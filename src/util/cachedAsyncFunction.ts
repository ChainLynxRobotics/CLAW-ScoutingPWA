/**
 * Wraps an async function so that if it is called multiple times before it resolves, it will only be executed once.
 * If there is another call to the function while it is already executing, the same promise will be returned.
 * 
 * @param fn The async function
 * @param persist Whether to persist the promise after it resolves, so that it will never be executed again
 * @returns The wrapped function
 */
export default function cachedAsyncFunction<T>(fn: ()=>Promise<T>, persist: boolean = false): ()=>Promise<T> {

    let pending: Promise<T> | null = null;

    return async (): Promise<T> => {
        if (pending) {
            return pending;
        }

        try {
            const resultPromise = fn();
            pending = resultPromise;
            return await resultPromise;
        } finally {
            if (!persist) pending = null; // Clear the pending promise if we're not persisting it
        }
    }
}