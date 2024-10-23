/**
 * Wraps an async function so that if it is called multiple times before it resolves, it will only be executed once.
 * If there is another call to the function while it is already executing, the same promise will be returned.
 * 
 * @param fn The async function
 * @returns The wrapped function
 */
export default function cachedAsyncFunction<T>(fn: ()=>Promise<T>) {

    let pending: Promise<any> | null = null;

    return async (): Promise<T> => {
        if (pending) {
            return pending;
        }

        try {
            const resultPromise = fn();
            pending = resultPromise;
            return await resultPromise;
        } finally {
            pending = null;
        }
    }
}