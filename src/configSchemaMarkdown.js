const js2md = require('json-schema-to-markdown')
const schema = require('./config.schema.json')

console.log(js2md(schema))
