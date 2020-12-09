Twitch Powered Up
=================

![build](https://github.com/jncraton/twitch-powered-up/workflows/build/badge.svg)

Software to interact with the LEGO Powered Up elements via Twitch.tv chat using a Raspberry Pi.

Overview
--------

A LEGO model is streamed via Twitch.tv, and viewers are able to control it by sending commands over Twitch chat.

![Demo video](https://github.com/jncraton/twitch-powered-up/blob/media/demo-optimized.gif?raw=true)

This is similar in concept to the classic [Twitch Plays Pokemon](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon) ([video](https://www.twitch.tv/videos/40790582)), and is inspired by an old [question on Bricks Stack Exchange](https://bricks.stackexchange.com/questions/10486/can-powered-up-trains-talk-to-multiple-bluetooth-remotes) asking about the ability for multiple users to control a single LEGO train.

System Overview
---------------

![Basic system diagram](https://github.com/jncraton/twitch-powered-up/blob/media/diagram.png?raw=true)

- LEGO Powered Up hubs are paired with a host device (Raspberry Pi) via Bluetooth.
- Host device monitors a Twitch chat room for commands and uses commands to control LEGO elements connected to hubs.
- Host device streams a webcam via Twitch showing the live state of the LEGO model.
- Command messages will be averaged for speeds and brightness.

Supported Hardware
------------------

This software has been designed and tested to run on a Raspberry Pi 4, but it should be able to run on most devices that support Bluetooth Low Energy.

### LEGO Elements

The software has been tested on the following components:

- Boost Move Hub (88006)
- Hub (88009)
- Medium Linear Motor (45303)
- Light (88005)
- Train Motor (88011)

It should also be compatible with any [devices supported by node-poweredup](https://github.com/nathankellenicki/node-poweredup#compatibility).

Installation
------------

These instructions assume that you are installing and running the software on a Raspberry Pi 4 running [Raspberry Pi OS](https://www.raspberrypi.org/software/).

### Dependencies

We first install a number of dependencies.

```
sudo apt install npm ffmpeg bluetooth bluez libbluetooth-dev libudev-dev
```

### Package

The following command will download the package from npm and configure it to be accessible globally on your system.

```
npm install -g twitch-powered-up
```

Configuration
-------------

The application expects a valid configuration file to be present as `~/.config/twitch-powered-up.json`. An example config will be created for you on first run of the following command:

```
twitch-powered-up
```

The example configuration file `~/.config/twitch-powered-up.json` can now be edited using the program of your choice. 

### Devices

The `devices` section is used to map `nouns` and `actions` to a port on a hub.

Ports are identified using the single capital letter stamped on the device (`A`, `B`, etc). Hubs are identified by their configured names. Names can be discovered and changed using the Powered Up mobile app, or by using the `tpu-rename-hub` script included with this project.

### Twitch

The `twitch` section is used to configure stream keys and parameters. The following steps will create and add your Twitch keys.

1. Create a [Twitch Account](https://twitch.tv) if you do not already have one.
2. Go into settings and [set up two-factor authentication](https://help.twitch.tv/s/article/two-factor-authentication-with-authy?language=en_US). 
3. Use your account to register [on Twitch's app registration website](https://dev.twitch.tv/dashboard/apps/create). 
4. Get an OAuth token from [this generator](https://twitchtokengenerator.com/) or another. Select the chat bot option. Scroll down and allow chat_login, chat:read, chat:edit, channel:moderate permissions. Copy both the OAuth token and refresh token to the appropriate fields in the config file.
5. Copy your [stream key](https://www.twitch.tv/broadcast/dashboard/streamkey) and add it to the config file.

You should also add your account's username and channel name to config file.

Usage
------------
- A webcam will be used to see the device you are interacting with through the chat. The framerate and quality preset are filled in in the exampleConfig file, these will need to change depending on your webcam. The link below leads to Twitch's recommendation for streaming with different webcams.
- [Twitch's recommendation](https://stream.twitch.tv/encoding/)
- Run the command "npm start".
- Turn on the hubs and set them to pair, the program will begin scanning for hubs upon start, and the Bluetooth will pair automatically. 
- With the twitch stream chat running, it will also automatically connect to the chat.
- The example below will explain using the chat to control the train.

Example
------------

- This example is for the train motor and with the motor named "red train"
- The line "red train go 50" in the chat will make the red train go forwards at a speed of 50, but if more commands are given it will average the speed. 
- Only what you want pulled out of the phrase will be accepted as well, so you don't need to arrange the words you want in any way, they just all need to be in the phrase. So for example: "I want the red train to move forward at a speed of 50" will only pull out "red train", "forward", and "50". 

Contributing
------------

Contributions to this project are welcome. If you have suggestions for features, improvements, or bug fixes, please suggest them via Issues or Pull Requests. For our Javascript code, we follow [Standard JS](https://standardjs.com/) style.
