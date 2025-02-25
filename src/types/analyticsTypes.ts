import { BlueAllianceAPIStatus, BlueAllianceMatch } from "./blueAllianceTypes";
import { MatchData } from "./MatchData";

export interface CustomTeamGroup {
    id: number;
    name: string;
    teams: number[];
}

// Defines a string union type for the different paths in an object
// Stolen from https://stackoverflow.com/a/58436959/2887218
export type Leaves<T> = T extends object ? { [K in keyof T]:
        `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
    }[keyof T] : never

export interface QuantitativeStats {
    min: number;
    max: number;
    sum: number;
    n: number;
    avg: number;
    sd: number;
}

export interface CategoricalStats<T> {
    sum: Map<T, number>;
    p: Map<T, number>;
    pMin: [T|undefined, number];
    pMax: [T|undefined, number];
    n: number;
}

export interface BooleanStats {
    sum: number;
    p: number;
    n: number;
}
