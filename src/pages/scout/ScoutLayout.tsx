import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ScoutingContext from "../../components/context/ScoutingContext";
import NoMatchAvailable from "./NoMatchAvailable";
import { Alert, Button, ButtonGroup } from "@mui/material";
import CurrentMatchContext from "../../components/context/CurrentMatchContext";
import SettingsContext from "../../components/context/SettingsContext";
import ConfettiDisplay from "../../components/ui/ConfettiDisplay";
import WakeLock from "../../components/ui/WakeLock";
import ScoutNavBar from "../../components/ScoutNavBar";

const ScoutPage = () => {
    
    const settings = useContext(SettingsContext);
    if (settings === undefined) throw new Error("SettingsContext not found");
    
    const currentMatchContext = useContext(CurrentMatchContext);
    const context = useContext(ScoutingContext);

    useEffect(() => {
        if (currentMatchContext?.hasUpdate) {
            setWarningDismissed(false);
        }
    }, [currentMatchContext?.hasUpdate]);

    useEffect(() => {
        if (currentMatchContext?.hasUpdate && !context) {
            currentMatchContext?.update();
        }
    }, [currentMatchContext, context]);

    const [warningDismissed, setWarningDismissed] = useState(false);

    return (
        <div className="w-full h-full flex flex-col relative">
            {context ?
                <>
                    <Outlet />
                    <div className="pt-16 w-full"></div>
                    <ScoutNavBar />
                </>
            :
                <NoMatchAvailable />
            }
            {currentMatchContext?.showConfetti && 
                <ConfettiDisplay />
            }
            {currentMatchContext?.hasUpdate && !(settings.matches.length == 0 || settings.currentMatchIndex >= settings.matches.length) &&
                <div className={"fixed bottom-16 right-0 pr-2 transition-transform "+(warningDismissed ? 'translate-x-[90%]' : '')} onClick={()=>setWarningDismissed(false)}>
                    <Alert severity="warning" className="w-full max-w-lg mx-auto" onClose={(e)=>{setWarningDismissed(true);e.stopPropagation();}}>
                        <div className="mb-1">The schedule has been updated, click to update button below to reflect your changes here, but be warned it will delete any scouting that is in-progress.</div>
                        <Button variant="contained" color="warning" size="small" onClick={() => currentMatchContext?.update()}>Update</Button>
                    </Alert>
                </div>
            }
            <WakeLock />
        </div>
    );
};
  
export default ScoutPage;

  