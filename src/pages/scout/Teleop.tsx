import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import { OnFieldButton } from "../../components/scout/OnFieldButton";
import OnFieldButtonGroup from "../../components/scout/OnFieldButtonGroup";
import { OnFieldMenuButton } from "../../components/scout/OnFieldMenuButton";


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
        <div className="w-full max-w-xl mx-auto flex flex-col items-center px-4">
            
            <div className="max-w-md relative my-12 whitespace-nowrap">
                <img src={`/imgs/reefscape_field_render_${context.allianceColor == AllianceColor.Red ? "red" : "blue"}.png`} 
                    alt="Reefscape Field Render" className={`w-full ${rotateField ? '-scale-100' : ''}`} />
                
                {/* Allows the field to be rotated depending on the pov of the scouter */}
                <button onClick={()=>settings?.setFieldRotated(!rotateField)}
                        className={`absolute top-0 bg-black bg-opacity-75 right-0 rounded-bl-lg`}>
                    <span className="material-symbols-outlined m-2">360</span>
                </button>
                
                <OnFieldButtonGroup label="Processor" top={!reverseX ? 0.2 : 0.8} left={!reverseY ? 0.9 : 0.1} vertical>
                    <OnFieldButton label="Score" color="success" value={context.fields.teleopAlgaeScore} setValue={(v)=>context.fields.set("teleopAlgaeScore", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.teleopAlgaeMiss} setValue={(v)=>context.fields.set("teleopAlgaeMiss", v)} />
                </OnFieldButtonGroup>

                <OnFieldButtonGroup label="Coral" top={!reverseX ? 0.5 : 0.5} left={!reverseY ? 0.5 : 0.5}>
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
        </div>
        </>
    );
};
  
export default Teleop;
