const deviceActionController = (services) => {
  const deviceActionService = services.deviceAction

  return {
    getAll: () => {
      const payload = deviceActionService.getAll()
      return { code: 200, payload }
    },
    create: (data) => {
      deviceActionService.addDeviceAction(data)
      return { code: 200 }
    },
  }
}

export default deviceActionController
