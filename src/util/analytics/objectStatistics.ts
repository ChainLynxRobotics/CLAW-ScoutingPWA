import { ProportionalStats, CategoricalStats, Leaves, QuantitativeStats, QuantitativeProportionalStats } from "../../types/analyticsTypes";

/**
 * Describes for a quantitative sample
 * 
 * @param sample - List of numbers to analyze
 * @returns The min, max, sum, n, avg, and standard deviation of the sample
 */
export function describeQuantitativeData(sample: Iterable<number>): QuantitativeStats {
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let n = 0;

    for (const obj of sample) {
        // Update stats
        if (obj < min) min = obj;
        if (obj > max) max = obj;
        sum += obj;
        n++;
    }
    if (n === 0) return { sample, min: NaN, max: NaN, sum: NaN, n: 0, avg: NaN, sd: NaN };

    const avg = sum / n;

    let sd_sum = 0;
    for (const obj of sample) {
        const diff = obj - avg;
        sd_sum += diff * diff;
    }
    const sd = Math.sqrt(sd_sum / (n - 1));

    return { sample, min, max, sum, n, avg, sd };
}

/**
 * Combines multiple samples of quantitative data and returns a single sample with the combined stats
 * 
 * @param data - List of QuantitativeStats to combine
 * @returns Resulting QuantitativeStats of the combined data
 */
export function addQuantitativeData(...data: QuantitativeStats[]): QuantitativeStats {
    if (data.length === 0) return describeQuantitativeData([]);
    if (data.length === 1) return data[0];
    
    const avg = data.reduce((acc, val) => acc + val.sum, 0) / data.reduce((acc, val) => acc + val.n, 0);

    // We only need to fully recalculate the standard deviation, as the other stats can be calculated from the input stats
    let combined_sample: number[] = [];
    let sd_sum = 0;
    for (const stat of data) {
        combined_sample.push(...stat.sample);
        for (const obj of stat.sample) {
            const diff = obj - avg;
            sd_sum += diff * diff;
        }
    }
    const sd = Math.sqrt(sd_sum / (data.reduce((acc, val) => acc + val.n, 0) - 1));

    return {
        sample: combined_sample,
        min: Math.min(...data.map(stat => stat.min)),
        max: Math.max(...data.map(stat => stat.max)),
        sum: data.reduce((acc, val) => acc + val.sum, 0),
        n: data.reduce((acc, val) => acc + val.n, 0),
        avg,
        sd
    };
}

/**
 * Subtracts two sets of quantitative data, to describe the difference in the data
 * 
 * Standard deviation is not calculated, as it is not useful in this context
 * 
 * Calculations are done as if the two sets of data were independent
 * 
 * @param a - First set of data
 * @param b - Second set of data, to be subtracted from the first
 * @returns Resulting QuantitativeStats of the subtracted data
 */
export function subtractQuantitativeData(a: QuantitativeStats, b: QuantitativeStats): QuantitativeStats {
    return {
        sample: [...a.sample, ...b.sample],
        min: Math.min(a.min, b.min),
        max: Math.max(a.max, b.max),
        sum: a.sum - b.sum,
        n: a.n - b.n,
        avg: a.avg - b.avg,
        sd: NaN
    };
}

/**
 * Describes multiple samples of success/fail data
 * 
 * Internally uses {@link describeQuantitativeData} on the x, n, and p data for each sample
 * 
 * @param samples - List of [successes, total] to analyze
 * @returns The x, n and p of each sample quantitatively described
 */
export function describeQuantitativeProportionalData(samples: Iterable<[number, number]>): QuantitativeProportionalStats {
    let x_list: number[] = []; // Successes
    let p_list: number[] = []; // Proportions
    let n_list: number[] = []; // Sample sizes

    for (const [x, n] of samples) {
        x_list.push(x);
        p_list.push(x / n);
        n_list.push(n);
    }

    return {
        samples: samples,
        x: describeQuantitativeData(x_list),
        n: describeQuantitativeData(n_list),
        p: describeQuantitativeData(p_list)
    };
}

/**
 * Combines multiple samples of success/fail data and returns a single sample with the combined stats
 * 
 * Internally uses {@link addQuantitativeData} to combine the x, n, and p data
 * 
 * @param data - List of QuantitativeProportionalStats to combine
 * @returns Resulting QuantitativeProportionalStats of the combined data
 */
export function addQuantitativeProportionalData(...data: QuantitativeProportionalStats[]): QuantitativeProportionalStats {
    if (data.length === 0) return { samples: [], x: addQuantitativeData(), n: addQuantitativeData(), p: addQuantitativeData() };
    if (data.length === 1) return data[0];

    let combined_samples: [number, number][] = [];
    for (const stat of data) {
        combined_samples.push(...stat.samples);
    }

    return {
        samples: combined_samples,
        x: addQuantitativeData(...data.map(stat => stat.x)),
        n: addQuantitativeData(...data.map(stat => stat.n)),
        p: addQuantitativeData(...data.map(stat => stat.p))
    };
}

/**
 * Subtracts two sets of success/fail data, to describe the difference in the data
 * 
 * Internally uses {@link subtractQuantitativeData} to subtract the x, n, and p data
 * 
 * @param a - First set of data
 * @param b - Second set of data, to be subtracted from the first
 * @returns Resulting QuantitativeProportionalStats of the subtracted data
 */
export function subtractQuantitativeProportionalData(a: QuantitativeProportionalStats, b: QuantitativeProportionalStats): QuantitativeProportionalStats {
    return {
        samples: [...a.samples, ...b.samples],
        x: subtractQuantitativeData(a.x, b.x),
        n: subtractQuantitativeData(a.n, b.n),
        p: subtractQuantitativeData(a.p, b.p)
    };
}

/**
 * Describes for a categorical sample
 * 
 * @param sample - List of categories to analyze, suggested to be an enum or string
 * @returns The sum of each, p of each, pMin, pMax, and n of the sample
 */
export function describeCategoricalData<T>(sample: Iterable<T>): CategoricalStats<T> {
    let sum = new Map<T, number>();
    let n = 0;

    for (const obj of sample) {
        // Update stats
        if (!sum.has(obj)) sum.set(obj, 0);
        sum.set(obj, sum.get(obj)! + 1);
        n++;
    }

    let p = new Map<T, number>();
    let pMin: [T|undefined, number] = [sum.keys().next().value, Infinity];
    let pMax: [T|undefined, number] = [sum.keys().next().value, -Infinity];

    for (const [key, value] of sum) {
        p.set(key, value / n);
        if (value / n < pMin[1]) pMin = [key, value / n];
        if (value / n > pMax[1]) pMax = [key, value / n];
    }

    return { sample, sum, p, pMin, pMax, n };
}
    

/**
 * Describes for a boolean sample
 * 
 * @param sample - List of booleans to analyze
 * @returns The sum, sumInverse, p, and n of the sample
 */
export function describeProportionalData(sample: Iterable<boolean>): ProportionalStats {
    let x = 0;
    let n = 0;

    for (const obj of sample) {
        // Update stats
        if (obj) x++;
        n++;
    }

    return { sample, x, p: x / n, n };
}
