'use strict'
// import the js library needed to work in twitch
const tmi = require('tmi.js');

//basic username and channel name for our specfic project Oauth_token is found in the config file
const BOT_USERNAME = "twitchpoweredup";
const OAUTH_TOKEN = "";
const CHANNEL_NAME = "twitchpoweredup";

function main(){
    connectToTwitch();
}

function connectToTwitch(){
    const connectionObj = {
        identity: {
        username: BOT_USERNAME,
        password: OAUTH_TOKEN
        },
        channels: [
        CHANNEL_NAME
        ]
    }; 

    const client = new tmi.client(connectionObj);

    // Registers our event handlers
    client.on('message', onMessageHandler);
    client.on('connected', onConnectedHandler);

    // Connect to Twitch
    client.connect();
}

function onMessageHandler (target, context, msg, self) {
    // Ignore messages from the bot such as shout messages for user commands
    if (self) { return; } 
  
    // Remove whitespace from chat message
    const commandName = msg.trim();

    
    console.log(commandName);
    
}

//shows that we have connected to the twitch account
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

main();
