import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initDb from './db/initDb.js'
import initHttp from './server/http/httpServer.js'
import Server from './server/server.js'
import initHttpControllers from './server/http/controllers/index.js'
import initWebsocket from './server/ws/wsServer.js'
import Services from './services/index.js'
import initWsControllers from './server/ws/controllers/index.js'


const app = async () => {
  try {
    const db = initDb()
    const server = await Server(config.server)
    const services = Services(db.models)

    const httpControllers = initHttpControllers(services)
    await initHttp(server.server, httpControllers, services)

    const wsControllers = initWsControllers(services)
    const wsHandlers = await initWebsocket(server.server, wsControllers)

    const onMissileThreatMessage = (dataBuffer) => {
      const actionId = 'missileThreat'
      const sendDataToUsers = wsHandlers.user

      const data = JSON.parse(dataBuffer.toString())
      const dangerStatus = config.alarm.missileDangerStatus

      const isAlarm = data.statusId === dangerStatus

      console.log(data)
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onMissileThreatMessage)

    await server.start()
  } catch (e) {
    console.log(e)
  }
}

console.log('start')
await app()
