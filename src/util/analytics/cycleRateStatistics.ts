import { Leaves } from "../../types/analyticsTypes";
import { addQuantitativeData, atPath, describeQuantitativeData, subtractQuantitativeData } from "./objectStatistics";

/**
 * Sums the values at the given paths in the data object.
 * @param data - The data object to sum values from.
 * @param paths - The paths to get the values
 * @returns The sum
 */
function sumAtPaths<T>(data: T, paths: Leaves<T>[]) {
    return paths.reduce((acc, path) => acc + atPath(data, path), 0);
}

/**
 * Gets the quantitatively described cycle rate of the given data objects.
 * 
 * @param paths - The paths to get the values, which will be summed and divided by the match length
 * @param divider - The match length
 * @param positive - The data objects to get the cycle rate of
 * @param negative - The data objects to subtract from the positive data objects
 * @returns Quantitative data object describing the cycle rate
 */
export function describeCycleRateQuantitativeObjects<T>(paths: Leaves<T>[], divider: number, positive: T[][], negative?: T[][]) {
    return subtractQuantitativeData(
        addQuantitativeData(
            ...positive.map(sampleObj => describeQuantitativeData(sampleObj.map(o => describeCycleRateQuantitativeData(paths, divider, o)).filter(o => o !== null) as number[]))
        ),
        negative && addQuantitativeData(
            ...negative.map(sampleObj => describeQuantitativeData(sampleObj.map(o => describeCycleRateQuantitativeData(paths, divider, o)).filter(o => o !== null) as number[]))
        )
    )
}

export function describeCycleRateQuantitativeData<T>(paths: Leaves<T>[], divider: number, object: T): number|null {
    const sum = sumAtPaths(object, paths);
    if (sum === 0) return null;
    return divider / sum;
}