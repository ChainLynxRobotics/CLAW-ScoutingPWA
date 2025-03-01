/**
 * Generates a new random positive whole number id from 0 to Number.MAX_SAFE_INTEGER
 * 
 * @returns A new Id
 */
export function generateRandomId(): number {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

/**
 * Generates a new random 32-bit unsigned int. This is more secure than generateRandomId.
 * 
 * Ranges from `0` inclusive to `2^32` exclusive.
 * 
 * @returns A new Id
 */
export function generateRandomUint32(): number {
    return new DataView(crypto.getRandomValues(new Uint8Array(4)).buffer).getUint32(0);
}