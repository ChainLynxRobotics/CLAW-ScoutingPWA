import { MatchData } from "../../types/MatchData";

/**
 * Calculate the average of multiple data points of a team for the same match.
 */
export default function matchDataAverage(matchData: MatchData[]): MatchData {
    if (matchData.length === 0) throw new Error("No data provided");
    return {
        id: matchData[0].id,
        matchId: matchData[0].matchId,
        teamNumber: matchData[0].teamNumber,
        allianceColor: matchData[0].allianceColor,
        scoutName: matchData.map(v => v.scoutName).join(", "),
    }
}