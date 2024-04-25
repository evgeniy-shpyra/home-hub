import actionService from './actionService.js'
import deviceActionService from './deviceActionService.js'
import deviceService from './deviceService.js'
import sensorService from './sensorService.js'
import userService from './userService.js'

const services = (dbHandlers) => ({
  action: actionService(dbHandlers),
  device: deviceService(dbHandlers),
  user: userService(dbHandlers),
  sensor: sensorService(dbHandlers),
  deviceAction: deviceActionService(dbHandlers)
})

export default services
