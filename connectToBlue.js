const PoweredUP = require('node-poweredup')
const poweredUP = new PoweredUP.PoweredUP()

poweredUP.on('discover', async (hub) => {
  console.log(`Discovered ${hub.name}!`)

  await hub.connect()
  console.log('Connected')

  console.log('Waiting for motorA...')
  const motorA = await hub.waitForDeviceAtPort('A') // Make sure a motor is plugged into port A
  console.log('Connected to motorA!')

  console.log('Running motor A at speed 100 for 2 seconds')
  motorA.setPower(100) // Run a motor attached to port A for 2 seconds at maximum speed (100) then stop
  await hub.sleep(2000)
  motorA.brake()
  await hub.sleep(1000) // Do nothing for 1 second

  console.log('Running motor A at speed -30 for 1 second')
  motorA.setPower(-30) // Run a motor attached to port A for 2 seconds at 1/2 speed in reverse (-50) then stop
  await hub.sleep(2000)
  motorA.brake()
  await hub.sleep(1000) // Do nothing for 1 second

  await hub.disconnect()
  console.log(`Disconnected ${hub.name}!`)
})

poweredUP.scan() // Start scanning for Hubs
console.log('Scanning for Hubs...')
