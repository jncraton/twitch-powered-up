Twitch Powered Up
=================

![build](https://github.com/jncraton/twitch-powered-up/workflows/build/badge.svg)

Software to interact with the LEGO Powered Up elements via Twitch.tv chat using a Raspberry Pi.

Overview
--------

This project is similar in concept to the classic [Twitch Plays Pokemon](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon) ([video](https://www.twitch.tv/videos/40790582)):

![TPP animation](https://upload.wikimedia.org/wikipedia/en/1/15/Twitch_plays_pokemon_animated.gif)

A LEGO model is live streamed via Twitch.tv, and viewers are able to control it by sending commands over Twitch chat.

System Overview
---------------

- LEGO Powered Up hubs are paired with a host device (Raspberry Pi) via Bluetooth.
- Host device monitors a Twitch chat room for commands and uses commands to control LEGO elements connected to hubs
- Host device streams a webcam via Twitch showing the live state of the LEGO model

Supported Hardware
------------------

This software has been designed and tested to run on a Raspberry Pi 4, but it should be able to run on most devices that supports Bluetooth Low Energy.

### LEGO Elements

- Hub (88009)
- Medium Linear Motor (45303)
- Light (88005)
- Train Motor (88011)

Set-Up
-------

Bot Creation:

On any computer-

- Create a [Twitch Account](https://twitch.tv) using the sign up button in the top right. This ste can be skipped if you have one created. 
- Go into settings and [set up two-factor authentication](https://help.twitch.tv/s/article/two-factor-authentication-with-authy?language=en_US). 
- Use that account to register [on Twitch's app registration website](https://dev.twitch.tv/dashboard/apps/create). 
- Get an OAuth token from [this generator](https://twitchtokengenerator.com/) or another. Select the chat bot option. Scroll down and allow chat_login, chat:read, chat:edit, channel:moderate permisions. Copy both the OAuth Token and Refresh Token, you will need them later. Do not share these codes, as they give a lot of access to your account. 

Discovering Mac Addresses: 

- Click the green button on top of the bluetooth device to make it discoverable. 
- In the Raspberry Pi-
- Click on the bluetooth symbol in the top right corner.
- Click add new device, this pops up a new box with possibly many different device options.
- Find the Lego piece names you need. The hub is labeled as just "Hub" with numbers behind it. 
- Hover the mouse over the piece, this pops up a box where the last of it is 6 pairs of numbers/letters divided by underscores. Write these down. 
- Repeat for all bluetooth devices that will need communication. 
- These identifiers are Mac Addresses. 

Config File:

- Put the Mac Addresses in the config file under the appropriate spots with their device name and place a colon (:) where the underscores are, as the example shows.
- Add the desired breaking value as a percentage of original speed.
- Movement is positive or negative, corresponding to forward and backwards movement. 
- Add the OAuth Token and the Refresh Token
- Add the bot username, and expected channel it will go to

Contributing
------------

Contributions to this project are welcome. If you have suggestions for features, improvements, or bug fixes, please suggest them via Issues or Pull Requests. For our Javascript code, we follow [Standard JS](https://standardjs.com/) style.
