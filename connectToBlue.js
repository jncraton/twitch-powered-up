const { createBluetooth } = require('node-ble')

async function main () {
	console.log('start');
	const { bluetooth, destroy } = createBluetooth();
	const adapter = await bluetooth.defaultAdapter();

	console.log('got adapter');
	console.log(adapter);

	if (! await adapter.isDiscovering()) {
		await adapter.startDiscovery();
	}

	console.log('start searching for bluetooth device');

	const device = await adapter.waitDevice('90:84:2B:18:B1:A8');
	await device.connect();

	console.log('connected');
	console.log(device);
}

main()
  .then(console.log)
  .catch(console.error)
