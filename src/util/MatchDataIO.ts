import JSZip from "jszip";
import { MatchData, MatchEventData } from "../types/MatchData";
import { stringify } from 'csv-stringify/browser/esm/sync';
import MatchDatabase from "./MatchDatabase";
import MatchEvent from "../enums/MatchEvent";
import AllianceColor from "../enums/AllianceColor";
import { MatchDataFieldInformation, MatchDataFields } from "../DataValues";

/**
 * Takes saved data and returns it as a blob zip file to be downloaded to a users computer. Includes both csv and json forms of the data.
 * 
 * @param matchData - List of match entries, usually you would get this from the database.
 * @param events - List of event entries, again you would get this from the database.
 * @returns A blob representing the zip file data
 */
async function exportDataAsZip(matchData: MatchData[], events: MatchEventData[]) {

    if (matchData.length == 0 || events.length == 0) throw new Error("No data to export");

    const serializedMatchData = [];
    for (const entry of matchData) {
        serializedMatchData.push({
            // This might be the weird code ive ever written, but it works so I'm not changing it
            // Basically, it goes through each entry in the object, and if the key is in the MatchDataFieldInformation object, it serializes it
            ...Object.fromEntries(Object.entries(entry).map(([key, value]) => {
                if (key in MatchDataFieldInformation) {
                    const info = MatchDataFieldInformation[key as keyof MatchDataFields];
                    return [key, (info.serialize as (value: unknown)=>string)?.(value) || value];
                }
                return [key, value];
            })),
            // This is for the perennial values that are always in the data
            allianceColor: AllianceColor[entry.allianceColor],
            matchStart: new Date(entry.matchStart).toISOString(),
            submitTime: new Date(entry.submitTime).toISOString()
        });
    }


    const zip = new JSZip();
    zip.file("raw/MatchData.json", JSON.stringify(matchData, undefined, 2))
    zip.file("raw/MatchData.csv", stringify(
        serializedMatchData,
        {
            header: true,
            columns: Object.keys(matchData[0]),
            cast: {
                boolean: (value: boolean) => value ? "Yes" : "No",
            },
            
        }
    ));
    zip.file("raw/MatchEvents.json", JSON.stringify(events, undefined, 2))
    zip.file("raw/MatchEvents.csv", stringify(
        events.map((entry) => ({
            ...entry,
            event: MatchEvent[entry.event]
        })),
        {
            header: true,
            columns: Object.keys(events[0]),
            cast: {
                boolean: (value: boolean) => value ? "Yes" : "No"
            }
        }
    ));


    const blob = await zip.generateAsync({type: "blob"});
    return blob;
}

/**
 * Reads data from a file that was exported using downloadDataAsZip function and imports it.
 * 
 * @param file - A File object, such as one you would get from a file input element
 */
async function importDataFromZip(file: File) {
    const zip = await JSZip.loadAsync(file);

    const rawMatchData = zip.file("raw/MatchData.json");
    if (!rawMatchData) throw new Error("Could not find match data in zip folder!");
    const matchData = JSON.parse(await rawMatchData.async("string"));
    console.log(matchData);

    const rawEventData = zip.file("raw/MatchEvents.json");
    if (!rawEventData) throw new Error("Could not find match data in zip folder!");
    const events = JSON.parse(await rawEventData.async("string"));
    console.log(events);

    await MatchDatabase.importData(matchData, events);
}

export default {
    exportDataAsZip,
    importDataFromZip
}