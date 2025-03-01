import { BlueAllianceMatch, BlueAllianceMatchScoreBreakdown2025 } from "../../types/blueAllianceTypes";
import { BlueAllianceMatchExtended } from "../../types/blueAllianceTypesExtended";

export function extendBlueAllianceScoreBreakdown2025(match: BlueAllianceMatch, team: number): BlueAllianceMatchExtended {
    const blueI = match.alliances.blue.team_keys.indexOf(`frc${team}`);
    const redI = match.alliances.red.team_keys.indexOf(`frc${team}`);

    if (blueI === -1 && redI === -1) throw new Error("Team not found in match");
    if (match.score_breakdown === null) return match as BlueAllianceMatchExtended;
    if (!('autoReef' in match.score_breakdown.blue) || !('autoReef' in match.score_breakdown.red)) throw new Error("Match is not a 2025 match");

    if (blueI > -1) {
        return {
            ...match,
            score_breakdown: {
                ...match.score_breakdown as BlueAllianceMatchScoreBreakdown2025,
                autoLineRobot: (match.score_breakdown.blue[("autoLineRobot" + (blueI + 1)) as "autoLineRobot1"|"autoLineRobot2"|"autoLineRobot3"] === "Yes") as boolean,
                endGameRobot: match.score_breakdown.blue[("endGameRobot" + (blueI + 1)) as "endGameRobot1"|"endGameRobot2"|"endGameRobot3"] as "None" | "Parked" | "ShallowCage" | "DeepCage"
            }
        }
    } else {
        return {
            ...match,
            score_breakdown: {
                ...match.score_breakdown as BlueAllianceMatchScoreBreakdown2025,
                autoLineRobot: (match.score_breakdown.red[("autoLineRobot" + (redI + 1)) as "autoLineRobot1"|"autoLineRobot2"|"autoLineRobot3"] === "Yes") as boolean,
                endGameRobot: match.score_breakdown.red[("endGameRobot" + (redI + 1)) as "endGameRobot1"|"endGameRobot2"|"endGameRobot3"] as "None" | "Parked" | "ShallowCage" | "DeepCage"
            }
        }
    }
}