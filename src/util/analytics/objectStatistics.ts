import { BooleanStats, CategoricalStats, Leaves, QuantitativeStats } from "../../types/analyticsTypes";

/**
 * Takes all the objects in objs and calculates the min, max, sum, n, and avg of the property at the defined path.
 * 
 * @param path A string representing the path to the property to analyze, e.g. 'alliances.blue.score', must be a number
 * @param objs A list of objects to analyze
 * @returns 
 */
export function getQuantitativePropertyStats<T extends object>(path: Leaves<T>, objs: Iterable<T>): QuantitativeStats {
    let sample = new Set<number>();
    for (const obj of objs) {
        let value = path.split('.').reduce((acc: any, key) => key in acc ? acc[key] : undefined, obj);
        if (typeof value !== 'number') throw new Error(`Property ${path} is not a number`); // Unknown type
        sample.add(value);
    }
    return getQuantitativeStats(sample);
};

/**
 * Describes for a quantitative sample
 * 
 * @param sample - List of numbers to analyze
 * @returns The min, max, sum, n, avg, and standard deviation of the sample
 */
export function getQuantitativeStats(sample: Iterable<number>): QuantitativeStats {
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

    const avg = sum / n;

    let sd_sum = 0;
    for (const obj of sample) {
        const diff = obj - avg;
        sd_sum += diff * diff;
    }
    const sd = Math.sqrt(sd_sum / (n - 1));

    return { min, max, sum, n, avg, sd };
}

/**
 * Takes all the objects in objs and calculates the sum, p, pMin, pMax, and n of the property at the defined path.
 * 
 * @param path A string representing the path to the property to analyze, e.g. 'alliances.blue.score'
 * @param objs A list of objects to analyze
 * @returns 
 */
export function getCategoricalPropertyStats<T>(path: string, objs: Iterable<T>): CategoricalStats<T> {
    let sample = new Set<T>();
    for (const obj of objs) {
        let value = path.split('.').reduce((acc: any, key) => key in acc ? acc[key] : undefined, obj);
        if (typeof value === 'undefined' || typeof value === 'function' || typeof value === 'object' || typeof value === 'symbol') throw new Error(`Property ${path} cannot have type ${typeof value}`); // Unknown type
        sample.add(value);
    }
    return getCategoricalStats(path, sample);
}

/**
 * Describes for a categorical sample
 * 
 * @param sample - List of categories to analyze
 * @returns The sum of each, p of each, pMin, pMax, and n of the sample
 */
export function getCategoricalStats<T>(path: string, objs: Iterable<T>): CategoricalStats<T> {
    let sum = new Map<T, number>();
    let n = 0;

    for (const obj of objs) {
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

    return { sum, p, pMin, pMax, n };
}


/**
 * Takes all the objects in objs and calculates the sum, sumInverse, p, and n of the property at the defined path.
 * 
 * @param path A string representing the path to the property to analyze, e.g. 'alliances.blue.score'
 * @param objs A list of objects to analyze
 * @returns 
 */
export function getBooleanPropertyStats(path: string, objs: Iterable<any>): BooleanStats {
    let sample = new Set<boolean>();
    for (const obj of objs) {
        let value = path.split('.').reduce((acc: any, key) => key in acc ? acc[key] : undefined, obj);
        if (typeof value !== 'boolean') throw new Error(`Property ${path} is not a boolean`); // Unknown type
        sample.add(value);
    }
    return getBooleanStats(sample);
}
    

/**
 * Describes for a boolean sample
 * 
 * @param sample - List of booleans to analyze
 * @returns The sum, sumInverse, p, and n of the sample
 */
export function getBooleanStats(sample: Iterable<boolean>): BooleanStats {
    let sum = 0;
    let n = 0;

    for (const obj of sample) {
        // Update stats
        if (obj) sum++;
        n++;
    }

    return { sum, p: sum / n, n };
}
