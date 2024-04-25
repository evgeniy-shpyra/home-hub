import { createHash } from '../../../utils/hash.js'

const deviceController = (services) => {
  const deviceService = services.device
  const actionService = services.action

  return {
    verifyClient: ({ id, password }, handlers) => {
      const passwordHash = createHash(password)
      const isVerified = deviceService.isVerified(id, passwordHash)
      return isVerified
    },
    onConnect: async ({ id }, handlers) => {
      deviceService.setOnline(id)

      const activeActions = actionService.getActive()
      console.log(activeActions)
    },
    onClose: async ({ id }, handlers) => {
      deviceService.setOffline(id)
    },
    onMessage: async (data, handlers) => {
      console.log(data)
      handlers.device(JSON.stringify({ status: true, action: 'toggleStatus' }))
      // const message = JSON.parse(data.message)
      // const payload = message.payload
      // switch (message.action) {
      //   case 'changedStatus':
      //     deviceService.updateStatus(data.id, payload.status)
      //     break
      // }
    },
    onError: async (data, handlers) => {
      console.log('onError', data)
    },
  }
}

export default deviceController
