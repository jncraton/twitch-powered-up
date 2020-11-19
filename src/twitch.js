// import the js library needed to work in twitch
const debug = require('debug')('twitch')
const tmi = require('tmi.js')
const config = require('../config.json')
const fs = require('fs')

const connect = (onMessageHandler, onConnectedHandler) => {
  const connectionObj = {
    identity: {
      username: config.twitch.username,
      password: config.twitch.auth
    },
    channels: [
      config.twitch.channel
    ]
  }

  const client = new tmi.Client(connectionObj)

  // Registers our event handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)

  // Connect to Twitch
  client.connect()
    .catch(() => refresh(connectionObj, onMessageHandler, onConnectedHandler))
}

const refresh = (connectionObj, onMessageHandler, onConnectedHandler) => {
  const URL = 'https://twitchtokengenerator.com/api/refresh/' + config.twitch.refresh
  require('https').get(URL, (res) => {
    res.setEncoding('utf8')
    res.on('data', function (body) {
      config.twitch.auth = JSON.parse(body).token
      connectionObj.identity.password = config.twitch.auth

      fs.writeFileSync('config.json', JSON.stringify(config, null, 4))

      const client = new tmi.Client(connectionObj)
      client.on('message', onMessageHandler)
      client.on('connected', onConnectedHandler)
      client.connect().catch(console.error)
    })
  })
}

const actionTokenFromMessage = (msg) => {
  let token = {
    multiplier: 1,
    min: -100,
    max: 100
  }

  config.devices.forEach(device => {
    if (device.nouns.some(n => msg.includes(n))) {
      token = Object.assign(token, device)
      try {
        token.min = device.min
        token.max = device.max
      } catch (e) {
        debug('max or min does not exist')
      }
      device.actions.forEach(action => {
        if (action.verbs.some(v => msg.includes(v))) {
          token = Object.assign(token, action)
        }
      })
    }
  })

  try {
    token.value = parseInt(msg.match(/-?\d+/)[0])
    token.value = Math.max(token.value, token.min)
    token.value = Math.min(token.value, token.max)
  } catch (e) {
    debug('no value found')
  }

  return token
}

module.exports = { actionTokenFromMessage, connect }
