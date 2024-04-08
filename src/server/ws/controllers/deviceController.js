const deviceController = (services) => {
  const deviceService = services.device

  return {
    verifyClient: ({ id }, handlers) => {
      const device = deviceService.getById(id)
      return !!device
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
    }
  }
}

export default deviceController
