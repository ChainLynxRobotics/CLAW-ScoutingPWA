import { Button, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select } from "@mui/material";
import { NavigateOptions, Outlet, To, useNavigate } from "react-router-dom";
import { AnalyticsSettingsContext } from "../../components/context/AnalyticsSettingsContextProvider";
import { useContext, useEffect, useState } from "react";
import ListItemTeam from "../../components/analytics/ListItemTeam";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import { ScheduleContext } from "../../components/context/ScheduleContextProvider";
import ListItemTeamGroup from "../../components/analytics/ListItemTeamGroup";

export default function AnalyticsLayout() {

    const navigate = useNavigate();

    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");

    const [mobile, setMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 1024;
            if (isMobile !== mobile) setMobile(isMobile);
        }
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [mobile]);

    const [open, setOpen] = useState(false);

    function onNavigate(to: To, options?: NavigateOptions) {
        if (mobile) setOpen(false);
        navigate(to, options);
    }

    return (
        <div className="w-full h-full flex flex-col items-center relative" style={{ paddingLeft: mobile ? 0 : 240 }}>
            <Drawer
                open={mobile ? open : true}
                onClose={() => setOpen(false)}
                variant={mobile ? "temporary" : "permanent"}
                sx={{
                    '& .MuiDrawer-paperAnchorDockedLeft': { position: 'absolute' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
                keepMounted
            >
                {analyticsSettings.starredTeams.length > 0 && 
                    <List
                        aria-labelledby="starred-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="starred-list-subheader" sx={{ backgroundImage: "var(--Paper-overlay, initial);" }}>
                                Starred Teams
                            </ListSubheader>
                        }
                    >
                        {analyticsSettings.starredTeams.map(team => (
                            <ListItemTeam key={team} team={team} onNavigate={onNavigate} />
                        ))}
                    </List>
                }

                <List
                    aria-labelledby="custom-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="custom-list-subheader" sx={{ backgroundImage: "var(--Paper-overlay, initial);" }}>
                            Custom Groups
                        </ListSubheader>
                    }
                >
                    {analyticsSettings.customTeamGroups.map(group => (
                        <ListItemTeamGroup 
                            key={group.id} 
                            name={group.name} 
                            teams={group.teams} 
                            editable 
                            setGroup={(name, teams)=>analyticsSettings.setCustomTeamGroupById(group.id, {...group, name, teams})}
                            deleteGroup={()=>analyticsSettings.removeCustomTeamGroup(group)}
                            onNavigate={onNavigate}
                        />
                    ))}
                    <ListItemButton onClick={() => analyticsSettings.addCustomTeamGroup({id: Date.now(), name: "New Group", teams: []})} className="opacity-60">
                        <ListItemIcon>
                            <span className="material-symbols-outlined">add</span>
                        </ListItemIcon>
                        <ListItemText primary="Add Group" />
                    </ListItemButton>
                </List>

                <List
                    aria-labelledby="alliance-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="alliance-list-subheader" className="flex items-center gap-4" sx={{ backgroundImage: "var(--Paper-overlay, initial);" }}>
                            <div>Alliances in </div>
                            <Select
                                variant="standard"
                                value={analyticsSettings.currentMatch}
                                onChange={e => analyticsSettings.setCurrentMatch(e.target.value)}
                            >
                                {schedule.matches.map(({matchId}) => (
                                    <MenuItem key={matchId} value={matchId}>{matchId}</MenuItem>
                                ))}
                            </Select>
                        </ListSubheader>
                    }
                >
                    <ListItemTeamGroup 
                        name="Blue Alliance" 
                        teams={analyticsSettings.blueAllianceTeams} 
                        open={analyticsSettings.currentMatchBlueOpen} 
                        setOpen={analyticsSettings.setCurrentMatchBlueOpen} 
                        onNavigate={onNavigate}
                        className="!bg-blue-500 !bg-opacity-20"
                    />
                    <ListItemTeamGroup 
                        name="Red Alliance" 
                        teams={analyticsSettings.redAllianceTeams} 
                        open={analyticsSettings.currentMatchRedOpen} 
                        setOpen={analyticsSettings.setCurrentMatchRedOpen} 
                        onNavigate={onNavigate}
                        className="!bg-red-500 !bg-opacity-20"
                    />
                </List>

                <List
                    aria-labelledby="all-teams-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="all-teams-list-subheader" sx={{ backgroundImage: "var(--Paper-overlay, initial);" }}>
                            All Teams
                        </ListSubheader>
                    }
                >
                    {analyticsSettings.teamList.map(team => (
                        <ListItemTeam key={team} team={team} onNavigate={onNavigate} />
                    ))}
                </List>

            </Drawer>

            <Outlet />

            <div className="absolute top-0 left-0">
                <Button onClick={() => setOpen(!open)} 
                    variant="contained"
                    size="small"
                    color="secondary"
                    className="!rounded-tl-none !rounded-bl-none !rounded-tr-none"
                >
                    <div className="flex items-center">
                        <span>Teams</span><span className="material-symbols-outlined">{open ? "chevron_left" : "chevron_right"}</span>
                    </div>
                </Button>
            </div>
        </div>
    )
}