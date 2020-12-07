const fs = require('fs')
const jsonschema = require('jsonschema')
const xdgBasedir = require('xdg-basedir')
const configPath = xdgBasedir.config + '/twitch-powered-up.json'
const examplePath = __dirname.replace(/\\/g, '/').replace(/\/src$/, '/examples/exampleConfig.json')
const schema = require('./config.schema.json')

const getConfig = async () => {
  try {
    await fs.promises.access(configPath)
  } catch (e) {
    await fs.promises.copyFile(examplePath, configPath)
    throw new Error(`Config not found\nNew config created at ${configPath}\nEnter Twitch tokens before running again.`)
  }

  return require(configPath)
}

const validateConfig = (config) => {
  const result = jsonschema.validate(config, schema)

  if (result.errors.length) {
    throw new Error('There were errors found in your config file.\n' + result.errors)
  }
}

module.exports = { getConfig, validateConfig }
