import { useContext, useState } from "react";
import { SettingsContext } from "../components/context/SettingsContextProvider";
import ErrorPage from "./ErrorPage";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import MatchSchedule from "../components/MatchSchedule";
import QrCodeList from "../components/qr/QrCodeList";
import QrCodeScanner from "../components/qr/QrCodeScanner";
import LoadingBackdrop from "../components/ui/LoadingBackdrop";
import { useSnackbar } from "notistack";
import QrCodeType from "../enums/QrCodeType";
import { QRCodeData } from "../types/QRCodeData";
import { getSchedule } from "../util/blueAllianceApi";
import PageTitle from "../components/ui/PageTitle";
import { ScheduleContext } from "../components/context/ScheduleContextProvider";

const SchedulePage = () => {

    const settings = useContext(SettingsContext);
    const schedule = useContext(ScheduleContext);
    const {enqueueSnackbar} = useSnackbar();

    // QR code sending and receiving
    const [qrData, setQrData] = useState<QRCodeData>();
    const [scannerOpen, setScannerOpen] = useState(false);

    const [infoOpen, setInfoOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

    const [loading, setLoading] = useState(false);


    function nextMatch() {
        schedule?.setCurrentMatchIndex(Math.min(schedule.currentMatchIndex+1, schedule.matches.length-1));
    }

    function previousMatch() {
        schedule?.setCurrentMatchIndex(Math.max(schedule.currentMatchIndex-1, 0));
    }


    const openQrCodes = () => {
        if (!settings || !schedule) return;
        const data: QRCodeData = {
            qrType: QrCodeType.Schedule,
            version: APP_VERSION,
            scheduleData: {
                schedule: schedule.matches,
                fieldRotated: settings.fieldRotated,
                competitionId: settings.competitionId,
                currentMatch: schedule.currentMatchIndex
            }
        };
        setQrData(data);
    }

    function onQrData(data: QRCodeData) {
        if (data.qrType !== QrCodeType.Schedule || !data.scheduleData) 
            throw new Error("QR Codes do not contain schedule data");
        if (!settings || !schedule) return;
        schedule.setMatches(data.scheduleData.schedule);
        settings.setFieldRotated(data.scheduleData.fieldRotated);
        settings.setCompetitionId(data.scheduleData.competitionId);
        schedule.setCurrentMatchIndex(data.scheduleData.currentMatch);
        setScannerOpen(false);
    }

    const downloadMatches = async () => {
        if (!settings || !schedule) return;

        setLoading(true);
        try {
            const matches = await getSchedule(settings.competitionId)
            schedule.setMatches(matches);
            schedule.setCurrentMatchIndex(Math.min(schedule.currentMatchIndex, matches.length));
            enqueueSnackbar("Schedule downloaded from blue alliance", {variant: "success"});
        } catch (err) {
            console.error("Failed to get schedule from blue alliance", err);
            enqueueSnackbar(err+"", {variant: "error"});
        }
        setLoading(false);
    }

    const deleteAllMatches = () => {
        if (!schedule) return;

        schedule.setMatches([]);
        schedule.setCurrentMatchIndex(0);

        setDeleteConfirmOpen(false);
        enqueueSnackbar("All scheduled matches have been deleted", {variant: "success"});
    }

    if (!settings) return (<ErrorPage msg="Settings context not found?!?!?!" />)
    return (
        <div className="w-full flex flex-col items-center gap-5 px-4">
            <PageTitle>Match Schedule</PageTitle>
            
            <div className="flex flex-wrap gap-4">
                <Button variant="contained" onClick={()=>setScannerOpen(true)} startIcon={<span className="material-symbols-outlined">photo_camera</span>}>Scan</Button>
                <Button variant="contained" color="secondary" onClick={openQrCodes} startIcon={<span className="material-symbols-outlined">qr_code_2</span>}>Share</Button>
                <IconButton onClick={()=>setInfoOpen(true)}>
                    <span className="material-symbols-outlined">info</span>
                </IconButton>
            </div>
            <div className="flex flex-wrap gap-4">
                <Button variant="outlined" color="primary" onClick={downloadMatches}>Download from BlueAlliance</Button>
            </div>
            <div className="flex flex-col items-center w-full mb-4 mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <div>Current Match: </div>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="small" 
                        onClick={previousMatch} 
                        startIcon={<span className="material-symbols-outlined">keyboard_double_arrow_up</span>}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="small" 
                        onClick={nextMatch} 
                        startIcon={<span className="material-symbols-outlined">keyboard_double_arrow_down</span>}
                    >
                        Next
                    </Button>
                </div>
                <div className="max-w-sm mb-2 text-center text-secondary text-sm">Tap on the ID column below or use the buttons above to switch to the current match.</div>
                <MatchSchedule />

                <Divider style={{marginTop: "64px"}}/>

                <div className="flex mt-4 mb-12 gap-4">
                    <Button variant="outlined" color="error" size="small" onClick={()=>setDeleteConfirmOpen(true)}>Delete Schedule</Button>
                </div>
            </div>

            {/* Info popup */}
            <Dialog 
                open={infoOpen} 
                onClose={()=>setInfoOpen(false)}
                aria-labelledby="info-dialog-title"
                maxWidth="sm"
            >
                <DialogTitle id="info-dialog-title">
                    Information
                </DialogTitle>
                <DialogContent>
                    <ul className="text-md list-disc pl-2">
                        <li>One device is designated as the &quot;host&quot; device.</li>
                        <li>If you are NOT the host device, click on &quot;Scan&quot; to get the schedule from the host device.</li>
                        <li>If you ARE the host, click the download button below to get a copy from blue alliance, then click &quot;Share&quot; to generate qr codes for other devices to scan.</li>
                        <li>Sharing the qr code also shares the Competition ID and the field rotation.</li>
                    </ul>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setInfoOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
            
            {/* Share match popup */}
            <Dialog
                open={qrData !== undefined}
                onClose={() => {setQrData(undefined)}}
                aria-labelledby="share-dialog-title"
                fullScreen
            >
                <DialogTitle id="share-dialog-title">
                    Share Schedule
                </DialogTitle>
                <DialogContent sx={{scrollSnapType: "y mandatory"}}>
                    <div className="w-full flex flex-col items-center">
                        <div className="w-full max-w-xl">
                            <p className="text-center">Scan the following QR code(s) on copy this schedule onto other devices</p>
                            {qrData && <QrCodeList data={qrData} allowTextCopy />}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={() => {setQrData(undefined)}}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Scan schedule popup */}
            <Dialog
                open={scannerOpen}
                onClose={() => {setScannerOpen(false)}}
                aria-labelledby="scan-dialog-title"
                fullScreen
            >
                <DialogTitle id="scan-dialog-title">
                    Collect Schedule Data
                </DialogTitle>
                <DialogContent sx={{paddingX: 0}}>
                    <div className="">
                        <div className="w-full max-w-xl">
                            <QrCodeScanner onReceiveData={onQrData} allowTextPaste />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={() => {setScannerOpen(false)}}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Delete all matches confirmation */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={() => {setDeleteConfirmOpen(false)}}
                aria-labelledby="delete-confirm-title"
            >
                <DialogTitle id="delete-confirm-title">
                    Reset Match Schedule?
                </DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the schedule?</p>
                    <i>(This does not delete the scouting data for those matches)</i>
                </DialogContent>
                <DialogActions>
                    <Button size="large" color="error" onClick={deleteAllMatches}>Delete</Button>
                    <Button size="large" color="secondary" onClick={() => {setDeleteConfirmOpen(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Loading spinner */}
            <LoadingBackdrop open={loading} onClick={()=>setLoading(false)} /> {/* Allow clicking to close backdrop in case there is no connection */}
        </div>
    )
};

export default SchedulePage;
