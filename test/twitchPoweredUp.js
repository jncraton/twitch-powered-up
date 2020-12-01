const assert = require('assert').strict
const twitchPoweredUp = require('../src/twitchPoweredUp')
const config = require('../examples/exampleConfig.json')

const test = async () => {
  const resolve = await twitchPoweredUp.checkValidConfig(config)
  assert.equal(resolve, 'good')
}

test()
