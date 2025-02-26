import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MatchData } from "../../types/MatchData";
import { Leaves } from "../../types/analyticsTypes";
import matchDatabase from "../../util/db/matchDatabase";
import { AnalyticsSettingsContext } from "../../components/context/AnalyticsSettingsContextProvider";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import { BlueAllianceMatch } from "../../types/blueAllianceTypes";
import blueAllianceApi from "../../util/blueAllianceApi";

const AnalyticsPage = () => {

    const { teams: strTeams, minusTeams: strMinusTeams } = useParams();

    // Team list from URL, numbers separated by '+', all of them are are added up for the statistic
    const teams = useMemo(() => {
        if (!strTeams) throw new Error("No teams provided");
        if (strTeams.match(/[^0-9+]/)) throw new Error("Invalid team list");
        return strTeams.split("+").filter(v=>!!v).map(team => parseInt(team));
    }, [strTeams]);

    // Team list from URL, numbers separated by '+', all of them are subtracted from the statistic
    const minusTeams = useMemo(() => {
        if (!strMinusTeams) return undefined;
        if (strMinusTeams.match(/[^0-9+]/)) throw new Error("Invalid comparison team list");
        return strMinusTeams.split("+").filter(v=>!!v).map(team => parseInt(team));
    }, [strMinusTeams]);

    const allTeams = useMemo(() => [...teams, ...(minusTeams ?? [])], [teams, minusTeams]);

    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");

    const analyticsCompetition = useMemo(() => analyticsSettings.currentCompetitionOnly ? settings.competitionId : undefined, [analyticsSettings.currentCompetitionOnly, settings.competitionId]);


    // Data from our scouting app
    // Maps Team Number -> Match ID -> Match Data (there can be multiple entries for the same match due to duel scouting)
    const [matchData, setMatchData] = useState(new Map<number, Map<string, MatchData[]>>());
    useEffect(() => {
        if (!analyticsSettings.includeScoutingData) return setMatchData(new Map(allTeams.map(team => [team, new Map()])));

        async function loadData() {
            const entries = await Promise.all(allTeams.map(async team => {
                const data = await matchDatabase.getAllByTeam(team, analyticsCompetition);
                
                const matchMap = new Map<string, MatchData[]>();

                data.forEach(match => {
                    if (!matchMap.has(match.matchId)) matchMap.set(match.matchId, [match]);
                    else matchMap.get(match.matchId)?.push(match);
                });

                return [team, matchMap] as [number, Map<string, MatchData[]>];
            }));
            setMatchData(new Map(entries));
        }
        loadData();
    }, [allTeams, analyticsSettings.includeScoutingData, analyticsCompetition]);

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


    return (
        <>
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

            
        </>
    )
}

export default AnalyticsPage;