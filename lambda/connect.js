const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = process.env.ACTIVE_CONNECTIONS_TABLE || 'ActiveConnections'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
}

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
})

exports.handler = async (event) => {
  const connectionId = event.requestContext?.connectionId
  if (!connectionId) {
    return createResponse(400, { status: 'error', message: 'Missing connectionId.' })
  }

  try {
    await dynamodb
      .put({
        TableName: TABLE_NAME,
        Item: {
          connectionId,
          connectedAt: new Date().toISOString(),
        },
      })
      .promise()

    return createResponse(200, { status: 'success', message: 'Connected.' })
  } catch (error) {
    console.error('WebSocket connect error:', error)
    return createResponse(500, { status: 'error', message: 'Unable to register connection.' })
  }
}
