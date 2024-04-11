import deviceController from './deviceController.js'
import sensorController from './sensorController.js'
import userController from './userController.js'

const initWsControllers = (services) => {
  return {
    device: deviceController(services),
    user: userController(services),
    sensor: sensorController(services),
  }
}

export default initWsControllers
