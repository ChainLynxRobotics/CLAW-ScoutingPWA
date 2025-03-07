import { useContext, useEffect, useMemo, useState } from "react";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import { SettingsContext } from "../context/SettingsContextProvider";
import { BlueAllianceMatchExtended } from "../../types/blueAllianceTypesExtended";
import { MatchData } from "../../types/MatchData";
import { extendBlueAllianceScoreBreakdown2025 } from "../../util/analytics/blueAllianceExtend";
import matchDataAverage from "../../util/analytics/matchDataAverage";
import blueAllianceApi from "../../util/blueAllianceApi";
import matchDatabase from "../../util/db/matchDatabase";
import matchCompare from "../../util/matchCompare";

export default function useTeamAnalyticsData(teams: number[], minusTeams: number[]|undefined, minMatch: number, maxMatch: number) {
    
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");

    const allTeams = useMemo(() => [...new Set([...teams, ...(minusTeams ?? [])])], [teams, minusTeams]);

    const analyticsCompetition = useMemo(() => analyticsSettings.currentCompetitionOnly ? settings.competitionId : undefined, [analyticsSettings.currentCompetitionOnly, settings.competitionId]);
    
    // Data from our scouting app
    // Maps Team Number -> Match ID -> Match Data (there can be multiple entries for the same match due to duel scouting)
    const [rawMatchData, setRawMatchData] = useState(new Map<number, MatchData[]>());
    useEffect(() => {
        if (!analyticsSettings.includeScoutingData) return setRawMatchData(new Map(allTeams.map(team => [team, []])));

        async function loadData() {
            const entries = await Promise.all(allTeams.map(async team => {
                const data = await matchDatabase.getAllByTeam(team, analyticsCompetition);
                
                // Combine multiple entries for the same match
                const matchMap = new Map<string, MatchData[]>();

                data.forEach(match => {
                    if (!matchMap.has(match.matchId)) matchMap.set(match.matchId, [match]);
                    else matchMap.get(match.matchId)?.push(match);
                });

                // Calculate average for each match if there are multiple entries for a single match
                const matches: MatchData[] = [];
                for (const [, matchData] of matchMap) matches.push(matchData.length === 1 ? matchData[0] : matchDataAverage(matchData));

                return [team, matches] as [number, MatchData[]];
            }));
            setRawMatchData(new Map(entries));
        }
        loadData();
    }, [allTeams, analyticsSettings.includeScoutingData, analyticsCompetition]);

    // Get the data with the min/max match filter applied
    const matchData = useMemo(() => {
        if (!analyticsSettings.currentCompetitionOnly) return rawMatchData;

        const minMatchId = schedule.matches[minMatch].matchId;
        const maxMatchId = schedule.matches[maxMatch].matchId;

        if (!minMatchId || !maxMatchId) {
            console.error("Could not find match ID for min/max match filter");
            return rawMatchData;
        }

        const newMatchData = new Map<number, MatchData[]>();
        rawMatchData.forEach((matches, team) => {
            newMatchData.set(team, matches.filter(match => matchCompare(match.matchId, minMatchId) >= 0 && matchCompare(match.matchId, maxMatchId) <= 0));
        });
        return newMatchData;
    }, [rawMatchData, minMatch, maxMatch]);

    const matchDataPositive = useMemo(() => teams.map(team => matchData.get(team)).filter(v => !!v), [teams, matchData]);
    const matchDataPositiveFlat = useMemo(() => matchDataPositive.flat(), [matchDataPositive]);
    const matchDataNegative = useMemo(() => minusTeams?.map(team => matchData.get(team)).filter(v => !!v), [minusTeams, matchData]);
    const matchDataNegativeFlat = useMemo(() => matchDataNegative?.flat(), [matchDataNegative]);

    // Data from The Blue Alliance
    // Maps Team Number -> Set of TBA Matches
    const [rawTBAMatchData, setRawTBAMatchData] = useState(new Map<number, BlueAllianceMatchExtended[]>());
    useEffect(() => {
        if (!analyticsSettings.includeBlueAllianceData) return setRawTBAMatchData(new Map(allTeams.map(team => [team, []])));

        async function loadData() {
            const entries = await Promise.all(allTeams.map(async team => {
                const data = await blueAllianceApi.getMatchesByTeam(team, settings!.competitionId, analyticsSettings!.currentCompetitionOnly);
                const extendedMatch = data.map(match => extendBlueAllianceScoreBreakdown2025(match, team));
                return [team, extendedMatch] as [number, BlueAllianceMatchExtended[]];
            }));
            setRawTBAMatchData(new Map(entries));
        }
        loadData();
    }, [allTeams, analyticsCompetition, settings, analyticsSettings]);

    // Get the data with the min/max match filter applied
    const tbaMatchData = useMemo(() => {
        if (!analyticsSettings.currentCompetitionOnly) return rawTBAMatchData;

        const minMatchId = schedule.matches[minMatch].matchId;
        const maxMatchId = schedule.matches[maxMatch].matchId;

        if (!minMatchId || !maxMatchId) {
            console.error("Could not find match ID for min/max match filter");
            return rawTBAMatchData;
        }

        const newMatchData = new Map<number, BlueAllianceMatchExtended[]>();
        rawTBAMatchData.forEach((matches, team) => {
            newMatchData.set(team, matches.filter(match => matchCompare(match.key, minMatchId) > 0 && matchCompare(match.key, maxMatchId) < 0));
        });
        return newMatchData;
    }, [rawTBAMatchData, minMatch, maxMatch]);

    const tbaMatchDataPositive = useMemo(() => teams.map(team => tbaMatchData.get(team)).filter(v => !!v), [teams, tbaMatchData]);
    const tbaMatchDataPositiveFlat = useMemo(() => tbaMatchDataPositive.flat(), [tbaMatchDataPositive]);
    const tbaMatchDataNegative = useMemo(() => minusTeams?.map(team => tbaMatchData.get(team)).filter(v => !!v), [minusTeams, tbaMatchData]);
    const tbaMatchDataNegativeFlat = useMemo(() => tbaMatchDataNegative?.flat(), [tbaMatchDataNegative]);

    return {
        allTeams,
        matchData,
        matchDataPositive,
        matchDataPositiveFlat,
        matchDataNegative,
        matchDataNegativeFlat,
        tbaMatchData,
        tbaMatchDataPositive,
        tbaMatchDataPositiveFlat,
        tbaMatchDataNegative,
        tbaMatchDataNegativeFlat
    }
}