import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Device']

export const createDeviceSchema = schemaWrapper({
  tags,
  description: 'Create a device',
  isAuth: true,
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: ['name'],
    additionalProperties: false
  }
})

export const getDevicesSchema = schemaWrapper({
  tags,
  description: 'Get all devices',
  isAuth: true,
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          lastActiveAt: { type: 'string' }
        }
      }
    }
  }
})

export const changeStatusDeviceSchema = schemaWrapper({
  tags,
  description: 'Change status of the device',
  isAuth: true,
  body: {
    type: 'object',
    properties: {
      status: { type: 'boolean' }
    },
    required: ['status'],
    additionalProperties: false
  }
})

export const deleteDeviceSchema = schemaWrapper({
  tags,
  description: 'Delete a device',
  isAuth: true,
  successResponse: {
    204: {
      description: 'Successful response with no body',
      type: 'null'
    }
  }
})
