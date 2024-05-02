import { actionBusEvent, sensorConDiscBusEvent } from '../bus/busEvents.js'
import { createHash } from '../utils/hash.js'

const sensorService = (dbHandlers, bus) => {
  const { Sensor } = dbHandlers
  
  return {
    create: ({ name, password, action_id }) => {
      const passwordHash = createHash(password)
      const result = Sensor.create({ name, password: passwordHash, action_id })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    getAll: () => {
      const result = Sensor.getAll()
      if (!result.success) {
        throw new Error(result.error)
      }

      const sensorDto = result.payload.map((s) => ({
        id: s.id,
        name: s.name,
        isOnline: s.isOnline ? true : false,
        action_id: s.action_id,
        status: s.status ? true : false,
        connectedAt: s.connectedAt,
      }))

      return sensorDto
    },
    getById: (id) => {
      const result = Sensor.getById(id)
      if (!result.success) {
        throw new Error(result.error)
      }
      const sensor = result.payload
      return sensor
    },
    isVerified: ({ name, password }) => {
      const passwordHash = createHash(password)
      const result = Sensor.getByNameAndPassword({ name, password: passwordHash })
      if (!result.success) {
        throw new Error(result.error)
      }
      const sensor = result.payload
      return sensor ? true : false
    },
    getByName: (name) => {
      const result = Sensor.getByName(name)
      if (!result.success) {
        throw new Error(result.message)
      }
      const sensor = result.payload
      return sensor
    },
    setOnline: (id) => {
      const result = Sensor.setOnline({ isOnline: 1, id })
      if (!result.success) {
        throw new Error(result.error)
      }
      bus.emit(sensorConDiscBusEvent, {
        id,
        isOnline: true,
      })
    },
    setOffline: (id) => {
      const result = Sensor.setOnline({ isOnline: 0, id })
      if (!result.success) {
        throw new Error(result.error)
      }
      bus.emit(sensorConDiscBusEvent, {
        id,
        isOnline: false,
      })
    },
    delete: (id) => {
      const result = Sensor.deleteById(id)
      if (!result.success) {
        throw new Error(result.message)
      }
      const isDeleted = result.payload
      return isDeleted
    },
    changeStatus: ({ id, status }) => {
      const result = Sensor.changeStatus({ id, status: status ? 1 : 0 })
      if (!result.success) {
        throw new Error(result.message)
      }
      bus.emit(actionBusEvent, {id, status})
    },
  }
}

export default sensorService
