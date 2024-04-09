const userController = (services) => {
  const userService = services.user

  return {
    verifyClient: ({ uuid }, handlers) => {
      const { isAuth } = userService.isAuth(uuid)
      return isAuth
    },
    onConnect: async (data, handlers) => {
      console.log('User connected')
    },
    onClose: async (data, handlers) => {
      console.log('User unconnected')
    },
    onMessage: async (data, handlers) => {
      console.log('onMessage', data)
    },
    onError: async (data, handlers) => {
      console.log('onError', data)
    }
  }
}

export default userController
