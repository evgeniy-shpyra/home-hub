const actionService = (dbHandlers) => {
  const { Action } = dbHandlers

  return {
    create: (name) => {
      const result = Action.create(name)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    updateActionStatus: (id, isActive) => {
      const result = Action.updateStatus({ id, isActive: isActive ? 1 : 0 })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    getStatusById: (id) => {
      const result = Action.selectStatusById(id)
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.payload == 1
    },
    getActive: () => {
      const result = Action.selectActive()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.payload
    },
    getAll: () => {
      const result = Action.select()
      if (!result.success) {
        throw new Error(result.error)
      }
      return result.payload
    }
  }
}

export default actionService
