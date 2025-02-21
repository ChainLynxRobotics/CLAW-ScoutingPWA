import RadioPacketType from "../enums/RadioPacketType";
import { MatchData } from "./MatchData";

export enum BluetoothStatusEnum {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
}

export interface RadioPacketData {
    packetType: RadioPacketType,
    version: string,
    matchScoutingData?: {
        entries: MatchData[],
    },
    matchRequestData?: {
        competitionId: string,
        knownMatches: number[],
    },
    clientIDData?: {
        clientID: number,
        scoutName?: string,
    },
};

export interface RadioPacketGroup {
    packetId: number,
    data: (Uint8Array|undefined)[],
    total: number,
    lastReceivedAt?: number, // Timestamp of when the last packet was received, used for cleanup of incomplete packets
}

export interface QueuedRadioPacketGroup {
    packetId: number,
    data: (Uint8Array|undefined)[],
    total: number,
    onComplete?: () => void,
    onError?: (e: unknown) => void,
}

export type RememberedClientID = RadioPacketData['clientIDData'] & { receivedAt: number };