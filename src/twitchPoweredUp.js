const twitch = require('./twitch')
const bluetooth = require('./bluetooth')

const init = () => {
  twitch.connect(onMessageHandler, onConnectedHandler)
  bluetooth.startScan()
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  const token = twitch.actionTokenFromMessage(message)

  if (token.hub && token.port && token.method) {
    const device = bluetooth.getDevice(token.hub, token.port)
    device[token.method](token.value * token.multiplier)
  }
}

// shows that we have connected to the twitch account
const onConnectedHandler = (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)
}

init()
