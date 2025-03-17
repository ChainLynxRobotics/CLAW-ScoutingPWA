import { MatchDataFieldInformation, MatchDataFields } from "../../MatchDataValues";
import { MatchData } from "../../types/MatchData";

/**
 * Calculate the average of multiple data points of a team for the same match.
 * 
 * Uses the average function provided in MatchDataFieldInformation, or calculates the average of numbers, booleans, and strings if not provided.
 * Other types will throw an error.
 * 
 */
export default function matchDataAverage(matchData: MatchData[]): MatchData {
    if (matchData.length === 0) throw new Error("No data provided");

    const fields: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const [field, info] of Object.entries(MatchDataFieldInformation)) {
        const values = matchData.map(v => v[field as keyof MatchDataFields]).filter(v => v !== undefined) as any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
        if (info.average !== undefined) fields[field as keyof MatchDataFields] = info.average(values);
        else if (values.every(v => typeof v === "number")) fields[field as keyof MatchDataFields] = values.reduce((a, b) => a + b, 0) / values.length;
        else if (values.every(v => typeof v === "boolean")) fields[field as keyof MatchDataFields] = values.reduce((a, b) => a + (b ? 1 : 0), 0) / values.length >= 0.5;
        else if (values.every(v => typeof v === "string")) fields[field as keyof MatchDataFields] = values.filter(val => val.trim().length).join("\n");
        else if (values.length === 0) fields[field as keyof MatchDataFields] = undefined
        else throw new Error("Field "+field+" is of type "+(typeof values[0]||"unknown")+" which cannot be averaged, and no custom average function was provided");
    
        if (fields[field as keyof MatchDataFields] === undefined) fields[field as keyof MatchDataFields] = info.defaultValue;
    };

    return {
        id: matchData[0].id,
        matchId: matchData[0].matchId,
        teamNumber: matchData[0].teamNumber,
        allianceColor: matchData[0].allianceColor,
        scoutName: matchData.map(v => v.scoutName).join(", "),
        submitTime: matchData[0].submitTime,

        ...fields as MatchDataFields
    }
}

export type EnumMap<T extends string | number | symbol> = {
    [K in T]: number;
};

export function enumAverageCalculator<T extends string | number | symbol>(values: T[]): T|undefined {
    // Return the most common value, prioritizing higher enum values if there is a tie
    if (values.length === 0) return undefined;
    const counts = values.reduce((a, b) => ({...a, [b]: (a[b] ?? 0) + 1}), {} as EnumMap<T>);
    const max = Math.max(...Object.values(counts) as number[]);
    const mostCommon = Object.entries(counts).filter(([, v]) => v === max).sort(([a], [b]) => a > b ? -1 : 1)[0][0];
    return mostCommon as T;
}

export function combineArrayNoRepeat<T extends X[], X = any>(values: T[]): T|undefined {
    if (values.length === 0) return undefined;
    const combined = values.reduce((a, b) => a.concat(b), [] as X[]) as T;
    return [...new Set(combined)] as T;
}