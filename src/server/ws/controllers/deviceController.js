const deviceController = (services) => {
  const deviceService = services.device

  return {
    verifyClient: ({ id }, handlers) => {
      const device = deviceService.getDeviceById(id)
      return device ? true : false
    },
    onConnect: async ({ id }, handlers) => {
      deviceService.setOnlineDevise(id)
    },
    onClose: async ({ id }, handlers) => {
      deviceService.setOfflineDevise(id)
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
