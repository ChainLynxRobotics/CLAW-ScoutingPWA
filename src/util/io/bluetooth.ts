import RadioPacketType from "../../enums/RadioPacketType";
import { MatchData } from "../../types/MatchData";
import { RadioPacketData, RadioPacketGroup } from "../../types/RadioPacketData";
import matchDatabase from "../db/matchDatabase";
import bluetoothServer from "./bluetoothServer";
import { compressBytes, decompressBytes } from "./compression";
import proto from "./proto";

const MAX_PACKET_DATA_SIZE = 512; // Maximum size of a packet's data field, note the max packet size is 10 bytes larger than this
const MAX_PACKET_GROUP_LENGTH = 255; // Maximum size of a packet in bytes

const PACKET_SEND_INTERVAL = 100; // Interval between sending packets in milliseconds


const queue: RadioPacketGroup[] = [];
const received: Map<bigint, RadioPacketGroup> = new Map(); // Map of packet IDs to packets

let timeout: NodeJS.Timeout | null = null;

async function broadcastMatchData(entries: MatchData[]) {
    await _queueFullPacket({
        packetType: RadioPacketType.MatchDataBroadcast,
        version: APP_VERSION,
        matchScoutingData: {
            entries: entries,
        },
    });
}

async function _queueFullPacket(data: RadioPacketData) {
    const radioPacketDataProto = await proto.getType("RadioPacketData");
    const encoded = radioPacketDataProto.encode(radioPacketDataProto.create(data)).finish();
    const compressed = await compressBytes(encoded);

    const packetId = crypto.getRandomValues(new BigUint64Array(1))[0]; // Generate a random packet ID
    const totalPackets = Math.ceil(compressed.byteLength / MAX_PACKET_DATA_SIZE);

    if (totalPackets > MAX_PACKET_GROUP_LENGTH) throw new Error('Packet too large');

    let packets = new Array<Uint8Array|undefined>(totalPackets);
    for (let i = 0, offset = 0; i < totalPackets; i++) {
        const packetData = compressed.slice(offset, offset + MAX_PACKET_DATA_SIZE);
        packets[i] = packetData;
        offset += packetData.byteLength;
    }
    queue.push({
        packetId: packetId,
        data: packets,
        total: totalPackets,
    });
    if (timeout === null) timeout = setTimeout(_processQueue, 1);
}

bluetoothServer.events.on('connected', ()=>{
    if (timeout === null) timeout = setTimeout(_processQueue, 1);
});
function _processQueue() {
    const group = queue[0];
    if (!group) {
        timeout = null;
        return;
    }

    const i = group.data.findIndex((p) => p !== undefined);
    const data = group.data[i];
    if (data) {
        console.log('Sending packet:', data);
        bluetoothServer.sendPacket(data.buffer).then(()=>{
            group.data[i] = undefined;
            if (group.data.every((p) => p === undefined)) queue.shift(); // Remove the group if all packets have been sent
        }).catch((e) => {
            console.error('Failed to send packet:', e);
        }).finally(() => {
            if (bluetoothServer.isConnected() || bluetoothServer.isReconnecting()) {
                timeout = setTimeout(_processQueue, PACKET_SEND_INTERVAL);
            } else {
                timeout = null;
            }
        });
    }
}

// On every packet received from the radio
bluetoothServer.events.on('packet', _onPacket);
function _onPacket(data: DataView) {
    console.log('Received packet:', data);

    let packetId = data.getBigUint64(0, true); // Packet ID
    let packetIndex = data.getUint8(8) // Packet index
    let totalPackets = data.getUint8(9); // Total packets
    let packetData = new Uint8Array(data.buffer, 10); // Packet data

    if (received.has(packetId)) {
        let group = received.get(packetId) as RadioPacketGroup;
        if (group.total !== totalPackets) throw new Error('Total packets mismatch for id ' + packetId);
        group.data[packetIndex] = packetData;
        if (group.data.every((p) => p !== undefined)) _decodeFullPacket(group);
    } else {
        let packets = new Array<Uint8Array|undefined>(totalPackets);
        packets.fill(undefined);
        packets[packetIndex] = packetData;

        received.set(packetId, {
            packetId: packetId,
            data: packets,
            total: totalPackets,
        });
    }
}

// Decode a full packet from a group of packets to a RadioPacketData object
async function _decodeFullPacket(group: RadioPacketGroup) {
    try {
        let fullPacket = new Uint8Array(group.data.reduce((acc, packet) => { // Get the total length of all the packet data
            if (packet === undefined) throw new Error('Missing packet');
            return acc + packet.byteLength;
        }, 0));

        // Combine all the packet data into one
        for (let i = 0, offset = 0; i < group.data.length; i++) {
            if (group.data[i] === undefined) throw new Error('Missing packet');
            let packetData = group.data[i]!;
            fullPacket.set(packetData, offset);
            offset += packetData.byteLength;
        }

        // Decode the packet
        const decompressed = await decompressBytes(fullPacket);

        const radioPacketDataProto = await proto.getType("RadioPacketData");
        const decoded = radioPacketDataProto.decode(decompressed);
        const data = radioPacketDataProto.toObject(decoded) as RadioPacketData;

        await _onDecodedPacket(data);
    } catch (e) {
        console.error('Failed to decode packet:', e);
    } finally {
        received.delete(group.packetId);
    }
}

// On every full decoded packet
async function _onDecodedPacket(packet: RadioPacketData) {
    console.log('Decoded packet:', packet);

    switch (packet.packetType) {
        case RadioPacketType.MatchDataBroadcast:
            matchDatabase.putAll(packet.matchScoutingData!.entries);
            break;
        case RadioPacketType.MatchDataRequest:
            const req = packet.matchRequestData!;
            // Find all matches that are not known by the sender
            const knownMatches = await matchDatabase.getAllIdsByCompetition(req.competitionId);
            const matchesToSend = await matchDatabase.getMultiple(knownMatches.filter((id) => !req.knownMatches.includes(id)));
            await broadcastMatchData(matchesToSend);
            break;
        default:
            console.error('Unknown packet type:', packet.packetType);
    }
}

export default {
    broadcastMatchData,
};