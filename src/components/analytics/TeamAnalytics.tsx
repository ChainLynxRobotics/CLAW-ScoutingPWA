import { Card, CardContent, CardHeader, Divider, Paper } from "@mui/material";
import { Masonry } from "@mui/lab";
import { useContext, useMemo, useState, useEffect } from "react";
import { BlueAllianceMatch } from "../../types/blueAllianceTypes";
import { MatchData } from "../../types/MatchData";
import blueAllianceApi from "../../util/blueAllianceApi";
import matchDatabase from "../../util/db/matchDatabase";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { SettingsContext } from "../context/SettingsContextProvider";
import matchDataAverage from "../../util/analytics/matchDataAverage";
import { PieChart, PieValueType } from "@mui/x-charts";
import HumanPlayerLocation from "../../enums/HumanPlayerLocation";
import ProportionalStatistic from "./ProporationalStatistic";
import { describeProportionalObjects, describeQuantitativeProportionalObjects } from "../../util/analytics/objectStatistics";
import QuantitativeProportionalStatistic from "./QuantitativeProportionalStatistic";

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

    const matchDataPositive = useMemo(() => teams.map(team => matchData.get(team)).filter(v => !!v), [teams, matchData]);
    const matchDataPositiveFlat = useMemo(() => matchDataPositive.flat(), [matchDataPositive]);
    const matchDataNegative = useMemo(() => minusTeams?.map(team => matchData.get(team)).filter(v => !!v), [minusTeams, matchData]);
    const matchDataNegativeFlat = useMemo(() => matchDataNegative?.flat(), [matchDataNegative]);

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

    const tbaMatchDataPositive = useMemo(() => teams.map(team => tbaMatchData.get(team)).filter(v => !!v), [teams, tbaMatchData]);
    const tbaMatchDataPositiveFlat = useMemo(() => tbaMatchDataPositive.flat(), [tbaMatchDataPositive]);
    const tbaMatchDataNegative = useMemo(() => minusTeams?.map(team => tbaMatchData.get(team)).filter(v => !!v), [minusTeams, tbaMatchData]);
    const tbaMatchDataNegativeFlat = useMemo(() => tbaMatchDataNegative?.flat(), [tbaMatchDataNegative]);



    // Data for the human player location pie chart
    const humanPlayerLocationData = useMemo<PieValueType[]>(() => [
        {
            id: HumanPlayerLocation.None,
            label: 'None',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation !== HumanPlayerLocation.None).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation !== HumanPlayerLocation.None).length || 0),
            color: 'snow'
        },
        {
            id: HumanPlayerLocation.CoralStation,
            label: 'Coral Station',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation === HumanPlayerLocation.CoralStation).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation === HumanPlayerLocation.CoralStation).length || 0),
            color: 'lightcoral',
        },
        {
            id: HumanPlayerLocation.Processor,
            label: 'Processor',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor).length || 0),
            color: 'lightskyblue',
        },
    ], [matchDataPositive, matchDataNegative]);

    return (
        <Paper elevation={0} className="w-full h-full overflow-y-scroll">
        <div className="flex flex-col items-center p-2">
            <h1 className="text-xl my-4 flex items-center gap-2">
                <span>Analytics for: </span>
                <b>
                    {teams.map((team, i) => (
                        <span key={team}>
                            <a href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                            {i < teams.length - 1 && ', '}
                        </span>
                    ))}
                </b>
                {minusTeams && <span> vs. </span>}
                {minusTeams && 
                    <b>
                        {minusTeams.map((team, i) => (
                            <span key={team}>
                                <a href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                                {i < minusTeams.length - 1 && ', '}
                            </span>
                        ))}
                    </b> 
                }
            </h1>
            <Masonry className="w-full h-full" columns={3} spacing={2}>
                <Card className="w-full max-w-md">
                    <CardHeader title="Pre Match" />
                    <CardContent>
                        <div>Human Player Location</div>
                        <PieChart width={400} height={300} series={[{ data: humanPlayerLocationData }]} />
                    </CardContent>
                </Card>

                <Card className="w-full max-w-md !overflow-visible">
                    <CardHeader title="Auto - Coral" />
                    <CardContent>
                        <QuantitativeProportionalStatistic name="Coral L4" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL4Score", "autoCoralL4Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L3" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL3Score", "autoCoralL3Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L2" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL2Score", "autoCoralL2Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L1" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL1Score", "autoCoralL1Miss", matchDataPositive, matchDataNegative)} />
                    </CardContent>
                </Card>

                <Card className="w-full max-w-md">
                    <CardHeader title="Auto - Other" />
                    <CardContent>
                        {/* <ProportionalStatistic stats={describeProportionalObjects<BlueAllianceMatch>("score_breakdown.blue.mobilityRobot1", tbaMatchDataPositive, tbaMatchDataNegative)} /> */}
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic name="Processor" stats={describeQuantitativeProportionalObjects<MatchData>("autoAlgaeScore", "autoAlgaeMiss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Net" stats={describeQuantitativeProportionalObjects<MatchData>("autoAlgaeNetScore", "autoAlgaeNetMiss", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Coral Ground Intake" stats={describeProportionalObjects<MatchData>("autoCoralGroundIntake", matchDataPositive, matchDataNegative)} />
                        <ProportionalStatistic name="Coral Station Intake" stats={describeProportionalObjects<MatchData>("autoCoralStationIntake", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Remove Algae from Reef" stats={describeProportionalObjects<MatchData>("autoRemoveAlgae", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Algae Ground Intake" stats={describeProportionalObjects<MatchData>("autoAlgaeGroundIntake", matchDataPositive, matchDataNegative)} />
                        <ProportionalStatistic name="Algae Reef Intake" stats={describeProportionalObjects<MatchData>("autoAlgaeReefIntake", matchDataPositive, matchDataNegative)} />
                    </CardContent>
                </Card>

                <Card className="w-full max-w-md !overflow-visible">
                    <CardHeader title="Teleop - Coral" />
                    <CardContent>
                        <QuantitativeProportionalStatistic name="Coral L4" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL4Score", "teleopCoralL4Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L3" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL3Score", "teleopCoralL3Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L2" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL2Score", "teleopCoralL2Miss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Coral L1" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL1Score", "teleopCoralL1Miss", matchDataPositive, matchDataNegative)} />
                    </CardContent>
                </Card>

                <Card className="w-full max-w-md">
                    <CardHeader title="Teleop - Other" />
                    <CardContent>
                        {/* <ProportionalStatistic stats={describeProportionalObjects<BlueAllianceMatch>("score_breakdown.blue.mobilityRobot1", tbaMatchDataPositive, tbaMatchDataNegative)} /> */}
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic name="Processor" stats={describeQuantitativeProportionalObjects<MatchData>("teleopAlgaeScore", "teleopAlgaeMiss", matchDataPositive, matchDataNegative)} />
                        <QuantitativeProportionalStatistic name="Net" stats={describeQuantitativeProportionalObjects<MatchData>("teleopAlgaeNetScore", "teleopAlgaeNetMiss", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Coral Ground Intake" stats={describeProportionalObjects<MatchData>("teleopCoralGroundIntake", matchDataPositive, matchDataNegative)} />
                        <ProportionalStatistic name="Coral Station Intake" stats={describeProportionalObjects<MatchData>("teleopCoralStationIntake", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Remove Algae from Reef" stats={describeProportionalObjects<MatchData>("teleopRemoveAlgae", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic name="Algae Ground Intake" stats={describeProportionalObjects<MatchData>("teleopAlgaeGroundIntake", matchDataPositive, matchDataNegative)} />
                        <ProportionalStatistic name="Algae Reef Intake" stats={describeProportionalObjects<MatchData>("teleopAlgaeReefIntake", matchDataPositive, matchDataNegative)} />
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic name="Human Player Shots" stats={describeQuantitativeProportionalObjects<MatchData>("teleopHumanPlayerAlgaeScore", "teleopHumanPlayerAlgaeMiss", 
                            matchDataPositive.map(matches => matches.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor)), // Only include matches where the human player is at the processor
                            matchDataNegative?.map(matches => matches.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor))
                        )} />
                    </CardContent>
                </Card>
            </Masonry>
        </div>
        </Paper>
    )
}