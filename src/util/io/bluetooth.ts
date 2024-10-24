import bluetoothServer from "./bluetoothServer";

const queue = [];

async function init() {
    if (!bluetoothServer.isConnected() && bluetoothServer.isReconnecting()) {
        await bluetoothServer.connect();
    }
}

bluetoothServer.events.on('packet', onPacket);
function onPacket(data: DataView) {
    console.log('Received packet:', data);
}

