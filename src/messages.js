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

  const numbers = msg.match(/-?\d+/)

  if (numbers) {
    token.value = parseInt(numbers[0])
  }

  token.value = Math.max(token.value, token.min)
  token.value = Math.min(token.value, token.max)

  if (token.relative) {
    token.value += getAverageValue(token.hub, token.port, token.method)
  }

  token.time = new Date().getTime()
  return token
}

const add = (message, username = '') => {
  const token = actionTokenFromMessage(message)
  token.username = username

  if (token.hub && token.port && token.method) {
    // Remove old tokens from this user for this hub, port, and method
    tokens = tokens.filter(t =>
      token.hub !== t.hub ||
      token.port !== t.port ||
      token.method !== t.method ||
      token.username !== t.username
    )
    tokens.push(token)
  }
}

const expire = (globalLifetime) => {
  const now = new Date().getTime()

  // Filter out expired tokens
  tokens = tokens.filter(token => {
    const lifetime = typeof token.lifetime === 'undefined' ? globalLifetime : token.lifetime
    return now - token.time < lifetime
  })
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
