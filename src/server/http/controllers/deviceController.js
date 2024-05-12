const infoController = (services) => {
  const deviceService = services.device

  return {
    getAll: () => {
      const payload = deviceService.getAll()
      return { code: 200, payload }
    },
    create: ({ name }) => {
      deviceService.create({ name })

      return { code: 200 }
    },
    changeStatus: ({ id, status }) => {
      deviceService.changeStatus({ id: +id, status })

      return { code: 200 }
    },
    delete: ({ id }) => {
      const isDeleted = deviceService.delete(id)
      if (!isDeleted) {
        return {
          code: 400,
          payload: { error: `Can't delete device with id ${id}` }
        }
      }
      return { code: 204 }
    }
  }
}

export default infoController
