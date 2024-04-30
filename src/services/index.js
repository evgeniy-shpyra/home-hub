import actionService from './actionService.js'
import deviceActionService from './deviceActionService.js'
import deviceService from './deviceService.js'
import sensorService from './sensorService.js'
import userService from './userService.js'

const services = (dbHandlers, bus) => ({
  action: actionService(dbHandlers, bus),
  device: deviceService(dbHandlers, bus),
  user: userService(dbHandlers, bus),
  sensor: sensorService(dbHandlers, bus),
  deviceAction: deviceActionService(dbHandlers, bus)
})

export default services
