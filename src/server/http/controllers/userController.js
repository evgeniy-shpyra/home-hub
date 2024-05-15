const userController = (services) => {
  const userService = services.user
  return {
    get: (_, user) => {
      const payload = {}
      if (user) {
        payload.token = user.uuid
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
      return { code: 200, payload: { token: userData.uuid } }
    },
    delete: ({ id }) => {
      const isDeleted = userService.delete(id)
      if (!isDeleted) {
        return {
          code: 400,
          payload: { error: `Can't delete user with id ${id}` },
        }
      }
      return { code: 204 }
    },
  }
}

export default userController
