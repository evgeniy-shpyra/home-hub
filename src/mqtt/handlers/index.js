import deviceHandlers from './deviceHandlers.js'

const handlers = (client) => {
  return {
    device: deviceHandlers(client),
    ping: async () => {
      console.log('ping')
      const topic = 'ping'
      await client.publish(topic, 'true')
    }
  }
}

export default handlers
