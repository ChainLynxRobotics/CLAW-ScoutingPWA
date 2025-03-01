import { useCallback, useRef } from "react";

/**
 * Allows react refs to be saved in local storage, useful for persisting state between page reloads
 * 
 * Updates the local storage value whenever the value is changed, does not reload components like useState (use useLocalStorageState for that)
 * 
 * @param defaultValue - The default value to use if the key is not in local storage
 * @param key - The key to use in local storage, should be unique among all keys
 * 
 * @returns - A pair containing the value and a function to set the value (just like useState) but ONLY updates the local storage value, DOES NOT refresh the component like useState
 */
export default function useLocalStorageRef<T>(defaultValue: T, key: string): [React.MutableRefObject<T>, React.Dispatch<React.SetStateAction<T>>] {

    const storageValue = window.localStorage.getItem(key);
    const value = useRef<T>(storageValue !== null ? JSON.parse(storageValue) : defaultValue);

    const setValue = useCallback((newValue: React.SetStateAction<T>) => {
        const valueToStore = newValue instanceof Function ? newValue(value.current) : newValue;
        value.current = valueToStore;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
    }, [key]);

    return [value, setValue];
}