const sensorController = (services) => {
  const sensorService = services.sensor

  return {
    verifyClient: ({ id, password }) => {
      const isVerified = sensorService.isVerified({ id, password })

      return isVerified
    },
    onConnect: ({ id }) => {
      sensorService.setOnline(+id)
    },
    onClose: ({ id }) => {
      sensorService.setOffline(+id)
      sensorService.changeStatus({ status: false, id })
    },
    onMessage: ({ message: messageJson, id }) => {
      try {
        const message = JSON.parse(messageJson)
        const status = message.status
        sensorService.changeStatus({ status, id })
      } catch (e) {
        console.log(e)
      }
    },
    onError: (data) => {
      console.log('onError', data)
    },
  }
}

export default sensorController
