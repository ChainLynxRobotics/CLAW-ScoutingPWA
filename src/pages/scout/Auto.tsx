import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import OnFieldButtonGroup from "../../components/scout/OnFieldButtonGroup";
import { OnFieldButton } from "../../components/scout/OnFieldButton";
import { Checkbox, FormControlLabel } from "@mui/material";


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

                <div className="columns-2 break-inside-avoid-column items-center">

                    <OnFieldButtonGroup label="Score" vertical top={0.3} left={0.45} className="text-5xl break-inside-avoid-column">
                        <OnFieldButton label="Inner" className="text-5xl" color="success" value={context.fields.autoPowerPortInnerScore} setValue={(v)=>context.fields.set("autoPowerPortInnerScore", v)} />
                        <OnFieldButton label="Outer" className="text-5xl" color="success" value={context.fields.autoPowerPortOuterScore} setValue={(v)=>context.fields.set("autoPowerPortOuterScore", v)} />
                        <OnFieldButton label="Bottom" className="text-5xl" color="success" value={context.fields.autoPowerPortBottomScore} setValue={(v)=>context.fields.set("autoPowerPortBottomScore", v)} />
                    </OnFieldButtonGroup>

                    <OnFieldButtonGroup label="Miss" vertical top={0.3} left={0.55} className="text-5xl break-inside-avoid-column">
                        <OnFieldButton label="Inner" className="text-5xl" color="success" value={context.fields.autoPowerPortInnerMiss} setValue={(v)=>context.fields.set("autoPowerPortInnerMiss", v)} />
                        <OnFieldButton label="Outer" className="text-5xl" color="success" value={context.fields.autoPowerPortOuterMiss} setValue={(v)=>context.fields.set("autoPowerPortOuterMiss", v)} />
                        <OnFieldButton label="Bottom" className="text-5xl" color="success" value={context.fields.autoPowerPortBottomMiss} setValue={(v)=>context.fields.set("autoPowerPortBottomMiss", v)} />
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
                            checked={context.fields.autoMovement} 
                            onClick={() => context.fields.set("autoMovement", !context.fields.autoMovement)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Robot Movement in Auto</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoPowerCellIntakeGround} 
                            onClick={() => context.fields.set("autoPowerCellIntakeGround", !context.fields.autoPowerCellIntakeGround)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Intook Power Cell From the Ground</span>}
                />

                <FormControlLabel
                    control={
                        <Checkbox 
                            checked={context.fields.autoPowerCellIntakeLoadingBay} 
                            onClick={() => context.fields.set("autoPowerCellIntakeLoadingBay", !context.fields.autoPowerCellIntakeLoadingBay)}
                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                        />
                    } 
                    label={<span>Intook Power Cell From the Loading Bay</span>}
                />

            </div>
            
        </div>
        </>
    );
};
  
export default Auto;
