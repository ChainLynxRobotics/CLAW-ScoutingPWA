import { useContext, useMemo, useState } from "react";
import { AnalyticsSettingsContext } from "../context/AnalyticsSettingsContextProvider";
import { Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemButtonProps, ListItemText, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ListItemTeam from "./ListItemTeam";
import { useSnackbar } from "notistack";

type Props = {
    name: string,
    teams: number[],
    defaultOpen?: boolean,
    open?: boolean, // If open is undefined, it will be managed by the component, otherwise it will be controlled by the parent
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>,
    editable?: boolean,
    setGroup?: (name: string, teams: number[]) => void,
    deleteGroup?: () => void,
} & ListItemButtonProps;

export default function ListItemTeamGroup({ name, teams, defaultOpen, open, setOpen, editable, setGroup, deleteGroup, ...props }: Props) {

    const navigate = useNavigate();
    const {enqueueSnackbar} = useSnackbar();
    
    const analyticsSettings = useContext(AnalyticsSettingsContext);
    if (!analyticsSettings) throw new Error("AnalyticsSettingsContext not found");

    const [mangedOpen, setManagedOpen] = useState(defaultOpen ?? false);

    const actuallyOpen = useMemo(() => open ?? mangedOpen, [open, mangedOpen]);
    const setActuallyOpen = useMemo(() => setOpen ?? setManagedOpen, [setOpen, setManagedOpen]);


    const [modalOpen, setModalOpen] = useState(false);
    
    return (
        <>
            <ListItemButton onClick={() => setActuallyOpen(!actuallyOpen)} {...props}>
                <ListItemText slots={{primary: "button"}} primary={name} onClick={(e)=>{e.stopPropagation(); if (teams.length !== 0) navigate(`/analytics/team/${teams.join('+')}`)}} tabIndex={0} />
                {editable &&
                    <button onClick={()=>setModalOpen(true)} tabIndex={0}>
                        <span className="material-symbols-outlined">edit</span>
                    </button>
                }
                <div>
                    {actuallyOpen ? <span className="material-symbols-outlined">keyboard_arrow_down</span> : <span className="material-symbols-outlined">chevron_right</span>}
                </div>
            </ListItemButton>
            <Collapse in={actuallyOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {teams.map(team => (
                        <ListItemTeam key={team} team={team} sx={{ pl: 4 }} />
                    ))}
                </List>
            </Collapse>
            {editable &&
                <Dialog
                    open={modalOpen}
                    onClose={()=>setModalOpen(false)}
                    aria-labelledby="create-group-modal-title"
                    slotProps={{
                        paper: {
                            component: 'form',
                            onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                                event.preventDefault();
                                try {
                                    const formData = new FormData(event.currentTarget);
                                    const formJson = Object.fromEntries((formData as any).entries()); // eslint-disable-line @typescript-eslint/no-explicit-any
                                    setGroup?.(formJson.name, formJson.teams.split(/[\s,]+/).filter((team: string) => team.length > 0).map((team: string) => parseInt(team)));
                                    setModalOpen(false);
                                } catch (e) {
                                    if (e instanceof Error) enqueueSnackbar(e.message, {variant: "error"});
                                    console.error(e);
                                }
                            },
                        },
                    }}
                >
                    <DialogTitle id="create-group-modal-title">Edit Group</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            name="name"
                            label="Group Name"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={name}
                        />
                        <TextField
                            margin="dense"
                            id="teams"
                            name="teams"
                            label="Teams (separated by commas or spaces)"
                            type="text"
                            fullWidth
                            variant="standard"
                            defaultValue={teams.join(",")}
                        />
                        <Button color="error" onClick={deleteGroup} className="!mt-8">Delete Group</Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={()=>setModalOpen(false)}>Cancel</Button>
                        <Button color="success" type="submit">Save</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    );
}