import schemaWrapper from '../../../services/schemaWrapper.js'

const tags = ['Device&Action']

export const createDeviceActionSchema = schemaWrapper({
  tags,
  description: 'Connect the device and the action',
  body: {
    type: 'object',
    properties: {
      deviceId: { type: 'number' },
      actionId: { type: 'string' },
      status: { type: 'boolean' },
      priority: { type: 'number' },
    },
    required: ['deviceId', 'actionId', 'status', 'priority'],
    additionalProperties: false,
  },
})

export const getDevicesActionsSchema = schemaWrapper({
  tags,
  description: 'Get connected the devices with the actions',
  successResponse: {
    [200]: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
        },
      },
    },
  },
})

