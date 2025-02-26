import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, MenuItem, Select } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AnalyticsSettingsContext } from "../../components/context/AnalyticsSettingsContextProvider";
import { useContext, useEffect, useMemo, useState } from "react";
import ListItemTeam from "../../components/analytics/ListItemTeam";
import { SettingsContext } from "../../components/context/SettingsContextProvider";
import matchDatabase from "../../util/db/matchDatabase";
import { ScheduleContext } from "../../components/context/ScheduleContextProvider";
import ListItemTeamGroup from "../../components/analytics/ListItemTeamGroup";

export default function AnalyticsLayout() {

    const settings = useContext(SettingsContext);
    if (!settings) throw new Error("SettingsContext not found");
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");
    const schedule = useContext(ScheduleContext);
    if (!schedule) throw new Error("ScheduleContext not found");


    return (
        <div className="w-full h-full flex flex-col items-center relative" style={{ paddingLeft: 240 }}>
            <Drawer
                open
                variant="permanent"
                sx={{
                    '& .MuiDrawer-paperAnchorDockedLeft': { position: 'absolute' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {analyticsSettings.starredTeams.length > 0 && 
                    <List
                        aria-labelledby="starred-list-subheader"
                        subheader={
                            <ListSubheader component="div" id="starred-list-subheader" >
                                Starred Teams
                            </ListSubheader>
                        }
                    >
                        {analyticsSettings.starredTeams.map(team => (
                            <ListItemTeam key={team} team={team} />
                        ))}
                    </List>
                }

                <List
                    aria-labelledby="custom-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="custom-list-subheader">
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
                        <ListSubheader component="div" id="alliance-list-subheader" className="flex items-center gap-4">
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
                        className="!bg-blue-500 !bg-opacity-20"
                    />
                    <ListItemTeamGroup 
                        name="Red Alliance" 
                        teams={analyticsSettings.redAllianceTeams} 
                        open={analyticsSettings.currentMatchRedOpen} 
                        setOpen={analyticsSettings.setCurrentMatchRedOpen} 
                        className="!bg-red-500 !bg-opacity-20"
                    />
                </List>

                <List
                    aria-labelledby="all-teams-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="all-teams-list-subheader">
                            All Teams
                        </ListSubheader>
                    }
                >
                    {analyticsSettings.teamList.map(team => (
                        <ListItemTeam key={team} team={team} />
                    ))}
                </List>

            </Drawer>

            <Outlet />
        </div>
    )
}