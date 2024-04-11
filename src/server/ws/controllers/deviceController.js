import { createHash } from '../../../utils/hash.js'

const deviceController = (services) => {
  const deviceService = services.device

  return {
    verifyClient: ({ id, password }, handlers) => {
      const passwordHash = createHash(password)
      console.log(passwordHash)
      const isVerified = deviceService.isVerified(id, passwordHash)

      return isVerified
    },
    onConnect: async ({ id }, handlers) => {
      deviceService.setOnline(id)
    },
    onClose: async ({ id }, handlers) => {
      deviceService.setOffline(id)
    },
    onMessage: async (data, handlers) => {
      console.log('onMessage', data)
    },
    onError: async (data, handlers) => {
      console.log('onError', data)
    },
  }
}

export default deviceController
