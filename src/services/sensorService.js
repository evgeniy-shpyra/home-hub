const sensorService = (dbHandlers) => {
  const { Sensor } = dbHandlers

  return {
    getAll: () => {
      const sensors = Sensor.getAll()
      return sensors
    },
    getById: (id) => {
      const sensor = Sensor.getById(id)
      return sensor
    },
    isVerified: (id, password) => {
      const device = Sensor.getByIdAndPassword(id, password)
      return device ? true : false
    },
    create: (name) => {},
    setOnline: (id) => {
      Sensor.setOnline(true, id)
    },
    setOffline: (id) => {
      Sensor.setOnline(false, id)
    },
  }
}

export default sensorService
