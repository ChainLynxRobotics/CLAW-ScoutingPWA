import { useContext, useMemo, useState } from "react";
import bluetoothServer from "../util/io/bluetoothServer";
import { useSnackbar } from "notistack";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { BluetoothContext } from "./context/BluetoothContextProvider";
import { BluetoothStatusEnum } from "../types/RadioPacketData";

const BluetoothStatus = () => {

    const {enqueueSnackbar} = useSnackbar();
    
    const bluetooth = useContext(BluetoothContext);
    
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = useMemo(()=> anchorEl !== null, [anchorEl]);

    function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
        if (bluetooth?.status === BluetoothStatusEnum.DISCONNECTED && !bluetoothServer.hasKnownDevice()) {
            onConnectButtonPress(); // Shortcut to connect on first time
            return;
        }
        setAnchorEl(event.currentTarget);
    }

    function onConnectButtonPress() {
        if ('bluetooth' in navigator) {
            bluetooth?.connect().then(()=>{
                enqueueSnackbar('Connected to radio', {variant: 'success'});
            }).catch((e) => {
                enqueueSnackbar('Failed to connect to radio: '+e, {variant: 'error'});
            });
        } else {
            enqueueSnackbar('Bluetooth not supported, please use Chrome or Edge', {variant: 'error'});
        }
        setAnchorEl(null);
    }

    function onDisconnectButtonPress() {
        bluetooth?.disconnect();
        setAnchorEl(null);
    }

    return (
        <div className="">
            <IconButton 
                id="bluetooth-button" 
                aria-controls={menuOpen ? 'bluetooth-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? 'true' : 'false'}
                onClick={openMenu}
                className="text-lg p-2"
            >
                <span className={`material-symbols-outlined ${bluetooth?.status === BluetoothStatusEnum.CONNECTED ? 'text-green-400' : bluetooth?.status === BluetoothStatusEnum.CONNECTING ? 'text-yellow-400' : 'text-red-400'}`}>
                    {bluetooth?.status === BluetoothStatusEnum.CONNECTED ? 'bluetooth_connected' : bluetooth?.status === BluetoothStatusEnum.CONNECTING ? 'bluetooth_searching' : 'bluetooth_disabled'}
                </span>
            </IconButton>
            <Menu
                id="bluetooth-menu"
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={() => setAnchorEl(null)}
                MenuListProps={{
                    'aria-labelledby': 'bluetooth-button',
                }}
            >
                <MenuItem 
                    onClick={onDisconnectButtonPress}
                    disabled={bluetooth?.status === BluetoothStatusEnum.DISCONNECTED}
                >
                    Disconnect
                </MenuItem>
            </Menu>
        </div>
    )
};

export default BluetoothStatus;