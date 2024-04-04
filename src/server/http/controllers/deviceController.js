import deviceService from '../../../services/deviceService.js'

const deviceController = (services) => {
  const deviceService = services.device
  
  const create = ({ name }) => {
    const deviceId = deviceService.createDevice(name)
    const payload = { isCreated: deviceId == !false }
    return { code: 200, payload }
  }

  const get = () => {
    const payload = deviceService.getAllDevises()
    return { code: 200, payload }
  }

  return { create, get }
}

export default deviceController
