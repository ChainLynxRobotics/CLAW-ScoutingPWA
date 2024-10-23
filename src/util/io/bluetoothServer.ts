import EventEmitter from "node:events";
import cachedAsyncFunction from "../cachedAsyncFunction";
import TypedEventEmitter from "typed-emitter";

const serviceUuid = parseInt('82480000-9a25-49fc-99be-2c16d1492d35');
const txCharacteristicUuid = parseInt('82480001-9a25-49fc-99be-2c16d1492d35');
const rxCharacteristicUuid = parseInt('82480002-9a25-49fc-99be-2c16d1492d35');

let server: BluetoothRemoteGATTServer | null = null;

let txCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;
let rxCharacteristic: BluetoothRemoteGATTCharacteristic | null = null;

type EventMap = {
    connected: () => void,
    disconnected: () => void,
    packet: (data: DataView) => void
}
const events = new EventEmitter() as TypedEventEmitter<EventMap>;


// connect to the device, using cachedAsyncFunction to ensure that only one connection is attempted at a time
const connect = cachedAsyncFunction(async () => {
    if ('bluetooth' in navigator === false) throw new Error('Bluetooth not supported');
    
    const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUuid] }]
    });

    device.addEventListener('gattserverdisconnected', () => {
        console.log('Radio disconnected');
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        events.emit('disconnected');
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
        server = null;
        txCharacteristic = null;
        rxCharacteristic = null;
        throw e;
    }
});

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