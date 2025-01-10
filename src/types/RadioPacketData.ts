import RadioPacketType from "../enums/RadioPacketType";
import { MatchData } from "./MatchData";

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
    onError?: (e: any) => void,
}