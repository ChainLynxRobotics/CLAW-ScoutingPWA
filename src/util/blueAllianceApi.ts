import { ScheduledMatch } from '../components/context/SettingsContextProvider';
import { TBA_API_BASE, TBA_API_KEY } from '../constants';
import { BlueAllianceEventRanking, BlueAllianceMatch, BlueAllianceMatchSimple } from '../types/blueAllianceTypes';
import matchCompare from './matchCompare';

export async function fetchFromBlueAlliance(relativeUrl: string): Promise<any> {
    const url = new URL(relativeUrl, TBA_API_BASE).toString();

    const res = await fetch(url, {
        //cache: 'default', // Use the browser cache, by default it respects cache-control and etag headers
        headers: {
            'X-TBA-Auth-Key': TBA_API_KEY,
            'accept': 'application/json',
        }
    });

    const json = await res.json();

    if (!res.ok || json.Error) {
        throw new Error(`Failed to fetch from blue alliance: ${json.Error}`);
    }

    return json;
}

export async function getSchedule(competitionId: string): Promise<ScheduledMatch[]> {
    
    const json = await fetchFromBlueAlliance(`event/${competitionId}/matches/simple`) as BlueAllianceMatchSimple[];

    if (!Array.isArray(json)) {
        throw new Error("TBA returned an unexpected response: "+JSON.stringify(json));
    }

    if (json.length === 0) {
        throw new Error("TBA returned no matches");
    }

    const matches: ScheduledMatch[] = json
        .sort((a, b)=>(matchCompare(a.key, b.key)))
        .map((match): ScheduledMatch => { // eslint-disable-line @typescript-eslint/no-explicit-any
            return {
                matchId: match.key.substring(competitionId.length+1),
                blue1: parseInt(match.alliances.blue.team_keys[0].substring(3)),
                blue2: parseInt(match.alliances.blue.team_keys[1].substring(3)),
                blue3: parseInt(match.alliances.blue.team_keys[2].substring(3)),
                red1: parseInt(match.alliances.red.team_keys[0].substring(3)),
                red2: parseInt(match.alliances.red.team_keys[1].substring(3)),
                red3: parseInt(match.alliances.red.team_keys[2].substring(3)),
            }
        }
    );
    return matches;
}

export async function getEventRankings(competitionId: string): Promise<number[]> {
    
    const json = await fetchFromBlueAlliance(`event/${competitionId}/rankings`) as BlueAllianceEventRanking;

    const rankings = json.rankings;

    if (!Array.isArray(rankings)) {
        throw new Error("TBA returned an unexpected response: "+JSON.stringify(json));
    }

    if (rankings.length === 0) {
        throw new Error("TBA returned no teams");
    }

    const teams = rankings
        .sort((a, b) => a.rank - b.rank) // eslint-disable-line @typescript-eslint/no-explicit-any
        .map((team) => Number(team.team_key.substring(3))); // eslint-disable-line @typescript-eslint/no-explicit-any

    return teams;
}

// competitionId can only be the year if currentCompetitionOnly is false
export async function getMatchesByTeam(team: number, competitionId: string, currentCompetitionOnly?: boolean): Promise<BlueAllianceMatch[]> {

    const url = currentCompetitionOnly ? `team/frc${team}/event/${competitionId}/matches` : `team/frc${team}/matches/${competitionId.substring(0, 4)}`;
    
    const json = await fetchFromBlueAlliance(url) as BlueAllianceMatch[];

    if (!Array.isArray(json)) {
        throw new Error("TBA returned an unexpected response: "+JSON.stringify(json));
    }

    return json;
}

export default {
    fetchFromBlueAlliance,
    getSchedule,
    getEventRankings,
    getMatchesByTeam,
}