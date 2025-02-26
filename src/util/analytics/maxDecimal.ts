/**
 * Serializes a number to a string with a maximum number of decimal digits.
 * 
 * @param num Number input
 * @param max Digits to show
 * @returns The number as a new number with a maximum number of decimal digits
 */
export default function maxDecimal(num: number, max: number): number {
    return Math.round(num * Math.pow(10, max)) / Math.pow(10, max);
}