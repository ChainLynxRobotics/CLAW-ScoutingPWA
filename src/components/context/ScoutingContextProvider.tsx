import { createContext, ReactElement, useCallback, useContext, useState } from "react"
import AllianceColor from "../../enums/AllianceColor";
import matchDatabase from "../../util/db/matchDatabase";
import { CurrentMatchContext } from "./CurrentMatchContextProvider";
import { useNavigate } from "react-router-dom";
import { SettingsContext } from "./SettingsContextProvider";
import { MatchDataFieldInformation, MatchDataFields } from "../../MatchDataValues";
import { generateRandomUint32 } from "../../util/id";
import { BluetoothContext } from "./BluetoothContextProvider";
import { MatchData } from "../../types/MatchData";

/**
 * Provides access the current match id, team, and color, as well as manipulating scouting data during the match.
 */
export const ScoutingContext = createContext<ScoutingContextType|undefined>(undefined);

// The following types are used to define the value of the ScheduleContext.Provider

export type ScoutingContextType = {
    matchId: string;
    teamNumber: number;
    allianceColor: AllianceColor;
    custom: {
        // Custom context values for season-specific data and functions

    },
    fields: MatchDataFields & {
        set: <T extends keyof MatchDataFields>(field: T, value: MatchDataFields[T]) => void;
    };
    submit: ()=>Promise<void>;
}

/**
 * This function is used to create a new `ScoutingContextProvider` object, which gives its children access to the `ScoutingContext` 
 * to store/update all the data that is collected during a match.
 * 
 * @param matchId - The match id that this data is for, will be used to identify the match in the database later
 * @param teamNumber - The team number that this data is for
 * @param allianceColor - The alliance color (used mostly for display, but still required) that this data is for
 * 
 * @returns A ContextProvider that allows its children to access the scouting context data and functions with `useContext(ScoutingContext);`
 */
export default function ScoutingContextProvider({children, matchId, teamNumber, allianceColor}: {children: ReactElement, matchId: string, teamNumber: number, allianceColor: AllianceColor}) {
    const navigate = useNavigate();
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const currentMatchContext = useContext(CurrentMatchContext);
    const bluetooth = useContext(BluetoothContext);

    // ****************************************************
    //           Perennial data and functions
    // ****************************************************

    const [matchFields, setMatchFields] = useState<MatchDataFields>(()=>{
        // Get the default values for all the fields
        const fields: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        let field: keyof MatchDataFields;
        for (field in MatchDataFieldInformation) {
            fields[field] = MatchDataFieldInformation[field].defaultValue;
        }
        return fields;
    });

    // Submit the match data to the database
    const submit = useCallback(async () => {
        const matchData: MatchData = {
            // Header data
            id: generateRandomUint32(),
            matchId: settings.competitionId+"_"+matchId,
            teamNumber,
            allianceColor,
            // Custom fields
            ...matchFields,
            autoCoralL2Score: matchFields.autoCoralL2ScoreLocations.length, // Backwards compatibility
            autoCoralL3Score: matchFields.autoCoralL3ScoreLocations.length,
            autoCoralL4Score: matchFields.autoCoralL4ScoreLocations.length,
            teleopCoralL2Score: matchFields.teleopCoralL2ScoreLocations.length,
            teleopCoralL3Score: matchFields.teleopCoralL3ScoreLocations.length,
            teleopCoralL4Score: matchFields.teleopCoralL4ScoreLocations.length,
            // Footer data
            scoutName: settings.scoutName,
            submitTime: Date.now()
        };
        await matchDatabase.put(matchData);
        bluetooth?.broadcastMatchData([matchData]);
        currentMatchContext?.increment();
        currentMatchContext?.setShowConfetti(true);
        navigate("/scout");
    }, [allianceColor, currentMatchContext, matchFields, matchId, navigate, settings, teamNumber, bluetooth]);


    // ****************************************************
    //         Season-specific states and functions
    // ****************************************************

    // Custom context values for season-specific logic
    // Remember to return these under the custom key in the return statement, AND add them to the ScoutingContextType
    
    


    // ****************************************************
    //           Return the state and functions
    // ****************************************************

    // This function is used to create a field setter function for each fields in the MatchDataFields object
    const fieldSetter = useCallback(<T extends keyof MatchDataFields>(field: T, value: MatchDataFields[T]) => {
        setMatchFields((currentMatchFields)=>({...currentMatchFields, [field]: value}));
    }, []);

    // All the data and functions that can be accessed from the context
    const value: ScoutingContextType = {
        matchId,
        teamNumber,
        allianceColor,
        custom: {
            // Return custom context values for season-specific data and functions

        },
        fields: {
            ...matchFields,
            set: fieldSetter
        },
        submit
    };

    return (
        <ScoutingContext.Provider value={value}>
            {children}
        </ScoutingContext.Provider>
    );
}
