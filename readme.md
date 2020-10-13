Twitch Powered Up
=================

[![Build Status](https://travis-ci.com/jncraton/twitch-powered-up.svg?token=yQJxZLQNAHqWRpN2k3wf&branch=master)](https://travis-ci.com/jncraton/twitch-powered-up)

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

Contributing
------------

Contributions to this project are welcome. If you have suggestions for features, improvements, or bug fixes, please suggest them via Issues or Pull Requests. For our Javascript code, we follow [Standard JS](https://standardjs.com/) style.
