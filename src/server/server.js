import Fastify from 'fastify'
import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import swaggerConfig from './swaggerConfig.js'

const server = async (opt = {}) => {
  const host = opt.host
  const port = opt.port

  const fastify = Fastify({ logger: true })

  await fastify.register(cors, {
    origin: '*',
  })

  // Swagger
  await fastify.register(swagger, {})
  await fastify.register(swaggerUi, swaggerConfig)


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
