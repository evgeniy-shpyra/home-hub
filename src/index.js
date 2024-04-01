import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initMqttApi from './api/initMqttApi.js'
import initDb from './db/initDb.js'
import initHttp from './server/http.js'
import Server from './server/server.js'

const app = async () => {
  try {
    const mqtt = initMqttApi(config.mqttBroker)
    await mqtt.strat()

    const onAlarmMessage = (dataBuffer) => {
      const data = JSON.parse(dataBuffer.toString())
      console.log(data)

      mqtt.publish('alarm', JSON.stringify(data), { qos: 2 })
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onAlarmMessage)

    const dbHandlers = initDb()

    dbHandlers.models.Action.create({ id: 1, name: 'Air alarm' })

    const server = Server(config.server)
    await initHttp(server.server)

    await server.start()
  } catch (e) {
    console.log(e)
  }
}

console.log('start')
await app()
