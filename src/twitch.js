// import the js library needed to work in twitch
const debug = require('debug')('twitch')
const tmi = require('tmi.js')
const config = require('../config.json')
const fs = require('fs')
const bluetooth = require('./bluetooth')

const init = () => {
  connect()
  bluetooth.startScan()
}

const connect = () => {
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
    .catch(() => refresh(connectionObj))
}

const refresh = (connectionObj) => {
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

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()

  const token = actionTokenFromMessage(message)
  const device = bluetooth.getDevice(token.hub, token.port)
  device[token.method](token.value * token.multiplier)
}

const actionTokenFromMessage = (msg) => {
  let token = {
    multiplier: 1
  }

  config.devices.forEach(device => {
    if (checkMsgIncludes(msg, device.nouns)) {
      token = Object.assign(token, device)

      device.actions.forEach(action => {
        if (checkMsgIncludes(msg, action.verbs)) {
          token = Object.assign(token, action)
        }
      })
    }
  })

  try {
    token.value = msg.match(/\d+/)[0]
  } catch (e) {
    debug('no value found')
  }

  return token
}

const checkMsgIncludes = (msg, strArr) => {
  return strArr.some(str => {
    if (msg.includes(str)) {
      return true
    }
  })
}

// shows that we have connected to the twitch account
const onConnectedHandler = (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)
}

init()
