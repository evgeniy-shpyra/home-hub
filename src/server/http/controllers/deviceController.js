import deviceService from '../../../services/deviceService.js'

const infoController = (services) => {
  const deviceService = services.device

  const get = () => {
    const payload = deviceService.getAllDevises()
    return { code: 200, payload }
  }

  return { get }
}

export default infoController
