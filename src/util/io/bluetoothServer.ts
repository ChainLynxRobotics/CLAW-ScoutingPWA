import EventEmitter from "node:events";
import cachedAsyncFunction from "../cachedAsyncFunction";
import TypedEventEmitter from "typed-emitter";

const serviceUuid = parseInt('82480000-9a25-49fc-99be-2c16d1492d35');
const txCharacteristicUuid = parseInt('82480001-9a25-49fc-99be-2c16d1492d35');
const rxCharacteristicUuid = parseInt('82480002-9a25-49fc-99be-2c16d1492d35');

let device: BluetoothDevice | null = null;
let server: BluetoothRemoteGATTServer | null = null;

let txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

type EventMap = {
    connected: () => void,
    disconnected: () => void,
    packet: (data: DataView) => void
}
const events = new EventEmitter() as TypedEventEmitter<EventMap>;

let isReconnecting = false;
let reconnectAttemptsLeft = 0;

// connect to the device, using cachedAsyncFunction to ensure that only one connection is attempted at a time
const connect = cachedAsyncFunction(async () => {
    device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }]
    });
    await connectToDevice();
});

// This function being separate from connect() allows us to reconnect to the same device if it disconnects
async function connectToDevice() {
    if (device === null) throw new Error('No device selected');

    device.addEventListener('gattserverdisconnected', () => {
        console.log('Radio disconnected');
        // Don't set device to null here, as we want to keep the device object around for reconnecting
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        events.emit('disconnected');

        if (!isReconnecting) {
            reconnectAttemptsLeft = 5;
            tryReconnect();
        }
    });

    server = (await device.gatt?.connect()) || null;
    if (server !== null) {
        console.log('Connected to radio');
    } else {
        throw new Error('Failed to connect to radio');
    }

    try {
        const service = await server.getPrimaryService(serviceUuid);
        if (!service) throw new Error('Failed to get service');

        txCharacteristic = await service.getCharacteristic(txCharacteristicUuid);
        if (!txCharacteristic) throw new Error('Failed to get tx characteristic');

        rxCharacteristic = await service.getCharacteristic(rxCharacteristicUuid);
        if (!rxCharacteristic) throw new Error('Failed to get rx characteristic');

        await rxCharacteristic.startNotifications();
        rxCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
            if (rxCharacteristic && rxCharacteristic.value) {
                events.emit('packet', rxCharacteristic.value);
            }
        });

        events.emit('connected');
    } catch (e) {
        device = null; // Clear device so we can't reconnect to it, as it doesn't have the correct characteristics
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        throw e;
    }
};

async function tryReconnect() {
    if (reconnectAttemptsLeft <= 0) {
        isReconnecting = false;
        return;
    }
    reconnectAttemptsLeft--;
    isReconnecting = true;
    
    try {
        console.log('Reconnecting to radio...');
        await connectToDevice();
    } catch (e) {
        console.error('Failed to reconnect to radio:', e);
        setTimeout(tryReconnect, 1000);
    }
}

function isConnected() {
    return server !== null;
}

async function sendPacket(data: ArrayBuffer) {
    if (!txCharacteristic) throw new Error('Not connected');
    await txCharacteristic.writeValue(data);
}

export {
    connect,
    isConnected,
    sendPacket,
    events
}