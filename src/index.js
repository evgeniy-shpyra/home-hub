import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initDb from './db/initDb.js'
import initHttp from './server/http/httpServer.js'
import Server from './server/server.js'
import initHttpControllers from './server/http/controllers/index.js'
import initWebsocket from './server/ws/wsServer.js'
import Services from './services/index.js'
import initWsControllers from './server/ws/controllers/index.js'
import { EventEmitter } from 'node:events'
import { actionBusEvent } from './bus/busEvents.js'
import webSocketEventHandler from './webSocketEventHandler.js'
import initMqtt from './mqtt/initMqtt.js'

const app = async () => {
  const bus = new EventEmitter()

  const db = initDb()
  const server = await Server(config.server)
  const services = Services(db.models, bus)

  const httpControllers = initHttpControllers(services)
  await initHttp(server.server, httpControllers, services)

  const wsControllers = initWsControllers(services)
  const wsHandlers = await initWebsocket(server.server, wsControllers)
  const mqtt = await initMqtt(config.mqtt, services, bus)

  const alarmApi = initAlarmApi(config.mainServer, 5_000)

  alarmApi.subscribe('alarm', (data) => {
    // services.sensor.changeStatus({
    //   id: 1,
    //   // status: data.isDanger,
    //   status: true,
    // })
  })

  webSocketEventHandler(wsHandlers, mqtt.handlers, bus, services)
  await server.start()

  return {
    stop: () => {
      server.stop()
      mqtt.stop()
      alarmApi.stop()
      db.close()
    },
  }
}

export default app
