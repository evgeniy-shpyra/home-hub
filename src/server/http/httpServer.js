import parseCookies from '../../utils/parseCookies.js'

const initHttp = async (server, controllers, services) => {
  const combinedControllers = {
    post: {
      'device': {
        handler: controllers.device.create,
        schema: null,
        isAuth: true,
      },
      'action-device-active': {
        handler: controllers.action.addDeviseToActive,
        schema: null,
        isAuth: true,
      },
      'action-device-inactive': {
        handler: controllers.action.addDeviseToInactive,
        schema: null,
        isAuth: true,
      },
    },
    get: {
      device: {
        handler: controllers.device.get,
        schema: null,
        isAuth: true,
      },
      action: {
        handler: controllers.action.get,
        schema: null,
        isAuth: true,
      },
      getUser: {
        handler: controllers.user.getUser,
        isAuth: true,
      },
    },
  }

  const verifyAuth = (cookies) => {
    const userService = services.user
    const isAuth = userService.isAuth(cookies.id)
    return isAuth
  }

  const mainHandler = async (req, reply, opt) => {
    const { handler, isRequiredAuth } = opt
    try {
      const cookies = parseCookies(req.cookies, req.unsignCookie)
      const userData = verifyAuth(cookies)

      if (isRequiredAuth && !userData.isAuth) {
        reply.code(401).send({ error: ['Not authorized'] })
        return
      }

      const body = req.body
      const user = userData.user

      const response = await handler(body, user)

      if (user) {
        reply.setCookie(id, user.uuid, {
          signed: true,
          path: '/',
        })
      }

      reply.code(response.code).send(response.payload)
    } catch (e) {
      console.log(e)
      reply.code(400).send({ error: ['An error occurred'] })
    }
  }

  for (const method in combinedControllers) {
    const routes = combinedControllers[method]
    for (const route in routes) {
      const handler = routes[route].handler
      const schema = routes[route].schema
      const isRequiredAuth = routes[route].isAuth
      const opt = {}
      if (schema) opt.schema = schema
      server[method](`/${route}`, opt, async (req, reply) =>
        mainHandler(req, reply, { handler, isRequiredAuth })
      )
    }
  }
}

export default initHttp
