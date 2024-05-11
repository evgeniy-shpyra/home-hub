import userController from './userController.js'

const initWsControllers = (services) => {
  return {
    user: userController(services),
  }
}

export default initWsControllers
