import websocket from '@fastify/websocket'

const initWebsocket = async (server, controllers) => {
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
            isVerified = controllers.device.verifyClient({ id: id[0] })
        }

        next(isVerified)
      },
    },
  })

  const deviceSubscribes = {}

  server.get('/ws/device', { websocket: true }, async (socket, request) => {
    const { onConnect, onClose, onMessage, onError } = controllers.device
    const id = request.headers['id'].split(' ')[0]

    await onConnect({ id })

    deviceSubscribes[id] = socket

    try {
      socket.on('message', async (message) => {
        const payload = message.toString()
        await onMessage({ message: payload, id })
      })

      socket.on('close', async () => {
        deviceSubscribes[id] && delete deviceSubscribes[id]
        await onClose({ id })
      })
    } catch (e) {
      console.log('Ws error', e)
      await onError({ message: e.message })
    }
  })

  return
}

export default initWebsocket
