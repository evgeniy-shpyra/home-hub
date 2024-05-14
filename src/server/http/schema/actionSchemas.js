import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['Action']

export const createActionSchema = schemaWrapper({
  tags,
  description: 'Create an action',
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' }
    },
    required: ['name'],
    additionalProperties: false
  }
})

export const getActionsSchema = schemaWrapper({
  tags,
  description: 'Get all actions',
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          lastActiveTime: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  }
})


export const deleteActionSchema = schemaWrapper({
  tags,
  description: 'Delete a action',
  successResponse: {
    204: {
      description: 'Successful response with no body',
      type: 'null'
    }
  }
})
