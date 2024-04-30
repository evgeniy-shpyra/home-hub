import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Device&Action']

export const createDeviceActionSchema = schemaWrapper({
  tags,
  description: 'Connect the device and the action',
  body: {
    type: 'object',
    properties: {
      deviceId: { type: 'number' },
      actionId: { type: 'number' },
      priority: { type: 'number' },
      deviceStatus: { type: 'boolean' },
    },
    required: ['deviceId', 'actionId', 'priority'],
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
          deviceId: { type: 'number' },
          actionId: { type: 'number' },
          deviceStatus: { type: 'boolean' },
          actionId: { type: 'number' },
        },
      },
    },
  },
})

