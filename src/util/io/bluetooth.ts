import RadioPacketType from "../../enums/RadioPacketType";
import { MatchData } from "../../types/MatchData";
import { QueuedRadioPacketGroup, RadioPacketData, RadioPacketGroup } from "../../types/RadioPacketData";
import matchDatabase from "../db/matchDatabase";
import { generateRandomUint32 } from "../id";
import bluetoothServer from "./bluetoothServer";
import { compressBytes, decompressBytes } from "./compression";
import proto from "./proto";

const MAX_PACKET_DATA_SIZE = 512; // Maximum size of a packet's data field, note the max packet size is 10 bytes larger than this
const MAX_PACKET_GROUP_LENGTH = 255; // Maximum size of a packet in bytes

const PACKET_SEND_INTERVAL = 100; // Interval between sending packets in milliseconds
const PACKET_CLEANUP_TIMEOUT = 5000; // How long to wait since last received packet to clean up incomplete groups in milliseconds


const queue: QueuedRadioPacketGroup[] = [];
const received: Map<number, RadioPacketGroup> = new Map(); // Map of packet IDs to packets

let interval: NodeJS.Timeout | null = null;

/**
 * Encodes, splits, and queues a list of packets to be sent to the server, and then broadcasts the match data to all connected clients.
 * 
 * @param entries The match data entries to broadcast
 * @param onComplete A callback to run when all packets have been sent successfully
 * @param onError A callback to run if an error occurs while sending the packets (NOT if there is an error with encoding the data, which will reject the promise)
 */
async function broadcastMatchData(entries: MatchData[], onComplete?: () => void, onError?: (e: any) => void) {
    await _queueFullPacket({
        packetType: RadioPacketType.MatchDataBroadcast,
        version: APP_VERSION,
        matchScoutingData: {
            entries: entries,
        },
    }, onComplete, onError);
}

/**
 * Encodes, splits, and queues a request for match data to be sent to the server.
 * Clients will respond with any match data that they have that the server doesn't know about.
 * The new data will be added to this clients database automatically as its received.
 * @param competitionId The competition ID to request match data for
 * @param knownMatches An array of match IDs that the server already knows about, and will not be sent by other clients
 * @param onComplete A callback to run when all packets have been sent successfully
 * @param onError A callback to run if an error occurs while sending the packets (NOT if there is an error with encoding the data, which will reject the promise)
 */
async function requestMatchData(competitionId: string, knownMatches: number[], onComplete?: () => void, onError?: (e: any) => void) {
    await _queueFullPacket({
        packetType: RadioPacketType.MatchDataRequest,
        version: APP_VERSION,
        matchRequestData: {
            competitionId: competitionId,
            knownMatches: knownMatches,
        },
    }, onComplete, onError);
}

/**
 * Sets the interval to process the queue every PACKET_SEND_INTERVAL milliseconds if it's not already running.
 * 
 * This is automatically run whenever a packet is queued, you only need to run this if {@link stopQueueInterval} is ran.
 */
async function startQueueInterval() {
    if (interval === null) setInterval(_processQueue, PACKET_SEND_INTERVAL);
}

/**
 * Stops the interval to process the queue.
 * 
 * Normally, the interval is started automatically when a packet is first queued and never stopped. (even if the queue is empty or the server is disconnected)
 * So, you should only need to run this if you want to stop the queue processing for some reason.
 */
async function stopQueueInterval() {
    if (interval !== null) clearInterval(interval);
}

async function _queueFullPacket(data: RadioPacketData, onComplete?: () => void, onError?: (e: any) => void) {
    const radioPacketDataProto = await proto.getType("RadioPacketData");
    const encoded = radioPacketDataProto.encode(radioPacketDataProto.create(data)).finish();
    const compressed = await compressBytes(encoded);

    const packetId = generateRandomUint32();
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
        onComplete: onComplete,
        onError: onError,
    });

    // Start the queue interval if it's not already running, note this will never stop unless stopQueueInterval is called
    if (interval === null) setInterval(_processQueue, PACKET_SEND_INTERVAL);
}

// Runs every PACKET_SEND_INTERVAL milliseconds to send packets in the queue
async function _processQueue() {
    if (!bluetoothServer.isConnected()) return; // Do nothing if the server is not connected
    if (queue.length === 0) return; // Do nothing if the queue is empty
    const group = queue[0];

    try {

        const i = group.data.findIndex((p) => p !== undefined); // Find the first packet that hasn't been sent in the group
        const data = group.data[i];
        if (data) {
            console.log('Sending packet:', data);
            
            const packetHeader = new DataView(new Uint8Array(6).buffer);
            packetHeader.setUint32(0, group.packetId); // Packet ID
            packetHeader.setUint8(4, i); // Packet index
            packetHeader.setUint8(5, group.total); // Total packets
            const packet = new Uint8Array(packetHeader.buffer.byteLength + data.byteLength);
            packet.set(new Uint8Array(packetHeader.buffer), 0);
            packet.set(data, packetHeader.buffer.byteLength);

            await bluetoothServer.sendPacket(packet.buffer)
            group.data[i] = undefined;
            if (group.data.every((p) => p === undefined)) { // If all packets have been sent
                group.onComplete?.(); // Run the onComplete callback
                queue.shift(); // Remove the group
            }
        }

    } catch (e) {
        console.error('Failed to process queue:', e);
        group.onError?.(e);
    }

    // Now is also a good time to cleanup old incomplete packets
    const now = Date.now();
    for (const [id, group] of received) {
        if (!group.lastReceivedAt) continue;
        if (now - group.lastReceivedAt > PACKET_CLEANUP_TIMEOUT) {
            console.log('Cleaning up incomplete packet:', group.packetId);
            received.delete(id);
        }
    }
}

// On every packet received from the radio
bluetoothServer.events.on('packet', _onPacket);
function _onPacket(data: DataView) {
    console.log('Received packet:', data);
    if (data.byteLength < 6) throw new Error('Invalid packet length');

    let packetId = data.getUint32(0, true); // Packet ID
    let packetIndex = data.getUint8(4) // Packet index
    let totalPackets = data.getUint8(5); // Total packets
    let packetData = new Uint8Array(data.buffer, 6); // Packet data

    console.log('Received packet:', packetId, packetIndex, totalPackets, packetData);

    // Check to see if we already received a packet with this ID
    if (received.has(packetId)) {
        let group = received.get(packetId) as RadioPacketGroup;

        if (group.total !== totalPackets) throw new Error('Total packets mismatch for id ' + packetId); // Prevent array out of bounds
        if (packetIndex >= totalPackets) throw new Error('Packet index out of bounds for id ' + packetId); // Prevent array out of bounds
        group.data[packetIndex] = packetData;
        group.lastReceivedAt = Date.now();

        if (group.data.every((p) => p !== undefined)) _decodeFullPacket(group);
    } else {
        let packets = new Array<Uint8Array|undefined>(totalPackets);
        packets.fill(undefined);
        packets[packetIndex] = packetData;

        received.set(packetId, {
            packetId: packetId,
            data: packets,
            total: totalPackets,
            lastReceivedAt: Date.now(),
        });

        if (packets.every((p) => p !== undefined)) _decodeFullPacket(received.get(packetId)!);
    }
}

// Decode a full packet from a group of packets to a RadioPacketData object
async function _decodeFullPacket(group: RadioPacketGroup) {
    console.log('Decoding full packet:', group);
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
            const imported = matchDatabase.putAll(packet.matchScoutingData!.entries);
            console.log(`Imported ${imported} matches`);
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
    requestMatchData,
    startQueueInterval,
    stopQueueInterval,
};