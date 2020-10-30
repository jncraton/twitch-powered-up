const PoweredUP = require('node-poweredup')
const poweredUP = new PoweredUP.PoweredUP()

poweredUP.on('discover', async (hub) => { // Wait to discover hubs
  await hub.connect() // Connect to hub
  console.log(`Connected to ${hub.name}!`)

  hub.on('disconnect', () => {
    console.log('Hub disconnected')
  })
})

const startScan = () => {
  poweredUP.scan()
  console.log('Scanning for Hubs...')
}

const changeAllHubLeds = (color) => {
  console.log('changing color')
  const hubs = poweredUP.getHubs() // Get an array of all connected hubs
  hubs.forEach(async (hub) => {
    const led = await hub.waitForDeviceByType(PoweredUP.Consts.DeviceType.HUB_LED)
    led.setColor(color) // Set the color
  })
}

module.exports = { startScan, changeAllHubLeds }
