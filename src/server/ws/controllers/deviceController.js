import { createHash } from '../../../utils/hash.js'

const deviceController = (services) => {
  const deviceService = services.device
  const actionService = services.action

  return {
    verifyClient: ({ name, password }) => {
      const isVerified = deviceService.isVerified({ name, password })
      return isVerified
    },
    getDevice: (name) => {
      const device = deviceService.getByName(name)
      return device
    },
    onConnect: async ({ id }) => {
      deviceService.setOnline(+id)
    },
    onClose: async ({ id }) => {
      console.log('disconnect')
      deviceService.setOffline(+id)
    },
    onMessage: async ({ message: messageJson, device }) => {
      const message = JSON.parse(messageJson)
      switch (message.action) {
        case 'changeStatus':
          deviceService.changeStatus({ status: message.status, id: device.id })
          break
        case 'status':
          deviceService.updateStatusInfo({ status: message.status, id: device.id })
          break
      }
    },
    onError: async (data) => {
      console.log('onError', data)
    },
  }
}

export default deviceController
