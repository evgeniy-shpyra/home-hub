const userController = (services) => {
  const userService = services.user

  return {
    verifyClient: ({ uuid }) => {
      const { isAuth } = userService.isAuth(uuid)
      return isAuth
    },
    onConnect: async ({ uuid }) => {
      userService.connect(uuid)
      console.log('User connected')
    },
    onClose: async (data) => {
      console.log('User unconnected')
    },
    onMessage: async (data) => {
      console.log('onMessage', data)
    },
    onError: async (data) => {
      console.log('onError', data)
    },
  }
}

export default userController
