import websocket from '@fastify/websocket'
import crypto from 'node:crypto'
const initWebsocket = async (server, controllers) => {
  const deviceController = controllers.device
  const userController = controllers.user
  const sensorController = controllers.sensor

  await server.register(websocket, {
    errorHandler: function (error, socket, req, reply) {
      socket.terminate()
    },
    options: {
      maxPayload: 1048576,
      verifyClient: async (info, next) => {
        try {
          const url = info.req.url
          let isVerified = false

          if (url === '/ws/user') {
            const id = info.req.headers.id
            isVerified = userController.verifyClient({ id })
          }

          next(isVerified)
        } catch (e) {
          console.log(e)
          next(false)
        }
      },
    },
  })

  const userSubscribes = {}
  server.get('/ws/user', { websocket: true }, async (socket, request) => {
    try {
      const { onConnect, onClose, onMessage, onError } = userController
      const uuid = request.headers.id
      const subscribersUuid = uuid || crypto.randomUUID()

      await onConnect({ uuid })

      userSubscribes[subscribersUuid] = socket

      socket.on('message', async (message) => {
        try {
          const payload = message.toString()
          await onMessage({ message: payload, uuid })
        } catch (e) {
          console.log(e)
        }
      })

      socket.on('close', async () => {
        userSubscribes[subscribersUuid] &&
          delete userSubscribes[subscribersUuid]
        await onClose({ uuid })
      })
    } catch (e) {
      console.log('Ws error', e)
      await onError({ message: e.message })
    }
  })
  const sendDataToUsers = (data) => {
    for (const key in userSubscribes) {
      userSubscribes[key].send(JSON.stringify(data))
    }
  }

  const handlers = {
    user: sendDataToUsers,
  }

  return handlers
}

export default initWebsocket
