import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import ScoutingContext from "../../components/context/ScoutingContext";
import NoMatchAvailable from "./NoMatchAvailable";
import { MAX_NOTE_LENGTH } from "../../constants";
import MatchResult from "../../enums/MatchResult";
import ClimbResult from "../../enums/ClimbResult";
import { useSnackbar } from "notistack";
import LoadingBackdrop from "../../components/ui/LoadingBackdrop";
import { Button, FormControl, InputLabel, Select, MenuItem, Rating, TextField } from "@mui/material";
import PageTitle from "../../components/ui/PageTitle";

const PostMatch = () => {
    const context = useContext(ScoutingContext);

    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    
    const [defenseHover, setDefenseHover] = useState<number>(-1);

    const ratings: { [index: number]: string } = {
        1: 'Useless :(',
        2: 'Poor',
        3: 'Ok',
        4: 'Good',
        5: 'Excellent',
    }

    function handleNotesChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!context) return;
        if (event.target.value.length <= MAX_NOTE_LENGTH) {
            context.fields.set("notes", event.target.value);
        }
    }

    function submit() {
        if (context) {
            setLoading(true);
            context.submit().catch((e) => {
                enqueueSnackbar(e.message, {variant: "error"});
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    if(!context) {
        return (<NoMatchAvailable />)
    }
    return (
        <>
        <div className="w-full flex justify-center">
            <PageTitle>Post Match</PageTitle>
        </div>
        <div className="w-full max-w-xl mx-auto flex flex-col items-left px-4 gap-4">

            <FormControl sx={{maxWidth: "256px"}}>
                <InputLabel>Climb Result</InputLabel>
                <Select 
                    id="climb-result" 
                    label="Climb Result" 
                    variant="outlined"
                    value={context.fields.climb}
                    onChange={(e) => context.fields.set("climb", e.target.value as ClimbResult)}
                >
                    <MenuItem value={ClimbResult.None}>None</MenuItem>
                    <MenuItem value={ClimbResult.Parked}>Parked (in triangle zone)</MenuItem>
                    <MenuItem value={MatchResult.Win}>Climb (on chain)</MenuItem>
                </Select>
            </FormControl>
            <div className="flex flex-row items-center gap-1 my-2">
                <span className="text-lg">Defense:</span>
                <Rating
                    name="defense-quality"
                    value={context.fields.defense}
                    onChange={(_e, newValue) => {
                        if(newValue !== null) context.fields.set("defense", newValue);
                    }}
                    onChangeActive={(_e, newHover) => {
                        setDefenseHover(newHover);
                    }}
                    precision={1}
                ></Rating>
                <span>{ratings[defenseHover !== -1 ? defenseHover : context.fields.defense]}</span>
            </div>
            <FormControl sx={{maxWidth: "256px"}}>
                <InputLabel>Human player notes scored</InputLabel>
                <Select 
                    id="human-player-notes" 
                    label="Human player notes scored" 
                    variant="outlined"
                    value={context.fields.humanPlayerPerformance}
                    onChange={(e) => context.fields.set("humanPlayerPerformance", e.target.value as number)}
                >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                </Select>
            </FormControl>
            <FormControl sx={{maxWidth: "256px"}}>
                <InputLabel>Match Result</InputLabel>
                <Select 
                    id="match-result" 
                    label="Match Result" 
                    variant="outlined"
                    value={context.fields.matchResult}
                    onChange={(e) => context.fields.set("matchResult", e.target.value as MatchResult)}
                >
                    <MenuItem value={MatchResult.Loss}>Loss</MenuItem>
                    <MenuItem value={MatchResult.Tie}>Tie</MenuItem>
                    <MenuItem value={MatchResult.Win}>Win</MenuItem>
                </Select>
            </FormControl>
            <TextField
                id="notes"
                label="Extra Notes"
                multiline
                rows={6}
                fullWidth
                value={context.fields.notes}
                onChange={handleNotesChange}
            />

            <div className="w-full flex justify-center mt-4">
                <Button 
                    variant="contained" 
                    color="success" 
                    size="large" 
                    onClick={submit}
                >
                    Submit
                </Button>
            </div>
        </div>

        {/* Loading spinner */}
        <LoadingBackdrop open={loading} />
        </>
    );
};
  
export default PostMatch;
