import { Paper } from "@mui/material";
import { useContext, useMemo, useState, useEffect } from "react";
import { BlueAllianceMatch } from "../../types/blueAllianceTypes";
import { MatchData } from "../../types/MatchData";
import blueAllianceApi from "../../util/blueAllianceApi";
import matchDatabase from "../../util/db/matchDatabase";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { SettingsContext } from "../context/SettingsContextProvider";
import matchDataAverage from "../../util/analytics/matchDataAverage";

export default function TeamAnalytics({ teams, minusTeams }: { teams: number[], minusTeams?: number[] }) {
    
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");


    const allTeams = useMemo(() => [...new Set([...teams, ...(minusTeams ?? [])])], [teams, minusTeams]);

    const analyticsCompetition = useMemo(() => analyticsSettings.currentCompetitionOnly ? settings.competitionId : undefined, [analyticsSettings.currentCompetitionOnly, settings.competitionId]);

    // Data from our scouting app
    // Maps Team Number -> Match ID -> Match Data (there can be multiple entries for the same match due to duel scouting)
    const [matchData, setMatchData] = useState(new Map<number, MatchData[]>());
    useEffect(() => {
        if (!analyticsSettings.includeScoutingData) return setMatchData(new Map(allTeams.map(team => [team, []])));

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
                for (const [_, matchData] of matchMap) matches.push(matchData.length === 1 ? matchData[0] : matchDataAverage(matchData));

                return [team, matches] as [number, MatchData[]];
            }));
            setMatchData(new Map(entries));
        }
        loadData();
    }, [allTeams, analyticsSettings.includeScoutingData, analyticsCompetition]);

    const matchDataPositive = useMemo(() => teams.map(team => matchData.get(team)).filter(v => !!v).flat(), [teams, matchData]);
    const matchDataNegative = useMemo(() => minusTeams?.map(team => matchData.get(team)).filter(v => !!v).flat(), [minusTeams, matchData]);

    // Data from The Blue Alliance
    // Maps Team Number -> Set of TBA Matches
    const [tbaMatchData, setTbaMatchData] = useState(new Map<number, BlueAllianceMatch[]>());
    useEffect(() => {
        if (!analyticsSettings.includeBlueAllianceData) return setTbaMatchData(new Map(allTeams.map(team => [team, []])));

        async function loadData() {
            const entries = await Promise.all(allTeams.map(async team => {
                const data = await blueAllianceApi.getMatchesByTeam(team, settings!.competitionId, analyticsSettings!.currentCompetitionOnly);
                return [team, data] as [number, BlueAllianceMatch[]];
            }));
            setTbaMatchData(new Map(entries));
        }
        loadData();
    }, [allTeams, analyticsSettings.includeBlueAllianceData, analyticsCompetition]);

    const tbaMatchDataPositive = useMemo(() => teams.map(team => tbaMatchData.get(team)).filter(v => !!v).flat(), [teams, tbaMatchData]);
    const tbaMatchDataNegative = useMemo(() => minusTeams?.map(team => tbaMatchData.get(team)).filter(v => !!v).flat(), [minusTeams, tbaMatchData]);

    return (
        <Paper elevation={0}>
            <h1 className="text-xl my-4 flex items-center gap-2">
                <span>Analytics for: </span>
                <b>
                    <span>
                        {teams.map((team, i) => (
                            <>
                                <a key={team} href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                                {i < teams.length - 1 && ', '}
                            </>
                        ))}
                    </span> 
                </b>
                    {minusTeams && <span> vs. </span>}
                <b>
                    {minusTeams && 
                        <span>
                            {minusTeams.map((team, i) => (
                                <>
                                    <a key={team} href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                                    {i < minusTeams.length - 1 && ', '}
                                </>
                            ))}
                        </span> 
                    }
                </b>
            </h1>
        </Paper>
    )
}