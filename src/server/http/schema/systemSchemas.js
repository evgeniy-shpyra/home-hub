import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['System']


export const toggleSystemSchema = schemaWrapper({
  tags,
  description: 'Toggle the system',
  body: {
    type: 'object',
    properties: {
      status: { type: 'boolean' },
    },
    required: ['status'],
    additionalProperties: false,
  },
})
