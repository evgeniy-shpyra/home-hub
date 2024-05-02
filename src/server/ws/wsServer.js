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
          } else if (url === '/ws/device' && info.req.headers.authorization) {
            const authData = info.req.headers.authorization.split(' ')
            if (authData.length === 2) {
              const [name, password] = Buffer.from(authData[1], 'base64')
                .toString('utf8')
                .split(':')
              if (name && password) {
                isVerified = deviceController.verifyClient({ name, password })
              }
            }
          } else if (url === '/ws/sensor' && info.req.headers.authorization) {
            const authData = info.req.headers.authorization.split(' ')
            if (authData.length === 2) {
              const [name, password] = Buffer.from(authData[1], 'base64')
                .toString('utf8')
                .split(':')
              if (name && password) {
                isVerified = sensorController.verifyClient({ name, password })
              }
            }
          }
          next(isVerified)
        } catch (e) {
          console.log(e)
          next(false)
        }
      },
    },
  })

  const deviceSubscribes = {}
  server.get('/ws/device', { websocket: true }, async (socket, request) => {
    try {
      const { onConnect, onClose, onMessage, onError, getDevice } =
        deviceController
      const authData = request.headers.authorization.split(' ')
      const [name, password] = Buffer.from(authData[1], 'base64')
        .toString('utf8')
        .split(':')

      const device = getDevice(name)
      const id = device.id

      deviceSubscribes[id] = socket

      socket.on('message', async (message) => {
        try {
          const payload = message.toString()
          await onMessage({ message: payload, device })
        } catch (e) {
          console.log(e)
        }
      })

      socket.on('close', async () => {
        console.log('close')
        deviceSubscribes[id] && delete deviceSubscribes[id]
        await onClose(device)
      })

      onConnect(device)
    } catch (e) {
      console.log('Ws error', e)
      await onError({ message: e.message })
    }
  })
  const sendDataToDevices = (data, ids = null) => {
    for (const key in deviceSubscribes) {
      if (ids) {
        if (ids.includes(+key)) {
          console.log('send message to device', data)
          deviceSubscribes[key].send(JSON.stringify(data))
        }
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

  const sensorSubscribes = {}
  server.get('/ws/sensor', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError, getSensor } = sensorController
    try {
      const authData = request.headers.authorization.split(' ')
      const [name, password] = Buffer.from(authData[1], 'base64')
        .toString('utf8')
        .split(':')
      const sensor = getSensor(name)
      const id = sensor.id
      
      onConnect({ id })
      sensorSubscribes[id] = socket

      socket.on('message', async (message) => {
        const payload = message.toString()
        onMessage({ message: payload, id })
      })

      socket.on('close', async () => {
        sensorSubscribes[id] && delete sensorSubscribes[id]
        onClose({ id })
      })
    } catch (e) {
      console.log('Ws error', e)
      onError({ message: e.message })
    }
  })
  const sendDataToSensors = (data) => {}

  const handlers = {
    device: sendDataToDevices,
    user: sendDataToUsers,
    sensor: sendDataToSensors,
  }

  return handlers
}

export default initWebsocket
