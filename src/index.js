import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initMqttApi from './api/initMqttApi.js'
import initDb from './db/initDb.js'
import initHttp from './server/http/httpServer.js'
import Server from './server/server.js'
import deviceControllerWs from './server/ws/controllers/deviceController.js'
import deviceControllerHttp from './server/http/controllers/deviceController.js'
import initWebsocket from './server/ws/wsServer.js'
import actionController from './server/http/controllers/actionController.js'

const app = async () => {
  try {
    // const mqtt = initMqttApi(config.mqttBroker)
    // await mqtt.strat()

    const onAlarmMessage = (dataBuffer) => {
      const data = JSON.parse(dataBuffer.toString())
      console.log(data)

      // mqtt.publish('alarm', JSON.stringify(data), { qos: 2 })
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onAlarmMessage)

    const db = initDb()

    const server = Server(config.server)

    const httpControllers = {
      device: deviceControllerHttp(db.models),
      action: actionController(db.models),
    }
    await initHttp(server.server, httpControllers)

    const wsControllers = { device: deviceControllerWs(db.models) }
    await initWebsocket(server.server, wsControllers, db.models)

    await server.start()
  } catch (e) {
    console.log(e)
  }
}

console.log('start')
await app()
