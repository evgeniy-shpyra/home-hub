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
  }
}

export default deviceService
