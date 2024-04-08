const infoController = (services) => {
  const deviceService = services.device

  const get = () => {
    const payload = deviceService.getAll()
    return { code: 200, payload }
  }

  const create = ({ name }) => {
    const deviceId = deviceService.create(name)
    const payload = { isCreated: deviceId == !false }
    return { code: 200, payload }
  }

  return { get, create }
}

export default infoController
