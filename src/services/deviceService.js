const deviceService = (dbHandlers) => {
  const { Device, Action } = dbHandlers

  return {
    getAllDevises: () => {
      const deices = Device.getAll()
      return deices
    },
    getDeviceById: (id) => {
      const device = Device.getById(id)
      return device
    },
    createDevice: (name) => {
      const deviceData = {
        name: name,
        isOnline: 0,
        status: 1,
      }
      const id = Device.create(deviceData)
      return id
    },
    setOnlineDevise: (id) => {
      Device.setOnline(true, id)
    }, 
    setOfflineDevise: (id) => {
      Device.setOnline(false, id)
    } 
  }
}

export default deviceService
