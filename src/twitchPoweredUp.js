const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
const configjs = require('./config')
const stream = require('./stream')
const messages = require('./messages')

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
  messages.setAllowedDevices(config.devices)
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  messages.add(message, context.username)
}

// shows that we have connected to the twitch account
const onConnectedHandler = (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)
}

const update = () => {
  messages.expire(config.twitch.messageLifetime)
  // Sort tokens by device and method and call method using average value
  config.devices.forEach(device => {
    const methods = new Set(device.actions.map(action => action.method))
    methods.forEach(method => {
      const averageValue = messages.getAverageValue(device.hub, device.port, method)

      const btDevice = bluetooth.getDevice(device.hub, device.port)
      if (btDevice) {
        btDevice[method](averageValue)
      }
    })
  })
}

module.exports = { init }
