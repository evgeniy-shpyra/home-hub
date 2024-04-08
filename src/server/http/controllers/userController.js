const userController = (services) => {
  const userService = services.user
  return {
    getUser: (body, user = {}) => {
      // const authData = userService.auth()

      // return { code: 200, cookie: replyCookie }
      return { code: 200, payload: user }
    }
  }
}

export default userController
