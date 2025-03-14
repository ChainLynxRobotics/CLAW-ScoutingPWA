import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import OnFieldButtonGroup from "../../components/scout/OnFieldButtonGroup";
import { OnFieldButton } from "../../components/scout/OnFieldButton";
import { OnFieldMenuButton } from "../../components/scout/OnFieldMenuButton";
import { Checkbox, FormControlLabel } from "@mui/material";
import Divider from "../../components/ui/Divider";
import { OnFieldReefButton } from "../../components/scout/OnFieldReefButton";


const Auto = () => {

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
            <PageTitle>Autonomous</PageTitle>
        </div>
        <div className="w-full mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center px-4 pb-12 gap-16">

            <div className="flex flex-col items-center">

                <div className="mb-2 italic text-secondary">Push and hold a button to undo</div>
                
                <div className="max-w-md relative whitespace-nowrap border-4 border-yellow-300">
                    <img src={`/imgs/reefscape_field_render_${context.allianceColor == AllianceColor.Red ? "red" : "blue"}.png`} 
                        alt="Reefscape Field Render" className={`w-full ${rotateField ? '-scale-100' : ''}`} />
                    
                    {/* Allows the field to be rotated depending on the pov of the scouter */}
                    <button onClick={()=>settings?.setFieldRotated(!rotateField)}
                            className={`absolute top-0 bg-black bg-opacity-75 right-0 rounded-bl-lg`}>
                        <span className="material-symbols-outlined m-2">360</span>
                    </button>
                    
                    <OnFieldButtonGroup label="Auto Processor" top={!reverseY ? 0.85 : 0.15} left={!reverseX ? 0.715 : 0.275} vertical>
                        <OnFieldButton label="Score" color="success" value={context.fields.autoAlgaeScore} setValue={(v)=>context.fields.set("autoAlgaeScore", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoAlgaeMiss} setValue={(v)=>context.fields.set("autoAlgaeMiss", v)} />
                    </OnFieldButtonGroup>

                    <OnFieldButtonGroup label="Auto Net" top={!reverseY ? 0.3 : 0.7} left={!reverseX ? 0.9 : 0.1} vertical>
                        <OnFieldButton label="Score" color="success" value={context.fields.autoAlgaeNetScore} setValue={(v)=>context.fields.set("autoAlgaeNetScore", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoAlgaeNetMiss} setValue={(v)=>context.fields.set("autoAlgaeNetMiss", v)} />
                    </OnFieldButtonGroup>

                    <OnFieldButtonGroup label="Auto Coral" top={!reverseY ? 0.45 : 0.55} left={!reverseX ? 0.5 : 0.5}>
                        <OnFieldReefButton label="L4" color="success" locations={context.fields.autoCoralL4ScoreLocations} setLocations={(v)=>context.fields.set("autoCoralL4ScoreLocations", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoCoralL4Miss} setValue={(v)=>context.fields.set("autoCoralL4Miss", v)} />

                        <OnFieldReefButton label="L3" color="success" locations={context.fields.autoCoralL3ScoreLocations} setLocations={(v)=>context.fields.set("autoCoralL3ScoreLocations", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoCoralL3Miss} setValue={(v)=>context.fields.set("autoCoralL3Miss", v)} />

                        <OnFieldReefButton label="L2" color="success" locations={context.fields.autoCoralL2ScoreLocations} setLocations={(v)=>context.fields.set("autoCoralL2ScoreLocations", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoCoralL2Miss} setValue={(v)=>context.fields.set("autoCoralL2Miss", v)} />
                        
                        <OnFieldButton label="L1" color="success" value={context.fields.autoCoralL1Score} setValue={(v)=>context.fields.set("autoCoralL1Score", v)} />
                        <OnFieldButton label="Miss" color="error" value={context.fields.autoCoralL1Miss} setValue={(v)=>context.fields.set("autoCoralL1Miss", v)} />
                    </OnFieldButtonGroup>

                </div>

            </div>

            <div className="flex flex-col items-center max-w-md">

                <div className="mb-6 italic text-secondary text-center">
                    Check ✅ if the robot was able to perform the following tasks during the autonomous period:
                </div>

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoRemoveL2Algae} 
                            onClick={() => context.fields.set("autoRemoveL2Algae", !context.fields.autoRemoveL2Algae)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Removed Algae ❌🟢 From Reef L2</span>} 
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoRemoveL3Algae} 
                            onClick={() => context.fields.set("autoRemoveL3Algae", !context.fields.autoRemoveL3Algae)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Removed Algae ❌🟢 From Reef L3</span>}
                />
                
                <Divider className="!my-4" />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoCoralGroundIntake} 
                            onClick={() => context.fields.set("autoCoralGroundIntake", !context.fields.autoCoralGroundIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Coral 🪸 From Ground</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoCoralStationIntake} 
                            onClick={() => context.fields.set("autoCoralStationIntake", !context.fields.autoCoralStationIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Coral 🪸 From Station 🏢</span>}
                />

                <Divider className="!my-4" />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoAlgaeGroundIntake} 
                            onClick={() => context.fields.set("autoAlgaeGroundIntake", !context.fields.autoAlgaeGroundIntake)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Collected Algae 🟢 From Ground</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoAlgaeReefIntake} 
                            onClick={() => context.fields.set("autoAlgaeReefIntake", !context.fields.autoAlgaeReefIntake)}
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
  
export default Auto;
