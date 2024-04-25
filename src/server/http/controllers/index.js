import deviceController from './deviceController.js'
import actionController from './actionController.js'
import userController from './userController.js'
import deviceActionController from './deviceActionController.js'
import sensorController from './sensorController.js'

const initHttpControllers = (services) => {
  return {
    device: deviceController(services),
    action: actionController(services),
    user: userController(services),
    deviceAction: deviceActionController(services),
    sensor: sensorController(services)
  }
}

export default initHttpControllers
