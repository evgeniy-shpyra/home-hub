const actionService = (dbHandlers) => {
  const { Action, DeviceAction } = dbHandlers

  return {
    updateActionStatus: (id, isActive) => {
      Action.updateStatus(id, isActive ? 1 : 0)
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
      if(!response.success) throw new Error(response.error)
      return response.payload
    },
  }
}

export default actionService
