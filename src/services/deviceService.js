import { changeDeviceStatusBusEvent } from '../bus/busEvents.js'
import { createHash } from '../utils/hash.js'

const deviceService = (dbHandlers, bus) => {
  const { Device } = dbHandlers

  return {
    getAll: () => {
      const result = Device.getAll()
      if (!result.success) {
        throw new Error(result.message)
      }
      const deices = result.payload
      const devicesDto = deices.map((d) => ({
        id: d.id,
        name: d.name,
        isOnline: !!d.isOnline,
        status: !!d.status,
        connectedAt: d.connectedAt
      }))
      return devicesDto
    },
    getById: (id) => {
      const result = Device.getById(id)
      if (!result.success) {
        throw new Error(result.message)
      }

      return result.payload
    },
    getByName: (name) => {
      const result = Device.getByName(name)
      if (!result.success) {
        throw new Error(result.message)
      }
      const device = result.payload
      return device
    },
    getDevicesByActiveActions: () => {
      const result = Device.getDevicesByActiveActions()
      if (!result.success) {
        throw new Error(result.message)
      }

      return result.payload
    },
    getDevicesByActiveActionsById: (deviceId) => {
      const result = Device.getDevicesByActiveActionsById(deviceId)
      if (!result.success) {
        throw new Error(result.message)
      }

      return result.payload
    },
    changeStatus: function ({ id, status }) {
      const device = this.getById(id)
      if (!device) throw new Error("Device isn't exist")

      bus.emit(changeDeviceStatusBusEvent, {
        name: device.name,
        status
      })
    },
    create: ({ name }) => {
      const deviceData = {
        name
      }
      const result = Device.create(deviceData)
      if (!result.success) {
        throw new Error(result.error)
      }
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
