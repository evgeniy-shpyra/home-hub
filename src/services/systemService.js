import { pingSystemBusEvent } from '../bus/busEvents.js'

function systemService(dbHandlers, bus) {
  const { Config } = dbHandlers
  
  return {
    ping: () => {
      bus.emit(pingSystemBusEvent)
    },
    turnOffSystem: () => {
      const result = Config.update({
        name: 'system',
        data: JSON.stringify({ isOn: false }),
      })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    turnOnSystem: () => {
      const result = Config.update({
        name: 'system',
        data: JSON.stringify({ isOn: true }),
      })
      if (!result.success) {
        throw new Error(result.error)
      }
    },
    getSystemStatus: () => {
      const result = Config.selectByName('system')
      if (!result.success) {
        throw new Error(result.error)
      }
      const config = JSON.parse(result.payload.data)

      return config.isOn
    },
  }
}

export default systemService
