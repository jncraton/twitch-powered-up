'use strict'

const readline = require('readline')
const PoweredUP = require('node-poweredup')
const poweredUP = new PoweredUP.PoweredUP()
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function main () {
  poweredUP.scan() // Start scanning for Hubs
  console.log('Scanning for Hubs...')

  poweredUP.on('discover', async (hub) => { // Wait to discover hubs
    await hub.connect() // Connect to hub
    console.log(`Connected to ${hub.name}!`)
    await promptUserForHubNames(hub)
    confirmHubName(hub)
    process.exit(1)
  })
}

async function promptUserForHubNames (hub) {
  const promise = new Promise(resolve => {
    rl.question('Name for new hub: ', async function(answer) {
      await hub.setName(answer) // Eventually wrap in try catch
      rl.close()
      resolve()
    })
  })
  return promise
}

function confirmHubName (hub) {
  console.log('Hub name is now: ' + hub._name)
}

main()
