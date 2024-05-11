import { actionBusEvent } from '../bus/busEvents.js'
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
    getByName: (name) => {
      const result = Sensor.getByName(name)
      if (!result.success) {
        throw new Error(result.message)
      }
      const sensor = result.payload
      return sensor
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
