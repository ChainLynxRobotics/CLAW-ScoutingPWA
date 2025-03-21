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
    humanPlayerLocation: HumanPlayerLocation,
    // Auto
    autoCoralL1Score: number,
    autoCoralL1Miss: number,
    autoCoralL2ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    autoCoralL2Score: number,
    autoCoralL2Miss: number,
    autoCoralL3ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    autoCoralL3Score: number,
    autoCoralL3Miss: number,
    autoCoralL4ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    autoCoralL4Score: number,
    autoCoralL4Miss: number,
    autoAlgaeScore: number,
    autoAlgaeMiss: number,
    autoAlgaeNetScore: number,
    autoAlgaeNetMiss: number,
    autoCoralGroundIntake: boolean,
    autoCoralStationIntake: boolean,
    autoAlgaeGroundIntake: boolean,
    autoAlgaeReefIntake: boolean,
    autoRemoveL2Algae: boolean,
    autoRemoveL3Algae: boolean,
    // Teleop
    teleopCoralL1Score: number,
    teleopCoralL1Miss: number,
    teleopCoralL2ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    teleopCoralL2Score: number,
    teleopCoralL2Miss: number,
    teleopCoralL3ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    teleopCoralL3Score: number,
    teleopCoralL3Miss: number,
    teleopCoralL4ScoreLocations: CoralScoreLocation[],
    /** @deprecated */
    teleopCoralL4Score: number,
    teleopCoralL4Miss: number,
    teleopAlgaeScore: number,
    teleopAlgaeMiss: number,
    teleopAlgaeNetScore: number,
    teleopAlgaeNetMiss: number,
    teleopCoralGroundIntake: boolean,
    teleopCoralStationIntake: boolean,
    teleopAlgaeGroundIntake: boolean,
    teleopAlgaeReefIntake: boolean,
    teleopRemoveL2Algae: boolean,
    teleopRemoveL3Algae: boolean,
    teleopHumanPlayerAlgaeScore: number,
    teleopHumanPlayerAlgaeMiss: number,
    // Endgame
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
        defaultValue: HumanPlayerLocation.Unknown,
        serialize: (value) => HumanPlayerLocation[value],
        average: enumAverageCalculator,
    },
    // Auto
    autoCoralL1Score: { name: "Auto Coral L1 Score", defaultValue: 0 },
    autoCoralL1Miss: { name: "Auto Coral L1 Miss", defaultValue: 0 },
    autoCoralL2ScoreLocations: { name: "Auto Coral L2 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    autoCoralL2Score: { name: "Auto Coral L2 Score", defaultValue: 0 },
    autoCoralL2Miss: { name: "Auto Coral L2 Miss", defaultValue: 0 },
    autoCoralL3ScoreLocations: { name: "Auto Coral L3 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    autoCoralL3Score: { name: "Auto Coral L3 Score", defaultValue: 0 },
    autoCoralL3Miss: { name: "Auto Coral L3 Miss", defaultValue: 0 },
    autoCoralL4ScoreLocations: { name: "Auto Coral L4 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    autoCoralL4Score: { name: "Auto Coral L4 Score", defaultValue: 0 },
    autoCoralL4Miss: { name: "Auto Coral L4 Miss", defaultValue: 0 },
    autoAlgaeScore: { name: "Auto Algae Score", defaultValue: 0 },
    autoAlgaeMiss: { name: "Auto Algae Miss", defaultValue: 0 },
    autoAlgaeNetScore: { name: "Auto Algae Net Score", defaultValue: 0 },
    autoAlgaeNetMiss: { name: "Auto Algae Net Miss", defaultValue: 0 },
    autoCoralGroundIntake: { name: "Auto Coral Ground Intake", defaultValue: false },
    autoCoralStationIntake: { name: "Auto Coral Station Intake", defaultValue: false },
    autoAlgaeGroundIntake: { name: "Auto Algae Ground Intake", defaultValue: false },
    autoAlgaeReefIntake: { name: "Auto Algae Reef Intake", defaultValue: false },
    autoRemoveL2Algae: { name: "Auto Remove Level 2 Algae", defaultValue: false },
    autoRemoveL3Algae: { name: "Auto Remove Level 3 Algae", defaultValue: false },
    // Teleop
    teleopCoralL1Score: { name: "Coral L1 Score", defaultValue: 0 },
    teleopCoralL1Miss: { name: "Coral L1 Miss", defaultValue: 0 },
    teleopCoralL2ScoreLocations: { name: "Coral L2 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    teleopCoralL2Score: { name: "Coral L2 Score", defaultValue: 0 },
    teleopCoralL2Miss: { name: "Coral L2 Miss", defaultValue: 0 },
    teleopCoralL3ScoreLocations: { name: "Coral L3 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    teleopCoralL3Score: { name: "Coral L3 Score", defaultValue: 0 },
    teleopCoralL3Miss: { name: "Coral L3 Miss", defaultValue: 0 },
    teleopCoralL4ScoreLocations: { name: "Coral L4 Score Locations", defaultValue: [], serialize: (value) => value.map((v) => CoralScoreLocation[v]).join(", "), average: combineArrayNoRepeat },
    teleopCoralL4Score: { name: "Coral L4 Score", defaultValue: 0 },
    teleopCoralL4Miss: { name: "Coral L4 Miss", defaultValue: 0 },
    teleopAlgaeScore: { name: "Algae Score", defaultValue: 0 },
    teleopAlgaeMiss: { name: "Algae Miss", defaultValue: 0 },
    teleopAlgaeNetScore: { name: "Algae Net Score", defaultValue: 0 },
    teleopAlgaeNetMiss: { name: "Algae Net Miss", defaultValue: 0 },
    teleopCoralGroundIntake: { name: "Coral Ground Intake", defaultValue: false },
    teleopCoralStationIntake: { name: "Coral Station Intake", defaultValue: false },
    teleopAlgaeGroundIntake: { name: "Algae Ground Intake", defaultValue: false },
    teleopAlgaeReefIntake: { name: "Algae Reef Intake", defaultValue: false },
    teleopRemoveL2Algae: { name: "Auto Remove Level 2 Algae", defaultValue: false },
    teleopRemoveL3Algae: { name: "Auto Remove Level 3 Algae", defaultValue: false },
    teleopHumanPlayerAlgaeScore: {
        name: "Human Player Algae Score",
        defaultValue: 0
    },
    teleopHumanPlayerAlgaeMiss: {
        name: "Human Player Algae Miss",
        defaultValue: 0
    },
    // Endgame
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