const assert = require('assert').strict
const config = require('../examples/exampleConfig.json')
const messages = require('../src/messages')

const test = () => {
  messages.setAllowedDevices(config.devices)

  messages.add('red train go 50')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 50)
  messages.add('red train go 100')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 75)

  messages.expire(0)
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 0)

  messages.add('red train go 50')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 50)
  messages.add('red train faster 50')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 75)
}

module.exports = { test }
