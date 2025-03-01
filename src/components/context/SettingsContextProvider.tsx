import { createContext, ReactElement, useEffect } from "react";
import useLocalStorageState from "../hooks/localStorageState";
import { COMPETITION_ID_EXPIRE_TIME } from "../../constants";
import useLocalStorageRef from "../hooks/localStorageRef";

/**
 * Provides access to the settings state and functions to manipulate the settings. These are usually stored in local storage.
 */
export const SettingsContext = createContext<SettingsStateData|undefined>(undefined);

// The following types are used to define the value of the SettingsContext.Provider

export type SettingsStateData = {
    competitionId: string;
    setCompetitionId: React.Dispatch<React.SetStateAction<string>>;
    setCompetitionIdLastUpdated: React.Dispatch<React.SetStateAction<number>>;

    clientId: number;
    setClientId: React.Dispatch<React.SetStateAction<number>>;
    scoutName: string;
    setScoutName: React.Dispatch<React.SetStateAction<string>>;
    fieldRotated: boolean;
    setFieldRotated: React.Dispatch<React.SetStateAction<boolean>>;

    autoFetchMatches: boolean;
    setAutoFetchMatches: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Wraps the children in a `SettingsContext.Provider` and gives access to the `SettingsContext` to the children. This includes all the values in `SettingsStateData` type.
 * 
 * @param defaultCompetitionId The default competitionId to use if the user has not set one
 * @param children The children to wrap in the SettingsContext.Provider and give access to the `SettingsContext`
 * @returns The children wrapped in the SettingsContext.Provider
 */
export default function SettingsContextProvider({defaultCompetitionId, children}: {defaultCompetitionId: string, children: ReactElement}) {

    const [competitionId, setCompetitionId] = useLocalStorageState<string>(defaultCompetitionId, "competitionId");
    const [competitionIdLastUpdated, setCompetitionIdLastUpdated] = useLocalStorageRef<number>(0, "competitionIdLastUpdated"); // Used to determine if the competitionId should auto be set to the default, aka if the custom competitionId is old

    const [clientId, setClientId] = useLocalStorageState<number>(0, "clientId"); // From 0-5
    const [scoutName, setScoutName] = useLocalStorageState<string>("", "scoutName"); // The name of the scout, to be submitted with the data
    
    const [fieldRotated, setFieldRotated] = useLocalStorageState<boolean>(false, "fieldRotated"); // Depends on the perspective of the field, used for the during match view

    const [autoFetchMatches, setAutoFetchMatches] = useLocalStorageState<boolean>(true, "autoFetchMatches"); // Whether or not to automatically fetch the match schedule from the blue alliance

    const [starredTeams, setStarredTeams] = useLocalStorageState<number[]>([], "starredTeams"); // Special teams we want to know about, used on the analytics page
    const [analyticsCurrentCompetitionOnly, setAnalyticsCurrentCompetitionOnly] = useLocalStorageState<boolean>(true, "analyticsCurrentCompetitionOnly"); // Whether or not to only show data from the current competition

    useEffect(() => {
        // If the competitionId is over COMPETITION_ID_EXPIRE_TIME old, set it to the default
        if (competitionIdLastUpdated.current < Date.now() - COMPETITION_ID_EXPIRE_TIME) {
            setCompetitionId(defaultCompetitionId);
            setCompetitionIdLastUpdated(Date.now());
            console.log("CompetitionId was old, setting to the default: "+defaultCompetitionId);
        }
    }, [competitionIdLastUpdated, setCompetitionId, defaultCompetitionId, setCompetitionIdLastUpdated]);

    // Assemble the value object to pass to the context provider
    const value = {
        competitionId,
        setCompetitionId,
        setCompetitionIdLastUpdated,

        clientId,
        setClientId,
        scoutName,
        setScoutName,
        fieldRotated,
        setFieldRotated,

        autoFetchMatches,
        setAutoFetchMatches,

        starredTeams,
        setStarredTeams,
        analyticsCurrentCompetitionOnly,
        setAnalyticsCurrentCompetitionOnly,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
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