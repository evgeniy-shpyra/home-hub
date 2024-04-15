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
    onMessage: async (jsonData, handlers) => {
      console.log('onMessage', data)
      const data = JSON.parse(jsonData)
      switch(data.action){
        case "changedStatus": 
        console.log(data)
        break
      }

    },
    onError: async (data, handlers) => {
      console.log('onError', data)
    },
  }
}

export default deviceController
