import { useContext, useState } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import { MAX_NOTE_LENGTH } from "../../constants";
import { useSnackbar } from "notistack";
import LoadingBackdrop from "../../components/ui/LoadingBackdrop";
import { Button, TextField, Slider, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
import PageTitle from "../../components/ui/PageTitle";
import Observation from "../../enums/Observation";

// For multiselect
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const observationValues = [
    {name: "Tippy (Seems prone ot falling over)", value: Observation.Tippy},
    {name: "Dropping Coral", value: Observation.DroppingCoral},
    {name: "Dropping Algae", value: Observation.DroppingAlgae},
    {name: "Difficulty Aligning to Score", value: Observation.DifficultyAligningScore},
    {name: "Difficulty Aligning to Intake", value: Observation.DifficultyAligningIntake},
    {name: "Immobilized (Not moving, still on)", value: Observation.Immobilized},
    {name: "Disabled Partially (off for part of match)", value: Observation.DisabledPartially},
    {name: "Disabled Fully (off for the entire match)", value: Observation.DisabledFully}
]

const PostMatch = () => {
    const context = useContext(ScoutingContext);

    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState<boolean>(false);
    
 
    function handleNotesChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!context) return;
        if (event.target.value.length <= MAX_NOTE_LENGTH) {
            context.fields.set("notes", event.target.value);
        }
    }

    function handleObservationsChange(event: SelectChangeEvent<Observation[]>) {
        if (!context) return;
        const val = event.target.value;
        context.fields.set("observations", typeof val === 'string' ? val.split(',').map((str)=>parseInt(str) as Observation) : val);
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

            <div className="mb-8">
                <div className="flex flex-row items-center gap-6 my-2">
                    <span className="text-lg text-nowrap">Time Defending: </span>
                    <Slider value={context.fields.timeDefending} onChange={(_e, newValue) => {
                        context.fields.set("timeDefending", newValue as number);
                    }} aria-label="Disabled slider" className="max-w-xs" />
                </div>
                <div className="text-secondary">(% of total match)</div>
            </div>

            <FormControl sx={{ maxWidth: 544 }}>
                <InputLabel id="observations-label">Observations</InputLabel>
                <Select
                    labelId="observations-label"
                    id="observations"
                    multiple
                    value={context.fields.observations}
                    onChange={handleObservationsChange}
                    input={<OutlinedInput label="Observations" />}
                    renderValue={(selected) => selected.map((value) => {
                        const obs = observationValues.find((obs) => obs.value === value);
                        return obs ? obs.name : "";
                    }).join(', ')}
                    MenuProps={MenuProps}
                >
                    {observationValues.map(({name, value}) => (
                        <MenuItem key={value} value={value}>
                            <Checkbox checked={context.fields.observations.includes(value)} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
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
