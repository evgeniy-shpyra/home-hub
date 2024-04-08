const userController = (services) => {
  const userService = services.user

  return {
    verifyClient: ({ uuid }, handlers) => {
      const { isAuth } = userService.isAuth(uuid)
      return isAuth
    },
    onConnect: async ({ id }, handlers) => {},
    onClose: async ({ id }, handlers) => {},
    onMessage: async (data, handlers) => {
      console.log('onMessage', data)
    },
    onError: async (data, handlers) => {
      console.log('onError', data)
    }
  }
}

export default userController
