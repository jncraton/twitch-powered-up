const assert = require('assert').strict
const twitchPoweredUp = require('../src/twitchPoweredUp')
const config = require('../examples/exampleConfig.json')

const test = async () => {
  await twitchPoweredUp.checkValidConfig(config)
}

test()
