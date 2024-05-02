const sensorController = (services) => {
  const sensorService = services.sensor

  return {
    verifyClient: ({ name, password }) => {
      const isVerified = sensorService.isVerified({ name, password })
      return isVerified
    },
    getSensor: (name) => {
      const sensor = sensorService.getByName(name)
      return sensor
    },
    onConnect: ({ id }) => {
      sensorService.setOnline(+id)
    },
    onClose: ({ id }) => {
      sensorService.setOffline(+id)
      sensorService.changeStatus({ status: false, id })
    },
    onMessage: ({ message: messageJson, id }) => {
      const message = JSON.parse(messageJson)
      switch (message.action) {
        case 'status':
          sensorService.changeStatus({
            status: message.status,
            id,
          })
          break
      }
    },
    onError: (data) => {
      console.log('onError', data)
    },
  }
}

export default sensorController
