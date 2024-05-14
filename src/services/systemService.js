import { pingSystemBusEvent } from '../bus/busEvents.js'

const systemService = (dbHandlers, bus) => {
  return {
    ping: () => {
      bus.emit(pingSystemBusEvent)
    }
  }
}

export default systemService
