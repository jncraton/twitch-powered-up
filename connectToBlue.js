const PoweredUP = require('node-poweredup')
const poweredUP = new PoweredUP.PoweredUP()

poweredUP.scan() // Start scanning for Hubs
console.log('Scanning for Hubs...')

poweredUP.on('discover', async (hub) => { // Wait to discover hubs
  await hub.connect() // Connect to hub
  console.log(`Connected to ${hub.name}!`)

  hub.on('disconnect', () => {
    console.log('Hub disconnected')
  })
})
