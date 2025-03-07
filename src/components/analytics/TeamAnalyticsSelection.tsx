import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, SelectProps, TextField } from "@mui/material"
import { useSnackbar } from "notistack";
import { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import AnalyticsSettings from "./AnalyticsSettings";

export default function TeamAnalyticsSelection({ teams, minusTeams, onUpdate }: { teams: number[], minusTeams?: number[], onUpdate: (teams: number[], minusTeams?: number[]) => void }) {
    
    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();

    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");

    const [modalOpen, setModalOpen] = useState(false)

    const [teamsStr, setTeamsStr] = useState(teams.join(', '))
    useEffect(() => setTeamsStr(teams.join(', ')), [teams])
    const [minusTeamsStr, setMinusTeamsStr] = useState(minusTeams?.join(', ') || '')
    useEffect(() => setMinusTeamsStr(minusTeams?.join(', ') || ''), [minusTeams])

    function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            if (!teamsStr) throw new Error("Teams cannot be empty");

            if (teamsStr.match(/[^0-9,\s]/)) throw new Error("Teams must be numbers separated by commas or spaces");
            else if (minusTeamsStr.match(/[^0-9,\s]/)) throw new Error("Compare-to Teams must be numbers separated by commas or spaces");

            const newTeams = teamsStr.split(/[\s,]+/).filter((team: string) => team.length > 0).map((team: string) => parseInt(team));
            const newMinusTeams = minusTeamsStr.split(/[\s,]+/).filter((team: string) => team.length > 0).map((team: string) => parseInt(team));
            onUpdate(newTeams, newMinusTeams.length > 0 ? newMinusTeams : undefined);
            setModalOpen(false);
        } catch (e) {
            if (e instanceof Error) enqueueSnackbar(e.message, {variant: "error"});
            console.error(e);
        }
    }

    function switchTeams() {
        if (!minusTeams || !minusTeams.length) return;
        onUpdate(minusTeams, teams);
    }
    
    return (
        <h1 className="text-xl mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="whitespace-nowrap">Analytics for: </span>
            
            <TeamAnalyticsSelectMenu
                current={teams.join('+')}
                label={"Team"+(teams.length === 1 ? "" : "s")}
                labelId="teams-select-label"
                id="teams-select"
                value={teams?.join('+') || ''}
                onChange={(e) => {
                    if (!e.target.value) return;
                    navigate(`/analytics/team/${e.target.value}` + (minusTeams ? `/vs/${minusTeams.join('+')}` : ''));
                    e.target.value = '';
                }}
            />

            <span className="whitespace-nowrap"> compared to </span>

            <TeamAnalyticsSelectMenu
                current={minusTeams?.join('+')||""}
                allowNone
                label={"Other Team"+(minusTeams?.length === 1 ? "" : "s")}
                labelId="compare-to-select-label"
                id="compare-to-select"
                value={minusTeams?.join('+') || ''}
                onChange={(e) => {
                    if (!e.target.value) return navigate(`/analytics/team/${teams.join('+')}`);
                    navigate(`/analytics/team/${teams.join('+')}/vs/${e.target.value}`);
                    e.target.value = '';
                }}
            />
            
            <div className="flex items-center">
                <Button onClick={() => setModalOpen(true)} color="primary">
                    <span className="material-symbols-outlined">edit_note</span>
                </Button>
                <Button onClick={() => switchTeams()} disabled={!minusTeams || !minusTeams.length} color="warning">
                    <span className="material-symbols-outlined">compare_arrows</span>
                </Button>
                <AnalyticsSettings />
            </div>


            <Dialog 
                open={modalOpen} 
                onClose={() => setModalOpen(false)}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit,
                    },
                }}
            >
                <DialogTitle id="create-group-modal-title">Edit Group</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="teams"
                        name="teams"
                        label="Teams (separated by commas or spaces)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={teamsStr}
                        onChange={e => setTeamsStr(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="minusTeams"
                        name="minusTeams"
                        label="Compare to Teams"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={minusTeamsStr}
                        onChange={e => setMinusTeamsStr(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setModalOpen(false)}>Cancel</Button>
                    <Button color="success" type="submit">Save</Button>
                </DialogActions>
            </Dialog>
        </h1>
    )
}

function TeamAnalyticsSelectMenu({ allowNone, current, ...props }: SelectProps & { allowNone?: boolean, current?: string }) {

    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");

    const allValues = useMemo(() => [
        ...analyticsSettings.starredTeams.map(team => team.toString()),
        analyticsSettings.blueAllianceTeams.length > 0 && analyticsSettings.blueAllianceTeams.map(team => team.toString()).join('+'),
        analyticsSettings.blueAllianceTeams.length > 0 && analyticsSettings.redAllianceTeams.map(team => team.toString()).join('+'),
        ...analyticsSettings.customTeamGroups.map(group => group.teams.join('+')),
        ...analyticsSettings.teamList.map(team => team.toString()),
    ], [analyticsSettings]);

    return (
        <FormControl sx={{ m: 1, minWidth: 148 }} size="small">
            <InputLabel id={props.labelId}>{props.label}</InputLabel>
            <Select
                {...props}
            >
                {allowNone &&
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                }
                {(current && !allValues.includes(current)) &&
                    <MenuItem value={current}>
                        {current.replace('+', ', ')}
                    </MenuItem>
                }
                <Divider />
                {analyticsSettings.starredTeams.map(team => 
                    <MenuItem key={team} value={team}>
                        {team}
                    </MenuItem>
                )}
                {analyticsSettings.starredTeams.length > 0 &&
                    <Divider />
                }
                {analyticsSettings.blueAllianceTeams.length > 0 &&
                    <MenuItem value={analyticsSettings.blueAllianceTeams.join('+')}>
                        Blue Alliance in {analyticsSettings.currentMatch}
                        <span className="text-xs text-gray-400"> ({analyticsSettings.blueAllianceTeams.join(', ')})</span>
                    </MenuItem>
                }
                {analyticsSettings.redAllianceTeams.length > 0 &&
                    <MenuItem value={analyticsSettings.redAllianceTeams.join('+')}>
                        Red Alliance in {analyticsSettings.currentMatch}
                        <span className="text-xs text-gray-400"> ({analyticsSettings.redAllianceTeams.join(', ')})</span>
                    </MenuItem>
                }
                {(analyticsSettings.blueAllianceTeams.length > 0  || analyticsSettings.redAllianceTeams.length > 0) &&
                    <Divider />
                }
                {analyticsSettings.customTeamGroups.map(group =>
                    <MenuItem key={group.id} value={group.teams.join('+')}>
                        {group.name}
                        <span className="text-xs text-gray-400"> ({group.teams.join(', ')})</span>
                    </MenuItem>
                )}
                {analyticsSettings.customTeamGroups.length > 0 &&
                    <Divider />
                }
                {analyticsSettings.teamList.map(team =>
                    <MenuItem key={team} value={team}>
                        {team}
                    </MenuItem>
                )}
            </Select>
        </FormControl>
    )
}