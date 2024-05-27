import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['System']

export const toggleSystemSchema = schemaWrapper({
  tags,
  description: 'Toggle the system',
  isAuth: true,
  body: {
    type: 'object',
    properties: {
      status: { type: 'boolean' },
    },
    required: ['status'],
    additionalProperties: false,
  },
})
export const pingSystemSchema = schemaWrapper({
  tags,
  isAuth: true,
  description: 'Ping the system',
})
export const getSystemStatusSchema = schemaWrapper({
  tags,
  isAuth: true,
  description: 'Get system status',
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'object',
      properties: {
        status: { type: 'boolean' },
      },
    },
  },
})
