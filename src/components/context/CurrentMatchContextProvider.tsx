import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from "react";
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
    /**
     * Increments the current match index and updates the current match being scouted.
     * This function should be called after the user has finished scouting a match.
     */
    increment: ()=>void,
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
    }, [schedule.currentMatchIndex, schedule.matches, settings.clientId]);

    const increment = useCallback(() => {
        schedule.setCurrentMatchIndex((current) => current + 1);
    }, [schedule]);

    // Prompt to update when settings change
    useEffect(() => {
        update();
    }, [schedule.currentMatchIndex, settings.clientId, schedule.matches]);

    const value = {
        update,
        increment,
        showConfetti,
        setShowConfetti
    };

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