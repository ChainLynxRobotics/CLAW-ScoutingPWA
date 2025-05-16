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
        
                        <div className="columns-2 break-inside-avoid-column">
        
                            <OnFieldButtonGroup label="Score" vertical top={0.3} left={0.45} className="text-5xl break-inside-avoid-column">
                                <OnFieldButton label="Inner" className="text-5xl" color="success" value={context.fields.teleopPowerPortInnerScore} setValue={(v)=>context.fields.set("teleopPowerPortInnerScore", v)} />
                                <OnFieldButton label="Outer" className="text-5xl" color="success" value={context.fields.teleopPowerPortOuterScore} setValue={(v)=>context.fields.set("teleopPowerPortOuterScore", v)} />
                                <OnFieldButton label="Bottom" className="text-5xl" color="success" value={context.fields.teleopPowerPortBottomScore} setValue={(v)=>context.fields.set("teleopPowerPortBottomScore", v)} />
                            </OnFieldButtonGroup>
        
                            <OnFieldButtonGroup label="Miss" vertical top={0.3} left={0.55} className="text-5xl break-inside-avoid-column">
                                <OnFieldButton label="Inner" className="text-5xl" color="success" value={context.fields.teleopPowerPortInnerMiss} setValue={(v)=>context.fields.set("teleopPowerPortInnerMiss", v)} />
                                <OnFieldButton label="Outer" className="text-5xl" color="success" value={context.fields.teleopPowerPortOuterMiss} setValue={(v)=>context.fields.set("teleopPowerPortOuterMiss", v)} />
                                <OnFieldButton label="Bottom" className="text-5xl" color="success" value={context.fields.teleopPowerPortBottomMiss} setValue={(v)=>context.fields.set("teleopPowerPortBottomMiss", v)} />
                            </OnFieldButtonGroup>
        
                            <div className="mb-2 italic text-secondary mt-4">Push and hold a button to undo</div>
                        </div>
        
                    </div>
        
                    <div className="flex flex-col items-left max-w-md">
        
                        <div className="mb-6 italic text-secondary text-center">
                            Check ✅ if the robot was able to perform the following tasks during the autonomous period:
                        </div>
                        
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={context.fields.teleopPowerCellIntakeGround} 
                                    onClick={() => context.fields.set("teleopPowerCellIntakeGround", !context.fields.teleopPowerCellIntakeGround)}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            } 
                            label={<span>Intook Power Cell From the Ground</span>}
                        />
        
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={context.fields.teleopPowerCellIntakeLoadingBay} 
                                    onClick={() => context.fields.set("teleopPowerCellIntakeLoadingBay", !context.fields.teleopPowerCellIntakeLoadingBay)}
                                    sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                            } 
                            label={<span>Intook Power Cell From the Loading Bay</span>}
                        />

                        <Divider />

                        <div>
                            <div className="text-3xl text-primary text-center">
                                Stage 2
                            </div>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={context.fields.teleopRotationControl} 
                                        onClick={() => context.fields.set("teleopRotationControl", !context.fields.teleopRotationControl)}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                    />
                                } 
                                label={<span>Spun Rotation Control Over 5 times</span>}
                            />
                        </div>

                        <Divider />

                        <div>
                            <div className="text-3xl text-primary text-center">
                                Stage 3
                            </div>
                            <FormControlLabel
                                control={
                                    <Checkbox 
                                        checked={context.fields.teleopPositionControl} 
                                        onClick={() => context.fields.set("teleopPositionControl", !context.fields.teleopPositionControl)}
                                        sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                    />
                                } 
                                label={<span>Spun Position Control to Correct Color</span>}
                            />
                        </div>
        
                    </div>
                    
                </div>
        </>
    );
};
  
export default Teleop;
