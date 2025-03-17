import { ComparableDataset, Getter, Leaves } from "../../types/analyticsTypes";
import { addQuantitativeData, atPath, describeQuantitativeData, getSum, subtractQuantitativeData } from "./objectStatistics";

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
 * @param getters - The paths to get the values, which will be summed and divided by the match length
 * @param divider - The match length
 * @param dataset - The data objects to describe
 * @returns Quantitative data object describing the cycle rate
 */
export function describeCycleRateQuantitativeObjects<T extends object>(getters: Getter<T>[], divider: number | undefined, dataset: ComparableDataset<T>) {
    return subtractQuantitativeData(
        addQuantitativeData(
            ...dataset.positive.map(sampleObj => describeQuantitativeData(sampleObj.map(o => describeCycleRateQuantitativeData(getters, divider, o)).filter(o => o !== null) as number[]))
        ),
        dataset.negative && addQuantitativeData(
            ...dataset.negative.map(sampleObj => describeQuantitativeData(sampleObj.map(o => describeCycleRateQuantitativeData(getters, divider, o)).filter(o => o !== null) as number[]))
        )
    )
}

export function describeCycleRateQuantitativeData<T>(getters: Getter<T>[], divider: number | undefined, object: T): number|null {
    const sum = getSum(object, getters);
    if (sum === 0) return null;
    if (divider === undefined) return sum;
    return divider / sum;
}