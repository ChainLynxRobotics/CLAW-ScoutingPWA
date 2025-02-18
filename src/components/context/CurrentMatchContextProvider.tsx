import { createContext, ReactElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SettingsContext } from "./SettingsContextProvider";
import AllianceColor from "../../enums/AllianceColor";
import ConditionalWrapper from "../ui/ConditionalWrapper";
import ScoutingContextProvider from "./ScoutingContextProvider";
import allianceTeamIndex from "../../util/allianceTeamIndex";
import { ScheduleContext } from "./ScheduleContextProvider";

/**
 * Allowing components to update and request updates to the current match context for when the current match changes (and more, see `CurrentMatchContextProvider`).
 */
export const CurrentMatchContext = createContext<CurrentMatchContextType|undefined>(undefined);

export type CurrentMatchContextType = {
    setHasUpdate: (hasUpdate: boolean)=>void,
    hasUpdate: boolean,
    /**
     * Updates the current match being scouting, may clear any in-progress data. 
     * This function should be called after prompting to user to update after changing schedules settings.
     */
    update: ()=>void,
    /**
     * Increments the current match index and updates the current match being scouted.
     * This function should be called after the user has finished scouting a match.
     */
    incrementAndUpdate: ()=>void,
    /**
     * Whether to show confetti on data submit. **This acts as a state variable and is not managed by the context provider**.
     */
    showConfetti: boolean,
    /**
     * Set the value of `showConfetti`. **This acts as a state variable and is not managed by the context provider**.
     */
    setShowConfetti: (show: boolean)=>void
}

/**
 * Provides the `CurrentMatchContext` values for the children components. Relies on the SettingsContext to determine the current match from the schedule.
 * 
 * Also wraps the children in a `ScoutingContextProvider` with the current match id, team, and color as determined by this code. (But only if the current match is defined)
 */
export default function CurrentMatchContextProvider({children}: {children: ReactElement}) {

    const settings = useContext(SettingsContext);
    if (settings === undefined) throw new Error("SettingsContext not found");

    const schedule = useContext(ScheduleContext);
    if (schedule === undefined) throw new Error("ScheduleContext not found");
    
    // Btw the next 30 or so lines were written entirely while I was wearing a fursuit head. 
    // Just thought I should mention that.
    
    const [scoutingData, setScoutingData] = useState<{matchId: string, teamNumber: number, allianceColor: AllianceColor} | undefined>(undefined);

    const [hasUpdate, setHasUpdate] = useState(false);
    const [updateNextRender, setUpdateNextRender] = useState(true); // Update on page load

    const [showConfetti, setShowConfetti] = useState(false); // Show confetti on data submit

    const update = useCallback(() => {
        if (schedule.matches.length == 0 || schedule.currentMatchIndex >= schedule.matches.length) {
            console.error("No matches to scout");
            setScoutingData(undefined);
            return;
        }
        
        const match = schedule.matches[schedule.currentMatchIndex];

        // ALternate between red and blue teams for each scout
        const { team, color } = allianceTeamIndex(match, schedule.currentMatchIndex, settings.clientId);

        setScoutingData({
            matchId: match.matchId,
            teamNumber: team,
            allianceColor: color
        });
        setHasUpdate(false);
    }, [schedule.currentMatchIndex, schedule.matches, settings.clientId]);

    const incrementAndUpdate = useCallback(() => {
        schedule.setCurrentMatchIndex((current) => current + 1);
        setUpdateNextRender(true);
    }, [schedule]);

    // Prompt to update when settings change
    useEffect(() => {
        setHasUpdate(true);
    }, [schedule.currentMatchIndex, settings.clientId, schedule.matches]);

    useEffect(() => {
        if (!updateNextRender) return;
        update();
        setUpdateNextRender(false);
    }, [updateNextRender, update]);

    const value = useMemo(() => ({
        setHasUpdate,
        hasUpdate,
        update,
        incrementAndUpdate,
        showConfetti,
        setShowConfetti
    }), [hasUpdate, showConfetti, update, incrementAndUpdate]);

    return (
        <CurrentMatchContext.Provider value={value}>
            <ConditionalWrapper 
                condition={scoutingData !== undefined} 
                wrapper={(children) => 
                <ScoutingContextProvider key={scoutingData?.matchId || '' + "-" + scoutingData?.teamNumber || 0}
                    matchId={scoutingData?.matchId || ''} 
                    teamNumber={scoutingData?.teamNumber || 0}
                    allianceColor={scoutingData?.allianceColor || AllianceColor.Red}
                >
                    {children}
                </ScoutingContextProvider>}
            >
                {children}
            </ConditionalWrapper>
        </CurrentMatchContext.Provider>
    );
}