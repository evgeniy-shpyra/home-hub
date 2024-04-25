import schemaWrapper from '../../../services/schemaWrapper.js'

const tags = ['Device']

export const createDeviceSchema = schemaWrapper({
  tags,
  description: 'Create a device',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['name', 'password'],
    additionalProperties: false,
  },
})

export const getDevicesSchema = schemaWrapper({
  tags,
  description: 'Get all devices',
  successResponse: {
    [200]: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          isOnline: { type: 'boolean' },
          status: { type: 'boolean' },
          connectedAt: { type: 'string' },
        },
      },
    },
  },
})


export const deleteDeviceSchema = schemaWrapper({
  tags,
  description: 'Delete a sensor',
  successResponse: {
    [204]: {
      description: 'Successful response with no body',
      type: 'null',
    },
  },
})