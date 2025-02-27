import { useContext } from "react";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import AllianceColor from "../../enums/AllianceColor";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import OnFieldButtonGroup from "../../components/scout/OnFieldButtonGroup";
import { OnFieldButton } from "../../components/scout/OnFieldButton";
import { OnFieldMenuButton } from "../../components/scout/OnFieldMenuButton";


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
                    <OnFieldButton label="Score" color="success" value={context.fields.autoAlgaeScore} setValue={(v)=>context.fields.set("autoAlgaeScore", v)} />
                    <OnFieldButton label="Miss" color="error" value={context.fields.autoAlgaeMiss} setValue={(v)=>context.fields.set("autoAlgaeMiss", v)} />
                </OnFieldButtonGroup>

                <OnFieldButtonGroup label="Coral" top={!reverseX ? 0.5 : 0.5} left={!reverseY ? 0.5 : 0.5}>
                    <OnFieldMenuButton
                        id="coral-score-menu-button"
                        label="Score"
                        color="success"
                        menuItems={[
                            {label: "Level 1", value: context.fields.autoCoralL1Score, setValue: (v)=>context.fields.set("autoCoralL1Score", v)},
                            {label: "Level 2", value: context.fields.autoCoralL2Score, setValue: (v)=>context.fields.set("autoCoralL2Score", v)},
                            {label: "Level 3", value: context.fields.autoCoralL3Score, setValue: (v)=>context.fields.set("autoCoralL3Score", v)},
                            {label: "Level 4", value: context.fields.autoCoralL4Score, setValue: (v)=>context.fields.set("autoCoralL4Score", v)}
                        ]}
                    />
                    <OnFieldMenuButton
                        id="coral-miss-menu-button"
                        label="Miss"
                        color="error"
                        menuItems={[
                            {label: "Level 1", value: context.fields.autoCoralL1Miss, setValue: (v)=>context.fields.set("autoCoralL1Miss", v)},
                            {label: "Level 2", value: context.fields.autoCoralL2Miss, setValue: (v)=>context.fields.set("autoCoralL2Miss", v)},
                            {label: "Level 3", value: context.fields.autoCoralL3Miss, setValue: (v)=>context.fields.set("autoCoralL3Miss", v)},
                            {label: "Level 4", value: context.fields.autoCoralL4Miss, setValue: (v)=>context.fields.set("autoCoralL4Miss", v)}
                        ]}
                    />
                </OnFieldButtonGroup>

            </div>
        </div>
        </>
    );
};
  
export default Auto;
