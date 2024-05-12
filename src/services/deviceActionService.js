const deviceActionService = (dbHandlers, bus) => {
  const { DeviceAction } = dbHandlers

  return {
    create: ({ actionId, deviceId, priority, deviceStatus }) => {
      const result = DeviceAction.create({
        actionId,
        deviceId,
        priority,
        deviceStatus: deviceStatus ? 1 : 0
      })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    getAll: () => {
      const result = DeviceAction.select()
      if (!result.success) {
        throw new Error(result.error)
      }

      const deviceActionDto = result.payload.map((da) => ({
        ...da,
        status: !!da.status
      }))
      return deviceActionDto
    }
  }
}

export default deviceActionService
