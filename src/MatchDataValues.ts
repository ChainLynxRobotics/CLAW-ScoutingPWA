import CoralScoreLocation from "./enums/CoralScoreLocation";
import HumanPlayerLocation from "./enums/HumanPlayerLocation"
import Observation from "./enums/Observation"
import { MatchData } from "./types/MatchData";
import { combineArrayNoRepeat, enumAverageCalculator } from "./util/analytics/matchDataAverage";

/**
 * This is the data that is stored in the MatchDataContext, and only gets stored once per match (unlike events).
 * 
 * These are the fields that are filled out by the user.
 * 
 * ### >>> These fields should change with every season. <<<
 * 
 * When you change these, remember to change the ProtoBuf file as well! **`/public/protobuf/data_transfer.proto`**
 */
export type MatchDataFields = {
    // Prematch
    autoStartPositionX: number|undefined, // Relative to the left 200 pixels of the field on blue side without field rotation (0-200)
    autoStartPositionY: number|undefined, // Relative to the entire height of the field on blue side without field rotation (0-500)
    humanPlayerLocation: boolean|undefined, // on or off field
    numberPowerCellsLoaded: number|undefined,
    // Auto
    autoMovement: boolean, // If the robot moves, this boolean should be true. Otherwise false.
    autoPowerPortBottomScore: number, // Amount of Power Cells Scored in Bottom Power Port
    autoPowerPortBottomMiss: number, // Amount of Power Cells Missed in Bottom Power Port
    autoPowerPortOuterScore: number, // Amount of Power Cells Scored in Outer Power Port
    autoPowerPortOuterMiss: number, // Amount of Power Cells Missed in Outer Power Port
    autoPowerPortInnerScore: number, // Amount of Power Cells Scored in Inner Power Port
    autoPowerPortInnerMiss: number, // Amount of Power Cells Missed in Inner Power Port
    autoPowerCellIntakeGround: boolean, // If the robot intakes Power Cells from the ground, this boolean should be true. Otherwise false.
    autoPowerCellIntakeLoadingBay: boolean, // If the robot intakes Power Cells from the loading bay, this boolean should be true. Otherwise false.
    // Teleop
    teleopPowerPortBottomScore: number, // Amount of Power Cells Scored in Bottom Power Port
    teleopPowerPortBottomMiss: number, // Amount of Power Cells Missed in Bottom Power Port
    teleopPowerPortOuterScore: number, // Amount of Power Cells Scored in Outer Power Port
    teleopPowerPortOuterMiss: number, // Amount of Power Cells Missed in Outer Power Port
    teleopPowerPortInnerScore: number, // Amount of Power Cells Scored in Inner Power Port
    teleopPowerPortInnerMiss: number, // Amount of Power Cells Missed in Inner Power Port
    teleopPowerCellIntakeGround: boolean, // If the robot intakes Power Cells from the ground, this boolean should be true. Otherwise false.
    teleopPowerCellIntakeLoadingBay: boolean, // If the robot intakes Power Cells from the loading bay, this boolean should be true. Otherwise false.
    teleopRotationControl: boolean, // If they get to stage 2, are they able to get to over 5 rotations. If not reached stage 2/not attempted, keep this as false.
    teleopPositionControl: boolean, // If they get to stage 3, did they succeed position control. If not reached stage 2/not attempted, keep this as false.
    // Endgame
    shieldGeneratorStage: number,
    climbedOnGenerator: boolean,
    timeDefending: number,
    observations: Observation[],
    notes: string,
}
// Other more global match data is stored in the type `MatchData` in `src/types/MatchData.ts`


/**
 * This is the information about each field in the MatchDataFields object.
 * 
 * This is used for display purposes, state initialization, and serialization.
 */
export const MatchDataFieldInformation: Readonly<MatchDataFieldInformationRecord> = {
    // Prematch
    autoStartPositionX: {
        name: "Auto Start Position",
        defaultValue: undefined,
        average: (values) => {
            const arr = values.filter(val => val !== undefined)
            return arr.reduce((a, b) => a + b, 0) / arr.length
        }
    },
    autoStartPositionY: {
        name: "Auto Start Position",
        defaultValue: undefined,
        average: (values) => {
            const arr = values.filter(val => val !== undefined)
            return arr.reduce((a, b) => a + b, 0) / arr.length
        }
    },
    humanPlayerLocation: {
        name: "Human Player Location",
        defaultValue: false,
        serialize: (value) => value ? "1" : "0",
    },
    numberPowerCellsLoaded: {
        name: "Number Of Power Cells Loaded",
        defaultValue: undefined,
        average: (values) => {
            const arr = values.filter(val => val !== undefined)
            return arr.reduce((a, b) => a + b, 0) / arr.length
        }
    },
    // Auto
    autoMovement: { name: "Auto Movement", defaultValue: false },
    autoPowerPortBottomScore: { name: "Auto Power Port Bottom Score", defaultValue: 0 },
    autoPowerPortBottomMiss: { name: "Auto Power Port Bottom Miss", defaultValue: 0 },
    autoPowerPortOuterScore: { name: "Auto Power Port Outer Score", defaultValue: 0 },
    autoPowerPortOuterMiss: { name: "Auto Power Port Outer Miss", defaultValue: 0 },
    autoPowerPortInnerScore: { name: "Auto Power Port Inner Score", defaultValue: 0 },
    autoPowerPortInnerMiss: { name: "Auto Power Port Inner Miss", defaultValue: 0 },
    autoPowerCellIntakeGround: { name: "Auto Power Port Intake Ground", defaultValue: false },
    autoPowerCellIntakeLoadingBay: { name: "Auto Power Port Intake Loading Bay", defaultValue: false },
    // Teleop
    teleopPowerPortBottomScore: { name: "Teleop Power Port Bottom Score", defaultValue: 0 },
    teleopPowerPortBottomMiss: { name: "Teleop Power Port Bottom Miss", defaultValue: 0 },
    teleopPowerPortOuterScore: { name: "Teleop Power Port Outer Score", defaultValue: 0 },
    teleopPowerPortOuterMiss: { name: "Teleop Power Port Outer Miss", defaultValue: 0 },
    teleopPowerPortInnerScore: { name: "Teleop Power Port Inner Score", defaultValue: 0 },
    teleopPowerPortInnerMiss: { name: "Teleop Power Port Inner Miss", defaultValue: 0 },
    teleopPowerCellIntakeGround: { name: "Teleop Power Port Intake Ground", defaultValue: false },
    teleopPowerCellIntakeLoadingBay: { name: "Teleop Power Port Intake Loading Bay", defaultValue: false },
    teleopPositionControl: {name: "Teleop Position Control", defaultValue: false},
    teleopRotationControl: {name: "Teleop Rotation Control", defaultValue: false},
    // Endgame
    shieldGeneratorStage: {
        name: "Shield Generator Stage",
        defaultValue: 1,
    },
    timeDefending: {
        name: "Time Defending",
        defaultValue: 0,
    },
    observations: {
        name: "Observations",
        defaultValue: [],
        serialize: (value) => value.map((v) => Observation[v]).join(", "),
        average: combineArrayNoRepeat,
    },
    climbedOnGenerator: {
        name: "Climbed on Generator",
        defaultValue: false,
        serialize: (value) => value ? "1" : "0",
    },
    notes: {
        name: "Notes",
        defaultValue: "",
    },
}


// *** DO NOT EDIT BELOW THIS LINE ***

// This makes sure the MatchDataFields and MatchDataFieldInformation are in sync
type MatchDataFieldInformationRecord = {
    [K in keyof MatchDataFields]: {
        /**
         * The name of the field, used for display purposes
         */
        name: string
        /**
         * The default value of the field, used when creating a new ScoutingContext
         */
        defaultValue: MatchDataFields[K]
        /**
         * An optional function to serialize the value to a string, used for display purposes of the value
         * @param value - The value to serialize
         * @returns A nice string representation of the value
         */
        serialize?: (value: MatchDataFields[K], object: MatchData) => string
        /**
         * A function that takes in a list of values across multiple entries for the same match, and returns the average value
         * 
         * This is automatically done for all fields that are numbers, booleans, and strings (which are joined with a newline)
         * If you want a custom one, or have a different type, you can define it here
         * 
         * @param values - The list of values to average
         * @returns The average value of the list, or undefined if there are no values and will default to the defaultValue
         */
        average?: (values: MatchDataFields[K][]) => MatchDataFields[K]|undefined
    }
}