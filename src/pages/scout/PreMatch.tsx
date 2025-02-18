import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import FormControl from "@mui/material/FormControl/FormControl";
import { Alert, Checkbox, FormControlLabel, FormGroup, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import HumanPlayerLocation from "../../enums/HumanPlayerLocation";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import { MAX_NOTE_LENGTH } from "../../constants";
import PageTitle from "../../components/ui/PageTitle";
import allianceTeamIndex from "../../util/allianceTeamIndex";
import { ScheduleContext } from "../../components/context/ScheduleContextProvider";


const PreMatch = () => {
    
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("Settings context not found?!?!?!");

    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("Schedule context not found.");

    const context = useContext(ScoutingContext);
    if (!context) throw new Error("Scouting context not found.");

    const handleHumanPlayerLocationChange = (event: SelectChangeEvent) => {
        context.fields.set("humanPlayerLocation", parseInt(event.target.value) as HumanPlayerLocation);
    };

    const handlePreloadChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        context.fields.set("preload", event.target.checked);
    }

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!context) return;
        if (event.target.value.length <= MAX_NOTE_LENGTH) {
            context.fields.set("notes", event.target.value);
        }
    }

    return (
        <>
        <div className="w-full flex justify-center">
            <PageTitle>Pre Match</PageTitle>
        </div>
        <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4">
            <h1 className="flex items-center gap-2 text-lg font-bold my-2">
                <span>You are scouting</span>
                <FormControl variant="standard">
                    <Select
                        labelId="team-select-label"
                        id="team-select"
                        value={settings.clientId}
                        onChange={(event) => {
                            settings?.setClientId(parseInt(event.target.value+""));
                        }}
                        label="Select Team">
                        {[0, 1, 2, 3, 4, 5].map((clientId) => {
                            const { team, color } = allianceTeamIndex(schedule.matches[schedule.currentMatchIndex], schedule.currentMatchIndex, clientId);
                            return (
                                <MenuItem key={clientId} value={clientId}>
                                    <span className={`text-lg font-bold ${color == AllianceColor.Red ? 'text-red-400' : 'text-blue-400'}`}>{team}</span>
                                    &nbsp;
                                    <span className="text-sm text-secondary">({clientId + 1})</span>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <span>in match</span>
                <FormControl variant="standard">
                    <Select
                        labelId="match-select-label"
                        id="match-select"
                        value={context.matchId}
                        onChange={(event) => {
                            const index = schedule.matches.map((match) => match.matchId+"").indexOf(event.target.value);
                            schedule?.setCurrentMatchIndex(index);
                        }}
                        label="Select Match"
                    >
                        {schedule.matches.map((match) => {
                            return <MenuItem key={match.matchId} value={match.matchId}><b className="text-lg">{match.matchId}</b></MenuItem>;
                        })}
                    </Select>
                </FormControl>
            </h1>
            <FormControl sx={{ m: 1, minWidth: 224 }}>
                <InputLabel id="human-player-location-label">
                    {context.teamNumber != 8248 ? `${context.teamNumber}'s Human Player Location` : `Soren's Location`}
                </InputLabel>
                <Select
                    labelId="human-player-location-label"
                    id="human-player-location"
                    value={context.fields.humanPlayerLocation+""}
                    onChange={handleHumanPlayerLocationChange}
                    label="Human Player Location"
                >
                    <MenuItem value={HumanPlayerLocation.None}>Not on field</MenuItem>
                    <MenuItem value={HumanPlayerLocation.Source}>Source</MenuItem>
                    <MenuItem value={HumanPlayerLocation.Amp}>Amp</MenuItem>
                </Select>
            </FormControl>
            <div className="h-4"></div> {/* Spacer */}
            <FormGroup>
                <FormControlLabel 
                    control={<Checkbox id="preload" 
                    value={context.fields.preload} 
                    onChange={handlePreloadChange} />} 
                    label="Note Preloaded" 
                />
            </FormGroup>
            <div className="h-4"></div> {/* Spacer */}
            <TextField
                id="notes"
                label="Extra Notes"
                multiline
                rows={6}
                fullWidth
                value={context.fields.notes}
                onChange={handleNotesChange}
            />
            <div className="h-4"></div> {/* Spacer */}
            { settings.scoutName === "" &&
                <Alert severity="warning">
                    <div className="text-lg mb-1"><b>You have not set your name!</b></div>
                    <div>Set your name in <Link to='/settings'><u>settings</u></Link> to track your contributions!</div>
                </Alert>
            }
            <span className="my-4 max-w-md text-center text-secondary">
                Reminder that it is ok to make mistakes! The data is collected by humans and read by humans,
                it is not the end of the world if you make a mistake. Just do your best!
            </span>
        </div>
        </>
    );
};
  
export default PreMatch;
