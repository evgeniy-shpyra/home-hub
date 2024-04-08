import deviceController from './deviceController.js'
import actionController from './actionController.js'
import infoController from './infoController.js'
import userController from './userController.js'

const initHttpControllers = (services) => {
  return {
    device: deviceController(services),
    action: actionController(services),
    info: infoController(services),
    user: userController(services)
  }
}

export default initHttpControllers
