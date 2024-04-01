import Fastify from 'fastify'

const server = (opt = {}) => {
  const host = opt.host
  const port = opt.port

  const fastify = Fastify({ logger: false })

  return {
    start: async () => {
      try {
        await fastify.listen({ port, host })
        console.log(`Server running at the port: ${port}`)
      } catch (err) {
        console.log('An error occurred while starting the server', err)
        process.exit(1)
      }
    },
    stop: async () => {
      await fastify.close()
      console.log('Server has been stopped')
    },
    server: fastify,
  }
}

export default server