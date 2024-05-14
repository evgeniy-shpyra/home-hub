import crypto from 'node:crypto'
import { createHash } from '../utils/hash.js'

const userService = (dbHandlers, bus) => {
  const { User } = dbHandlers

  return {
    isAuth: (uuid) => {
      const resultCount = User.getCount()
      if (!resultCount.success) {
        throw new Error(result.message)
      }
      if (resultCount.payload === 0) {
        return { isAuth: true }
      } else if (!uuid) {
        return { isAuth: false }
      }
      const resultUser = User.getByUuid(uuid)
      if (!resultUser.success) {
        throw new Error(result.message)
      }

      if (resultUser.payload) {
        return { isAuth: true, user: resultUser.payload }
      }
      return { isAuth: false }
    },
    delete: (id) => {
      const result = User.deleteById(id)
      if (!result.success) {
        throw new Error(result.message)
      }
      const isDeleted = result.payload
      return isDeleted
    },
    login: ({ login, password }) => {
      const resultCount = User.getCount()
      if (!resultCount.success) {
        throw new Error(result.message)
      }

      if (resultCount.payload === 0) {
        return {}
      }

      const passwordHash = createHash(password)
      const resultUser = User.getByLoginAndPassword({
        login,
        password: passwordHash
      })
      if (!resultUser.success) {
        throw new Error(resultUser.message)
      }

      if (!resultUser.payload) return null

      const userInfo = {
        uuid: resultUser.payload.uuid
      }
      return userInfo
    },
    create: ({ login, password }) => {
      const uuid = crypto.randomUUID()
      const hashPassword = createHash(password)
      const result = User.create({ uuid, password: hashPassword, login })
      if (!result.success) {
        throw new Error(result.message)
      }
    },
    gatAll: () => {
      const result = User.getAll()
      if (!result.success) {
        throw new Error(result.error)
      }
      const usersDto = result.payload.map((u) => ({
        id: u.id,
        login: u.login,
        isOnline: !!u.isOnline,
        lastOnlineTime: u.lastOnlineTime
      }))
      return usersDto
    },
    connect: (uuid) => {
    }
  }
}

export default userService
