const userService = (dbHandlers) => {
  const { User } = dbHandlers

  return {
    isAuth: (uuid) => {
      const count = User.count()
      if (count === 0) {
        return { isAuth: true }
      } else if (!uuid) {
        return { isAuth: false }
      }

      const user = getByUuid(uuid)
      if (user) {
        return { isAuth: true, user }
      }
      return { isAuth: true }
    }
  }
}

export default userService
