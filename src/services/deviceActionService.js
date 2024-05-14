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
    bultUpdateCreate: function (devisesActions) {
      const itemsForCreating = []
      for (const key in devisesActions) {
        const item =  {...devisesActions[key], deviceStatus: devisesActions[key].deviceStatus ? 1 : 0}
        if(item.id){
          this.update(item)
        }
        else{
          itemsForCreating.push(item)
        }
      }

      if(itemsForCreating.length)
        this.bulkCreate(itemsForCreating)
    },
    bulkCreate: (devisesActions) => {
      const result = DeviceAction.bulkCreate(devisesActions)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    update: (deviseAction) => {
      const result = DeviceAction.update(deviseAction)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    bulkCreate: (devisesActions) => {
      const result = DeviceAction.bulkCreate(devisesActions)
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
