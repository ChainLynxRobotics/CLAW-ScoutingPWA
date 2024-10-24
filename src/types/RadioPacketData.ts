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
    packetId: bigint,
    data: (Uint8Array|undefined)[],
    total: number,
}