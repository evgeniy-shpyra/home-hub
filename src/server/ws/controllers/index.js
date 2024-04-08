import deviceController from './deviceController.js'
import userController from './userController.js'

const initWsControllers = (services) => {
  return {
    device: deviceController(services),
    user: userController(services)
  }
}

export default initWsControllers
