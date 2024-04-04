import deviceService from '../../services/deviceService.js'

const deviceController = (dbHandlers) => {
  const services = deviceService(dbHandlers)
  return {
    verifyClient: ({ id }) => {
      const device = services.getDeviceById(id)
      return device ? true : false
    },
    onConnect: async ({ id }) => {
      services.setOnlineDevise(id)

    },
    onClose: async ({ id }) => {
      services.setOfflineDevise(id)
    },
    onMessage: async (data) => {
      console.log('onMessage', data)
    },
    onError: async (data) => {
      console.log('onError', data)
    },
  }
}

export default deviceController
