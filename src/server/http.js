import combineControllers from './controllers/index.js'

const initHttp = async (server) => {
  const controllers = combineControllers()

  for (const method in controllers) {
    for (const routes of controllers[method]) {
      for (const route in routes) {
        const handler = routes[route].handler
        const schema = routes[route].schema

        const opt = {}
        if (schema) opt.schema = schema
        server[method](`/${route}`, opt, async (request, reply) => {
          const { code, payload } = await handler()
          reply.code(code).send(payload)
        })
      }
    }
  }
}

export default initHttp
