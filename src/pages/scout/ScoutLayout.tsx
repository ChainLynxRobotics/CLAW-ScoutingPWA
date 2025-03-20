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
import { MATCH_DATA_BLUETOOTH_BROADCAST_INTERVAL, MATCH_DATA_BLUETOOTH_BROADCAST_MAX_ENTRIES } from "../../constants";
import matchDatabase from "../../util/db/matchDatabase";
import matchCompare from "../../util/matchCompare";

const ScoutPage = () => {
    
    const settings = useContext(SettingsContext);
    const currentMatchContext = useContext(CurrentMatchContext);
    const context = useContext(ScoutingContext);
    const bluetooth = useContext(BluetoothContext);

    useEffect(() => {
        if (!settings) return;
        if (!(bluetooth?.status === BluetoothStatusEnum.CONNECTED)) return;
        const broadcast = () => {
            bluetooth?.broadcastClientID(settings?.clientId, settings.scoutName);
        }
        const interval = setInterval(broadcast, 5000);
        broadcast();
        return () => clearInterval(interval);
    }, [settings, bluetooth?.status, bluetooth?.broadcastClientID]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!settings) return;
        if (!(bluetooth?.status === BluetoothStatusEnum.CONNECTED)) return;
        const broadcast = async () => {
            const matchIds = await matchDatabase.getAllIdsByCompetition(settings.competitionId);
            if (matchIds.length === 0) return;
            let matches = await matchDatabase.getMultiple(matchIds);
            matches = matches.sort((a, b) => matchCompare(b.matchId, a.matchId));
            if (matches.length > MATCH_DATA_BLUETOOTH_BROADCAST_MAX_ENTRIES) {
                matches = matches.slice(0, MATCH_DATA_BLUETOOTH_BROADCAST_MAX_ENTRIES);
            }
            bluetooth?.broadcastMatchData(matches);
        }
        const interval = setInterval(broadcast, MATCH_DATA_BLUETOOTH_BROADCAST_INTERVAL);
        return () => clearInterval(interval);
    }, [settings, bluetooth?.status]); // eslint-disable-line react-hooks/exhaustive-deps

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

  