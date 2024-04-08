import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initDb from './db/initDb.js'
import initHttp from './server/http/httpServer.js'
import Server from './server/server.js'
import deviceControllerWs from './server/ws/controllers/deviceController.js'
import deviceControllerHttp from './server/http/controllers/deviceController.js'
import initWebsocket from './server/ws/wsServer.js'
import actionController from './server/http/controllers/actionController.js'
import Services from './services/index.js'
import infoController from './server/http/controllers/deviceController.js'

const app = async () => {
  try {
    const db = initDb()

    const server = Server(config.server)

    const services = Services(db.models)

    const httpControllers = {
      device: deviceControllerHttp(services),
      action: actionController(services),
      info: infoController(services)
    }
    await initHttp(server.server, httpControllers)

    const wsControllers = {
      device: deviceControllerWs(services),
    }
    const wsHandlers = await initWebsocket(server.server, wsControllers)

    const onAlarmMessage = (dataBuffer) => {
      const data = JSON.parse(dataBuffer.toString())
      const dangerStatus = config.alarm.missileDangerStatus
      if(data.statusId === dangerStatus){

      }
      else{
        
      }

     

      console.log(data)
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onAlarmMessage)

    await server.start()
  } catch (e) {
    console.log(e)
  }
}

console.log('start')
await app()
