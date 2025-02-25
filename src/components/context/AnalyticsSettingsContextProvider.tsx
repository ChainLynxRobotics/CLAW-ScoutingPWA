import { createContext, ReactElement } from "react";
import useLocalStorageState from "../hooks/localStorageState";
import { CustomTeamGroup } from "../../types/analyticsTypes";

/**
 * Provides access to the settings state and functions to manipulate the settings. These are usually stored in local storage.
 */
export const AnalyticsSettingsContext = createContext<AnalyticsSettingsStateData|undefined>(undefined);

// The following types are used to define the value of the AnalyticsSettingsContext.Provider

export type AnalyticsSettingsStateData = {
    // Special teams
    starredTeams: number[];
    setStarredTeams: React.Dispatch<React.SetStateAction<number[]>>;
    starTeam: (team: number) => void;
    unstarTeam: (team: number) => void;
    toggleStarTeam: (team: number) => void;
    // If only to show data from the current competition
    currentCompetitionOnly: boolean;
    setCurrentCompetitionOnly: React.Dispatch<React.SetStateAction<boolean>>;
    // The current match to show alliance teams for
    currentMatch: string;
    setCurrentMatch: React.Dispatch<React.SetStateAction<string>>;
    currentMatchBlueOpen: boolean;
    setCurrentMatchBlueOpen: React.Dispatch<React.SetStateAction<boolean>>;
    currentMatchRedOpen: boolean;
    setCurrentMatchRedOpen: React.Dispatch<React.SetStateAction<boolean>>;
    // If to include scouting data from this scouting app in the analytics
    includeScoutingData: boolean;
    setIncludeScoutingData: React.Dispatch<React.SetStateAction<boolean>>;
    // If to include blue alliance data in the analytics
    includeBlueAllianceData: boolean;
    setIncludeBlueAllianceData: React.Dispatch<React.SetStateAction<boolean>>;
    // Custom groups
    customTeamGroups: CustomTeamGroup[];
    setCustomTeamGroups: React.Dispatch<React.SetStateAction<CustomTeamGroup[]>>;
    setCustomTeamGroupById: (id: number, group: CustomTeamGroup) => void;
    addCustomTeamGroup: (group: CustomTeamGroup) => void;
    removeCustomTeamGroup: (group: CustomTeamGroup) => void;
}

/**
 * Wraps the children in a `AnalyticsSettingsContext.Provider` and gives access to the `AnalyticsSettingsContext` to the children. This includes all the values in `AnalyticsSettingsStateData` type.
 * 
 * @param children The children to wrap and give access to the context
 * @returns The children wrapped in the AnalyticsSettingsContext.Provider
 */
export default function SettingsContextProvider({children}: {children: ReactElement}) {

    const [starredTeams, setStarredTeams] = useLocalStorageState<number[]>([8248, 4180], "starredTeams");
    const [currentCompetitionOnly, setCurrentCompetitionOnly] = useLocalStorageState<boolean>(true, "analyticsCurrentCompetitionOnly");
    const [currentMatch, setCurrentMatch] = useLocalStorageState<string>("", "analyticsCurrentMatch");
    const [currentMatchBlueOpen, setCurrentMatchBlueOpen] = useLocalStorageState<boolean>(false, "analyticsCurrentMatchBlueOpen");
    const [currentMatchRedOpen, setCurrentMatchRedOpen] = useLocalStorageState<boolean>(false, "analyticsCurrentMatchRedOpen");
    const [includeScoutingData, setIncludeScoutingData] = useLocalStorageState<boolean>(true, "analyticsIncludeScoutingData");
    const [includeBlueAllianceData, setIncludeBlueAllianceData] = useLocalStorageState<boolean>(true, "analyticsIncludeBlueAllianceData");
    const [customTeamGroups, setCustomTeamGroups] = useLocalStorageState<CustomTeamGroup[]>([], "analyticsCustomTeamGroups");
    
    function addCustomTeamGroup(group: CustomTeamGroup) {
        setCustomTeamGroups([...customTeamGroups, group]);
    }

    function removeCustomTeamGroup(group: CustomTeamGroup) {
        setCustomTeamGroups(customTeamGroups.filter(g => g !== group));
    }

    function setCustomTeamGroupById(id: number, group: CustomTeamGroup) {
        console.log("Setting group", id, group);
        setCustomTeamGroups(customTeamGroups.map(g => g.id === id ? group : g));
    }

    function starTeam(team: number) {
        if (starredTeams.includes(team)) return;
        setStarredTeams([...starredTeams, team]);
    }

    function unstarTeam(team: number) {
        setStarredTeams(starredTeams.filter(t => t !== team));
    }

    function toggleStarTeam(team: number) {
        if (starredTeams.includes(team)) {
            unstarTeam(team);
        } else {
            starTeam(team);
        }
    }

    const value = {
        starredTeams,
        setStarredTeams,
        starTeam,
        unstarTeam,
        toggleStarTeam,
        currentCompetitionOnly,
        setCurrentCompetitionOnly,
        currentMatch,
        setCurrentMatch,
        currentMatchBlueOpen,
        setCurrentMatchBlueOpen,
        currentMatchRedOpen,
        setCurrentMatchRedOpen,
        includeScoutingData,
        setIncludeScoutingData,
        includeBlueAllianceData,
        setIncludeBlueAllianceData,
        customTeamGroups,
        setCustomTeamGroups,
        setCustomTeamGroupById,
        addCustomTeamGroup,
        removeCustomTeamGroup,
    }

    return (
        <AnalyticsSettingsContext.Provider value={value}>
            {children}
        </AnalyticsSettingsContext.Provider>
    )
}