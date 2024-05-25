const deviceActionController = (services) => {
  const deviceActionService = services.deviceAction

  return {
    getAll: () => {
      const payload = deviceActionService.getAll()
      return { code: 200, payload }
    },
    create: ({ actionId, deviceId, priority, deviceStatus }) => {
      deviceActionService.create({ actionId, deviceId, priority, deviceStatus })
      return { code: 200 }
    },
    bulkUpdate: (devicesActions) => {
      deviceActionService.bulkUpdate(devicesActions)
      return { code: 200 }
    }
  }
}

export default deviceActionController
