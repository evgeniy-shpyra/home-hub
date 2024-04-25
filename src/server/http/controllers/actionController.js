const actionController = (services) => {
  const actionService = services.action

  return {
    getAll: () => {
      const payload = actionService.getAll()
      return { code: 200, payload }
    },
  }
}

export default actionController
