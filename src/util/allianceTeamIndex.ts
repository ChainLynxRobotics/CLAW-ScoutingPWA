import { ScheduledMatch } from "../components/context/SettingsContextProvider";
import AllianceColor from "../enums/AllianceColor";

export default function allianceTeamIndex(match: ScheduledMatch, currentMatchIndex: number, clientId: number) {
    const index = (currentMatchIndex + clientId) % 6;

    return {
        team: [match.blue1, match.red1, match.blue2, match.red2, match.blue3, match.red3][index],
        color: (index % 2 == 0) ? AllianceColor.Blue : AllianceColor.Red
    }
}