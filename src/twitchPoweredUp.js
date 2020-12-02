const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
<<<<<<< HEAD
const config = require('../config.json')
var allTokens = []
=======
const fs = require('fs')
const stream = require('./stream')
const xdgBasedir = require('xdg-basedir')
const jsonschema = require('jsonschema')
const configPath = xdgBasedir.config + '/twitch-powered-up.json'
const examplePath = __dirname.replace(/\\/g, '/').replace(/\/src$/, '/examples/exampleConfig.json')
const schema = require('./config.schema.json')

let config
>>>>>>> 7461da7d90814bbe3673ab87bb17b0011a73ad22

const init = async () => {
  config = await getConfig()
  try {
    await validateConfig(config)
  } catch (e) {
    process.exit(1)
  }

  twitch.connect(onMessageHandler, onConnectedHandler, config)
  bluetooth.startScan()
<<<<<<< HEAD
  setInterval(update, config.twitch.decay)
=======
  stream.start(config)
>>>>>>> 7461da7d90814bbe3673ab87bb17b0011a73ad22
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  const token = twitch.actionTokenFromMessage(message, config)

  if (token.hub && token.port && token.method) {
    allTokens.push(token)
  }
}

const useToken = (token) => {
  // const token  = twitch.actionTokenFromMessage(message)
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

<<<<<<< HEAD
const update = () => {
  var now = new Date().getTime()
  for (var i = 0; i < allTokens.length; i++) {
    // give the user a minute to add a new command before their origonal gets taken off
    if (now - allTokens[i].time > 90000) {
      var popped = allTokens[i]
      allTokens.splice(i, 1)
      var Similar = false
      for (var j = 0; i < allTokens.length; i++) {
        if (popped.nouns[0] === allTokens[j].nouns[0]) {
          Similar = true
          break
        }
      }
      if (!Similar) {
        var msg = popped.nouns[0] + ' ' + popped.verbs[0] + ' ' + 0
        var Default = twitch.actionTokenFromMessage(msg)
        useToken(Default)
      }
    }
  }

  var average = []
  for (var lcv = 0; lcv < allTokens.length; lcv++) {
    average[lcv] = allTokens[lcv]
  }
  while (average.length) {
    var currentToken = average[0]
    var newValue = currentToken.value
    var numberOfElements = 1
    for (var k = 1; k < average.length; k++) {
      if (currentToken.nouns[0] === average[k].nouns[0]) {
        newValue = newValue + average[k].value
        numberOfElements++
        average.splice(k, 1)
        k--
      }
    }
    newValue = newValue / numberOfElements
    var newMessage = currentToken.nouns[0] + ' ' + currentToken.verbs[0] + ' ' + newValue
    var newToken = twitch.actionTokenFromMessage(newMessage)
    // Work.value = newValue
    useToken(newToken)
    average.splice(0, 1)
  }
}

init()
=======
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

const validateConfig = async (config) => {
  const result = jsonschema.validate(config, schema)

  if (result.errors) {
    console.log('There were errors found in your config file.')
    result.errors.forEach(e => {
      console.log(e.stack.replace('instance.', ''))
    })
    throw new Error(result)
  }
}

module.exports = { init }
>>>>>>> 7461da7d90814bbe3673ab87bb17b0011a73ad22
