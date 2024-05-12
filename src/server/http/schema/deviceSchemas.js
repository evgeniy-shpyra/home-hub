import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Device']

export const createDeviceSchema = schemaWrapper({
  tags,
  description: 'Create a device',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      password: { type: 'string' }
    },
    required: ['name', 'password'],
    additionalProperties: false
  }
})

export const getDevicesSchema = schemaWrapper({
  tags,
  description: 'Get all devices',
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          connectedAt: { type: 'string' }
        }
      }
    }
  }
})

export const changeStatusDeviceSchema = schemaWrapper({
  tags,
  description: 'Change status of the device',
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
  successResponse: {
    204: {
      description: 'Successful response with no body',
      type: 'null'
    }
  }
})
