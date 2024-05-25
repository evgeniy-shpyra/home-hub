import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Device&Action']

export const createDeviceActionSchema = schemaWrapper({
  tags,
  description: 'Connect the device and the action',
  isAuth: true,
  body: {
    type: 'object',
    properties: {
      deviceId: { type: 'number' },
      actionId: { type: 'number' },
      priority: { type: 'number' },
      deviceStatus: { type: 'boolean' }
    },
    required: ['deviceId', 'actionId', 'priority', 'deviceStatus'],
    additionalProperties: false
  }
})

export const bulkUpdateDeviceActionSchema = schemaWrapper({
  tags,
  description: 'Bulk connect the device and the action',
  isAuth: true,
  body: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        deviceId: { type: 'number' },
        actionId: { type: 'number' },
        priority: { type: 'number' },
        deviceStatus: { type: 'boolean' },
        isDelete: { type: 'boolean' }
      },
      additionalProperties: false
    },
    minItems: 1
  }
})

export const getDevicesActionsSchema = schemaWrapper({
  tags,
  description: 'Get connected the devices with the actions',
  isAuth: true,
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          deviceId: { type: 'number' },
          actionId: { type: 'number' },
          priority: { type: 'number' },
          deviceStatus: { type: 'boolean' }
        }
      }
    }
  }
})
