const userController = (services) => {
  const userService = services.user
  return {
    get: (_, user) => {
      const payload = {}
      if (user) {
        payload.id = user.uuid
        payload.login = user.login
      }
      return { code: 200, payload }
    },
    getAll: () => {
      const payload = userService.gatAll()
      return { code: 200, payload }
    },
    create: ({ login, password }) => {
      userService.create({ login, password })
      return { code: 200 }
    },
    login: ({ login, password }) => {
      const userData = userService.login({ login, password })

      if (!userData) {
        return { code: 401, payload: { error: 'Not authorized' } }
      }
      const response = { code: 200, payload: userData }
      if (Object.keys(userData).length) {
        response.user = { uuid: userData.uuid }
      }
      return response
    },
    delete: ({ id }) => {
      const isDeleted = userService.delete(id)
      if (!isDeleted) {
        return {
          code: 400,
          payload: { error: `Can't delete user with id ${id}` }
        }
      }
      return { code: 204 }
    }
  }
}

export default userController
