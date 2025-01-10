import EventEmitter from "events";
import cachedAsyncFunction from "../cachedAsyncFunction";
import TypedEventEmitter from "typed-emitter";

const serviceUuid = '82480000-9a25-49fc-99be-2c16d1492d35';
const txCharacteristicUuid = '82480001-9a25-49fc-99be-2c16d1492d35';
const rxCharacteristicUuid = '82480002-9a25-49fc-99be-2c16d1492d35';

let device: BluetoothDevice | null = null;
let server: BluetoothRemoteGATTServer | null = null;

let txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

type EventMap = {
    connecting: () => void,
    connected: () => void,
    disconnected: () => void,
    packet: (data: DataView) => void
}
const events = new EventEmitter() as TypedEventEmitter<EventMap>;

let _isReconnecting = false;
let reconnectAttemptsLeft = 0;

function isSupported() {
    return 'bluetooth' in navigator;
}

// connect to the device, using cachedAsyncFunction to ensure that only one connection is attempted at a time
const connect = cachedAsyncFunction(async () => {

    disconnect();

    device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'CLAW' }],
        optionalServices: [serviceUuid],
        // acceptAllDevices: true,
        // optionalServices: [serviceUuid]
    });

    await connectToDevice();

    device.addEventListener('gattserverdisconnected', (e) => {
        console.log('Radio disconnected');
        // Don't set device to null here, as we want to keep the device object around for reconnecting
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        events.emit('disconnected');

        if (!_isReconnecting) {
            reconnectAttemptsLeft = 5;
            tryReconnect();
        }
    });

});

// This function being separate from connect() allows us to reconnect to the same device if it disconnects
async function connectToDevice() {
    if (device === null) throw new Error('No device selected');
    
    server = null;
    txCharacteristic = null;
    rxCharacteristic = null;

    try {
        events.emit('connecting');
        server = (await device.gatt?.connect()) || null;
        if (server !== null) {
            console.log('Connected to gatt server');
        } else {
            throw new Error('Failed to connect to gatt server');
        }

        try {
            await getCharacteristics();
            console.log('Connected to radio');
            events.emit('connected');
        } catch (e) {
            device = null; // Clear device so we can't reconnect to it, as it doesn't have the correct characteristics
            throw e;
        }
    } catch (e) {
        // Clear all the variables before throwing the error
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        events.emit('disconnected');
        throw e;
    }
};

// Populates the txCharacteristic and rxCharacteristic variables with the correct characteristics
async function getCharacteristics() {
    if (server === null) throw new Error('Not connected');

    const service = await server.getPrimaryService(serviceUuid);
    if (!service) throw new Error('Failed to get service');

    txCharacteristic = await service.getCharacteristic(txCharacteristicUuid);
    if (!txCharacteristic) throw new Error('Failed to get tx characteristic');

    rxCharacteristic = await service.getCharacteristic(rxCharacteristicUuid);
    if (!rxCharacteristic) throw new Error('Failed to get rx characteristic');

    await txCharacteristic.startNotifications();
    txCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        if (txCharacteristic && txCharacteristic.value) {
            events.emit('packet', txCharacteristic.value);
        }
    });
}

// Attempts to reconnect to the radio, with a delay of 1 second between each attempt
async function tryReconnect() {
    if (reconnectAttemptsLeft <= 0 || device === null) {
        reconnectAttemptsLeft = 0;
        _isReconnecting = false;
        return;
    }
    reconnectAttemptsLeft--;
    _isReconnecting = true;
    
    try {
        console.log('Reconnecting to radio...');
        await connectToDevice();
        _isReconnecting = false;
    } catch (e) {
        console.error('Failed to reconnect to radio', e);
        if (reconnectAttemptsLeft > 0) setTimeout(tryReconnect, 1000);
    }
}

/**
 * Disconnect from the radio
 */
function disconnect() {
    if (server) {
        reconnectAttemptsLeft = 0;
        device = null;
        server.disconnect(); // Will trigger the gattserverdisconnected event, which will clear the other variables
    }
}

function isConnected() {
    return server !== null;
}

function isReconnecting() {
    return _isReconnecting;
}

function hasKnownDevice() {
    return device !== null;
}

function getKnownDeviceName() {
    return device?.name || 'Unknown device';
}

async function sendPacket(data: ArrayBuffer) {
    if (!rxCharacteristic) throw new Error('Not connected');
    await rxCharacteristic.writeValue(data);
}

export default {
    isSupported,
    connect,
    disconnect,
    isConnected,
    isReconnecting,
    hasKnownDevice,
    getKnownDeviceName,
    sendPacket,
    events
}