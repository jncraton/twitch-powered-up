const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
const fs = require('fs')
const stream = require('./stream')
const xdgBasedir = require('xdg-basedir')
const jsonschema = require('jsonschema')
const configPath = xdgBasedir.config + '/twitch-powered-up.json'
const examplePath = __dirname.replace(/\\/g, '/').replace(/\/src$/, '/examples/exampleConfig.json')
const schema = require('./config.schema.json')

let config

const init = async () => {
  config = await getConfig()

  try {
    jsonschema.validate(config, schema, { throwAll: true })
  } catch (validationError) {
    console.log('There were errors found in your config file:')
    validationError.errors.forEach(e => {
      console.log(e.stack.replace('instance.', ''))
    })
    process.exit(0)
  }
  twitch.connect(onMessageHandler, onConnectedHandler, config)
  bluetooth.startScan()
  stream.start(config)
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  const token = twitch.actionTokenFromMessage(message, config)

  if (token.hub && token.port && token.method) {
    const device = bluetooth.getDevice(token.hub, token.port)
    if (device) {
      device[token.method](token.value * token.multiplier)
    }
  }
}

// shows that we have connected to the twitch account
const onConnectedHandler = (addr, port) => {
  console.log(`Connected to ${addr}:${port}`)
}

const getConfig = () => {
  return new Promise(resolve => {
    try {
      const config = require(configPath)
      resolve(config)
    } catch (e) {
      fs.copyFile(examplePath, configPath, (err) => {
        if (err) {
          console.error({ message: 'There was an error', err })
          process.exit(1)
        } else {
          console.log('twitch-powered-up.config was created: \n' + configPath + '\nmake sure to enter twitch tokens before running again.')
          process.exit(0)
        }
      })
    }
  })
}

module.exports = { init }
