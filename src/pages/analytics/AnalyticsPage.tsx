import { useContext } from "react";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import PageTitle from "../../components/ui/PageTitle";
import { ScheduleContext } from "../../components/context/ScheduleContextProvider";
import { AnalyticsSettingsContext } from "../../components/context/AnalyticsSettingsContextProvider";

const AnalyticsPage = () => {

    const settings = useContext(SettingsContext);
    const schedule = useContext(ScheduleContext);
    const analyticsSettings = useContext(AnalyticsSettingsContext);


    return (
    <div className="w-full h-full px-4 flex flex-col items-center relative">
        <PageTitle>Analytics</PageTitle>
        
        
    </div>
    )
}

export default AnalyticsPage;