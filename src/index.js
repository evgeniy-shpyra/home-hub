import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'

const app = async () => {
  try {
    const onAlarmMessage = (data) => {
      console.log(JSON.parse(data.toString()))
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onAlarmMessage)

  } catch (e) {
    console.log(e)
  }
}

await app()
