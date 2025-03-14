import { Card, CardContent, CardHeader, Chip, Divider, Paper } from "@mui/material";
import { useContext, useMemo, useState } from "react";
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
import matchCompare from "../../util/matchCompare";
import AnalyticsCard from "./AnalyticsCard";

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

    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");

    const [minMatch, setMinMatch] = useState(0);
    const [maxMatch, setMaxMatch] = useState(schedule.matches.length - 1);

    // Get the data
    const {
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

    const scoutingMatchDataset: GraphableDataset<MatchData, string> = useMemo(() => ({
        positive: matchDataPositive,
        negative: matchDataNegative,
        xGetter: (data) => data.matchId,
        xComparator: matchCompare
    }), [matchDataPositive, matchDataNegative]);

    const tbaMatchDataset: GraphableDataset<BlueAllianceMatchExtended, string> = useMemo(() => ({
        positive: tbaMatchDataPositive,
        negative: tbaMatchDataNegative,
        xGetter: (data) => data.key,
        xComparator: matchCompare
    }), [tbaMatchDataPositive, tbaMatchDataNegative]);
    

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
        <Paper elevation={0} className="w-full h-full overflow-y-scroll">
        <div className="flex flex-col items-center p-2">
            <TeamAnalyticsSelection teams={teams} minusTeams={minusTeams} onUpdate={(newTeams, newMinusTeams)=>{
                navigate(`/analytics/team/${newTeams.join('+')}${newMinusTeams ? `/vs/${newMinusTeams.join('+')}` : ''}`);
            }} />
            <TeamAnalyticsMatchSelection min={minMatch} max={maxMatch} onChange={(min, max) => {
                setMinMatch(min);
                setMaxMatch(max);
            }} />
            <div className="w-full flex flex-wrap items-start justify-center gap-2">
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Pre Match Start Position" className="border-4 border-green-300 !overflow-visible">
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
                    <AnalyticsCard title="Auto - Coral" className="border-4 border-yellow-300">
                        <QuantitativeProportionalStatistic 
                            name="Coral L4"
                            successes="autoCoralL4Score"
                            failures="autoCoralL4Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L3" 
                            successes="autoCoralL3Score"
                            failures="autoCoralL3Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L2" 
                            successes="autoCoralL2Score"
                            failures="autoCoralL2Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L1" 
                            successes="autoCoralL1Score"
                            failures="autoCoralL1Miss"
                            dataset={scoutingMatchDataset}
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
                            desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened."
                        />
                        <QuantitativeStatistic 
                            name="# of Cycles" 
                            getter={match => getSum(match, autoCycleRatePaths) || undefined}
                            dataset={scoutingMatchDataset}
                            desc="Number of scores and misses for coral and algae in one match. Exclude matches where nothing happened."
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Auto Leave" 
                            getter="score_breakdown.autoLineRobot"
                            dataset={tbaMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic 
                            name="Processor" 
                            successes="autoAlgaeScore"
                            failures="autoAlgaeMiss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Net" 
                            successes="autoAlgaeNetScore"
                            failures="autoAlgaeNetMiss"
                            dataset={scoutingMatchDataset}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Auto - Abilities" className="border-4 border-yellow-300">
                        <ProportionalStatistic 
                            name="Coral Ground Intake" 
                            getter="autoCoralGroundIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic 
                            name="Coral Station Intake" 
                            getter="autoCoralStationIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Remove Algae from Reef L2" 
                            getter="autoRemoveL2Algae"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic 
                            name="Remove Algae from Reef L3"
                            getter="autoRemoveL3Algae"
                            dataset={scoutingMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Algae Ground Intake" 
                            getter="autoAlgaeGroundIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic 
                            name="Algae Reef Intake" 
                            getter="autoAlgaeReefIntake"
                            dataset={scoutingMatchDataset}
                        />
                    </AnalyticsCard>
                </div>
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Teleop - Coral" className="border-4 border-pink-400">
                        <QuantitativeProportionalStatistic 
                            name="Coral L4" 
                            successes="teleopCoralL4Score"
                            failures="teleopCoralL4Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L3" 
                            successes="teleopCoralL3Score"
                            failures="teleopCoralL3Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L2" 
                            successes="teleopCoralL2Score"
                            failures="teleopCoralL2Miss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic 
                            name="Coral L1" 
                            successes="teleopCoralL1Score"
                            failures="teleopCoralL1Miss"
                            dataset={scoutingMatchDataset}
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
                            desc="Counts both scores and misses for coral and algae. Excludes matches where nothing happened."
                        />
                        <QuantitativeStatistic 
                            name="# of Cycles" 
                            getter={match => getSum(match, teleopCycleRatePaths) || undefined}
                            dataset={scoutingMatchDataset}
                            desc="Number of scores and misses for coral and algae in one match. Exclude matches where nothing happened."
                        />
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic
                            name="Processor" 
                            successes="teleopAlgaeScore"
                            failures="teleopAlgaeMiss"
                            dataset={scoutingMatchDataset}
                        />
                        <QuantitativeProportionalStatistic
                            name="Net" 
                            successes="teleopAlgaeNetScore"
                            failures="teleopAlgaeNetMiss"
                            dataset={scoutingMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <QuantitativeProportionalStatistic 
                            name="Human Player Shots" 
                            successes={match => {
                                if (match.humanPlayerLocation !== HumanPlayerLocation.Processor) return undefined;
                                return match.teleopHumanPlayerAlgaeScore;
                            }}
                            failures={match => {
                                if (match.humanPlayerLocation !== HumanPlayerLocation.Processor) return undefined;
                                return match.teleopHumanPlayerAlgaeMiss;
                            }}
                            dataset={scoutingMatchDataset}
                        />
                    </AnalyticsCard>

                    <AnalyticsCard title="Teleop - Abilities" className="border-4 border-pink-400">
                        <ProportionalStatistic 
                            name="Coral Ground Intake" 
                            getter="teleopCoralGroundIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic 
                            name="Coral Station Intake" 
                            getter="teleopCoralStationIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic
                            name="Remove Algae from Reef L2" 
                            getter="teleopRemoveL2Algae"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic
                            name="Remove Algae from Reef L3"
                            getter="teleopRemoveL3Algae"
                            dataset={scoutingMatchDataset}
                        />
                        <Divider sx={{ my: 2 }} />
                        <ProportionalStatistic 
                            name="Algae Ground Intake" 
                            getter="teleopAlgaeGroundIntake"
                            dataset={scoutingMatchDataset}
                        />
                        <ProportionalStatistic 
                            name="Algae Reef Intake" 
                            getter="teleopAlgaeReefIntake"
                            dataset={scoutingMatchDataset}
                        />
                    </AnalyticsCard>
                </div>
                <div className="flex flex-col gap-2 max-w-sm w-full">
                    <AnalyticsCard title="Climb" className="border-4 border-blue-300">
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
                    </AnalyticsCard>
                    <AnalyticsCard title="Post Match" className="border-4 border-blue-300">
                        <QuantitativeStatistic 
                            name="Time Defending" 
                            unit="%"
                            getter="timeDefending"
                            dataset={scoutingMatchDataset}
                        />
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
            </div>
        </div>
        </Paper>
    )
}