import threatHandler from '../../../threatHandler.js'
import { createHash } from '../../../utils/hash.js'

const sensorController = (services) => {
  const sensorService = services.sensor

  return {
    verifyClient: ({ id, password }, handlers) => {
      const passwordHash = createHash(password)
      const sensor = sensorService.isVerified(id, passwordHash)
      console.log({ sensor })
      return sensor ? true : false
    },
    onConnect: ({ id }, handlers) => {
      console.log('Sensor connected')
      sensorService.setOnline(id)
      const sensorData = sensorService.getById(id)

      return sensorData
    },
    onClose: ({ id }, handlers) => {
      sensorService.setOffline(id)
      console.log('Sensor unconnected')
    },
    onMessage: ({ message: messageJson, sensorData }, handlers) => {
      const message = JSON.parse(messageJson)
      const actionId = sensorData.action_id

      threatHandler(actionId, message.isDanger, services, handlers)
    },
    onError: (data, handlers) => {
      console.log('onError', data)
    },
  }
}

export default sensorController
