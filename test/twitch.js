const assert = require('assert').strict
const twitch = require('../src/twitch')

const token = twitch.actionTokenFromMessage('Move the red train forward at power 30')

assert.equal(token.hub, 'hub1')
assert.equal(token.port, 'A')
assert.equal(token.method, 'setPower')
assert.equal(token.value, 30)
