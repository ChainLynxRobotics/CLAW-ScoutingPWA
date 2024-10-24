import RadioPacketType from "../enums/RadioPacketType";
import { MatchData } from "./MatchData";

export type RadioPacketData = {
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

export type RadioPacketGroup = {
    packetId: number,
    data: (Uint8Array|undefined)[],
    total: number,
    lastReceivedAt?: number, // Timestamp of when the last packet was received, used for cleanup of incomplete packets
}