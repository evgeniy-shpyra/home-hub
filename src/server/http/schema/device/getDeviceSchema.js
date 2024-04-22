const getDeviceSchema = {
  description: 'create device',
  tags: ['Device'],
  response: {
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
    [400]: {
      description: 'Bad response',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
}

export default getDeviceSchema
