import websocket from '@fastify/websocket'
import crypto from 'node:crypto'
const initWebsocket = async (server, controllers) => {
  const deviceController = controllers.device
  const userController = controllers.user
  const sensorController = controllers.sensor

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

        if (url === '/ws/user') {
          const id = info.req.headers.id
          isVerified = userController.verifyClient({ id })
        } else if (url === '/ws/sensor') {
          const id = info.req.headers.id
          const password = info.req.headers.password
          if (id && password) {
            isVerified = sensorController.verifyClient({ id, password })
          }
        } else if (url === '/ws/device' && info.req.headers.authorization) {
          const authData = info.req.headers.authorization.split(' ')
          if (authData.length === 2) {
            const [id, password] = Buffer.from(authData[1], 'base64').toString('utf8').split(":")
            if (id && password) {
              isVerified = deviceController.verifyClient({ id, password })
            }
          }
        }
        next(isVerified)
      },
    },
  })

  const deviceSubscribes = {}
  server.get('/ws/device', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = deviceController
    const authData = request.headers.authorization.split(' ')
    const [id, password] = Buffer.from(authData[1], 'base64').toString('utf8').split(":")

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
  const sendDataToDevices = (data, ids = null) => {
    for (const key in deviceSubscribes) {
      if (ids) {
        if (ids.includes(+key)) deviceSubscribes[key].send(JSON.stringify(data))
      } else {
        deviceSubscribes[key].send(JSON.stringify(data))
      }
    }
  }

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
        await onMessage({ message: payload, uuid }, handlers)
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
  const sendDataToUsers = (data) => {
    for (const key in userSubscribes) {
      userSubscribes[key].send(JSON.stringify(data))
    }
  }

  const sensorSubscribes = {}
  server.get('/ws/sensor', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = sensorController
    try {
      const id = request.headers.id

      const sensorData = onConnect({ id }, handlers)

      sensorSubscribes[id] = socket

      socket.on('message', async (message) => {
        const payload = message.toString()
        onMessage({ message: payload, sensorData }, handlers)
      })

      socket.on('close', async () => {
        sensorSubscribes[subscribersUuid] &&
          delete sensorSubscribes[subscribersUuid]
        onClose({ uuid }, handlers)
      })
    } catch (e) {
      console.log('Ws error', e)
      onError({ message: e.message }, handlers)
    }
  })
  const sendDataToSensors = (data) => {}

  handlers.device = sendDataToDevices
  handlers.user = sendDataToUsers
  handlers.sensor = sendDataToSensors

  return handlers
}

export default initWebsocket
