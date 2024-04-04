import deviceService from '../../services/deviceService.js'

const deviceController = (dbHandlers) => {
  const services = deviceService(dbHandlers)

  const create = ({ name }) => {
    const deviceId = services.createDevice(name)
    const payload = { isCreated: deviceId == !false }
    return { code: 200, payload }
  }

  const get = () => {
    const payload = services.getAllDevises()

    return { code: 200, payload }
  }

  return { create, get }
}

export default deviceController
