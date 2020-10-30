// import the js library needed to work in twitch
const debug = require('debug')('twitch')
const tmi = require('tmi.js')
const CONFIG = require('../config.json')
const fs = require('fs')
const connectToBlue = require('./connectToBlue')

// basic username and channel name for our specfic project Oauth_token is found in the config file
const BOT_USERNAME = CONFIG.BOT_USERNAME
const OAUTH_TOKEN = CONFIG.AUTHTOKEN
const CHANNEL_NAME = CONFIG.CHANNEL_NAME
const DEVICES = CONFIG.Devices
const REFRESH_TOKEN = CONFIG.REFRESHTOKEN

const init = () => {
  connectToTwitch()
  connectToBlue.startScan()
}

const connectToTwitch = () => {
  const connectionObj = {
    identity: {
      username: BOT_USERNAME,
      password: OAUTH_TOKEN
    },
    channels: [
      CHANNEL_NAME
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
  const URL = 'https://twitchtokengenerator.com/api/refresh/' + REFRESH_TOKEN
  let newToken = ''
  require('https').get(URL, (res) => {
    res.setEncoding('utf8')
    res.on('data', function (body) {
      const json = JSON.parse(body)
      newToken = json.token
      connectionObj.identity.password = newToken
      const fileContent = fs.readFileSync('config.json')
      const data = JSON.parse(fileContent)
      data.AUTHTOKEN = newToken
      fs.writeFileSync('config.json', JSON.stringify(data, null, 4))

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
  const device = connectToBlue.getDevice(token.hub, token.port)
  device[token.method](token.val * token.multiplier)
}

const actionTokenFromMessage = (msg) => {
  let token = {
    hub: null,
    port: null,
    method: null,
    val: null,
    multiplier: 1
  }

  DEVICES.forEach(device => {
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
    token.val = msg.match(/\d+/)[0]
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
