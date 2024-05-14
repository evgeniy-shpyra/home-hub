const systemController = (services) => {
  const systemService = services.system
  return {
    toggleSystem: () => {},
    ping: () => {
      systemService.ping()
      return { code: 200 }
    }
  }
}

export default systemController
