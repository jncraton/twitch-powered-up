const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
const configjs = require('./config')
const stream = require('./stream')

let tokens = []
let config

const init = async () => {
  try {
    config = await configjs.getConfig()
    configjs.validateConfig(config)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }

  twitch.connect(onMessageHandler, onConnectedHandler, config)
  bluetooth.startScan()
  setInterval(update, 100)
  stream.start(config)
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  const token = twitch.actionTokenFromMessage(message, config)

  if (token.hub && token.port && token.method) {
    tokens.push(token)
  }
}

// shows that we have connected to the twitch account
const onConnectedHandler = (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)
}

const update = () => {
  const now = new Date().getTime()

  // Filter out expired tokens
  tokens = tokens.filter(token => now - token.time < config.twitch.messageLifetime)

  // Sort tokens by device and method and call method using average value
  config.devices.forEach(device => {
    const methods = new Set(device.actions.map(action => action.method))
    methods.forEach(method => {
      const deviceMethodTokens = tokens.filter(token =>
        token.hub === device.hub &&
        token.port === device.port &&
        token.method === method
      )

      const averageValue = deviceMethodTokens.reduce((avg, token) =>
        token.value * token.multiplier / tokens.length + avg
      , 0)

      const btDevice = bluetooth.getDevice(device.hub, device.port)
      if (btDevice) {
        btDevice[method](averageValue)
      }
    })
  })
}

module.exports = { init }
