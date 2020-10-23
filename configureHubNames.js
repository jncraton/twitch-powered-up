'use strict'

const fs = require('fs');
const readline = require('readline');
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
    let rl = readline.createInterface(
        process.stdin, process.stdout);    
    rl.setPrompt(`Name for new hub: `);
    rl.prompt()
    rl.on('line', (hubName) => {
        rl.close();
    });
    return hubName;
}

function confirmHubName(hub) {
    console.log("\nHub name is now: " + hub.name);
}

main();