export interface CustomTeamGroup {
    id: number;
    name: string;
    teams: number[];
}

export interface ComparableDataset<T extends object> {
    /**
     * The positive samples, split by the given group, and then a list of the data points for each group
     */
    positive: T[][];
    /**
     * The negative samples, split by the given group, and then a list of the data points for each group
     */
    negative: T[][] | undefined;
}

export interface GraphableDataset<T extends object, K> extends ComparableDataset<T> {
    /**
     * Optional value but required for graphing of each data point to group data by and use for graphing
     */
    xGetter?: (data: T) => K;
    /**
     * Optional function to compare the keyPath values for sorting on the graph
     */
    xComparator?: (a: K, b: K) => number;
}

/**
 * A function or path that access a value from an object
 */
export type Getter<T> = Leaves<T> | ((data: T) => any);

// Defines a string union type for the different paths in an object
// Stolen from https://stackoverflow.com/a/58436959/2887218
export type Leaves<T> = T extends object ? { [K in keyof T]:
        `${Exclude<K, symbol>}${Leaves<T[K]> extends never ? "" : `.${Leaves<T[K]>}`}`
    }[keyof T] : never


export interface QuantitativeStats {
    sample: Iterable<number>;
    /** The smallest value within the data */
    min: number;
    /** The largest value within the data */
    max: number;
    /** The sum of all data added up */
    sum: number;
    /** The number of data points (sample size) */
    n: number;
    /** The average of all data points (mean) */
    avg: number;
    /** The standard deviation of the data points */
    sd: number;
}

export interface QuantitativeProportionalStats {
    samples: Iterable<[number, number]>;
    /** The number of successes, quantitatively described */
    x: QuantitativeStats;
    /** The sample sizes, quantitatively described */
    n: QuantitativeStats;
    /** The proportions from 0-1, proportionally described */
    p: ProportionalStats;
}

export interface CategoricalStats<T> {
    sample: Iterable<T>;
    /** The number of times each category appears */
    sum: Map<T, number>;
    /** The proportion of the total for all categories that appear, Category mapped to Proportion from 0-1 */
    p: Map<T, number>;
    /** Lowest proportion category, [category, proportion] */
    pMin: [T|undefined, number];
    /** Highest proportion category, [category, proportion] */
    pMax: [T|undefined, number];
    /** The sample size */
    n: number;
}

export interface ProportionalStats {
    /** The number of successes */
    x: number;
    /** The proportion of successes, from 0-1 */
    p: number;
    /** The sample size */
    n: number;
}
