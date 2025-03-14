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
import Divider from "../../components/ui/Divider";
import { OnFieldReefButton } from "../../components/scout/OnFieldReefButton";


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
        <div className="w-full mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center px-4 pb-12 gap-16">

            <div className="flex flex-col items-center">

            <div className="mb-2 italic text-secondary">Push and hold a button to undo</div>
            
            <div className="max-w-md relative whitespace-nowrap border-4 border-pink-400">
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

                <OnFieldButtonGroup label="Coral" top={!reverseY ? 0.45 : 0.55} left={!reverseX ? 0.5 : 0.5}>
                    <OnFieldReefButton label="L4" color="success" locations={context.fields.teleopCoralL4ScoreLocations} setLocations={(v)=>context.fields.set("teleopCoralL4ScoreLocations", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopCoralL4Miss} setValue={(v)=>context.fields.set("teleopCoralL4Miss", v)} />

                    <OnFieldReefButton label="L3" color="success" locations={context.fields.teleopCoralL3ScoreLocations} setLocations={(v)=>context.fields.set("teleopCoralL3ScoreLocations", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopCoralL3Miss} setValue={(v)=>context.fields.set("teleopCoralL3Miss", v)} />

                    <OnFieldReefButton label="L2" color="success" locations={context.fields.teleopCoralL2ScoreLocations} setLocations={(v)=>context.fields.set("teleopCoralL2ScoreLocations", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopCoralL2Miss} setValue={(v)=>context.fields.set("teleopCoralL2Miss", v)} />
                
                    <OnFieldButton label="L1" color="success" value={context.fields.teleopCoralL1Score} setValue={(v)=>context.fields.set("teleopCoralL1Score", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopCoralL1Miss} setValue={(v)=>context.fields.set("teleopCoralL1Miss", v)} />
                </OnFieldButtonGroup>

            </div>

            </div>

            <div className="flex flex-col items-center max-w-md">

                <div className="mb-6 italic text-secondary text-center">
                    Check ✅ if the robot was able to perform the following tasks during the teleop period:
                </div>

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopRemoveL2Algae} 
                            onClick={() => context.fields.set("teleopRemoveL2Algae", !context.fields.teleopRemoveL2Algae)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Removed Algae ❌🟢 From Reef L2</span>} 
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopRemoveL3Algae} 
                            onClick={() => context.fields.set("teleopRemoveL3Algae", !context.fields.teleopRemoveL3Algae)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Removed Algae ❌🟢 From Reef L3</span>}
                />
                
                <Divider className="!my-4" />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopCoralGroundIntake} 
                            onClick={() => context.fields.set("teleopCoralGroundIntake", !context.fields.teleopCoralGroundIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Coral 🪸 From Ground</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopCoralStationIntake} 
                            onClick={() => context.fields.set("teleopCoralStationIntake", !context.fields.teleopCoralStationIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Coral 🪸 From Station 🏢</span>}
                />

                <Divider className="!my-4" />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopAlgaeGroundIntake} 
                            onClick={() => context.fields.set("teleopAlgaeGroundIntake", !context.fields.teleopAlgaeGroundIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Algae 🟢 From Ground</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.teleopAlgaeReefIntake} 
                            onClick={() => context.fields.set("teleopAlgaeReefIntake", !context.fields.teleopAlgaeReefIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Algae 🟢 From Reef 🪸</span>}
                />

            </div>

        </div>
        </>
    );
};
  
export default Teleop;
