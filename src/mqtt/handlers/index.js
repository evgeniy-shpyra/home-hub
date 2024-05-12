import deviceHandlers from './deviceHandlers.js'

const handlers = (client) => {
  return {
    device: deviceHandlers(client),
    ping: async () => {
      const topic = 'ping'
      await client.publish(topic, 'true')
    }
  }
}

export default handlers
