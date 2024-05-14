const deviceActionService = (dbHandlers, bus) => {
  const { DeviceAction } = dbHandlers

  return {
    create: ({ actionId, deviceId, priority, deviceStatus }) => {
      const result = DeviceAction.create({
        actionId,
        deviceId,
        priority,
        deviceStatus: deviceStatus ? 1 : 0,
      })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    bulkCreate: (devisesActions) => {
      const items = []
      for (const key in devisesActions) {
        items.push({
          ...devisesActions[key],
          deviceStatus: devisesActions[key].deviceStatus ? 1 : 0,
        })
      }
      const result = DeviceAction.bulkCreate(items)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    deleteAll: () => {
      const result = DeviceAction.deleteAll()
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
        status: !!da.status,
      }))
      return deviceActionDto
    },
  }
}

export default deviceActionService
