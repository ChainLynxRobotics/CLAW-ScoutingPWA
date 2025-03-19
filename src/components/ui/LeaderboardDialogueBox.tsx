import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, ButtonProps } from "@mui/material";
import React, { useMemo } from "react";
import { MatchDataHeader } from "../../types/MatchData";

type LeadersProps = {
    data: (MatchDataHeader & { scoutName: string })[] | undefined;
} & ButtonProps;

export default function AlertDialog({ data, ...props}: LeadersProps) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const map = useMemo(() => {
        return data?.reduce((acc, elm) => {
            if (elm.scoutName === "") return acc;

            if(elm.scoutName in acc){
                acc[elm.scoutName] += 1;
            } else {
                acc[elm.scoutName] = 1;
            }
            return acc;
        }, {} as Record<string, number>); // eslint-disable-line @typescript-eslint/no-explicit-any
    }, [data]);

    const leaderboard = useMemo(() => {
        if (map === undefined) return [];
        return Object.entries(map).sort((a, b) => b[1] - a[1]);
    }, [map]);

    return (
        <React.Fragment>
            <Button variant="contained" color="secondary" onClick={handleClickOpen} {...props}>
                Open Leaderboard
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="leaderboard-dialog-title"
            >
                <DialogTitle id="leaderboard-dialog-title">
                    Leaderboard
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Scout Name</TableCell>
                                    <TableCell>Matches Scouted</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaderboard.map((row) => (
                                    <TableRow
                                        key={row[0]}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row[0]}
                                        </TableCell>
                                        <TableCell>{row[1]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}