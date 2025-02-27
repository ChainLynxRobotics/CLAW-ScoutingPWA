import { ProportionalStats, CategoricalStats, Leaves, QuantitativeStats, QuantitativeProportionalStats } from "../../types/analyticsTypes";

export function describeQuantitativeObjects<T>(path: Leaves<T>, positive: T[][], negative?: T[][]): QuantitativeStats {
    return subtractQuantitativeData(
        addQuantitativeData(
            ...positive.map(sampleObj => describeQuantitativeData(sampleObj.map(o => atPath(o, path))))
        ),
        negative && addQuantitativeData(
            ...negative.map(sampleObj => describeQuantitativeData(sampleObj.map(o => atPath(o, path))))
        )
    )
}

export function describeQuantitativeProportionalObjects<T>(successPath: Leaves<T>, failurePath: Leaves<T>, positive: T[][], negative?: T[][]): QuantitativeProportionalStats {
    return subtractQuantitativeProportionalData(
        addQuantitativeProportionalData(
            ...positive.map(sampleObj => describeQuantitativeProportionalData(sampleObj.map(o => [atPath(o, successPath), atPath(o, failurePath)])))
        ),
        negative && addQuantitativeProportionalData(
            ...negative.map(sampleObj => describeQuantitativeProportionalData(sampleObj.map(o => [atPath(o, successPath), atPath(o, failurePath)])))
        )
    )
}

export function describeCategoricalObjects<T,E = any>(path: Leaves<T>, positive: T[][], negative?: T[][]): CategoricalStats<E> {
    return subtractCategoricalData<E>(
        addCategoricalData<E>(
            ...positive.map(sampleObj => describeCategoricalData<E>(sampleObj.map(o => atPath(o, path)))
        )),
        negative && addCategoricalData<E>(
            ...negative.map(sampleObj => describeCategoricalData<E>(sampleObj.map(o => atPath(o, path)))
        ))
    )
}

export function describeProportionalObjects<T>(path: Leaves<T>, positive: T[][], negative?: T[][]): ProportionalStats {
    return subtractProportionalData(
        addProportionalData(
            ...positive.map(sampleObj => describeProportionalData(sampleObj.map(o => atPath(o, path)))
        )),
        negative && addProportionalData(
            ...negative.map(sampleObj => describeProportionalData(sampleObj.map(o => atPath(o, path)))
        ))
    )
}

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
 * Combines multiple samples of quantitative data and returns a single sample with the combined stats.
 * 
 * Acts as if values are added to each other, not just concatenated
 * 
 * For example, if you had 3 teams, the average would be all 3 averages combined, not the average of all 3 averages
 * 
 * @param data - List of QuantitativeStats to combine
 * @returns Resulting QuantitativeStats of the combined data
 */
export function addQuantitativeData(...data: QuantitativeStats[]): QuantitativeStats {
    if (data.length === 0) return describeQuantitativeData([]);
    if (data.length === 1) return data[0];

    let combined_sample: number[] = [];
    for (const stat of data) {
        combined_sample.push(...stat.sample);
    }

    return {
        sample: combined_sample,
        min: data.map(stat => stat.min).reduce((a, b) => a + b, 0),
        max: data.map(stat => stat.max).reduce((a, b) => a + b, 0),
        sum: data.reduce((acc, val) => acc + val.sum, 0),
        n: data.reduce((acc, val) => acc + val.n, 0) / data.length,
        avg: data.reduce((acc, val) => acc + val.avg, 0),
        sd: Math.sqrt(data.reduce((acc, val) => acc + val.sd * val.sd, 0))
    };
}

/**
 * Subtracts two sets of quantitative data, to describe the difference in the data
 * 
 * If the stats are the same, the resulting stats will be all 0s
 * 
 * @param a - First set of data
 * @param b - Second set of data, to be subtracted from the first
 * @returns Resulting QuantitativeStats of the subtracted data
 */
export function subtractQuantitativeData(a: QuantitativeStats, b?: QuantitativeStats): QuantitativeStats {
    if (b === undefined || b.n === 0) return a;
    return {
        sample: [...a.sample, ...b.sample],
        min: a.min - b.min,
        max: a.max - b.max,
        sum: a.sum - b.sum,
        n: (a.n + b.n) / 2,
        avg: a.avg - b.avg,
        sd: Math.sqrt(a.sd * a.sd + b.sd * b.sd)
    };
}

/**
 * Describes multiple samples of success/fail data
 * 
 * Internally uses {@link describeQuantitativeData} on the x, n, and p data for each sample
 * 
 * @param samples - List of [successes, failures] to analyze
 * @returns The x, n and p of each sample quantitatively described
 */
export function describeQuantitativeProportionalData(samples: Iterable<[number, number]>): QuantitativeProportionalStats {
    let x_list: number[] = []; // Successes
    let p_list: number[] = []; // Proportions
    let n_list: number[] = []; // Sample sizes

    for (const [s, f] of samples) {
        x_list.push(s);
        p_list.push(s / (s + f));
        n_list.push(s + f);
    }

    const x = describeQuantitativeData(x_list);
    const n = describeQuantitativeData(n_list);

    return {
        samples: samples,
        x,
        n,
        p: describeProportionalData({successes: x.sum, failures: n.sum - x.sum})
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
    if (data.length === 0) return { samples: [], x: addQuantitativeData(), n: addQuantitativeData(), p: addProportionalData() };
    if (data.length === 1) return data[0];

    let combined_samples: [number, number][] = [];
    for (const stat of data) {
        combined_samples.push(...stat.samples);
    }

    return {
        samples: combined_samples,
        x: addQuantitativeData(...data.map(stat => stat.x)),
        n: addQuantitativeData(...data.map(stat => stat.n)),
        p: addProportionalData(...data.map(stat => stat.p))
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
export function subtractQuantitativeProportionalData(a: QuantitativeProportionalStats, b?: QuantitativeProportionalStats): QuantitativeProportionalStats {
    if (b === undefined || b.n.n === 0) return a;
    return {
        samples: [...a.samples, ...b.samples],
        x: subtractQuantitativeData(a.x, b.x),
        n: subtractQuantitativeData(a.n, b.n),
        p: subtractProportionalData(a.p, b.p)
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
 * Combines categorical data and returns a single sample with the combined stats
 * 
 * Note: proportions are combined and can end up being higher than 1
 * 
 * @param data - List of CategoricalStats to combine
 * @returns Resulting CategoricalStats of the combined data
 */
export function addCategoricalData<T>(...data: CategoricalStats<T>[]): CategoricalStats<T> {
    if (data.length === 0) return describeCategoricalData([]);
    if (data.length === 1) return data[0];

    let combined_sample: T[] = [];
    let combined_sum = new Map<T, number>();
    let combined_n = 0;
    for (const stat of data) {
        combined_sample.push(...stat.sample);
        for (const [key, value] of stat.sum) {
            if (!combined_sum.has(key)) combined_sum.set(key, 0);
            combined_sum.set(key, combined_sum.get(key)! + value);
        }
        combined_n += stat.n;
    }

    let combined_p = new Map<T, number>();
    let combined_pMin: [T|undefined, number] = [combined_sum.keys().next().value, Infinity];
    let combined_pMax: [T|undefined, number] = [combined_sum.keys().next().value, -Infinity];

    for (const [key, value] of combined_sum) {
        combined_p.set(key, value / combined_n);
        if (value / combined_n < combined_pMin[1]) combined_pMin = [key, value / combined_n];
        if (value / combined_n > combined_pMax[1]) combined_pMax = [key, value / combined_n];
    }

    return { sample: combined_sample, sum: combined_sum, p: combined_p, pMin: combined_pMin, pMax: combined_pMax, n: combined_n };
}

/**
 * Subtracts two sets of categorical data, to describe the difference in the data
 * 
 * @param a - First set of data
 * @param b - Second set of data, to be subtracted from the first
 * @returns Resulting CategoricalStats of the subtracted data
 */
export function subtractCategoricalData<T>(a: CategoricalStats<T>, b?: CategoricalStats<T>): CategoricalStats<T> {
    if (b === undefined || b.n === 0) return a;

    let combined_sum = new Map<T, number>();

    for (const [key, value] of a.sum) {
        if (!combined_sum.has(key)) combined_sum.set(key, 0);
        combined_sum.set(key, combined_sum.get(key)! + value);
    }
    for (const [key, value] of b.sum) {
        if (!combined_sum.has(key)) combined_sum.set(key, 0);
        combined_sum.set(key, combined_sum.get(key)! - value);
    }

    let combined_p = new Map<T, number>();
    
    for (const [key, value] of a.p) {
        if (!combined_p.has(key)) combined_p.set(key, 0);
        combined_p.set(key, combined_p.get(key)! + value);
    }

    for (const [key, value] of b.p) {
        if (!combined_p.has(key)) combined_p.set(key, 0);
        combined_p.set(key, combined_p.get(key)! - value);
    }

    let combined_pMin: [T|undefined, number] = [combined_sum.keys().next().value, Infinity];
    let combined_pMax: [T|undefined, number] = [combined_sum.keys().next().value, -Infinity];

    for (const [key, value] of combined_p) {
        if (value < combined_pMin[1]) combined_pMin = [key, value];
        if (value > combined_pMax[1]) combined_pMax = [key, value];
    }

    return {
        sample: [...a.sample, ...b.sample],
        sum: combined_sum,
        p: combined_p,
        pMin: combined_pMin,
        pMax: combined_pMax,
        n: (a.n + b.n) / 2
    };
}

/**
 * Describes for a boolean sample
 * 
 * @param sample - List of booleans to analyze
 * @returns The sum, sumInverse, p, and n of the sample
 */
export function describeProportionalData(sample: Iterable<boolean> | {successes: number, failures: number}): ProportionalStats {
    if ("successes" in sample) {
        if (sample.successes + sample.failures === 0) return { x: 0, p: 0, n: 0 };
        return {
            x: sample.successes,
            p: sample.successes / (sample.successes + sample.failures),
            n: sample.successes + sample.failures
        }
    }
    let x = 0;
    let n = 0;

    for (const obj of sample) {
        // Update stats
        if (obj) x++;
        n++;
    }

    return { x, p: n != 0 ? (x / n) : 0, n };
}

/**
 * Combines multiple samples of boolean data and returns a single sample with the combined stats
 * 
 * @param data - List of ProportionalStats to combine
 * @returns Resulting ProportionalStats of the combined data
 */
export function addProportionalData(...data: ProportionalStats[]): ProportionalStats {
    if (data.length === 0) return describeProportionalData([]);
    if (data.length === 1) return data[0];

    let combined_x = 0;
    let combined_n = 0;
    for (const stat of data) {
        combined_x += stat.x;
        combined_n += stat.n;
    }

    return {
        x: combined_x,
        p: combined_n != 0 ? (combined_x / combined_n) : 0,
        n: combined_n };
}

/**
 * Subtracts two sets of boolean data, to describe the difference in the data
 * 
 * @param a - First set of data
 * @param b - Second set of data, to be subtracted from the first
 * @returns Resulting ProportionalStats of the subtracted data
 */
export function subtractProportionalData(a: ProportionalStats, b?: ProportionalStats): ProportionalStats {
    if (b === undefined || b.n === 0) return a;
    return {
        x: a.x - b.x,
        p: a.p - b.p,
        n: (a.n - b.n) /2
    };
}

/**
 * Gets a value of an object at a path, such as "a.b.c" from { a: { b: { c: 5 } } }
 * @param obj - Object to search in
 * @param path - The path to get the value from
 * @returns The value or undefined if it doesn't exist
 */
export function atPath<T>(obj: T, path: Leaves<T>): any {
    let current = obj as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    for (const key of path.split(".")) {
        if (current === undefined || current === null || !(key in current)) return undefined;
        current = current[key as keyof typeof current];
    }
    return current;
}