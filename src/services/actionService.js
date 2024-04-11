const actionService = (dbHandlers) => {
  const { Device, Action } = dbHandlers

  return {
    updateActionStatus: (id, isActive) => {
      Action.updateStatus(id, isActive ? 1 : 0)
    },
    addDeviseToActive: (data) => {
      const { deviceId, actionId } = data
      const id = Action.addDeviceToActive(deviceId, actionId)
      return id
    },
    addDeviseToInactive: (data) => {
      const { deviceId, actionId } = data
      const id = Action.addDeviceToInactive(deviceId, actionId)
      return id
    },
    getAll: () => {
      const response = Action.select()
      return response
    },
  }
}

export default actionService
