import websocket from '@fastify/websocket'
import crypto from 'node:crypto'
const initWebsocket = async (server, controllers) => {
  const userController = controllers.user

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

          if (url.includes('/ws/user')) {
            const urlArr = url.split('/')
            isVerified = userController.verifyClient({ uuid: urlArr[3] })
          }

          next(isVerified)
        } catch (e) {
          console.log(e)
          next(false)
        }
      }
    }
  })

  const userSubscribes = {}
  server.get('/ws/user/:token', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = userController
    const urlArr = request.url.split('/')
    const uuid = urlArr[3]

    const subscribersUuid = uuid || crypto.randomUUID()
    try {
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
    user: sendDataToUsers
  }

  return handlers
}

export default initWebsocket
