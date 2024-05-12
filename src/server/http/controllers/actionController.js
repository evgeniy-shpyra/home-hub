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
    }
  }
}

export default actionController
