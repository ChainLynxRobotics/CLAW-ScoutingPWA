import { Backdrop, Card, CardContent, CardHeader, Chip, CircularProgress, Divider, Paper } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import { MatchData } from "../../types/MatchData";
import { BarChart, PieChart, PieValueType } from "@mui/x-charts";
import HumanPlayerLocation from "../../enums/HumanPlayerLocation";
import ProportionalStatistic from "./ProporationalStatistic";
import { getSum } from "../../util/analytics/objectStatistics";
import QuantitativeProportionalStatistic from "./QuantitativeProportionalStatistic";
import TeamAnalyticsSelection from "./TeamAnalyticsSelection";
import { useNavigate } from "react-router-dom";
import Heatmap from "./Heatmap";
import QuantitativeStatistic from "./QuantitativeStatistic";
import Observation from "../../enums/Observation";
import { BlueAllianceMatchExtended } from "../../types/blueAllianceTypesExtended";
import { GraphableDataset, Leaves } from "../../types/analyticsTypes";
import { ScheduleContext } from "../context/ScheduleContextProvider";
import TeamAnalyticsMatchSelection from "./TeamAnalyticsMatchSelection";
import useTeamAnalyticsData from "./useTeamAnalyticsData";
import matchCompare, { matchCompareEquals, matchEquals } from "../../util/matchCompare";
import AnalyticsCard from "./AnalyticsCard";
import { GradientElement } from "visual-heatmap/dist/types/types";
import CoralScoreLocation from "../../enums/CoralScoreLocation";
import Statistic from "./Statistic";
import StatisticLineChart from "./StatisticLineChart";

const autoCycleRatePaths: Leaves<MatchData>[] = [
    "autoPowerPortBottomScore",
    "autoPowerPortBottomMiss",
    "autoPowerPortInnerMiss",
    "autoPowerPortInnerScore",
    "autoPowerPortOuterMiss",
    "autoPowerPortOuterScore",
];

const teleopCycleRatePaths: Leaves<MatchData>[] = [
    "teleopPowerPortBottomMiss",
    "teleopPowerPortBottomScore",
    "teleopPowerPortInnerMiss",
    "teleopPowerPortInnerScore",
    "teleopPowerPortOuterMiss",
    "teleopPowerPortOuterScore",
];

const heatmapOriginalWidth = 200;
const heatmapOriginalHeight = 500;
const heatmapWidth = 150;
const heatmapHeight = 375;
const heatmapGradient: GradientElement[] = [
    {
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
    }
];

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

    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");

    const [minMatch, setMinMatch] = useState(0);
    const [maxMatch, setMaxMatch] = useState(schedule.matches.length - 1);

    const [dismissedLoading, setDismissedLoading] = useState(false);

    // Get the data
    const {
        loadedMatchData,
        loadedTBAMatchData,
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
    } = useTeamAnalyticsData(teams, minusTeams, minMatch, maxMatch);

    useEffect(() => {
        if (!loadedMatchData && !loadedTBAMatchData && dismissedLoading) {
            setDismissedLoading(false);
        }
    }, [loadedMatchData, loadedTBAMatchData, dismissedLoading]);

    const scoutingMatchDataset: GraphableDataset<MatchData> = useMemo(() => ({
        positive: matchDataPositive,
        positiveGroupNames: teams.map(team => team.toString()),
        negative: matchDataNegative,
        negativeGroupNames: minusTeams?.map(team => team.toString()),
        xData: schedule.matches.map((match, i) => i),
        xGetter: (data) => schedule.matches.findIndex(match => matchCompareEquals(match.matchId, data.matchId)) || 0,
        xSerializer: (x) => schedule.matches[x]?.matchId,
    }), [matchDataPositive, matchDataNegative, schedule.matches]);

    const tbaMatchDataset: GraphableDataset<BlueAllianceMatchExtended> = useMemo(() => ({
        positive: tbaMatchDataPositive,
        positiveGroupNames: teams.map(team => team.toString()),
        negative: tbaMatchDataNegative,
        negativeGroupNames: minusTeams?.map(team => team.toString()),
        xData: schedule.matches.map((match, i) => i),
        xGetter: (data) => schedule.matches.findIndex(match => matchCompareEquals(match.matchId, data.key)) || 0,
        xSerializer: (x) => schedule.matches[x]?.matchId,
    }), [tbaMatchDataPositive, tbaMatchDataNegative, schedule.matches]);
    

    // Data for the human player location pie chart
    const humanPlayerLocationData = useMemo<PieValueType[]>(() => [
        {
            id: 0,
            label: 'Not on Field',
            value: matchDataPositiveFlat.filter(match => !match.humanPlayerLocation).length - (matchDataNegativeFlat?.filter(match => match.humanPlayerLocation).length || 0),
            color: 'lightgrey'
        },
        {
            id: 1,
            label: 'On Field',
            value: matchDataPositiveFlat.filter(match => match.humanPlayerLocation).length - (matchDataNegativeFlat?.filter(match => !match.humanPlayerLocation).length || 0),
            color: 'snow'
        },
    ], [matchDataPositiveFlat, matchDataNegativeFlat]);

    // Data for the heatmap
    const heatmapData = useMemo(() => matchDataPositiveFlat
        .filter(match => match.autoStartPositionX !== undefined && match.autoStartPositionY !== undefined)
        .map(match => ({
            x: match.autoStartPositionX! * heatmapWidth / heatmapOriginalWidth,
            y: match.autoStartPositionY! * heatmapHeight / heatmapOriginalHeight,
            value: 5
        })
    ), [matchDataPositiveFlat]);

    // Data for the climb pie chart
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

    // Data for the observations bar chart
    const observationsBarChartRobots = useMemo(() => [...teams, ...(minusTeams ?? [])], [teams, minusTeams]);
    const observationsBarChartData = useMemo(() => 
        observationsBarChartRobots.map(team => ({
            team,
            [Observation.Tippy]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.Tippy)).length || 0,
            [Observation.DroppingCoral]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DroppingCoral)).length || 0,
            [Observation.DroppingAlgae]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DroppingAlgae)).length || 0,
            [Observation.DifficultyAligningScore]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DifficultyAligningScore)).length || 0,
            [Observation.DifficultyAligningIntake]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DifficultyAligningIntake)).length || 0,
            [Observation.Immobilized]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.Immobilized)).length || 0,
            [Observation.DisabledPartially]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DisabledPartially)).length || 0,
            [Observation.DisabledFully]: matchData.get(team)?.filter(match => match.observations?.includes(Observation.DisabledFully)).length || 0,
        }))
    , [matchData, observationsBarChartRobots]);

    return (
        <div className="w-full h-full overflow-y-scroll">
        <div className="flex flex-col items-center p-2">
            <TeamAnalyticsSelection teams={teams} minusTeams={minusTeams} onUpdate={(newTeams, newMinusTeams)=>{
                navigate(`/analytics/team/${newTeams.join('+')}${newMinusTeams ? `/vs/${newMinusTeams.join('+')}` : ''}`);
            }} />
            <TeamAnalyticsMatchSelection min={minMatch} max={maxMatch} onChange={(min, max) => {
                setMinMatch(min);
                setMaxMatch(max);
            }} />
            <div className="w-full flex flex-wrap items-start justify-center gap-2 relative">
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Pre Match Start Position" className="border-4 border-green-300">
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
                                    gradient: heatmapGradient
                                }} />
                            </div>
                        </div>
                    </AnalyticsCard>
                    <AnalyticsCard title="Pre Match" className="border-4 border-green-300">
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
                    </AnalyticsCard>
                </div>
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Auto - Coral Heatmaps" className="border-4 border-yellow-300">
                        <div className="flex flex-col items-center">
                            <div>
                                <Statistic name="Coral L4" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.autoCoralL4ScoreLocations).flat()} />
                                <Divider sx={{ my: 2 }} />
                                <Statistic name="Coral L3" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.autoCoralL3ScoreLocations).flat()} />
                                <Divider sx={{ my: 2 }} />
                                <Statistic name="Coral L2" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.autoCoralL2ScoreLocations).flat()} />
                            </div>
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Auto - Power Port" className="border-4 border-yellow-300">
                        <QuantitativeProportionalStatistic 
                            name="Power Port Bottom"
                            successes="autoPowerPortBottomScore"
                            failures="autoPowerPortBottomMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <QuantitativeProportionalStatistic 
                            name="Power Port Inner" 
                            successes="autoPowerPortInnerScore"
                            failures="autoPowerPortInnerMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <QuantitativeProportionalStatistic 
                            name="Power Port Outer" 
                            successes="autoPowerPortOuterScore"
                            failures="autoPowerPortOuterMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Auto - Other" className="border-4 border-yellow-300">
                        <QuantitativeStatistic 
                            name="Cycle Time" 
                            unit="s" 
                            digits={0}
                            getter={match => {
                                let sum = getSum(match, autoCycleRatePaths);
                                if (sum === 0) return undefined;
                                return 15 / sum;
                            }}
                            dataset={scoutingMatchDataset}
                            graphable
                            desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened."
                        />
                        <QuantitativeStatistic 
                            name="# of Cycles" 
                            getter={match => getSum(match, autoCycleRatePaths) || undefined}
                            dataset={scoutingMatchDataset}
                            graphable
                            desc="Number of scores and misses for coral and algae in one match. Exclude matches where nothing happened."
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Auto Leave" 
                            getter="score_breakdown.autoLineRobot"
                            dataset={tbaMatchDataset}
                            graphable
                        />
                        <ProportionalStatistic 
                            name="Power Cell Ground Intake" 
                            getter="autoPowerCellIntakeGround"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <ProportionalStatistic 
                            name="Power Cell Loading Bay Intake Intake" 
                            getter="autoPowerCellIntakeLoadingBay"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                    </AnalyticsCard>
                </div>
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Teleop - Coral Heatmaps" className="border-4 border-pink-400">
                        <div className="flex flex-col items-center">
                            <div>
                                <Statistic name="Coral L4" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.teleopCoralL4ScoreLocations).flat()} />
                                <Divider sx={{ my: 2 }} />
                                <Statistic name="Coral L3" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.teleopCoralL3ScoreLocations).flat()} />
                                <Divider sx={{ my: 2 }} />
                                <Statistic name="Coral L2" />
                                <CoralHeatmap data={matchDataPositiveFlat.map(match => match.teleopCoralL2ScoreLocations).flat()} />
                            </div>
                        </div>
                    </AnalyticsCard>

                    <AnalyticsCard title="Teleop - Coral" className="border-4 border-pink-400">
                        <QuantitativeProportionalStatistic 
                            name="Power Port Bottom" 
                            successes="teleopPowerPortBottomScore"
                            failures="teleopPowerPortBottomMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <QuantitativeProportionalStatistic 
                            name="Power Port Inner" 
                            successes="teleopPowerPortInnerScore"
                            failures="teleopPowerPortInnerMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <QuantitativeProportionalStatistic 
                            name="Power Port Outer" 
                            successes="teleopPowerPortOuterScore"
                            failures="teleopPowerPortOuterMiss"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Teleop - Other" className="w-full max-w-md border-4 border-pink-400">
                        <QuantitativeStatistic 
                            name="Cycle Time" 
                            unit="s" 
                            digits={0}
                            getter={match => {
                                let sum = getSum(match, teleopCycleRatePaths);
                                if (sum === 0) return undefined;
                                return 135 / sum;
                            }}
                            dataset={scoutingMatchDataset}
                            graphable
                            desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened."
                        />
                        <QuantitativeStatistic 
                            name="# of Cycles" 
                            getter={match => getSum(match, teleopCycleRatePaths) || undefined}
                            dataset={scoutingMatchDataset}
                            graphable
                            desc="Number of scores and misses for coral and algae in one match. Exclude matches where nothing happened."
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Power Cell Ground Intake" 
                            getter="teleopPowerCellIntakeGround"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <ProportionalStatistic 
                            name="Power Cell Loading Bay Intake" 
                            getter="teleopPowerCellIntakeLoadingBay"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                    </AnalyticsCard>
                </div>
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Climb" className="border-4 border-blue-300">
                        <PieChart width={275} height={150} series={[{ 
                            data: climbPieData,
                            cx: 50,
                            cy: "50%",
                            outerRadius: 50,
                            innerRadius: 15,
                            cornerRadius: 5,
                            paddingAngle: 5,
                        }]} />
                    </AnalyticsCard>
                    <AnalyticsCard title="Post Match" className="border-4 border-blue-300">
                        <QuantitativeStatistic 
                            name="Time Defending" 
                            unit="%"
                            getter="timeDefending"
                            dataset={scoutingMatchDataset}
                            graphable
                        />
                        <Divider sx={{ my: 2 }} />
                        <div>Observations:</div>
                        <BarChart 
                            width={300} 
                            height={299}
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
                            margin={{ top: 215, bottom: 20 }}
                        />
                    </AnalyticsCard>
                    <AnalyticsCard title="Notes" className="border-4 border-blue-300">
                        {matchDataPositiveFlat.concat(matchDataNegativeFlat ?? []).filter(match=>(match.notes.trim()||match.observations?.filter(observation => observation !== undefined).length)).map(match => (
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
                                        {match.observations?.filter(observation => observation !== undefined).map((observation) => (
                                            <Chip key={observation} label={observationLabels[observation]} variant="outlined" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </AnalyticsCard>
                </div>

                <Backdrop
                    sx={() => ({ 
                        color: '#fff', 
                        position: 'absolute', 
                        alignItems: 'start',
                        paddingTop: '12rem'
                    })}
                    open={dismissedLoading || !loadedMatchData || !loadedTBAMatchData}
                    onClick={() => setDismissedLoading(true)}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            </div>
        </div>
        </div>
    )
}

const coralHeatmapMap: Record<CoralScoreLocation, { x: number, y: number }> = {
    [CoralScoreLocation.A]: { x: 293, y: 414 },
    [CoralScoreLocation.B]: { x: 293, y: 440 },
    [CoralScoreLocation.C]: { x: 312, y: 475 },
    [CoralScoreLocation.D]: { x: 335, y: 489 },
    [CoralScoreLocation.E]: { x: 375, y: 489 },
    [CoralScoreLocation.F]: { x: 398, y: 475 },
    [CoralScoreLocation.G]: { x: 419, y: 440 },
    [CoralScoreLocation.H]: { x: 419, y: 414 },
    [CoralScoreLocation.I]: { x: 398, y: 379 },
    [CoralScoreLocation.J]: { x: 375, y: 366 },
    [CoralScoreLocation.K]: { x: 335, y: 366 },
    [CoralScoreLocation.L]: { x: 312, y: 379 },
}
const imageWidth = 747;
const imageHeight = 850;
const centerOfReefX = 355;
const centerOfReefY = 425;

const coralHeatmapWidth = 200;
const coralHeatmapHeight = 200;
const leftTranslate = -centerOfReefX + coralHeatmapWidth/2;
const topTranslate = -centerOfReefY + coralHeatmapHeight/2;
export function CoralHeatmap({ data }: { data?: CoralScoreLocation[] }) {

    const heatmapData = useMemo(() => data?.filter(v => v !== undefined).map(location => ({
        x: coralHeatmapMap[location].x + leftTranslate,
        y: coralHeatmapMap[location].y + topTranslate,
        value: 1
    })) || [], [data]);

    return (
        <div className="relative overflow-hidden" style={{ width: coralHeatmapWidth, height: coralHeatmapHeight }}>
            <div
                className="absolute"
                style={{ 
                    width: `${imageWidth}px`,
                    height: `${imageHeight}px`,
                    top: `${topTranslate}px`,
                    left: `${leftTranslate}px`,
                }}
            >
                <img src={`/imgs/reefscape_field_render_blue.png`} 
                    alt="Reefscape Field Render"
                    width={imageWidth}
                    height={imageHeight}
                    // Zoom in specifically on the reef
                    style={{
                        transformOrigin: `${centerOfReefX}px ${centerOfReefY}px`,
                        scale: 1.2
                    }}
                />
            </div>
            <Heatmap data={heatmapData} config={{
                size: 75,
                intensity: 0.75, 
                min: 0,
                gradient: heatmapGradient
            }}
                className="scale-[1.2]"
            />
        </div>
    )
}