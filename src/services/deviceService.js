const deviceService = (dbHandlers) => {
  const { Device, Action } = dbHandlers

  return {
    getAll: () => {
      const deices = Device.getAll()
      return deices
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
    create: (name) => {
      const deviceData = {
        name,
        isOnline: 0,
        status: 1,
      }
      const id = Device.create(deviceData)
      return id
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
