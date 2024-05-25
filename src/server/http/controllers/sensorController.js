const sensorController = (services) => {
  const sensorService = services.sensor

  return {
    create: ({ name, actionId }) => {
      sensorService.create({ name, actionId })
      return { code: 200 }
    },
    getAll: () => {
      const payload = sensorService.getAll()
      return { code: 200, payload }
    },
    delete: ({ id }) => {
      const isDeleted = sensorService.delete(id)
      if (!isDeleted) {
        return {
          code: 400,
          payload: { error: `Can't delete sensor with id ${id}` }
        }
      }
      return { code: 204 }
    }
  }
}

export default sensorController
