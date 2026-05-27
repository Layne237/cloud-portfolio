const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = process.env.VISITOR_TABLE_NAME || 'PageViews'
const ITEM_KEY = { id: process.env.VISITOR_ITEM_KEY || 'pageViews' }

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
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

  try {
    const result = await dynamodb
      .update({
        TableName: TABLE_NAME,
        Key: ITEM_KEY,
        UpdateExpression: 'SET #count = if_not_exists(#count, :zero) + :incr, #lastUpdated = :now',
        ExpressionAttributeNames: {
          '#count': 'count',
          '#lastUpdated': 'lastUpdated',
        },
        ExpressionAttributeValues: {
          ':zero': 0,
          ':incr': 1,
          ':now': new Date().toISOString(),
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise()

    const newCount = result.Attributes?.count

    if (typeof newCount !== 'number') {
      throw new Error('Invalid count value returned from DynamoDB.')
    }

    return createResponse(200, {
      status: 'success',
      count: newCount,
    })
  } catch (error) {
    console.error('Visitor counter error:', error)
    return createResponse(500, {
      status: 'error',
      message: 'Unable to read or update the visitor counter.',
    })
  }
}
