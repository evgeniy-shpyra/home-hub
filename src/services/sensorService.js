import { createHash } from "../utils/hash.js"

const sensorService = (dbHandlers) => {
  const { Sensor } = dbHandlers

  return {
    create: ({ name, password, action_id }) => {
      const passwordHash = createHash(password)
      const result = Sensor.create({name, password: passwordHash, action_id})
      if(!result.success){
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
        connectedAt: s.connectedAt,
      }))

      return sensorDto
    },
    getById: (id) => {
      const sensor = Sensor.getById(id)
      return sensor
    },
    isVerified: (id, password) => {
      const device = Sensor.getByIdAndPassword(id, password)
      return device ? true : false
    },
    setOnline: (id) => {
      Sensor.setOnline(true, id)
    },
    setOffline: (id) => {
      Sensor.setOnline(false, id)
    },
    delete: (id) => {
      const result = Sensor.deleteById(id)
      if (!result.success) {
        throw new Error(result.message)
      }
      const isDeleted = result.payload
      return isDeleted
    }
  }
}

export default sensorService
