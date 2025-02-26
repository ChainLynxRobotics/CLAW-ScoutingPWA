import { useMemo } from "react";
import { useParams } from "react-router-dom";
import TeamAnalytics from "../../components/analytics/TeamAnalytics";

const AnalyticsPage = () => {

    const { teams: strTeams, minusTeams: strMinusTeams } = useParams();

    // Team list from URL, numbers separated by '+', all of them are are added up for the statistic
    const teams = useMemo(() => {
        if (!strTeams) throw new Error("No teams provided");
        if (strTeams.match(/[^0-9+]/)) throw new Error("Invalid team list");
        return strTeams.split("+").filter(v=>!!v).map(team => parseInt(team));
    }, [strTeams]);

    // Team list from URL, numbers separated by '+', all of them are subtracted from the statistic
    const minusTeams = useMemo(() => {
        if (!strMinusTeams) return undefined;
        if (strMinusTeams.match(/[^0-9+]/)) throw new Error("Invalid comparison team list");
        return strMinusTeams.split("+").filter(v=>!!v).map(team => parseInt(team));
    }, [strMinusTeams]);


    return (
        <div className="w-full h-full p-4">
            <TeamAnalytics teams={teams} minusTeams={minusTeams} />
        </div>
    )
}

export default AnalyticsPage;