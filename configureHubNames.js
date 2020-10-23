'use strict'

const fs = require('fs');
const PoweredUP = require('node-poweredup');
const poweredUP = new PoweredUP.PoweredUP();

function main() {
    scanAndConnectToHubs();    
}

function scanAndConnectToHubs() {
    poweredUP.scan(); // Start scanning for Hubs
    console.log('Scanning for Hubs...');

    poweredUP.on('discover', async (hub) => { // Wait to discover hubs
        await hub.connect(); // Connect to hub
        console.log(`Connected to ${hub.name}!`);
        hub.setName(promptUserForHubNames());
        confirmHubName(hub);
    });
}

function promptUserForHubNames(){
    console.log("Name for new hub: ");
    return readline();
}

function confirmHubName(hub) {
    console.log("\nHub name is now: " + hub.name);
}

main();