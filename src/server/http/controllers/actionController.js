import actionService from '../../services/actionService.js'

const actionController = (dbHandlers) => {
  const services = actionService(dbHandlers)

  return {
    get: () => {
      const payload = services.getAllActions()
      return { code: 200, payload }
    },
    addDeviseToActive: (data) => {
      const id = services.addDeviseToActive(data)
      const payload = { isCreated: id == !false }
      return { code: 200, payload }
    },
    addDeviseToInactive: (data) => {
      const id = services.addDeviseToInactive(data)
      const payload = { isCreated: id == !false }
      return { code: 200, payload }
    },
  }
}

export default actionController
