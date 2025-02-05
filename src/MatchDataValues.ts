import ClimbResult from "./enums/ClimbResult"
import HumanPlayerLocation from "./enums/HumanPlayerLocation"
import MatchResult from "./enums/MatchResult"

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
    autoStartPosition: number,
    humanPlayerLocation: HumanPlayerLocation,
    // Auto
    autoLeave: boolean,
    autoCoralL1Score: number,
    autoCoralL1Miss: number,
    autoCoralL2Score: number,
    autoCoralL2Miss: number,
    autoCoralL3Score: number,
    autoCoralL3Miss: number,
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
    // Teleop
    teleopCoralL1Score: number,
    teleopCoralL1Miss: number,
    teleopCoralL2Score: number,
    teleopCoralL2Miss: number,
    teleopCoralL3Score: number,
    teleopCoralL3Miss: number,
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
    teleopHumanPlayerAlgaeScore: number,
    teleopHumanPlayerAlgaeMiss: number,
    // Endgame
    climb: ClimbResult,
    timeDefending: number,
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
    autoStartPosition: {
        name: "Auto Start Position",
        defaultValue: 0,
    },
    humanPlayerLocation: {
        name: "Human Player Location",
        defaultValue: HumanPlayerLocation.None,
        serialize: (value) => HumanPlayerLocation[value],
    },
    // Auto
    autoLeave: {
        name: "Auto Leave",
        defaultValue: false,
    },
    autoCoralL1Score: { name: "Coral L1 Score", defaultValue: 0 },
    autoCoralL1Miss: { name: "Coral L1 Miss", defaultValue: 0 },
    autoCoralL2Score: { name: "Coral L2 Score", defaultValue: 0 },
    autoCoralL2Miss: { name: "Coral L2 Miss", defaultValue: 0 },
    autoCoralL3Score: { name: "Coral L3 Score", defaultValue: 0 },
    autoCoralL3Miss: { name: "Coral L3 Miss", defaultValue: 0 },
    autoCoralL4Score: { name: "Coral L4 Score", defaultValue: 0 },
    autoCoralL4Miss: { name: "Coral L4 Miss", defaultValue: 0 },
    autoAlgaeScore: { name: "Algae Score", defaultValue: 0 },
    autoAlgaeMiss: { name: "Algae Miss", defaultValue: 0 },
    autoAlgaeNetScore: { name: "Algae Net Score", defaultValue: 0 },
    autoAlgaeNetMiss: { name: "Algae Net Miss", defaultValue: 0 },
    autoCoralGroundIntake: { name: "Coral Ground Intake", defaultValue: false },
    autoCoralStationIntake: { name: "Coral Station Intake", defaultValue: false },
    autoAlgaeGroundIntake: { name: "Algae Ground Intake", defaultValue: false },
    autoAlgaeReefIntake: { name: "Algae Reef Intake", defaultValue: false },
    // Teleop
    teleopCoralL1Score: { name: "Coral L1 Score", defaultValue: 0 },
    teleopCoralL1Miss: { name: "Coral L1 Miss", defaultValue: 0 },
    teleopCoralL2Score: { name: "Coral L2 Score", defaultValue: 0 },
    teleopCoralL2Miss: { name: "Coral L2 Miss", defaultValue: 0 },
    teleopCoralL3Score: { name: "Coral L3 Score", defaultValue: 0 },
    teleopCoralL3Miss: { name: "Coral L3 Miss", defaultValue: 0 },
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
    teleopHumanPlayerAlgaeScore: {
        name: "Human Player Algae Score",
        defaultValue: 0
    },
    teleopHumanPlayerAlgaeMiss: {
        name: "Human Player Algae Miss",
        defaultValue: 0
    },
    // Endgame
    climb: {
        name: "Climb",
        defaultValue: ClimbResult.None,
        serialize: (value) => ClimbResult[value],
    },
    timeDefending: {
        name: "Time Defending",
        defaultValue: 0,
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
        serialize?: (value: MatchDataFields[K]) => string
    }
}