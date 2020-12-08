const assert = require('assert').strict
const twitch = require('../src/twitch')
const config = require('../examples/exampleConfig.json')

const test = () => {
  const token = twitch.actionTokenFromMessage('Move the red train forward at power 30', config)
  twitch.update()
  assert.equal(token.hub, 'hub1')
  assert.equal(token.port, 'A')
  assert.equal(token.method, 'setPower')
  assert.equal(token.value, 30)
  assert.equal(averageValue, 30)
  
  const token1 = twitch.actionTokenFromMessage('Move the red train forward at power 60', config)
  twitch.update()
  assert.equal(averageValue, 45)
    
  const token2 = twitch.actionTokenFromMessage('Turn on the lights of the red train', config)
  twitch.update()
  assert.equal(averageValue, 100)

}

module.exports = { test }
