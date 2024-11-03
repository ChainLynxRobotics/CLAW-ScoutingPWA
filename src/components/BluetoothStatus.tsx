import { useEffect, useMemo, useState } from "react";
import bluetoothServer from "../util/io/bluetoothServer";
import { useSnackbar } from "notistack";
import { IconButton, Menu, MenuItem } from "@mui/material";

export enum BluetoothStatusEnum {
    DISCONNECTED = 0,
    CONNECTING = 1,
    CONNECTED = 2,
}

const BluetoothStatus = () => {

    const {enqueueSnackbar} = useSnackbar();
    
    const [status, setStatus] = useState<BluetoothStatusEnum>(bluetoothServer.isConnected() ? BluetoothStatusEnum.CONNECTED : BluetoothStatusEnum.DISCONNECTED);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = useMemo(()=> anchorEl !== null, [anchorEl]);

    useEffect(() => {
        const onDisconnect = () => setStatus(BluetoothStatusEnum.DISCONNECTED);
        const onConnecting = () => setStatus(BluetoothStatusEnum.CONNECTING);
        const onConnect = () => setStatus(BluetoothStatusEnum.CONNECTED);

        bluetoothServer.events.on('disconnected', onDisconnect);
        bluetoothServer.events.on('connecting', onConnecting);
        bluetoothServer.events.on('connected', onConnect);


        return () => {
            bluetoothServer.events.off('disconnected', onDisconnect);
            bluetoothServer.events.off('connecting', onConnecting);
            bluetoothServer.events.off('connected', onConnect);
        };
    }, []);

    function openMenu(event: React.MouseEvent<HTMLButtonElement>) {
        if (status === BluetoothStatusEnum.DISCONNECTED && !bluetoothServer.hasKnownDevice()) {
            onConnectButtonPress(); // Shortcut to connect on first time
            return;
        }
        setAnchorEl(event.currentTarget);
    }

    function onConnectButtonPress() {
        if ('bluetooth' in navigator) {
            bluetoothServer.connect().then(()=>{
                enqueueSnackbar('Connected to radio', {variant: 'success'});
                bluetoothServer.sendPacket(new Uint8Array([0x01, 0x02, 0x03, 0x04]).buffer).catch(console.error)
            }).catch((e) => {
                enqueueSnackbar('Failed to connect to radio: '+e, {variant: 'error'});
                console.error('Failed to connect to radio:', e);
            });
        } else {
            enqueueSnackbar('Bluetooth not supported, please use Chrome or Edge', {variant: 'error'});
        }
        setAnchorEl(null);
    }

    function onDisconnectButtonPress() {
        bluetoothServer.disconnect();
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
                <span className={`material-symbols-outlined ${status === BluetoothStatusEnum.CONNECTED ? 'text-green-400' : status === BluetoothStatusEnum.CONNECTING ? 'text-yellow-400' : 'text-red-400'}`}>
                    {status === BluetoothStatusEnum.CONNECTED ? 'bluetooth_connected' : status === BluetoothStatusEnum.CONNECTING ? 'bluetooth_searching' : 'bluetooth_disabled'}
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
                    disabled={status === BluetoothStatusEnum.DISCONNECTED}
                >
                    Disconnect
                </MenuItem>
            </Menu>
        </div>
    )
};

export default BluetoothStatus;