const infoController = (services) => {
  const deviceService = services.device

  const get = () => {
    const payload = deviceService.getAll()
    return { code: 200, payload }
  }

  const create = ({ name, password }) => {
    const response = deviceService.create({ name, password })
    if (!response.success) {
      return { code: 400, payload: { error: response.error } }
    }
    return { code: 200 }
  }

  return { get, create }
}

export default infoController
