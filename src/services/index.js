import actionService from './actionService.js'
import deviceService from './deviceService.js'

const services = (dbHandlers) => ({
  action: actionService(dbHandlers),
  device: deviceService(dbHandlers),
})

export default services
