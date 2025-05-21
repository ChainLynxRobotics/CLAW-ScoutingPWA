import InputLabel from "@mui/material/InputLabel/InputLabel";
import MenuItem from "@mui/material/MenuItem/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select/Select";
import { useContext, useMemo } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import FormControl from "@mui/material/FormControl/FormControl";
import { Alert, Button, Checkbox, FormControlLabel, OutlinedInput, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import HumanPlayerLocation from "../../enums/HumanPlayerLocation";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import { MAX_NOTE_LENGTH } from "../../constants";
import PageTitle from "../../components/ui/PageTitle";
import allianceTeamIndex from "../../util/allianceTeamIndex";
import { ScheduleContext } from "../../components/context/ScheduleContextProvider";
import { BluetoothContext } from "../../components/context/BluetoothContextProvider";
import { RememberedClientID } from "../../types/RadioPacketData";
import dayjs from "../../util/dayjs";


const PreMatch = () => {
    
    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("Settings context not found?!?!?!");

    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("Schedule context not found.");

    const bluetooth = useContext(BluetoothContext);
    if (!bluetooth) throw new Error("Bluetooth context not found.");

    const context = useContext(ScoutingContext);
    if (!context) throw new Error("Scouting context not found.");

    const claimedClientID: RememberedClientID|undefined = useMemo(() => bluetooth.getClaimedClientID(settings.clientId), [bluetooth, settings.clientId]);

    const handleHumanPlayerLocationChange = (event: SelectChangeEvent) => {
        context.fields.set("humanPlayerLocation", (event.target.value ? true : false));
    };

    const handleNumberPowerCellsLoadedChange = (event: SelectChangeEvent) => {
        context.fields.set("numberPowerCellsLoaded", parseInt(event.target.value));
    };


    const handlePinPlace = (event: React.MouseEvent<HTMLImageElement>) => {
        if (!context) return;
        const rect = event.currentTarget.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
        if (reverseX) x = rect.width - x;
        if (reverseY) y = rect.height - y;
        context.fields.set("autoStartPositionX", x);
        context.fields.set("autoStartPositionY", y);
        console.log(`Placed pin at (${x}, ${y})`);
    }

    const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!context) return;
        if (event.target.value.length <= MAX_NOTE_LENGTH) {
            context.fields.set("notes", event.target.value);
        }
    }

    const rotateField = settings?.fieldRotated || false;
    const isBlue = context.allianceColor == AllianceColor.Blue;
    const reverseX = rotateField == isBlue;
    const reverseY = rotateField == isBlue;

    const startPositionComponent =
        <>
            <h3 className="text-lg">Auto Start Position</h3>
            <span className="text-secondary">Click on the field to place a pin</span>

            <div className="max-w-md relative my-4 whitespace-nowrap border-4 border-green-300">
                <img src={`/imgs/recharge_field_render_${context.allianceColor == AllianceColor.Red ? "red" : "blue"}.png`} 
                    alt="Recharge Field Render" 
                    className={`w-[200px] h-[500px] object-cover ${!rotateField ? '' : '-scale-100'} ${isBlue ? 'object-right': 'object-left'}`}
                    onClick={handlePinPlace}
                />
                
                {/* Allows the field to be rotated depending on the pov of the scouter */}
                <button onClick={()=>settings?.setFieldRotated(!rotateField)}
                        className={`absolute top-0 bg-black bg-opacity-75 right-0 rounded-bl-lg`}>
                    <span className="material-symbols-outlined m-2">360</span>
                </button>

                {context.fields.autoStartPositionX && context.fields.autoStartPositionY &&
                    <img 
                        src="/imgs/map_pin_icon.svg" 
                        width="35.25" 
                        height="48" 
                        className="absolute -translate-x-1/2 -translate-y-full"
                        style={{
                            left: !reverseX ? context.fields.autoStartPositionX : 200 - context.fields.autoStartPositionX,
                            top: !reverseY ? context.fields.autoStartPositionY : 500 - context.fields.autoStartPositionY,
                        }}
                    />
                }
            </div>
            {context.fields.autoStartPositionX && context.fields.autoStartPositionY &&
                <Button onClick={()=>{context.fields.set("autoStartPositionX", undefined); context.fields.set("autoStartPositionY", undefined);}}
                    variant="outlined" color="error" className="!mb-4">
                    Remove Pin
                </Button>
            }
        </>;
    return (
        <>
        <div className="w-full flex justify-center">
            <PageTitle>Pre Match</PageTitle>
        </div>
        <div className="w-full mx-auto flex flex-col items-center px-4">

            { settings.scoutName === "" &&
                <Alert severity="warning" variant="outlined" className="mb-4">
                    <div className="text-lg mb-1"><b>You have not set your name!</b></div>
                    <div>Set your name in <Link to='/settings'><u>settings</u></Link> to track your contributions!</div>
                </Alert>
            }

            { claimedClientID &&
                <Alert severity="warning" variant="filled">
                    <div className="text-lg mb-1"><b>Somebody else is using your client ID!</b></div>
                    <div>{claimedClientID.scoutName || "An unnamed scouter"} is using Client ID <code>{claimedClientID.clientID+1}</code> as of <code>{dayjs(claimedClientID.receivedAt).fromNow()}</code></div>
                </Alert>
            }

            <h1 className="flex flex-wrap items-center justify-center gap-x-2 text-lg font-bold mt-2 mb-8">
                <div className="flex items-center gap-2">
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
                </div>
                <div className="flex items-center gap-2">
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
                </div>
            </h1>
            <div className="flex flex-col md:flex-row gap-24">
                <div className="flex flex-col items-center mb-4 flex-shrink-0">
                    <h3 className="text-lg">Auto Start Position</h3>
                    <span className="text-secondary">Click on the field to place a pin</span>

                    <div className="max-w-md relative my-4 whitespace-nowrap border-4 border-green-300">
                        <img src={`/imgs/recharge_field_render_${context.allianceColor == AllianceColor.Red ? "red" : "blue"}.png`} 
                            alt="Infinite Recharge Field Render" 
                            className={`w-[800px] h-[500px] object-cover ${!rotateField ? '' : '-scale-100'} ${isBlue ? 'object-right': 'object-left'}`}
                            onClick={handlePinPlace}
                        />
                        
                        {/* Allows the field to be rotated depending on the pov of the scouter */}
                        <button onClick={()=>settings?.setFieldRotated(!rotateField)}
                                className={`absolute top-0 bg-black bg-opacity-75 right-0 rounded-bl-lg`}>
                            <span className="material-symbols-outlined m-2">360</span>
                        </button>

                        {context.fields.autoStartPositionX && context.fields.autoStartPositionY &&
                            <img 
                                src="/imgs/map_pin_icon.svg" 
                                width="35.25" 
                                height="48" 
                                className="absolute -translate-x-1/2 -translate-y-full"
                                style={{
                                    left: !reverseX ? context.fields.autoStartPositionX : 200 - context.fields.autoStartPositionX,
                                    top: !reverseY ? context.fields.autoStartPositionY : 500 - context.fields.autoStartPositionY,
                                }}
                            />
                        }
                    </div>
                    {context.fields.autoStartPositionX && context.fields.autoStartPositionY &&
                        <Button onClick={()=>{context.fields.set("autoStartPositionX", undefined); context.fields.set("autoStartPositionY", undefined);}}
                            variant="outlined" color="error" className="!mb-4">
                            Remove Pin
                        </Button>
                    }
                </div>
                <div className="flex flex-col items-center">
                    <FormControlLabel
                        label={"Is " + context.teamNumber + "'s human player on the field"}
                        control={
                            <Checkbox
                                value={context.fields.humanPlayerLocation}
                                onChange={handleHumanPlayerLocationChange}
                            />
                        }
                    />

                    <div className="h-4"></div> {/* Spacer */}
                    
                    <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="Power-Cells-Dropdown">Number of Power Cells</InputLabel>
                        <Select
                            labelId="Power-Cells-Dropdown"
                            id="Power-Cells-Dropdown"
                            value={context.fields.numberPowerCellsLoaded?.toString()}
                            onChange={handleNumberPowerCellsLoadedChange}
                            input={<OutlinedInput label="Number of Power Cells" />}
                            >
                                <MenuItem value="0">0 Power Cells Loaded</MenuItem>
                                <MenuItem value="1">1 Power Cell Loaded</MenuItem>
                                <MenuItem value="2">2 Power Cells Loaded</MenuItem>
                                <MenuItem value="3">3 Power Cells Loaded</MenuItem>
                        </Select>
                    </FormControl>

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
                    <span className="my-4 max-w-md text-center text-secondary">
                        Reminder that it is ok to make mistakes! The data is collected by humans and read by humans,
                        it is not the end of the world if you make a mistake. Just do your best!
                    </span>
                </div>
            </div>
        </div>
        </>
    );
};
  
export default PreMatch;
