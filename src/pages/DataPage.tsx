import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import matchDatabase from "../util/db/matchDatabase";
import { MatchIdentifier } from "../types/MatchData";
import QrCodeType from "../enums/QrCodeType";
import zip from "../util/io/zip";
import useLocalStorageState from "../components/hooks/localStorageState";
import matchCompare from "../util/matchCompare";
import FileSaver from "file-saver";
import SettingsContext from "../components/context/SettingsContext";
import { QRCodeData } from "../types/QRCodeData";
import QrCodeList from "../components/qr/QrCodeList";
import QrCodeScanner from "../components/qr/QrCodeScanner";
import DataList from "../components/DataList";
import { useSnackbar } from "notistack";
import LoadingBackdrop from "../components/ui/LoadingBackdrop";
import bluetooth from "../util/io/bluetooth";
import bluetoothServer from "../util/io/bluetoothServer";
import PageTitle from "../components/ui/PageTitle";

const DataPage = () => {

    const settings = useContext(SettingsContext);

    const [entries, setEntries] = useState<MatchIdentifier[]|undefined>(undefined);
    const [readentries, setReadEntries] = useLocalStorageState<number[]>([], "dataReadMatches"); 

    const [qrData, setQrData] = useState<QRCodeData>(); // Signals the qr code data to be generated
    const [scannerOpen, setScannerOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const {enqueueSnackbar} = useSnackbar();

    async function updateEntries() {
        const allEntries = await matchDatabase.getAllHeaders();
        setEntries(allEntries.sort((a, b) => -matchCompare(a.matchId, b.matchId)));
        return allEntries;
    }

    useEffect(() => {
        updateEntries();
    }, []);

    const bluetoothSupported = bluetoothServer.isSupported();

    const [anchorElInput, setAnchorElInput] = useState<null | HTMLElement>(null);
    const openInput = Boolean(anchorElInput);
    const handleClickInput = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElInput(event.currentTarget);
    };
    const handleCloseInput = () => {
        setAnchorElInput(null);
    };

    const [anchorElOutput, setAnchorElOutput] = useState<null | HTMLElement>(null);
    const openOutput = Boolean(anchorElOutput);
    const handleClickOutput = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElOutput(event.currentTarget);
    };
    const handleCloseOutput = () => {
        setAnchorElOutput(null);
    };

    async function openQrData() {
        setLoading(true);
        try {
            const allEntries = (await matchDatabase.getAll()).filter((match) => !readentries.includes(match.id));
            
            if (allEntries.length === 0) throw new Error("No new data to share");
            
            const data: QRCodeData = {
                qrType: QrCodeType.MatchData,
                version: APP_VERSION,
                matchScoutingData: {
                    entries: allEntries,
                }
            };

            setQrData(data);
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    // Decodes a fully assembled qr code and imports the match data
    async function onQrData(data: QRCodeData) {
        if (data.qrType !== QrCodeType.MatchData || !data.matchScoutingData) throw new Error("QR Codes do not contain match data");
        setScannerOpen(false);
        
        setLoading(true);
        try {
            const count = data.matchScoutingData.entries.length || 0;
            const imported = await matchDatabase.putAll(data.matchScoutingData.entries);
            await updateEntries();
            enqueueSnackbar(`Imported ${imported} entries ${imported != count ? `(${count - imported} duplicates were omitted)` : ''}`, {variant: "success"});
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    async function broadcastData() {
        setLoading(true);
        try {
            if (!bluetoothServer.isConnected()) throw new Error("Connect to a radio using the bluetooth button first");

            const allEntries = await matchDatabase.getAll();
            if (allEntries.length === 0) throw new Error("No data to share");
            
            await bluetooth.broadcastMatchData(allEntries, ()=>{
                enqueueSnackbar("Match data sent successfully", {variant: "success"});
            }, (e)=>{
                enqueueSnackbar("Error sending data: "+e, {variant: "error"});
            });
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    async function requestData() {
        setLoading(true);
        try {
            if (!bluetoothServer.isConnected()) throw new Error("Connect to a radio using the bluetooth button first");

            const knownMatches = await matchDatabase.getAllIds();
            
            await bluetooth.requestMatchData(settings!.competitionId, knownMatches, ()=>{
                enqueueSnackbar("Sent request, awaiting responses", {variant: "success"});
            }, (e)=>{
                enqueueSnackbar("Error sending request: "+e, {variant: "error"});
            });
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    async function exportData() {
        if (entries?.length === 0) return enqueueSnackbar("No data to export", {variant: "error"});

        setLoading(true);
        try {
            const allEntries = await matchDatabase.getAll();

            const blob = await zip.exportDataAsZip(allEntries);
            const date = new Date();

            FileSaver.saveAs(blob, 
                `Scouting Data - ${settings?.scoutName || 'No Name'} - ${date.toISOString().replace(/:/g,'-')}.zip`); // replace colons with dashes to avoid file system issues
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    const fileUpload = useRef<HTMLInputElement>(null);

    async function importData() {
        console.log("Importing data");
        if (fileUpload.current?.files?.length === 0) return;
        const file = fileUpload.current?.files?.item(0);
        if (!file) return;

        setLoading(true);
        try {
            const data = await zip.importDataFromZip(file);
            
            const count = data.entries.length || 0;
            const imported = await matchDatabase.putAll(data.entries);
            await updateEntries();
            enqueueSnackbar(`Imported ${imported} entries ${imported != count ? `(${count - imported} duplicates were omitted)` : ''}`, {variant: "success"});
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }


    async function deleteItems(selected: number[]) {
        setLoading(true);
        try {
            await matchDatabase.removeAll(selected);
            await updateEntries();
        } catch (e) {
            console.error(e);
            enqueueSnackbar(e+"", {variant: "error"});
        }
        setLoading(false);
    }

    function markNew(selected: number[]) {
        const newRead = readentries.filter(e => !selected.includes(e));
        setReadEntries(newRead);
    }

    function markRead(selected: number[]) {
        const newReadEntries = [...readentries, ...(entries||[]).map(e=>e.id).filter(e=>selected.includes(e)&&!readentries.includes(e))];
        setReadEntries(newReadEntries);
    }

    return (
    <div className="w-full flex flex-col items-center text-center">

        <PageTitle>Data Page</PageTitle>

        <div className="mb-4 flex gap-8">
            <Button 
                id="output-menu-button"
                variant="contained"
                color="primary"
                onClick={handleClickOutput} 
                startIcon={<span className="material-symbols-outlined">share</span>}
            >
                Share
            </Button>
            <Menu
                id="export-menu"
                anchorEl={anchorElOutput}
                open={openOutput}
                onClose={handleCloseOutput}
                MenuListProps={{
                    'aria-labelledby': 'output-menu-button',
                }}
            >
                <MenuItem onClick={openQrData}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">qr_code_2</span>
                    </ListItemIcon>
                    <ListItemText>QR Code</ListItemText>
                </MenuItem>
                <MenuItem onClick={broadcastData} disabled={!bluetoothSupported}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">cloud_upload</span>
                    </ListItemIcon>
                    <ListItemText>Bluetooth</ListItemText>
                </MenuItem>
                <MenuItem onClick={exportData}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">download</span>
                    </ListItemIcon>
                    <ListItemText>ZIP File</ListItemText>
                </MenuItem>
            </Menu>
            <Button 
                id="input-menu-button"
                variant="contained"
                color="primary"
                onClick={handleClickInput} 
                startIcon={<span className="material-symbols-outlined">download</span>}
            >
                Import
            </Button>
            <Menu
                id="input-menu"
                anchorEl={anchorElInput}
                open={openInput}
                onClose={handleCloseInput}
                MenuListProps={{
                    'aria-labelledby': 'input-menu-button',
                }}
            >
                <MenuItem onClick={() => setScannerOpen(true)}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">photo_camera</span>
                    </ListItemIcon>
                    <ListItemText>QR Code</ListItemText>
                </MenuItem>
                <MenuItem onClick={requestData} disabled={!bluetoothSupported}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">cloud_download</span>
                    </ListItemIcon>
                    <ListItemText>Bluetooth</ListItemText>
                </MenuItem>
                <MenuItem onClick={()=>fileUpload.current?.click()}>
                    <ListItemIcon>
                        <span className="material-symbols-outlined">upload_file</span>
                    </ListItemIcon>
                    <ListItemText>ZIP File</ListItemText>
                </MenuItem>
                <input type="file" ref={fileUpload} id="data-import" accept=".zip" style={{display: "none"}} onChange={importData} />
            </Menu>
        </div>

        <div className="max-w-lg w-full mb-16 px-1">
            <DataList 
                entries={entries}
                readEntries={readentries}
                deleteItems={deleteItems}
                markNew={markNew}
                markRead={markRead}
            />
        </div>

        {/* Share match data popup */}
        <Dialog
            open={qrData !== undefined}
            onClose={() => {setQrData(undefined)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
        >
            <DialogTitle id="alert-dialog-title">
                Share Match Data
            </DialogTitle>
            <DialogContent sx={{scrollSnapType: "y mandatory"}}>
                <div className="w-full flex flex-col items-center">
                    <div className="w-full max-w-md">
                        <p className="text-center">Scan the following QR code(s) on another device to import match data</p>
                        {qrData && <QrCodeList data={qrData} />}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button 
                    size="large" 
                    onClick={() => {setQrData(undefined); setReadEntries(entries?.map(e=>e.id)||[])}} 
                    color="success"
                >
                    Scan Finished
                </Button>
                <Button 
                    size="large" 
                    onClick={() => {setQrData(undefined)}} 
                    color="error"
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>

        {/* Scan data popup */}
        <Dialog
            open={scannerOpen}
            onClose={() => {setScannerOpen(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullScreen
        >
            <DialogTitle id="alert-dialog-title">
                Collect Match Data
            </DialogTitle>
            <DialogContent sx={{paddingX: 0}}>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="w-full max-w-xl">
                        {scannerOpen ? <QrCodeScanner onReceiveData={onQrData} /> : ''}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button size="large" onClick={() => {setScannerOpen(false)}}>Close</Button>
            </DialogActions>
        </Dialog>

        <LoadingBackdrop open={loading} />
    </div>
    );
};
  
export default DataPage;
  