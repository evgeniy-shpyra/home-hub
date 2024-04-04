import actionService from '../../../services/actionService.js'

const actionController = (services) => {
  const actionService = services.action

  return {
    get: () => {
      const payload = actionService.getAllActions()
      return { code: 200, payload }
    },
    addDeviseToActive: (data) => {
      const id = actionService.addDeviseToActive(data)
      const payload = { isCreated: id == !false }
      return { code: 200, payload }
    },
    addDeviseToInactive: (data) => {
      const id = actionService.addDeviseToInactive(data)
      const payload = { isCreated: id == !false }
      return { code: 200, payload }
    },
  }
}

export default actionController
