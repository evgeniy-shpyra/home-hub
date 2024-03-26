import config from '../config.json' assert { type: 'json' }
import initAlarmApi from './api/initAlarmApi.js'
import initMqttApi from './api/initMqttApi.js'

const app = async () => {
  try {
    
    const mqtt = initMqttApi(config.mqttBroker)
    await mqtt.strat()
    console.log('connected to mqtt broker')

    const onAlarmMessage = (dataBuffer) => {
      const data = JSON.parse(dataBuffer.toString())
      console.log(data)

      mqtt.publish('alarm', JSON.stringify(data), {qos: 2})
    }

    const alarmApi = initAlarmApi(config.mainServer)
    alarmApi.subscribe('alarm', onAlarmMessage)


  } catch (e) {
    console.log(e)
  }
}

console.log("start")
await app()
