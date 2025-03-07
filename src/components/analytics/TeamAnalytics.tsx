import { Card, CardContent, CardHeader, Chip, Divider, Paper } from "@mui/material";
import { Masonry } from "@mui/lab";
import { useContext, useMemo, useState, useEffect } from "react";
import { MatchData } from "../../types/MatchData";
import blueAllianceApi from "../../util/blueAllianceApi";
import matchDatabase from "../../util/db/matchDatabase";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { SettingsContext } from "../context/SettingsContextProvider";
import matchDataAverage from "../../util/analytics/matchDataAverage";
import { BarChart, PieChart, PieValueType } from "@mui/x-charts";
import HumanPlayerLocation from "../../enums/HumanPlayerLocation";
import ProportionalStatistic from "./ProporationalStatistic";
import { describeProportionalObjects, describeQuantitativeObjects, describeQuantitativeProportionalObjects } from "../../util/analytics/objectStatistics";
import QuantitativeProportionalStatistic from "./QuantitativeProportionalStatistic";
import TeamAnalyticsSelection from "./TeamAnalyticsSelection";
import { useNavigate } from "react-router-dom";
import Heatmap from "./Heatmap";
import QuantitativeStatistic from "./QuantitativeStatistic";
import Observation from "../../enums/Observation";
import { extendBlueAllianceScoreBreakdown2025 } from "../../util/analytics/blueAllianceExtend";
import { BlueAllianceMatchExtended } from "../../types/blueAllianceTypesExtended";
import { Leaves } from "../../types/analyticsTypes";
import { describeCycleRateQuantitativeObjects } from "../../util/analytics/cycleRateStatistics";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import matchCompare from "../../util/matchCompare";
import TeamAnalyticsMatchSelection from "./TeamAnalyticsMatchSelection";

const autoCycleRatePaths: Leaves<MatchData>[] = [
    "autoCoralL4Score",
    "autoCoralL4Miss",
    "autoCoralL3Score",
    "autoCoralL3Miss",
    "autoCoralL2Score",
    "autoCoralL2Miss",
    "autoCoralL1Score",
    "autoCoralL1Miss",
    "autoAlgaeScore",
    "autoAlgaeMiss",
    "autoAlgaeNetScore",
    "autoAlgaeNetMiss",
];

const teleopCycleRatePaths: Leaves<MatchData>[] = [
    "teleopCoralL4Score",
    "teleopCoralL4Miss",
    "teleopCoralL3Score",
    "teleopCoralL3Miss",
    "teleopCoralL2Score",
    "teleopCoralL2Miss",
    "teleopCoralL1Score",
    "teleopCoralL1Miss",
    "teleopAlgaeScore",
    "teleopAlgaeMiss",
    "teleopAlgaeNetScore",
    "teleopAlgaeNetMiss",
];

const heatmapOriginalWidth = 200;
const heatmapOriginalHeight = 500;
const heatmapWidth = 150;
const heatmapHeight = 375;

const observationLabels = {
    [Observation.Tippy]: "Tippy",
    [Observation.DroppingCoral]: "Dropped Coral",
    [Observation.DroppingAlgae]: "Dropped Algae",
    [Observation.DifficultyAligningScore]: "Difficulty Aligning Score",
    [Observation.DifficultyAligningIntake]: "Difficulty Aligning Intake",
    [Observation.Immobilized]: "Immobilized",
    [Observation.DisabledPartially]: "Disabled Partially",
    [Observation.DisabledFully]: "Disabled Fully",
}

export default function TeamAnalytics({ teams, minusTeams }: { teams: number[], minusTeams?: number[] }) {

    const navigate = useNavigate();
    
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");


    const allTeams = useMemo(() => [...new Set([...teams, ...(minusTeams ?? [])])], [teams, minusTeams]);

    const analyticsCompetition = useMemo(() => analyticsSettings.currentCompetitionOnly ? settings.competitionId : undefined, [analyticsSettings.currentCompetitionOnly, settings.competitionId]);

    const [minMatch, setMinMatch] = useState(0);
    const [maxMatch, setMaxMatch] = useState(schedule.matches.length - 1);
    
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



    // Data for the human player location pie chart
    const humanPlayerLocationData = useMemo<PieValueType[]>(() => [
        {
            id: HumanPlayerLocation.Unknown,
            label: 'Unknown',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Unknown).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Unknown).length || 0),
            color: 'lightgrey'
        },
        {
            id: HumanPlayerLocation.None,
            label: 'None',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation === HumanPlayerLocation.None).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation === HumanPlayerLocation.None).length || 0),
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
    ], [matchDataPositiveFlat, matchDataNegativeFlat]);

    const heatmapData = useMemo(() => matchDataPositiveFlat
        .filter(match => match.autoStartPositionX !== undefined && match.autoStartPositionY !== undefined)
        .map(match => ({
            x: match.autoStartPositionX! * heatmapWidth / heatmapOriginalWidth,
            y: match.autoStartPositionY! * heatmapHeight / heatmapOriginalHeight,
            value: 5
        })
    ), [matchDataPositiveFlat]);

    const climbPieData = useMemo<PieValueType[]>(() => [
        {
            id: "None",
            label: 'None',
            value: tbaMatchDataPositiveFlat.filter(match => match.score_breakdown?.endGameRobot === "None").length - (tbaMatchDataNegativeFlat?.filter(match => match.score_breakdown?.endGameRobot === "None").length || 0),
            color: 'lightgrey'
        },
        {
            id: "Parked",
            label: 'Parked',
            value: tbaMatchDataPositiveFlat.filter(match => match.score_breakdown?.endGameRobot === "Parked").length - (tbaMatchDataNegativeFlat?.filter(match => match.score_breakdown?.endGameRobot === "Parked").length || 0),
            color: 'snow'
        },
        {
            id: "ShallowCage",
            label: 'Shallow Cage',
            value: tbaMatchDataPositiveFlat.filter(match => match.score_breakdown?.endGameRobot === "ShallowCage").length - (tbaMatchDataNegativeFlat?.filter(match => match.score_breakdown?.endGameRobot === "ShallowCage").length || 0),
            color: 'lightskyblue',
        },
        {
            id: "DeepCage",
            label: 'Deep Cage',
            value: tbaMatchDataPositiveFlat.filter(match => match.score_breakdown?.endGameRobot === "DeepCage").length - (tbaMatchDataNegativeFlat?.filter(match => match.score_breakdown?.endGameRobot === "DeepCage").length || 0),
            color: 'DarkSlateBlue',
        },
    ], [tbaMatchDataPositiveFlat, tbaMatchDataNegativeFlat]);

    const observationsBarChartRobots = useMemo(() => [...teams, ...(minusTeams ?? [])], [teams, minusTeams]);
    const observationsBarChartData = useMemo(() => 
        observationsBarChartRobots.map(team => ({
            team,
            [Observation.Tippy]: matchData.get(team)?.filter(match => match.observations.includes(Observation.Tippy)).length || 0,
            [Observation.DroppingCoral]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DroppingCoral)).length || 0,
            [Observation.DroppingAlgae]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DroppingAlgae)).length || 0,
            [Observation.DifficultyAligningScore]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DifficultyAligningScore)).length || 0,
            [Observation.DifficultyAligningIntake]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DifficultyAligningIntake)).length || 0,
            [Observation.Immobilized]: matchData.get(team)?.filter(match => match.observations.includes(Observation.Immobilized)).length || 0,
            [Observation.DisabledPartially]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DisabledPartially)).length || 0,
            [Observation.DisabledFully]: matchData.get(team)?.filter(match => match.observations.includes(Observation.DisabledFully)).length || 0,
        }))
    , [matchData, observationsBarChartRobots]);

    return (
        <Paper elevation={0} className="w-full h-full overflow-y-scroll">
        <div className="flex flex-col items-center p-2">
            <TeamAnalyticsSelection teams={teams} minusTeams={minusTeams} onUpdate={(newTeams, newMinusTeams)=>{
                navigate(`/analytics/team/${newTeams.join('+')}${newMinusTeams ? `/vs/${newMinusTeams.join('+')}` : ''}`);
            }} />
            <TeamAnalyticsMatchSelection min={minMatch} max={maxMatch} onChange={(min, max) => {
                setMinMatch(min);
                setMaxMatch(max);
            }} />
            <div className="flex flex-wrap items-start justify-center gap-2">
                <div className="flex flex-col gap-2">
                    <Card className="w-full max-w-md border-4 border-green-300 !overflow-visible">
                        <CardHeader title="Pre Match Start Position" />
                        <CardContent>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img src={`/imgs/reefscape_field_render_blue.png`} 
                                        alt="Reefscape Field Render" 
                                        className={`object-cover object-right`}
                                        style={{ width: heatmapWidth, height: heatmapHeight }}
                                    />
                                    <Heatmap data={heatmapData} config={{
                                        size: 100,
                                        intensity: 0.75, 
                                        min: 0,
                                        gradient: [{
                                            color: [0, 0, 0, 0.0],
                                            offset: 0
                                        }, {
                                            color: [0, 0, 255, 0.2],
                                            offset: 0.2
                                        }, {
                                            color: [0, 255, 0, 0.5],
                                            offset: 0.45
                                        }, {
                                            color: [255, 255, 0, 1.0],
                                            offset: 0.85
                                        }, {
                                            color: [255, 0, 0, 1.0],
                                            offset: 1.0
                                        }]
                                    }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-md border-4 border-green-300">
                        <CardHeader title="Pre Match" />
                        <CardContent>
                            <div>Human Player Location</div>
                            <PieChart width={275} height={150} series={[{ 
                                data: humanPlayerLocationData,
                                cx: 50,
                                cy: "50%",
                                outerRadius: 50,
                                innerRadius: 15,
                                cornerRadius: 5,
                                paddingAngle: 5,
                            }]} />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-2">
                    <Card className="w-full max-w-md border-4 border-yellow-300">
                        <CardHeader title="Auto - Coral" />
                        <CardContent>
                            <QuantitativeProportionalStatistic name="Coral L4" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL4Score", "autoCoralL4Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L3" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL3Score", "autoCoralL3Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L2" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL2Score", "autoCoralL2Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L1" stats={describeQuantitativeProportionalObjects<MatchData>("autoCoralL1Score", "autoCoralL1Miss", matchDataPositive, matchDataNegative)} />
                        </CardContent>
                    </Card>

                    <Card className="w-full max-w-md border-4 border-yellow-300">
                        <CardHeader title="Auto - Other" />
                        <CardContent>
                            <QuantitativeStatistic name="Cycle Rate" stats={describeCycleRateQuantitativeObjects<MatchData>(autoCycleRatePaths, matchDataPositive, matchDataNegative)} desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened." />
                            <Divider sx={{ my: 2 }} />
                            <ProportionalStatistic name="Auto Leave" stats={describeProportionalObjects<BlueAllianceMatchExtended>("score_breakdown.autoLineRobot", tbaMatchDataPositive, tbaMatchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <QuantitativeProportionalStatistic name="Processor" stats={describeQuantitativeProportionalObjects<MatchData>("autoAlgaeScore", "autoAlgaeMiss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Net" stats={describeQuantitativeProportionalObjects<MatchData>("autoAlgaeNetScore", "autoAlgaeNetMiss", matchDataPositive, matchDataNegative)} />
                        </CardContent>
                    </Card>

                    <Card className="w-full max-w-md border-4 border-yellow-300">
                        <CardHeader title="Auto - Abilities" />
                        <CardContent>
                            <ProportionalStatistic name="Coral Ground Intake" stats={describeProportionalObjects<MatchData>("autoCoralGroundIntake", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Coral Station Intake" stats={describeProportionalObjects<MatchData>("autoCoralStationIntake", matchDataPositive, matchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <ProportionalStatistic name="Remove Algae from Reef L2" stats={describeProportionalObjects<MatchData>("autoRemoveL2Algae", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Remove Algae from Reef L3" stats={describeProportionalObjects<MatchData>("autoRemoveL3Algae", matchDataPositive, matchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <ProportionalStatistic name="Algae Ground Intake" stats={describeProportionalObjects<MatchData>("autoAlgaeGroundIntake", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Algae Reef Intake" stats={describeProportionalObjects<MatchData>("autoAlgaeReefIntake", matchDataPositive, matchDataNegative)} />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-2">
                    <Card className="w-full max-w-md border-4 border-pink-400">
                        <CardHeader title="Teleop - Coral" />
                        <CardContent>
                            <QuantitativeProportionalStatistic name="Coral L4" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL4Score", "teleopCoralL4Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L3" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL3Score", "teleopCoralL3Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L2" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL2Score", "teleopCoralL2Miss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Coral L1" stats={describeQuantitativeProportionalObjects<MatchData>("teleopCoralL1Score", "teleopCoralL1Miss", matchDataPositive, matchDataNegative)} />
                        </CardContent>
                    </Card>

                    <Card className="w-full max-w-md border-4 border-pink-400">
                        <CardHeader title="Teleop - Other" />
                        <CardContent>
                            <QuantitativeStatistic name="Cycle Rate" stats={describeCycleRateQuantitativeObjects<MatchData>(teleopCycleRatePaths, matchDataPositive, matchDataNegative)} desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened." />
                            <Divider sx={{ my: 2 }} />
                            <QuantitativeProportionalStatistic name="Processor" stats={describeQuantitativeProportionalObjects<MatchData>("teleopAlgaeScore", "teleopAlgaeMiss", matchDataPositive, matchDataNegative)} />
                            <QuantitativeProportionalStatistic name="Net" stats={describeQuantitativeProportionalObjects<MatchData>("teleopAlgaeNetScore", "teleopAlgaeNetMiss", matchDataPositive, matchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <QuantitativeProportionalStatistic name="Human Player Shots" stats={describeQuantitativeProportionalObjects<MatchData>("teleopHumanPlayerAlgaeScore", "teleopHumanPlayerAlgaeMiss", 
                                matchDataPositive.map(matches => matches.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor)), // Only include matches where the human player is at the processor
                                matchDataNegative?.map(matches => matches.filter(match => match.humanPlayerLocation === HumanPlayerLocation.Processor))
                            )} />
                        </CardContent>
                    </Card>

                    <Card className="w-full max-w-md border-4 border-pink-400">
                        <CardHeader title="Teleop - Abilities" />
                        <CardContent>
                            <ProportionalStatistic name="Coral Ground Intake" stats={describeProportionalObjects<MatchData>("teleopCoralGroundIntake", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Coral Station Intake" stats={describeProportionalObjects<MatchData>("teleopCoralStationIntake", matchDataPositive, matchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <ProportionalStatistic name="Remove Algae from Reef L2" stats={describeProportionalObjects<MatchData>("teleopRemoveL2Algae", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Remove Algae from Reef L3" stats={describeProportionalObjects<MatchData>("teleopRemoveL3Algae", matchDataPositive, matchDataNegative)} />
                            <Divider sx={{ my: 2 }} />
                            <ProportionalStatistic name="Algae Ground Intake" stats={describeProportionalObjects<MatchData>("teleopAlgaeGroundIntake", matchDataPositive, matchDataNegative)} />
                            <ProportionalStatistic name="Algae Reef Intake" stats={describeProportionalObjects<MatchData>("teleopAlgaeReefIntake", matchDataPositive, matchDataNegative)} />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-2 w-min">
                    <Card className="w-full max-w-md border-4 border-blue-300">
                        <CardHeader title="Climb" />
                        <CardContent>
                            <div>Climb</div>
                            <PieChart width={275} height={150} series={[{ 
                                data: climbPieData,
                                cx: 50,
                                cy: "50%",
                                outerRadius: 50,
                                innerRadius: 15,
                                cornerRadius: 5,
                                paddingAngle: 5,
                            }]} />
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-md border-4 border-blue-300">
                        <CardHeader title="Post Match" />
                        <CardContent>
                            <QuantitativeStatistic name="Time Defending" stats={describeQuantitativeObjects<MatchData>("timeDefending", matchDataPositive, matchDataNegative)} asPercent asPercentMultiplier={1} />
                            <Divider sx={{ my: 2 }} />
                            <div>Observations:</div>
                            <BarChart 
                                width={300} 
                                height={350}
                                dataset={observationsBarChartData}
                                xAxis={[{ scaleType: 'band', dataKey: 'team' }]}
                                series={[
                                    { dataKey: Observation.Tippy+"", label: 'Tippy', color: 'hotpink' },
                                    { dataKey: Observation.DroppingCoral+"", label: 'Dropping Coral', color: 'lightcoral' },
                                    { dataKey: Observation.DroppingAlgae+"", label: 'Dropping Algae', color: 'lightgreen' },
                                    { dataKey: Observation.DifficultyAligningScore+"", label: 'Difficulty Aligning Score', color: 'lightblue' },
                                    { dataKey: Observation.DifficultyAligningIntake+"", label: 'Difficulty Aligning Intake', color: 'lightyellow' },
                                    { dataKey: Observation.Immobilized+"", label: 'Immobilized', color: 'lightgrey' },
                                    { dataKey: Observation.DisabledPartially+"", label: 'Disabled Partially', color: 'orange' },
                                    { dataKey: Observation.DisabledFully+"", label: 'Disabled Fully', color: 'red' },
                                ]}
                                barLabel="value"
                                margin={{ top: 250 }}
                            />
                        </CardContent>
                    </Card>
                    <Card className="w-full max-w-md border-4 border-blue-300">
                        <CardHeader title="Notes" />
                        <CardContent className="flex flex-col gap-2">
                            {matchDataPositiveFlat.concat(matchDataNegativeFlat ?? []).filter(match=>(match.notes.trim()||match.observations.length)).map(match => (
                                <Card variant="outlined" key={match.teamNumber+"-"+match.matchId}>
                                    <CardHeader subheader={
                                        <span className="flex justify-between">
                                            <span>{match.teamNumber}</span>
                                            <span>{match.matchId}</span>
                                        </span>} 
                                        sx={{ p: 2 }} />
                                    <CardContent sx={{ py: 0 }}>
                                        {match.notes}
                                        <div className="flex gap-2 flex-wrap mt-2">
                                            {match.observations.map((observation) => (
                                                <Chip key={observation} label={observationLabels[observation]} variant="outlined" />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
        </Paper>
    )
}