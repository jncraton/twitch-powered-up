const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
const fs = require('fs')
const stream = require('./stream')
const xdgBasedir = require('xdg-basedir')
const configPath = xdgBasedir.config + '/twitch-powered-up.json'
let config

const init = async () => {
  config = await getConfig()
  await checkValidConfig()
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
      console.log(e)
      fs.copyFile('examples/exampleConfig.json', configPath, (err) => {
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

const checkValidConfig = () => {
  return new Promise(resolve => {
    const configErrors = []

    if (!config) { configErrors.push('config not found...') }
    if (config && !config.twitch) { configErrors.push('config.twitch not found...') }
    if (config && config.twitch && !config.twitch.auth) { configErrors.push('config.twitch.auth not found...') }
    if (config && config.twitch && !config.twitch.refresh) { configErrors.push('config.twitch.refresh not found...') }
    if (config && config.twitch && !config.twitch.username) { configErrors.push('config.twitch.username not found...') }
    if (config && config.twitch && !config.twitch.channel) { configErrors.push('config.twitch.channel not found...') }

    if (config && config.twitch && !config.twitch.stream) { configErrors.push('config.twitch.stream not found...') }
    if (config && config.twitch && config.twitch.stream && !config.twitch.stream.streamKey) { configErrors.push('config.twitch.stream.streamKey not found...') }
    if (config && config.twitch && config.twitch.stream && !config.twitch.stream.ingestServer) { configErrors.push('config.twitch.stream.ingestServer not found...') }
    if (config && config.twitch && config.twitch.stream && !config.twitch.stream.displayDevice) { configErrors.push('config.twitch.stream.displayDevice not found...') }
    if (config && config.twitch && config.twitch.stream && !config.twitch.stream.framerate) { configErrors.push('config.twitch.stream.framerate not found...') }
    if (config && config.twitch && config.twitch.stream && !config.twitch.stream.qualityPreset) { configErrors.push('config.twitch.stream.qualityPreset not found...') }

    if (config && !config.devices) { configErrors.push('config.devices not found...') }
    if (config && config.devices && config.devices.length === 0) { configErrors.push('config.devices has no devices...') }

    if (config && config.devices) {
      config.devices.forEach((device, deviceIndex) => {
        if (!device.hub) { configErrors.push('config.device[' + deviceIndex + '].hub not found...') }
        if (!device.port) { configErrors.push('config.device[' + deviceIndex + '].port not found...') }
        if (!device.nouns) { configErrors.push('config.device[' + deviceIndex + '].nouns not found...') }
        if (!device.actions) { configErrors.push('config.device[' + deviceIndex + '].actions not found...') }
        if (device.nouns && device.nouns.length === 0) { configErrors.push('config.device[' + deviceIndex + '].actions has no nouns...') }
        if (device.actions && device.actions.length === 0) { configErrors.push('config.device[' + deviceIndex + '].actions has no actions...') }

        if (device.actions) {
          device.actions.forEach((action, actionIndex) => {
            if (!action.method) { configErrors.push('config.device[' + deviceIndex + '].actions[' + actionIndex + '].method not found...') }
            if (!action.verbs) { configErrors.push('config.device[' + deviceIndex + '].actions[' + actionIndex + '].verbs not found...') }
            if (typeof action.value === 'undefined') { configErrors.push('config.device[' + deviceIndex + '].actions[' + actionIndex + '].value not found...') }
            if (action.verbs && action.verbs.length === 0) { configErrors.push('config.device[' + deviceIndex + '].actions[' + actionIndex + '].verbs has no verbs...') }
          })
        }
      })
    }

    if (configErrors.length > 0) {
      configErrors.forEach((error) => {
        console.log(error)
      })
      console.log(configPath + ' is not set up properly...')
      process.exit(1)
    } else {
      resolve('done')
    }
  })
}

module.exports = { init }
