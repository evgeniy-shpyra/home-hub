import actionService from './actionService.js'
import deviceService from './deviceService.js'
import userService from './userService.js'

const services = (dbHandlers) => ({
  action: actionService(dbHandlers),
  device: deviceService(dbHandlers),
  user: userService(dbHandlers)
})

export default services
