import { useContext } from "react";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { Checkbox, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ListItemTeam({ team, ...props }: { team: number } & ListItemButtonProps) {

    const navigate = useNavigate();
    
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    
    return (
        <ListItemButton onClick={()=>navigate(`/analytics/team/${team}`)} {...props}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={analyticsSettings.starredTeams.includes(team)}
                    onChange={() => analyticsSettings.toggleStarTeam(team)}
                    icon={<span className="material-symbols-outlined">star_outline</span>}
                    checkedIcon={<span className="material-symbols-outlined">star</span>}
                />
            </ListItemIcon>
            <ListItemText primary={team} />
        </ListItemButton>
    );
}