import Fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
const server = async (opt = {}) => {
  const host = opt.host
  const port = opt.port
  const cookieSecret = opt.cookieSecret

  const fastify = Fastify({ logger: false })

  await fastify.register(cors, {
    origin: ['*', `http://${host}`]
  })

  fastify.register(fastifyCookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  })

  return {
    start: async () => {
      try {
        await fastify.listen({ port, host })
        console.log(`Server running at the port: ${host}:${port}`)
      } catch (err) {
        console.log('An error occurred while starting the server', err)
        process.exit(1)
      }
    },
    stop: async () => {
      await fastify.close()
      console.log('Server has been stopped')
    },
    server: fastify
  }
}

export default server
