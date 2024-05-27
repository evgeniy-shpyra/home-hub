const systemController = (services) => {
  const systemService = services.system
  return {
    toggleSystemStatus: ({ status }) => {
      if (status) {
        systemService.turnOnSystem()
      } else {
        systemService.turnOffSystem()
      }
      return { code: 200 }
    },
    getSystemStatus: () => {
      const status = systemService.getSystemStatus()

      return { code: 200, payload: { status } }
    },
    ping: () => {
      systemService.ping()
      return { code: 200 }
    },
  }
}

export default systemController
