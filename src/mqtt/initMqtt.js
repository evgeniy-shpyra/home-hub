import MQTT from 'async-mqtt'
import deviceHandlers from './handlers/deviceHandlers.js'
import controllers from './controllers.js'
import handlers from './handlers/index.js'

const initMqtt = async ({ host, port }, services, bus) => {
  const client = await MQTT.connectAsync(`tcp://${host}:${port}`)

  await controllers(client, services, bus)

  return {
    handlers: handlers(client),
    stop: async () => {
      await client.end()
      console.log('Mqtt has been stopped')
    },
  }
}

export default initMqtt
