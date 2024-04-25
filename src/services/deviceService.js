import { createHash } from '../utils/hash.js'

const deviceService = (dbHandlers) => {
  const { Device, Action } = dbHandlers

  return {
    getAll: () => {
      const deices = Device.getAll()
      const devicesDto = deices.map((d) => ({
        id: d.id,
        name: d.name,
        isOnline: d.isOnline ? true : false,
        status: d.status ? true : false,
        connectedAt: d.connectedAt,
      }))
      return devicesDto
    },
    getById: (id) => {
      const response = Device.getById(id)
      if (!response.success) {
        throw new Error(response.error)
      }
      return response.payload
    },
    getDeviceByActive: (actionId) => {
      const devicesId = Device.getDeviceByActive(actionId)
      return devicesId
    },
    isVerified: (id, password) => {
      const device = Device.getByIdAndPassword(id, password)
      return device ? true : false
    },
    updateStatus: (id, isActive) => {
      Device.updateStatus(id, isActive ? 1 : 0)
    },
    create: ({ name, password }) => {
      const deviceData = {
        name,
        password: createHash(password),
      }
      const response = Device.create(deviceData)
      return response
    },
    setOnline: (id) => {
      Device.setOnline(true, id)
    },
    setOffline: (id) => {
      Device.setOnline(false, id)
    },
    delete: (id) => {
      const result = Device.deleteById(id)
      if (!result.success) {
        throw new Error(result.message)
      }
      const isDeleted = result.payload
      return isDeleted
    }
  }
}

export default deviceService
