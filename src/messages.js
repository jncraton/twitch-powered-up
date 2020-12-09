const debug = require('debug')('messages')

let tokens = []
let devices

const setAllowedDevices = (allowedDevices) => {
  devices = allowedDevices
}

const actionTokenFromMessage = (msg) => {
  let token = {
    multiplier: 1,
    min: -100,
    max: 100
  }

  devices.forEach(device => {
    if (device.nouns.some(n => msg.includes(n))) {
      token = Object.assign(token, device)

      device.actions.forEach(action => {
        if (action.verbs.some(v => msg.includes(v))) {
          token = Object.assign(token, action)
        }
      })
    }
  })

  try {
    token.value = parseInt(msg.match(/-?\d+/)[0])
    token.value = Math.max(token.value, token.min)
    token.value = Math.min(token.value, token.max)
  } catch (e) {
    debug('no value found')
  }
  token.time = new Date().getTime()
  return token
}

const add = (message) => {
  const token = actionTokenFromMessage(message)

  if (token.hub && token.port && token.method) {
    tokens.push(token)
  }
}

const expire = (messageLifetime) => {
  const now = new Date().getTime()

  // Filter out expired tokens
  tokens = tokens.filter(token => now - token.time < messageLifetime)
}

const getAverageValue = (hub, port, method) => {
  const deviceMethodTokens = tokens.filter(token =>
    token.hub === hub &&
    token.port === port &&
    token.method === method
  )

  return deviceMethodTokens.reduce((avg, token) =>
    token.value * token.multiplier / deviceMethodTokens.length + avg
  , 0)
}

module.exports = { setAllowedDevices, add, getAverageValue, expire, actionTokenFromMessage }
