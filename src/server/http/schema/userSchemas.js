import schemaWrapper from '../../../utils/schemaWrapper.js'

const tags = ['User']

export const createUserSchema = schemaWrapper({
  tags,
  description: 'Create a user',
  body: {
    type: 'object',
    properties: {
      login: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['login', 'password'],
    additionalProperties: false,
  },
})

export const deleteUserSchema = schemaWrapper({
  tags,
  description: 'Delete a user',
  successResponse: {
    204: {
      description: 'Successful response with no body',
      type: 'null',
    },
  },
})

export const getUserSchema = schemaWrapper({
  tags,
  description: 'Get user data',
  headers: {
    type: 'object',
    properties: {
      authorization: {
        type: 'string',
      },
    },
    required: ['authorization'],
  },
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'object',
      properties: {
        login: { type: 'string' },
      },
    },
  },
})

export const getUsersSchema = schemaWrapper({
  tags,
  description: 'Get all users data',
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          login: { type: 'string' },
          isOnline: { type: 'boolean' },
          lastOnlineTime: { type: 'string' },
        },
      },
    },
  },
})
export const loginUserSchema = schemaWrapper({
  tags,
  description: 'Login a user',
  body: {
    type: 'object',
    properties: {
      login: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['login', 'password'],
    additionalProperties: false,
  },
  successResponse: {
    200: {
      description: 'Successful response with no body',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
})
