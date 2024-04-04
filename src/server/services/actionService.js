const actionService = (dbHandlers) => {
  const { Device, Action } = dbHandlers

  const addDeviseToActive = (data) => {
    const { deviceId, actionId } = data
    const id = Action.addDeviceToActive(deviceId, actionId)
    return id
  }
  const addDeviseToInactive = (data) => {
    const { deviceId, actionId } = data
    const id = Action.addDeviceToInactive(deviceId, actionId)
    return id
  }

  const getAllActions = () => {
    const response = Action.select()
    return response
  }

  return { addDeviseToActive, addDeviseToInactive, getAllActions }
}

export default actionService
