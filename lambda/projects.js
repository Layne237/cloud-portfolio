const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = process.env.PROJECTS_TABLE_NAME || 'ProjectInfo'
const ITEM_KEY = process.env.PROJECTS_ITEM_KEY || 'portfolio-projects'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS, GET, PUT',
}

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
})

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { status: 'ok' })
  }

  if (event.httpMethod === 'GET') {
    try {
      const result = await dynamodb
        .get({
          TableName: TABLE_NAME,
          Key: { id: ITEM_KEY },
        })
        .promise()

      return createResponse(200, {
        status: 'success',
        projects: result.Item?.projects || [],
      })
    } catch (error) {
      console.error('projects GET error:', error)
      return createResponse(500, {
        status: 'error',
        message: 'Unable to load project data.',
      })
    }
  }

  if (event.httpMethod === 'PUT') {
    const claims = event.requestContext.authorizer?.jwt?.claims || event.requestContext.authorizer?.claims
    if (!claims) {
      return createResponse(401, { status: 'error', message: 'Unauthorized. Cognito authorization required.' })
    }

    let payload
    try {
      payload = JSON.parse(event.body || '{}')
    } catch (error) {
      return createResponse(400, { status: 'error', message: 'Invalid JSON payload.' })
    }

    if (!Array.isArray(payload.projects)) {
      return createResponse(400, {
        status: 'error',
        message: 'The request body must include a `projects` array.',
      })
    }

    try {
      await dynamodb
        .put({
          TableName: TABLE_NAME,
          Item: {
            id: ITEM_KEY,
            projects: payload.projects,
            updatedAt: new Date().toISOString(),
          },
        })
        .promise()

      return createResponse(200, {
        status: 'success',
        message: 'Project data updated successfully.',
      })
    } catch (error) {
      console.error('projects PUT error:', error)
      return createResponse(500, {
        status: 'error',
        message: 'Unable to save project data.',
      })
    }
  }

  return createResponse(405, { status: 'error', message: 'Method not allowed. Use GET or PUT.' })
}
