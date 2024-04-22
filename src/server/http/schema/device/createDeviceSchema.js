const createDeviceSchema = {
  description: 'create device',
  tags: ['Device'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['name', 'password'],
    additionalProperties: false,
  },
  response: {
    [200]: {
      description: 'Successful response with no body',
      type: 'null',
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

export default createDeviceSchema
