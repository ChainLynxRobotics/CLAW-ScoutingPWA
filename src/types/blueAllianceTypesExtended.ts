import { BlueAllianceMatch, BlueAllianceMatchScoreBreakdown2025, BlueAllianceMatchScoreBreakdown2025Alliance } from "./blueAllianceTypes";

export interface BlueAllianceMatchExtended extends BlueAllianceMatch {
    score_breakdown: BlueAllianceMatchScoreBreakdown2025Extended | null;
}

export interface BlueAllianceMatchScoreBreakdown2025Extended extends BlueAllianceMatchScoreBreakdown2025 {
    // For the robot currently focused on
    autoLineRobot?: boolean;
    // For the robot currently focused on
    endGameRobot?: "None" | "Parked" | "ShallowCage" | "DeepCage";
}