import {
  createActionSchema,
  deleteActionSchema,
  getActionsSchema,
} from './schema/actionSchemas.js'
import {
  bulkUpdateDeviceActionSchema,
  createDeviceActionSchema,
  getDevicesActionsSchema,
} from './schema/deviceActionSchemas.js'
import {
  changeStatusDeviceSchema,
  createDeviceSchema,
  deleteDeviceSchema,
  getDevicesSchema,
} from './schema/deviceSchemas.js'
import {
  createSensorSchema,
  deleteSensorSchema,
  getSensorsSchema,
} from './schema/sensorSchemas.js'
import { pingSystemSchema, toggleSystemSchema } from './schema/systemSchemas.js'

import {
  createUserSchema,
  deleteUserSchema,
  getUserSchema,
  getUsersSchema,
  loginUserSchema,
} from './schema/userSchemas.js'

const initHttp = async (server, controllers, services) => {
  const combinedControllers = {
    post: {
      'device': {
        handler: controllers.device.create,
        schema: createDeviceSchema,
        isAuth: true,
      },
      'devices/:id/change-status': {
        handler: controllers.device.changeStatus,
        schema: changeStatusDeviceSchema,
        isAuth: true,
      },
      'sensor': {
        handler: controllers.sensor.create,
        schema: createSensorSchema,
        isAuth: true,
      },
      'action': {
        handler: controllers.action.create,
        schema: createActionSchema,
        isAuth: true,
      },
      'device-action': {
        handler: controllers.deviceAction.create,
        schema: createDeviceActionSchema,
        isAuth: true,
      },
      'user': {
        handler: controllers.user.create,
        schema: createUserSchema,
        isAuth: true,
      },
      'login': {
        handler: controllers.user.login,
        schema: loginUserSchema,
        isAuth: false,
      },
      'system/toggle': {
        handler: controllers.system.toggle,
        schema: toggleSystemSchema,
        isAuth: true,
      },
    },
    put: {
      'devices-actions': {
        handler: controllers.deviceAction.bulkUpdate,
        schema: bulkUpdateDeviceActionSchema,
        isAuth: true,
      },
    },
    get: {
      'devices': {
        handler: controllers.device.getAll,
        schema: getDevicesSchema,
        isAuth: true,
      },
      'actions': {
        handler: controllers.action.getAll,
        schema: getActionsSchema,
        isAuth: true,
      },
      'user': {
        handler: controllers.user.get,
        schema: getUserSchema,
        isAuth: true,
      },
      'users': {
        handler: controllers.user.getAll,
        schema: getUsersSchema,
        isAuth: true,
      },
      'devices-actions': {
        handler: controllers.deviceAction.getAll,
        schema: getDevicesActionsSchema,
        isAuth: true,
      },
      'sensors': {
        handler: controllers.sensor.getAll,
        schema: getSensorsSchema,
        isAuth: true,
      },
      'system/ping': {
        handler: controllers.system.ping,
        schema: pingSystemSchema,
        isAuth: true,
      },
    },
    delete: {
      'user/:id': {
        handler: controllers.user.delete,
        schema: deleteUserSchema,
        isAuth: true,
      },
      'sensor/:id': {
        handler: controllers.sensor.delete,
        schema: deleteSensorSchema,
        isAuth: true,
      },
      'device/:id': {
        handler: controllers.device.delete,
        schema: deleteDeviceSchema,
        isAuth: true,
      },
      'action/:id': {
        handler: controllers.action.delete,
        schema: deleteActionSchema,
        isAuth: true,
      },
    },
  }

  const verifyAuth = (authorization) => {
    const userService = services.user
    const isAuth = userService.isAuth(authorization)
    return isAuth
  }

  const mainHandler = async (req, reply, opt) => {
    const { handler, isRequiredAuth } = opt
    try {
      const userData = verifyAuth(handler.authorization)

      if (isRequiredAuth && !userData.isAuth) {
        reply.code(401).send({ error: ['Not authorized'] })
        return
      }
      const user = userData.user

      const body = req.body || {}
      const params = req.params || {}

      const response = await handler({ ...body, ...params }, user)

      reply.code(response.code).send(response.payload)
    } catch (e) {
      console.log(e)
      reply.code(400).send({ error: ['An error occurred', e.message] })
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
