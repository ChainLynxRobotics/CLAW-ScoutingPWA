import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import { CurrentMatchContext } from "../../components/context/CurrentMatchContextProvider";
import ConfettiDisplay from "../../components/ui/ConfettiDisplay";
import WakeLock from "../../components/ui/WakeLock";
import ScoutNavBar from "../../components/ScoutNavBar";
import { BluetoothContext } from "../../components/context/BluetoothContextProvider";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import { BluetoothStatusEnum } from "../../types/RadioPacketData";

const ScoutPage = () => {
    
    const settings = useContext(SettingsContext);
    const currentMatchContext = useContext(CurrentMatchContext);
    const context = useContext(ScoutingContext);
    const bluetooth = useContext(BluetoothContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!settings) return;
            if (!(bluetooth?.status === BluetoothStatusEnum.CONNECTED)) return;
            bluetooth?.broadcastClientID(settings?.clientId, settings.scoutName);
        }, 5000);
        return () => clearInterval(interval);
    }, [settings, bluetooth]);

    return (
        <div className="w-full h-full flex flex-col relative">
            {context ?
                <>
                    <Outlet />
                    <div className="pt-24 w-full"></div>
                    <ScoutNavBar />
                </>
            :
                <NoMatchAvailable />
            }
            {currentMatchContext?.showConfetti && 
                <ConfettiDisplay />
            }
            <WakeLock />
        </div>
    );
};
  
export default ScoutPage;

  