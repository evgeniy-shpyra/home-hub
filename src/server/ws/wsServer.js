import websocket from '@fastify/websocket'
import crypto from 'node:crypto'
const initWebsocket = async (server, controllers) => {
  const deviceController = controllers.device
  const userController = controllers.user

  const handlers = {}

  await server.register(websocket, {
    errorHandler: function (error, socket, req, reply) {
      socket.terminate()
    },
    options: {
      maxPayload: 1048576,
      verifyClient: async (info, next) => {
        const url = info.req.url
        let isVerified = false

        if (url === '/ws/device') {
          const id = info.req.headers.id?.split(' ') || []
          if (id.length) { isVerified = deviceController.verifyClient({ id: id[0] }) }
        } else if (url === '/ws/user') {
          const id = info.req.headers.id
          isVerified = userController.verifyClient({ id })
        }

        next(isVerified)
      }
    }
  })

  const deviceSubscribes = {}
  server.get('/ws/device', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = deviceController
    const id = request.headers.id.split(' ')[0]

    await onConnect({ id }, handlers)

    deviceSubscribes[id] = socket

    try {
      socket.on('message', async (message) => {
        const payload = message.toString()
        await onMessage({ message: payload, id }, handlers)
      })

      socket.on('close', async () => {
        deviceSubscribes[id] && delete deviceSubscribes[id]
        await onClose({ id }, handlers)
      })
    } catch (e) {
      console.log('Ws error', e)
      await onError({ message: e.message }, handlers)
    }
  })
  const sendDataToDevices = () => {}

  const userSubscribes = {}
  server.get('/ws/user', { websocket: true }, async (socket, request) => {
    try {
      const { onConnect, onClose, onMessage, onError } = userController
      const uuid = request.headers.id
      const subscribersUuid = uuid || crypto.randomUUID()

      await onConnect({ uuid }, handlers)

      userSubscribes[subscribersUuid] = socket

      socket.on('message', async (message) => {
        const payload = message.toString()
        await onMessage({ message: payload, id }, handlers)
      })

      socket.on('close', async () => {
        userSubscribes[subscribersUuid] &&
          delete userSubscribes[subscribersUuid]
        await onClose({ uuid }, handlers)
      })
    } catch (e) {
      console.log('Ws error', e)
      await onError({ message: e.message }, handlers)
    }
  })

  const sendDataToUsers = () => {}

  handlers.device = sendDataToDevices
  handlers.user = sendDataToUsers

  return handlers
}

export default initWebsocket
