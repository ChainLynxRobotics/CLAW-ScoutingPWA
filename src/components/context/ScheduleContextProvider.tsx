import { createContext, ReactElement, useCallback, useContext, useEffect, useMemo } from "react";
import useLocalStorageState from "../hooks/localStorageState";
import { AUTO_MATCH_FETCH_INTERVAL } from "../../constants";
import { getSchedule } from "../../util/blueAllianceApi";
import { SettingsContext } from "./SettingsContextProvider";
import useLocalStorageRef from "../hooks/localStorageRef";

/**
 * Provides access to the settings state and functions to manipulate the schedule.
 */
export const ScheduleContext = createContext<ScheduleStateData|undefined>(undefined);


// The following types are used to define the value of the ScheduleContext.Provider

export type ScheduleStateData = {
    matches: ScheduledMatch[];
    setMatches: React.Dispatch<React.SetStateAction<ScheduledMatch[]>>;
    currentMatchIndex: number;
    setCurrentMatchIndex: React.Dispatch<React.SetStateAction<number>>;
    addMatch: (match: ScheduledMatch) => void;
    editMatch: (oldId: string, match: ScheduledMatch) => void;
    removeMatch: (matchId: string) => void;
    moveMatchUp: (matchId: string) => void;
    moveMatchDown: (matchId: string) => void;
}

/**
 * Wraps the children in a `ScheduleContext.Provider` and gives access to the `ScheduleContext` to the children. This includes all the values in `ScheduleStateData` type.
 * 
 * @param defaultCompetitionId The default competitionId to use if the user has not set one
 * @param children The children to wrap in the SettingsContext.Provider and give access to the `ScheduleContext`
 * @returns The children wrapped in the ScheduleContext.Provider
 */
export default function ScheduleContextProvider({children}: {children: ReactElement}) {

    const settings = useContext(SettingsContext);
    

    const [matches, setMatches] = useLocalStorageState<ScheduledMatch[]>([], "matches");
    const [currentMatchIndex, setCurrentMatchIndex] = useLocalStorageState<number>(0, "nextMatch"); // The current match being, used to determine what match to show on the main page

    const [lastAutoMatchFetch, setLastAutoMatchFetch] = useLocalStorageRef<number>(0, "lastAutoMatchFetch"); // The last time the matches were fetched automatically

    // Auto fetch matches
    useEffect(() => {
        // Note: This function does not always fetch latest matches, only if it has been a while since the last fetch. Most of the time it will do nothing.
        async function autoFetch() {
            if (settings?.autoFetchMatches && Date.now() - lastAutoMatchFetch.current > AUTO_MATCH_FETCH_INTERVAL) {
                console.log("Auto fetching matches");
                setLastAutoMatchFetch(Date.now());

                if (!settings) throw new Error("Settings not loaded");
                const newMatches = await getSchedule(settings.competitionId);

                if (newMatches.length === 0) return;
                if (matches.length == newMatches.length && JSON.stringify(matches) == JSON.stringify(newMatches)) return; // Only update if the matches are different

                setMatches(newMatches);
                setCurrentMatchIndex(Math.min(currentMatchIndex, newMatches.length));
            }
        }
        autoFetch();
        const interval = setInterval(autoFetch, 10000); // Check every 10 seconds
        return () => clearInterval(interval);
    }, [settings?.autoFetchMatches, lastAutoMatchFetch, settings, matches, currentMatchIndex, setLastAutoMatchFetch, setMatches, setCurrentMatchIndex]);
    

    // helper functions to manipulate the match schedule

    const addMatch = useCallback((match: ScheduledMatch) => {
        setMatches([...matches, match]);
    }, [matches, setMatches]);

    const editMatch = useCallback((oldId: string, match: ScheduledMatch) => {
        setMatches(matches.map(m => m.matchId === oldId ? match : m));
    }, [matches, setMatches]);

    const removeMatch = useCallback((matchId: string) => {
        setMatches(matches.filter(m => m.matchId !== matchId));
    }, [matches, setMatches]);

    const moveMatchUp = useCallback((matchId: string) => {
        const index = matches.findIndex(m => m.matchId === matchId);
        if (index > 0) {
            const temp = matches[index - 1];
            matches[index - 1] = matches[index];
            matches[index] = temp;
            setMatches([...matches]);
        }
    }, [matches, setMatches]);

    const moveMatchDown = useCallback((matchId: string) => {
        const index = matches.findIndex(m => m.matchId === matchId);
        if (index < matches.length - 1) {
            const temp = matches[index + 1];
            matches[index + 1] = matches[index];
            matches[index] = temp;
            setMatches([...matches]);
        }
    }, [matches, setMatches]);

    // Assemble the value object to pass to the context provider
    const value = useMemo<ScheduleStateData>(() => ({
        matches,
        setMatches,
        currentMatchIndex,
        setCurrentMatchIndex,
        addMatch,
        editMatch,
        removeMatch,
        moveMatchUp,
        moveMatchDown,
    }), [matches, setMatches, currentMatchIndex, setCurrentMatchIndex, addMatch, editMatch, removeMatch, moveMatchUp, moveMatchDown]);

    return (
        <ScheduleContext.Provider value={value}>
            {children}
        </ScheduleContext.Provider>
    );
}

/**
 * A match that is scheduled to be played, with the team numbers for each alliance.
 */
export type ScheduledMatch = {
    matchId: string;
    blue1: number;
    blue2: number;
    blue3: number;
    red1: number;
    red2: number;
    red3: number;
}