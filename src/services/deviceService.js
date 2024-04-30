import {
  changeDeviceStatusBusEvent,
  deviceConDiscBusEvent,
} from '../bus/busEvents.js'
import { createHash } from '../utils/hash.js'

const deviceService = (dbHandlers, bus) => {
  const { Device, Action } = dbHandlers

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
        isOnline: d.isOnline ? true : false,
        status: d.status ? true : false,
        connectedAt: d.connectedAt,
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
    getDevicesByActiveActions: () => {
      const result = Device.getDevicesByActiveActions()
      if (!result.success) {
        throw new Error(result.message)
      }
      const daData = result.payload
      const deviceActionDTO = daData.map((da) => ({
        ...da,
        deviceStatus: da.deviceStatus ? true : false,
      }))

      return deviceActionDTO
    },
    getDevicesByActiveActionsById: (deviceId) => {
      const result = Device.getDevicesByActiveActionsById(deviceId)
      if (!result.success) {
        throw new Error(result.message)
      }
      const daData = result.payload
      const deviceActionDTO = daData.map((da) => ({
        ...da,
        deviceStatus: da.deviceStatus ? true : false,
      }))

      return deviceActionDTO
    },
    getByName: (name) => {
      const result = Device.getByName(name)
      if (!result.success) {
        throw new Error(result.message)
      }
      const device = result.payload
      return device
    },
    isVerified: ({ name, password }) => {
      const passwordHash = createHash(password)
      const result = Device.getByNameAndPassword({
        name,
        password: passwordHash,
      })
      if (!result.success) {
        throw new Error(result.message)
      }
      const device = result.payload
      return device ? true : false
    },
    changeStatus: ({ id, status }) => {
      bus.emit(changeDeviceStatusBusEvent, {
        id,
        status,
      })
    },
    updateStatusInfo: ({ status, id }) => {
      bus.emit(changeDeviceStatusBusEvent, {
        id,
        status,
      })
    },
    create: ({ name, password }) => {
      const deviceData = {
        name,
        password: createHash(password),
      }
      const result = Device.create(deviceData)
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    setOnline: (id) => {
      const result = Device.setOnline({ isOnline: 1, id })
      if (!result.success) {
        throw new Error(result.message)
      }
      bus.emit(deviceConDiscBusEvent, {
        id,
        isOnline: true,
      })
    },
    setOffline: (id) => {
      const result = Device.setOnline({ isOnline: 0, id })
      if (!result.success) {
        throw new Error(result.message)
      }
      bus.emit(deviceConDiscBusEvent, {
        id,
        isOnline: false,
      })
    },
    delete: (id) => {
      const result = Device.deleteById(id)
      if (!result.success) {
        throw new Error(result.message)
      }
      const isDeleted = result.payload
      return isDeleted
    },
  }
}

export default deviceService
