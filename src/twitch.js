const tmi = require('tmi.js')
const fs = require('fs')

const connect = (onMessageHandler, onConnectedHandler, config) => {
  const connectionObj = {
    identity: {
      username: config.twitch.chat.username,
      password: config.twitch.chat.auth
    },
    channels: [
      config.twitch.chat.channel
    ]
  }

  const client = new tmi.Client(connectionObj)

  // Registers our event handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)

  // Connect to Twitch
  client.connect()
    .catch(() => refresh(connectionObj, onMessageHandler, onConnectedHandler, config))
}

const refresh = (connectionObj, onMessageHandler, onConnectedHandler, config) => {
  const URL = 'https://twitchtokengenerator.com/api/refresh/' + config.twitch.chat.refresh
  require('https').get(URL, (res) => {
    res.setEncoding('utf8')
    res.on('data', function (body) {
      config.twitch.chat.auth = JSON.parse(body).token
      connectionObj.identity.password = config.twitch.chat.auth

      fs.writeFileSync('config.json', JSON.stringify(config, null, 4))

      const client = new tmi.Client(connectionObj)
      client.on('message', onMessageHandler)
      client.on('connected', onConnectedHandler)
      client.connect().catch(console.error)
    })
  })
}

module.exports = { connect }
