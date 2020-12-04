const assert = require('assert').strict
const configjs = require('../src/config')
const config = require('../examples/exampleConfig.json')

const test = () => {
  configjs.validateConfig(config)
  assert.throws(
    () => {
      configjs.validateConfig({})
    },
    Error
  )
}

module.exports = { test }
