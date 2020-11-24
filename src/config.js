const validate = require('jsonschema').validate;
const schema = require('./config_schema.json')
const config = require('../examples/exampleConfig.json')

console.log(validate(config, schema))
