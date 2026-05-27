const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = process.env.VISITOR_TABLE_NAME || 'PageViews'
const ITEM_KEY = process.env.VISITOR_ITEM_KEY || 'pageViews'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS, GET',
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

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { status: 'error', message: 'Method not allowed. Use GET.' })
  }

  const claims = event.requestContext.authorizer?.jwt?.claims || event.requestContext.authorizer?.claims
  if (!claims) {
    return createResponse(401, { status: 'error', message: 'Unauthorized. Cognito authorization required.' })
  }

  try {
    const result = await dynamodb
      .get({
        TableName: TABLE_NAME,
        Key: { id: ITEM_KEY },
      })
      .promise()

    const item = result.Item || {}
    return createResponse(200, {
      status: 'success',
      count: item.count || 0,
      lastUpdated: item.lastUpdated || null,
      rawItem: item,
    })
  } catch (error) {
    console.error('getVisitorAnalytics error:', error)
    return createResponse(500, {
      status: 'error',
      message: 'Failed to read visitor analytics from DynamoDB.',
    })
  }
}
