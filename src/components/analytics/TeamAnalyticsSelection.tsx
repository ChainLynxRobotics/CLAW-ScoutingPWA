import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useSnackbar } from "notistack";
import { useState } from "react"

export default function TeamAnalyticsSelection({ teams, minusTeams, onUpdate }: { teams: number[], minusTeams?: number[], onUpdate: (teams: number[], minusTeams?: number[]) => void }) {
    
    const {enqueueSnackbar} = useSnackbar();

    const [modalOpen, setModalOpen] = useState(false)

    const [teamsStr, setTeamsStr] = useState(teams.join(', '))
    const [minusTeamsStr, setMinusTeamsStr] = useState(minusTeams?.join(', ') || '')

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
    
    return (
        <h1 className="text-xl my-4 flex items-center gap-2">
            <span>Analytics for: </span>
            <b>
                {teams.map((team, i) => (
                    <span key={team}>
                        <a href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                        {i < teams.length - 1 && ', '}
                    </span>
                ))}
            </b>
            {minusTeams && <span> vs. </span>}
            {minusTeams && 
                <b>
                    {minusTeams.map((team, i) => (
                        <span key={team}>
                            <a href={`https://www.thebluealliance.com/team/${team}`} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-500">{team}</a>
                            {i < minusTeams.length - 1 && ', '}
                        </span>
                    ))}
                </b> 
            }
            <Button onClick={() => setModalOpen(true)}>
                <span className="material-symbols-outlined">edit</span>
            </Button>
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