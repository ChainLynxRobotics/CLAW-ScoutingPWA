import ErrorPage from "./ErrorPage";
import { useContext } from "react";
import SettingsContext from "../components/context/SettingsContext";
import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import PageTitle from "../components/ui/PageTitle";

const SettingsPage = () => {

    const settings = useContext(SettingsContext);

    if (!settings) return (<ErrorPage msg="Settings context not found?!?!?!" />)
    return (
    <div className="w-full flex flex-col items-center gap-5 px-4 pb-24">
        <PageTitle>Settings</PageTitle>

        <div className="mb-2 flex flex-col items-center">
            <div className="text-secondary">App Version: <i>{APP_VERSION}</i></div>
            <div className="text-secondary">Build Date: <i>{new Date(BUILD_DATE).toLocaleString()}</i></div>
            <div><Link to="/" className="text-blue-400 underline hover:text-blue-500 transition">Install Instructions</Link></div>
        </div>

        <FormControl className="max-w-96">
            <TextField 
                id="scout-name" 
                label="Scout Name" 
                value={settings.scoutName} 
                onChange={(e)=>settings.setScoutName(e.target.value)} 
                variant="outlined"
            />
            <FormHelperText>Your name will be submitted with your data to track contributions.</FormHelperText>
        </FormControl>
        <FormControl className="max-w-96">
            <InputLabel>Client ID</InputLabel>
            <Select id="client-id" label="Client ID" value={settings.clientId+""} onChange={(e)=>settings.setClientId(parseInt(e.target.value))}>
                <MenuItem value={"0"}>1</MenuItem>
                <MenuItem value={"1"}>2</MenuItem>
                <MenuItem value={"2"}>3</MenuItem>
                <MenuItem value={"3"}>4</MenuItem>
                <MenuItem value={"4"}>5</MenuItem>
                <MenuItem value={"5"}>6</MenuItem>
            </Select>
            <FormHelperText>Make sure each scouting client has a unique ID, as this is used to determine what team you scout each match.</FormHelperText>
        </FormControl>
        <FormControl className="max-w-96">
            <TextField 
                id="competition-id" 
                label="Competition ID" 
                value={settings.competitionId} 
                onChange={(e)=>{settings.setCompetitionId(e.target.value); settings.setCompetitionIdLastUpdated(Date.now())}} 
                variant="outlined"
            />
            <FormHelperText>Make sure this matches the blue alliance url and everybody else&apos;s devices!</FormHelperText>
        </FormControl>

        <FormControl className="max-w-96">
            <FormControlLabel label="Rotate Field View" 
                control={<Checkbox checked={settings.fieldRotated} onChange={(e)=>settings.setFieldRotated(e.target.checked)} color="primary" />}
            />
            <FormHelperText>Change this based on the perspective you are viewing the field for when you are scouting</FormHelperText>
        </FormControl>

        <FormControl className="max-w-96">
            <FormControlLabel label="Auto Update Matches" 
                control={<Checkbox checked={settings.autoFetchMatches} onChange={(e)=>settings.setAutoFetchMatches(e.target.checked)} color="primary" />}
            />
            <FormHelperText>When enabled, the match schedule will get automatically downloaded from Blue Alliance every so often</FormHelperText>
        </FormControl>
    </div>
    );
};

export default SettingsPage;
