const actionService = (dbHandlers) => {
  const { Action, DeviceAction } = dbHandlers

  return {
    updateActionStatus: (id, isActive) => {
      Action.updateStatus(id, isActive ? 1 : 0)
    },
    addDeviseToActive: (data) => {
      const { deviceId, actionId } = data
      const id = DeviceAction.addDeviceToActive(deviceId, actionId)
      return id
    },
    addDeviseToInactive: (data) => {
      const { deviceId, actionId } = data
      const id = DeviceAction.addDeviceToInactive(deviceId, actionId)
      return id
    },
    getStatusById: (id) => {
      const response = Action.selectStatusById(id)
      return response == 1 ? true : false
    },
    getActive: () => {
      const response = Action.selectActive()
      return response
    },
    getAll: () => {
      const response = Action.select()
      return response
    },
  }
}

export default actionService
