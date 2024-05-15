const schemaWrapper = ({
  description,
  tags,
  body,
  querystring,
  headers,
  successResponse
}) => {
  const schema = {
    description,
    tags,
    response: {
      400: {
        description: 'Bad response',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      },
      401: {
        description: 'Not authorized',
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
  if(headers){
    schema.body = headers
  }
  if (body) {
    schema.body = body
  }
  if (querystring) {
    schema.querystring = querystring
  }
  if (successResponse) {
    schema.response = { ...schema.response, ...successResponse }
  } else {
    schema.response = {
      ...schema.response,
      200: {
        description: 'Successful response with no body',
        type: 'null'
      }
    }
  }
  return schema
}

export default schemaWrapper
