const infoController = (services) => {
  const deviceService = services.device
  const actionService = services.action

  const get = () => {
    const devices = deviceService.getAll()
    const actions = actionService.getAll()

    const payload = {
      devices,
      actions
    }

    return { code: 200, payload }
  }

  return { get }
}

export default infoController
