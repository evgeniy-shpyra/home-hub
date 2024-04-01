import websocket from '@fastify/websocket'
import verifyHouse from '../utils/verifyHouse.js'

const initWebsocket = async (server, dbHandlers) => {
  await server.register(websocket, {
    errorHandler: function (error, socket, req, reply) {
      socket.terminate()
    },
    options: {
      maxPayload: 1048576, // messages size: 1 MiB
      verifyClient: async (info, next) => {
        const authorization =
          info.req.headers['authorization']?.split(' ') || []
        const isVerified =
          authorization.length === 2 &&
          (await verifyHouse(authorization[1], dbHandlers.home))

        next(isVerified)
      },
    },
  })

  const subscribes = {}

  return
}

export default initWebsocket
