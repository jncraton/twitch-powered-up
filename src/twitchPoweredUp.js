const twitch = require('./twitch')
const bluetooth = require('./bluetooth')
const config = require('../config.json')
var allTokens = []

const init = () => {
  twitch.connect(onMessageHandler, onConnectedHandler)
  bluetooth.startScan()
  setInterval(update, config.twitch.decay)
}

const onMessageHandler = (target, context, msg, self) => {
  // Ignore messages from the bot such as shout messages for user commands
  if (self) { return }

  // Remove whitespace from chat message
  const message = msg.trim().toLowerCase()
  const token = twitch.actionTokenFromMessage(message)

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
