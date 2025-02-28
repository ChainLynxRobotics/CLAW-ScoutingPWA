import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import { OnFieldButton } from "../../components/scout/OnFieldButton";
import OnFieldButtonGroup from "../../components/scout/OnFieldButtonGroup";
import { OnFieldMenuButton } from "../../components/scout/OnFieldMenuButton";
import { FormControlLabel, Checkbox } from "@mui/material";


const Teleop = () => {

    const settings = useContext(SettingsContext);

    const context = useContext(ScoutingContext);
    if (!context) return (<NoMatchAvailable />);

    

    const rotateField = settings?.fieldRotated || false;
    const isBlue = context.allianceColor == AllianceColor.Blue;
    const reverseX = rotateField == isBlue;
    const reverseY = rotateField == isBlue;
    return (
        <>
        <div className="w-full flex justify-center">
            <PageTitle>Tele Operated</PageTitle>
        </div>
        <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4 pb-12">
            
            <div className="max-w-md relative my-6 whitespace-nowrap border-4 border-pink-400">
                <img src={`/imgs/reefscape_field_render_${context.allianceColor == AllianceColor.Red ? "red" : "blue"}.png`} 
                    alt="Reefscape Field Render" className={`w-full ${rotateField ? '-scale-100' : ''}`} />
                
                {/* Allows the field to be rotated depending on the pov of the scouter */}
                <button onClick={()=>settings?.setFieldRotated(!rotateField)}
                        className={`absolute top-0 bg-black bg-opacity-75 right-0 rounded-bl-lg`}>
                    <span className="material-symbols-outlined m-2">360</span>
                </button>
                
                <OnFieldButtonGroup label="Processor" top={!reverseY ? 0.85 : 0.15} left={!reverseX ? 0.715 : 0.275} vertical>
                    <OnFieldButton label="Score" color="success" value={context.fields.teleopAlgaeScore} setValue={(v)=>context.fields.set("teleopAlgaeScore", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopAlgaeMiss} setValue={(v)=>context.fields.set("teleopAlgaeMiss", v)} />
                </OnFieldButtonGroup>

                <OnFieldButtonGroup label="Net" top={!reverseY ? 0.3 : 0.7} left={!reverseX ? 0.9 : 0.1} vertical>
                    <OnFieldButton label="Score" color="success" value={context.fields.teleopAlgaeNetScore} setValue={(v)=>context.fields.set("teleopAlgaeNetScore", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopAlgaeNetMiss} setValue={(v)=>context.fields.set("teleopAlgaeNetMiss", v)} />
                </OnFieldButtonGroup>
                <OnFieldButtonGroup label="Human Net" top={!reverseY ? 0.1 : 0.9} left={!reverseX ? 0.5 : 0.5}>
                    <OnFieldButton label="Score" color="success" value={context.fields.teleopHumanPlayerAlgaeScore} setValue={(v)=>context.fields.set("teleopHumanPlayerAlgaeScore", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopHumanPlayerAlgaeMiss} setValue={(v)=>context.fields.set("teleopHumanPlayerAlgaeMiss", v)} />
                </OnFieldButtonGroup>

                <OnFieldButtonGroup label="Coral" top={!reverseY ? 0.5 : 0.5} left={!reverseX ? 0.5 : 0.5}>
                    <OnFieldMenuButton
                        id="coral-score-menu-button"
                        label="Score"
                        color="success"
                        menuItems={[
                            {label: "Level 1", value: context.fields.teleopCoralL1Score, setValue: (v)=>context.fields.set("teleopCoralL1Score", v)},
                            {label: "Level 2", value: context.fields.teleopCoralL2Score, setValue: (v)=>context.fields.set("teleopCoralL2Score", v)},
                            {label: "Level 3", value: context.fields.teleopCoralL3Score, setValue: (v)=>context.fields.set("teleopCoralL3Score", v)},
                            {label: "Level 4", value: context.fields.teleopCoralL4Score, setValue: (v)=>context.fields.set("teleopCoralL4Score", v)}
                        ]}
                    />
                    <OnFieldMenuButton
                        id="coral-miss-menu-button"
                        label="Miss"
                        color="error"
                        menuItems={[
                            {label: "Level 1", value: context.fields.teleopCoralL1Miss, setValue: (v)=>context.fields.set("teleopCoralL1Miss", v)},
                            {label: "Level 2", value: context.fields.teleopCoralL2Miss, setValue: (v)=>context.fields.set("teleopCoralL2Miss", v)},
                            {label: "Level 3", value: context.fields.teleopCoralL3Miss, setValue: (v)=>context.fields.set("teleopCoralL3Miss", v)},
                            {label: "Level 4", value: context.fields.teleopCoralL4Miss, setValue: (v)=>context.fields.set("teleopCoralL4Miss", v)}
                        ]}
                    />
                </OnFieldButtonGroup>

            </div>

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopRemoveL2Algae} 
                        onClick={(e) => context.fields.set("teleopRemoveL2Algae", !context.fields.teleopRemoveL2Algae)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Removed Algae ❌🟢 From Reef L2</span>} 
            />

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopRemoveL3Algae} 
                        onClick={(e) => context.fields.set("teleopRemoveL3Algae", !context.fields.teleopRemoveL3Algae)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Removed Algae ❌🟢 From Reef L3</span>}
            />
            
            <div className="my-4 w-full max-w-md h-1 bg-background-secondary undefined"></div>

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopCoralGroundIntake} 
                        onClick={(e) => context.fields.set("teleopCoralGroundIntake", !context.fields.teleopCoralGroundIntake)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Collected Coral 🪸 From Ground</span>}
            />

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopCoralStationIntake} 
                        onClick={(e) => context.fields.set("teleopCoralStationIntake", !context.fields.teleopCoralStationIntake)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Collected Coral 🪸 From Station 🏢</span>}
            />

            <div className="my-4 w-full max-w-md h-1 bg-background-secondary undefined"></div>

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopAlgaeGroundIntake} 
                        onClick={(e) => context.fields.set("teleopAlgaeGroundIntake", !context.fields.teleopAlgaeGroundIntake)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Collected Algae 🟢 From Ground</span>}
            />

            <FormControlLabel
                control={
                    <Checkbox 
                        checked={context.fields.teleopAlgaeReefIntake} 
                        onClick={(e) => context.fields.set("teleopAlgaeReefIntake", !context.fields.teleopAlgaeReefIntake)}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                    />
                } 
                label={<span>Collected Algae 🟢 From Reef 🪸</span>}
            />
        </div>
        </>
    );
};
  
export default Teleop;
