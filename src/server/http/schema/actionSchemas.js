import schemaWrapper from '../../../services/schemaWrapper.js'

const tags = ['Action']

export const getActionsSchema = schemaWrapper({
  tags,
  description: 'Get all actions',
  successResponse: {
    [200]: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          lastActiveTime: { type: 'string' },
          status: { type: 'boolean' },
          name: { type: 'string' },
        },
      },
    },
  },
})
