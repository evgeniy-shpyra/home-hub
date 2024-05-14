const actionController = (services) => {
  const actionService = services.action

  return {
    create: ({ name }) => {
      actionService.create(name)

      return { code: 200 }
    },
    getAll: () => {
      const payload = actionService.getAll()
      return { code: 200, payload }
    },
    delete: ({ id }) => {
      const isDeleted = actionService.delete(id)
      if (!isDeleted) {
        return {
          code: 400,
          payload: { error: `Can't delete action with id ${id}` }
        }
      }
      return { code: 204 }
    }
  }
}

export default actionController
