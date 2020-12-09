const assert = require('assert').strict
const config = require('../examples/config.json')
const messages = require('../src/messages')

const test = () => {
  messages.setAllowedDevices(config.devices)

  messages.add('red train go 50', 'user1')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 50)
  messages.add('red train go 100', 'user2')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 75)

  messages.expire(0)
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 0)

  messages.add('red train go 50', 'user1')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 50)
  messages.add('red train faster 50', 'user2')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 75)

  messages.expire(0)
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 0)

  messages.add('red train go 50', 'user1')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 50)
  messages.add('red train faster 50', 'user1')
  assert.equal(messages.getAverageValue('hub1', 'A', 'setPower'), 100)
}

module.exports = { test }
