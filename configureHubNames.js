'use strict'

const fs = require('fs');
const readline = require('readline');
const PoweredUP = require('node-poweredup');
const { resolve } = require('path');
const poweredUP = new PoweredUP.PoweredUP();
let rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});   

function main() {
    scanAndConnectToHubs();
}

function scanAndConnectToHubs() {
    poweredUP.scan(); // Start scanning for Hubs
    console.log('Scanning for Hubs...');

    poweredUP.on('discover', async (hub) => { // Wait to discover hubs
        await hub.connect(); // Connect to hub
        console.log(`Connected to ${hub.name}!`);
        await promptUserForHubNames(hub);
        confirmHubName(hub);
        process.exit(1);
    });
}

async function promptUserForHubNames(hub) {
    let promise = new Promise(resolve => {
        rl.question("Name for new hub: ", async function(answer) {
            await hub.setName(answer); // Eventually wrap in try catch
            rl.close();
            resolve();
        })
    });
    return promise;
}

function confirmHubName(hub) {
    console.log("Hub name is now: " + hub._name);
}

main();