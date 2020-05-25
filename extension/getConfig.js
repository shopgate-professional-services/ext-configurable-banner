const { promisify } = require('util')
const request = require('request')

const requestPromisified = promisify(request)

/**
 * Get config
 * @param {SDKContext} context
 * @returns {Promise<{drawings}>}
 */
module.exports = async (context) => {
  if (!context.config.configEndpoint && !context.config.banners) {
    return { config: [] }
  }

  // Static config
  if (!context.config.configEndpoint) {
    return { config: context.config.banners || [] }
  }

  // Dynamic config
  const { ttl, config } = await context.storage.extension.get('config') || {}
  if (ttl && ttl > Date.now() && config) {
    return { config }
  }

  try {
    const { body } = await requestPromisified({
      uri: context.config.configEndpoint,
      json: true,
      timeout: 2000
    })

    if (!Array.isArray(body.banners)) {
      context.log.warn(body, 'Endpoint response is malformed')
      await context.storage.extension.set('config', {
        ttl: Date.now() + context.config.configTTL * 1000,
        config: []
      })
      return {
        config: []
      }
    }

    await context.storage.extension.set('config', {
      ttl: Date.now() + context.config.configTTL * 1000,
      config: body.banners
    })
    return { config: body.banners }
  } catch (err) {
    context.log.error(err, 'Endpoint error')
    return {
      config: []
    }
  }
}
