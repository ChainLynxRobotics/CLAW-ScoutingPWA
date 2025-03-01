import { useContext } from "react";
import { Outlet } from "react-router-dom";
import { ScoutingContext } from "../../components/context/ScoutingContextProvider";
import NoMatchAvailable from "./NoMatchAvailable";
import { CurrentMatchContext } from "../../components/context/CurrentMatchContextProvider";
import ConfettiDisplay from "../../components/ui/ConfettiDisplay";
import WakeLock from "../../components/ui/WakeLock";
import ScoutNavBar from "../../components/ScoutNavBar";

const ScoutPage = () => {
    
    const currentMatchContext = useContext(CurrentMatchContext);
    const context = useContext(ScoutingContext);

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

  