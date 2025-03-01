import { createContext, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { BluetoothStatusEnum, QueuedRadioPacketGroup, RadioPacketData, RadioPacketGroup, RememberedClientID } from "../../types/RadioPacketData";
import { MatchData } from "../../types/MatchData";
import RadioPacketType from "../../enums/RadioPacketType";
import proto from "../../util/io/proto";
import { compressBytes, decompressBytes } from "../../util/io/compression";
import { generateRandomUint32 } from "../../util/id";
import bluetoothServer from "../../util/io/bluetoothServer";
import matchDatabase from "../../util/db/matchDatabase";


const MAX_PACKET_DATA_SIZE = 255; // Maximum size of a packet's data field, note the max packet size is 10 bytes larger than this
const MAX_PACKET_GROUP_LENGTH = 255; // Maximum size of a packet in bytes

const PACKET_SEND_INTERVAL = 100; // Interval between sending packets in milliseconds
const PACKET_CLEANUP_TIMEOUT = 5000; // How long to wait since last received packet to clean up incomplete groups in milliseconds

const CLIENT_ID_REMEMBER_TIME = 1000 * 30 * 1; // How long to "remember" a received client ID broadcast, in milliseconds


export const BluetoothContext = createContext<BluetoothContextType|undefined>(undefined);

export type BluetoothContextType = {
    /**
     * Attempts to connect to the Bluetooth server
     */
    connect: () => Promise<void>,
    /**
     * Disconnects from the Bluetooth server
     */
    disconnect: () => Promise<void>,
    /**
     * The current status of the Bluetooth connection
     * @see BluetoothStatusEnum
     */
    status: BluetoothStatusEnum,
    /**
     * Encodes, splits, and queues a list of packets to be sent to the server, and then broadcasts the match data to all connected clients.
     * 
     * @param entries The match data entries to broadcast
     * @param onComplete A callback to run when all packets have been sent successfully
     * @param onError A callback to run if an error occurs while sending the packets (NOT if there is an error with encoding the data, which will reject the promise)
     */
    broadcastMatchData: (entries: MatchData[], onComplete?: () => void, onError?: (e: unknown) => void) => Promise<void>,
    /**
     * Encodes, splits, and queues a request for match data to be sent to the server.
     * Clients will respond with any match data that they have that the server doesn't know about.
     * The new data will be added to this clients database automatically as its received.
     * @param competitionId The competition ID to request match data for
     * @param knownMatches An array of match IDs that the server already knows about, and will not be sent by other clients
     * @param onComplete A callback to run when all packets have been sent successfully
     * @param onError A callback to run if an error occurs while sending the packets (NOT if there is an error with encoding the data, which will reject the promise)
     */
    requestMatchData: (competitionId: string, knownMatches: number[], onComplete?: () => void, onError?: (e: unknown) => void) => Promise<void>,
    /**
     * Broadcasts a client ID to all connected clients.
     * 
     * @param clientID The current client ID to broadcast
     * @param scoutName The scout name to broadcast, if any
     * @param onComplete A callback to run when all packets have been sent successfully
     * @param onError A callback to run if an error occurs while sending the packets (NOT if there is an error with encoding the data, which will reject the promise)
     */
    broadcastClientID: (clientID: number, scoutName?: string, onComplete?: () => void, onError?: (e: unknown) => void) => Promise<void>,
    /**
     * Used to check if another client has already claimed a client ID.
     * @param clientID - The client ID to check
     * @returns The most recent client ID broadcast that matches the client ID, or undefined if it's not found
     */
    getClaimedClientID: (clientID: number) => RememberedClientID | undefined,
}

export default function CurrentMatchContextProvider({children}: {children: ReactElement}) {

    // List of packets to be sent
    const queue = useRef<QueuedRadioPacketGroup[]>([]);
    const isCurrentlySending = useRef<boolean>(false);
    // List of all packet ids that have been sent, to be used to check for duplicates
    const sentPackets = useRef<Set<number>>(new Set());
    // List of partial packets that have been received, to be assembled into full packets and decoded once all parts are received
    const receivedPackets = useRef<Map<number, RadioPacketGroup>>(new Map());

    /**
     * Recently received client IDs, list of known outside known client IDs and when they were received. These last for CLIENT_ID_REMEMBER_TIME milliseconds.
     */
    const [receivedClientIDs, setReceivedClientIDs] = useState<RememberedClientID[]>([]);

    // The current status of the Bluetooth connection
    const [status, setStatus] = useState<BluetoothStatusEnum>(bluetoothServer.isConnected() ? BluetoothStatusEnum.CONNECTED : BluetoothStatusEnum.DISCONNECTED);

    // *******************************
    // Connection
    // *******************************

    const _onDisconnect = useCallback(() => setStatus(BluetoothStatusEnum.DISCONNECTED), []);
    const _onConnecting = useCallback(() => setStatus(BluetoothStatusEnum.CONNECTING), []);
    const _onConnect = useCallback(() => setStatus(BluetoothStatusEnum.CONNECTED), []);

    const connect = useCallback(async () => {
        setStatus(BluetoothStatusEnum.CONNECTING);
        try {
            await bluetoothServer.connect();
            setStatus(BluetoothStatusEnum.CONNECTED);
        } catch (e) {
            setStatus(BluetoothStatusEnum.DISCONNECTED);
            console.error('Failed to connect to radio:', e);
            throw e;
        }
    }, []);

    const disconnect = useCallback(async () => {
        setStatus(BluetoothStatusEnum.DISCONNECTED);
        await bluetoothServer.disconnect();
    }, []);

    // *******************************
    // Sending packets
    // *******************************

    const _queueFullPacket = useCallback(async (data: RadioPacketData, onComplete?: () => void, onError?: (e: unknown) => void) => {
        const radioPacketDataProto = await proto.getType("RadioPacketData");
        const encoded = radioPacketDataProto.encode(radioPacketDataProto.create(data)).finish();
        const compressed = await compressBytes(encoded);
    
        const packetId = generateRandomUint32();
        const totalPackets = Math.ceil(compressed.byteLength / MAX_PACKET_DATA_SIZE);
    
        if (totalPackets > MAX_PACKET_GROUP_LENGTH) throw new Error('Packet too large');
    
        const packets = new Array<Uint8Array|undefined>(totalPackets);
        for (let i = 0, offset = 0; i < totalPackets; i++) {
            const packetData = compressed.slice(offset, offset + MAX_PACKET_DATA_SIZE);
            packets[i] = packetData;
            offset += packetData.byteLength;
        }
        queue.current.push({
            packetId: packetId,
            data: packets,
            total: totalPackets,
            onComplete: onComplete,
            onError: onError,
        });
        console.log('Queued packet:', packetId, totalPackets);
        sentPackets.current.add(packetId);
    }, []);

    const broadcastMatchData = useCallback(async (entries: MatchData[], onComplete?: () => void, onError?: (e: unknown) => void) => {
        await _queueFullPacket({
            packetType: RadioPacketType.MatchDataBroadcast,
            version: APP_VERSION,
            matchScoutingData: {
                entries: entries,
            },
        }, onComplete, onError);
    }, [_queueFullPacket]);

    const requestMatchData = useCallback(async (competitionId: string, knownMatches: number[], onComplete?: () => void, onError?: (e: unknown) => void) => {
        await _queueFullPacket({
            packetType: RadioPacketType.MatchDataRequest,
            version: APP_VERSION,
            matchRequestData: {
                competitionId: competitionId,
                knownMatches: knownMatches,
            },
        }, onComplete, onError);
    }, [_queueFullPacket]);

    const broadcastClientID = useCallback(async (clientID: number, scoutName?: string, onComplete?: () => void, onError?: (e: unknown) => void) => {
        await _queueFullPacket({
            packetType: RadioPacketType.ClientIDBroadcast,
            version: APP_VERSION,
            clientIDData: {
                clientID: clientID,
                scoutName: scoutName,
            },
        }, onComplete, onError);
    }, [_queueFullPacket]);

    // Runs every PACKET_SEND_INTERVAL milliseconds to send packets in the queue
    const _processQueue = useCallback(async () => {
        if (!bluetoothServer.isConnected()) return; // Do nothing if the server is not connected
        if (isCurrentlySending.current) return; // Do nothing if we are already sending
        if (queue.current.length === 0) return; // Do nothing if the queue is empty
        const group = queue.current[0];
    
        isCurrentlySending.current = true;
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
    
                await bluetoothServer.sendPacket(packet.buffer);
                group.data[i] = undefined;
                if (group.data.every((p) => p === undefined)) { // If all packets have been sent
                    group.onComplete?.(); // Run the onComplete callback
                    queue.current.shift(); // Remove the group
                }
            }
        } catch (e) {
            console.error('Failed to process queue:', e);
            group.onError?.(e);
        } finally {
            isCurrentlySending.current = false;
        }
    
        // Now is also a good time to cleanup old incomplete packets
        const now = Date.now();
        for (const [id, group] of receivedPackets.current) {
            if (!group.lastReceivedAt) continue;
            if (now - group.lastReceivedAt > PACKET_CLEANUP_TIMEOUT) {
                console.log('Cleaning up incomplete packet:', group.packetId);
                receivedPackets.current.delete(id);
            }
        }
        // And clean up old received client ids
        setReceivedClientIDs(r=>r.filter((d) => Date.now() - d.receivedAt < CLIENT_ID_REMEMBER_TIME));
    }, []);

    // *******************************
    // Receiving packets
    // *******************************

    // On every full decoded packet
    const _onDecodedPacket = useCallback(async (packet: RadioPacketData) => {
        console.log('Decoded packet:', packet);

        // Handle the packet based on its type
        
        if (packet.packetType === RadioPacketType.MatchDataBroadcast) {
            // On match data broadcast, add all the matches to the database
            
            const imported = matchDatabase.putAll(packet.matchScoutingData!.entries);
            console.log(`Imported ${imported} matches`);

        } else if (packet.packetType === RadioPacketType.MatchDataRequest) {
            // On match data request, send all matches that are not known by the sender

            const req = packet.matchRequestData!;
            // Find all matches that are not known by the sender
            const knownMatches = await matchDatabase.getAllIdsByCompetition(req.competitionId);
            const matchesToSend = await matchDatabase.getMultiple(knownMatches.filter((id) => !req.knownMatches.includes(id)));
            await broadcastMatchData(matchesToSend);

        } else if (packet.packetType === RadioPacketType.ClientIDBroadcast) {
            // On client ID broadcast, remember the client ID

            const req = packet.clientIDData!;
            // Remove ones by the same scout name (if defined) or that are too old
            const newReceivedClientIDs = receivedClientIDs.filter((d) => (d.scoutName && req.scoutName) ? d.scoutName !== req.scoutName : true)
                .filter((d) => Date.now() - d.receivedAt < CLIENT_ID_REMEMBER_TIME);
            // Add the new one
            newReceivedClientIDs.push({
                clientID: req.clientID,
                scoutName: req.scoutName,
                receivedAt: Date.now(),
            });
            setReceivedClientIDs(newReceivedClientIDs);
        } else {
            console.error('Unknown packet type:', packet.packetType);
        }
    }, [broadcastMatchData, receivedClientIDs]);

    // Decode a full packet from a group of packets to a RadioPacketData object
    const _decodeFullPacket = useCallback(async (group: RadioPacketGroup) => {
        console.log('Decoding full packet:', group);
        try {
            const fullPacket = new Uint8Array(group.data.reduce((acc, packet) => { // Get the total length of all the packet data
                if (packet === undefined) throw new Error('Missing packet');
                return acc + packet.byteLength;
            }, 0));
    
            // Combine all the packet data into one
            for (let i = 0, offset = 0; i < group.data.length; i++) {
                if (group.data[i] === undefined) throw new Error('Missing packet');
                const packetData = group.data[i]!;
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
            receivedPackets.current.delete(group.packetId);
        }
    }, [_onDecodedPacket]);

    // Decodes a partial packet received from the server
    const _onPacket = useCallback((data: DataView) => {
        console.log('Received packet:', data);
        if (data.byteLength < 6) throw new Error('Invalid packet length');
    
        const packetId = data.getUint32(0); // Packet ID
        const packetIndex = data.getUint8(4) // Packet index
        const totalPackets = data.getUint8(5); // Total packets
        const packetData = new Uint8Array(data.buffer, 6); // Packet data

        if (sentPackets.current.has(packetId)) return console.log('Received own packet (Ignoring):', packetId); // Ignore own packets
    
        console.log('Received packet:', packetId, packetIndex, totalPackets, packetData);
    
        // Check to see if we already received a packet with this ID
        if (receivedPackets.current.has(packetId)) {
            const group = receivedPackets.current.get(packetId) as RadioPacketGroup;
    
            if (group.total !== totalPackets) throw new Error('Total packets mismatch for id ' + packetId); // Prevent array out of bounds
            if (packetIndex >= totalPackets) throw new Error('Packet index out of bounds for id ' + packetId); // Prevent array out of bounds
            group.data[packetIndex] = packetData;
            group.lastReceivedAt = Date.now();
    
            if (group.data.every((p) => p !== undefined)) _decodeFullPacket(group);
        } else {
            const packets = new Array<Uint8Array|undefined>(totalPackets);
            packets.fill(undefined);
            packets[packetIndex] = packetData;
    
            receivedPackets.current.set(packetId, {
                packetId: packetId,
                data: packets,
                total: totalPackets,
                lastReceivedAt: Date.now(),
            });
    
            if (packets.every((p) => p !== undefined)) _decodeFullPacket(receivedPackets.current.get(packetId)!);
        }
    }, [_decodeFullPacket]);

    const getClaimedClientID = useCallback(function getClaimedClientID(clientID: number) {
        // Remove old client IDs
        return receivedClientIDs.filter((d) => Date.now() - d.receivedAt < CLIENT_ID_REMEMBER_TIME)
            .sort((a, b) => b.receivedAt - a.receivedAt).find((d) => d.clientID === clientID);
    }, [receivedClientIDs]);


    // Setup event listeners
    useEffect(() => {
        bluetoothServer.events.on('disconnected', _onDisconnect);
        bluetoothServer.events.on('connecting', _onConnecting);
        bluetoothServer.events.on('connected', _onConnect);
        bluetoothServer.events.on('packet', _onPacket);

        return () => {
            bluetoothServer.events.off('disconnected', _onDisconnect);
            bluetoothServer.events.off('connecting', _onConnecting);
            bluetoothServer.events.off('connected', _onConnect);
            bluetoothServer.events.off('packet', _onPacket);
        }
    }, [_onPacket, _onConnect, _onDisconnect, _onConnecting]);

    useEffect(() => {
        const interval = setInterval(_processQueue, PACKET_SEND_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, [_processQueue]);

    // *******************************
    // Context
    // *******************************

    const value: BluetoothContextType = {
        connect,
        disconnect,
        status,
        broadcastMatchData,
        requestMatchData,
        broadcastClientID,
        getClaimedClientID,
    }

    return (
        <BluetoothContext.Provider value={value}>
            {children}
        </BluetoothContext.Provider>
    );
}