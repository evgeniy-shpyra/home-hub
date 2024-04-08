import websocket from '@fastify/websocket'

const initWebsocket = async (server, controllers) => {
  const deviceController = controllers.device

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
          const id = info.req.headers['id']?.split(' ') || []
          if (id.length)
            isVerified = deviceController.verifyClient({ id: id[0] })
        }

        next(isVerified)
      },
    },
  })

  const deviceSubscribes = {}
  server.get('/ws/device', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = deviceController
    const id = request.headers['id'].split(' ')[0]

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

  handlers.device = sendDataToDevices

  return handlers
}

export default initWebsocket
