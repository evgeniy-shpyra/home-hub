import schemaWrapper from '../../../services/schemaWrapper.js'

const tags = ['Sensor']


export const createSensorSchema = schemaWrapper({
  tags,
  description: 'Create a sensor',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      password: { type: 'string' },
      action_id: { type: 'string' },
    },
    required: ['name', 'password', 'action_id'],
    additionalProperties: false,
  },
})

export const getSensorsSchema = schemaWrapper({
  tags,
  description: 'Get all sensors',
  successResponse: {
    [200]: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          action_id: {type: 'string'},
          isOnline: {type: 'boolean'},
          status: { type: 'boolean' },
          name: { type: 'string' },
          connectedAt: { type: 'string' },
        },
      },
    },
  },
})


export const deleteSensorSchema = schemaWrapper({
  tags,
  description: 'Delete a sensor',
  successResponse: {
    [204]: {
      description: 'Successful response with no body',
      type: 'null',
    },
  },
})