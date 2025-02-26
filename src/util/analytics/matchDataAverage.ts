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

    let fields: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const [field, info] of Object.entries(MatchDataFieldInformation)) {
        const values = matchData.map(v => v[field as keyof MatchDataFields]);
        if (info.average !== undefined) fields[field as keyof MatchDataFields] = info.average(values as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        else if (values.every(v => typeof v === "number")) fields[field as keyof MatchDataFields] = values.reduce((a, b) => a + b, 0) / values.length;
        else if (values.every(v => typeof v === "boolean")) fields[field as keyof MatchDataFields] = values.reduce((a, b) => a + (b ? 1 : 0), 0) / values.length >= 0.5;
        else if (values.every(v => typeof v === "string")) fields[field as keyof MatchDataFields] = values.join("\n");
        else throw new Error("Field "+field+" is of type "+typeof values[0]+" which cannot be averaged, and no custom average function was provided");
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

export function enumAverageCalculator<T extends string | number | symbol>(values: T[]): T {
    // Return the most common value, prioritizing higher enum values if there is a tie
    const counts = values.reduce((a, b) => ({...a, [b]: (a[b] ?? 0) + 1}), {} as EnumMap<T>);
    const max = Math.max(...Object.values(counts) as number[]);
    const mostCommon = Object.entries(counts).filter(([_, v]) => v === max).sort(([a], [b]) => a > b ? -1 : 1)[0][0];
    return mostCommon as T;
}