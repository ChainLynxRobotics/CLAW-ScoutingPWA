import { useContext } from "react";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { Checkbox, ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";
import { NavigateOptions, To } from "react-router-dom";

export default function ListItemTeam({ team, onNavigate, ...props }: { team: number, onNavigate?: (to: To, options?: NavigateOptions)=>void } & ListItemButtonProps) {
    
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    
    return (
        <ListItemButton onClick={()=>onNavigate?.(`/analytics/team/${team}`)} {...props}>
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