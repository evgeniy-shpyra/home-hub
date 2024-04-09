const userController = (services) => {
  const userService = services.user
  return {
    getUser: (body, user) => {
      const payload = {}

      if (user) {
        payload.id = user.uuid
        payload.login = user.login
      }

      return { code: 200, payload }
    },
  }
}

export default userController
