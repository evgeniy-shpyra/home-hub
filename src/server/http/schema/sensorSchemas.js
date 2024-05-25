import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Sensor']

export const createSensorSchema = schemaWrapper({
  tags,
  description: 'Create a sensor',
  isAuth: true,
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      action_id: { type: 'number' }
    },
    required: ['name', 'action_id'],
    additionalProperties: false
  }
})

export const getSensorsSchema = schemaWrapper({
  tags,
  description: 'Get all sensors',
  isAuth: true,
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          actionId: { type: 'number' },
          status: { type: 'boolean' },
          name: { type: 'string' },
          lastActiveAt: { type: 'string' }
        }
      }
    }
  }
})

export const deleteSensorSchema = schemaWrapper({
  tags,
  description: 'Delete a sensor',
  isAuth: true,
  successResponse: {
    204: {
      description: 'Successful response with no body',
      type: 'null'
    }
  }
})
