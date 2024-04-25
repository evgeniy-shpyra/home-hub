const deviceActionService = (dbHandlers) => {
  const { Action, DeviceAction } = dbHandlers

  return {
    getAll: () => {
      const result = DeviceAction.select()
      if (!result.success) {
        throw new Error(result.error)
      }
     
      const deviceActionDto = result.payload.map((da) => ({
        ...da,
        status: da.status ? true : false,
      }))
      return deviceActionDto
    },
    addDeviceAction: ({ deviceId, actionId, status, priority }) => {
      const result = DeviceAction.addDeviceAction({
        deviceId,
        actionId,
        status: status ? 1 : 0,
        priority,
      }) 

      if (!result.success) {
        throw new Error(result.error)
      }
    },
  }
}

export default deviceActionService
