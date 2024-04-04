const initHttp = async (server, controllers) => {
  const combinedControllers = {
    post: {
      'device': {
        handler: controllers.device.create,
        schema: null,
      },
      'action-device-active': {
        handler: controllers.action.addDeviseToActive,
        schema: null,
      },
      'action-device-inactive': {
        handler: controllers.action.addDeviseToInactive,
        schema: null,
      },
    },
    get: {
      device: {
        handler: controllers.device.get,
        schema: null,
      },
      action: {
        handler: controllers.action.get,
        schema: null,
      },
    },
  }

  for (const method in combinedControllers) {
    const routes = combinedControllers[method]
    for (const route in routes) {
      const handler = routes[route].handler
      const schema = routes[route].schema
      const opt = {}
      if (schema) opt.schema = schema
      server[method](`/${route}`, opt, async (request, reply) => {
        const body = request.body
        const { code, payload } = await handler(body)
        reply.code(code).send(payload)
      })
    }
  }
}

export default initHttp
