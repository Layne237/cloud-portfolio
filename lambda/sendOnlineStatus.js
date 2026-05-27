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

const handleStaleConnection = async (apiGateway, connectionId) => {
  try {
    await dynamodb.delete({ TableName: TABLE_NAME, Key: { connectionId } }).promise()
    console.log('Removed stale connection:', connectionId)
  } catch (error) {
    console.error('Failed to remove stale connection:', connectionId, error)
  }
}

exports.handler = async (event) => {
  const domainName = event.requestContext?.domainName
  const stage = event.requestContext?.stage
  const connectionId = event.requestContext?.connectionId

  if (!domainName || !stage || !connectionId) {
    return createResponse(400, { status: 'error', message: 'Invalid WebSocket request context.' })
  }

  const endpoint = `https://${domainName}/${stage}`
  const apigw = new AWS.ApiGatewayManagementApi({ apiVersion: '2018-11-29', endpoint })

  try {
    const result = await dynamodb.scan({ TableName: TABLE_NAME, ProjectionExpression: 'connectionId' }).promise()
    const connections = result.Items || []
    const count = connections.length
    const payload = JSON.stringify({ type: 'onlineStatus', onlineCount: count })

    await Promise.all(
      connections.map(async ({ connectionId: targetConnectionId }) => {
        try {
          await apigw.postToConnection({ ConnectionId: targetConnectionId, Data: payload }).promise()
        } catch (error) {
          const statusCode = error.statusCode || (error.code === 'GoneException' ? 410 : null)
          if (statusCode === 410 || statusCode === 403 || statusCode === 404) {
            await handleStaleConnection(apigw, targetConnectionId)
          } else {
            console.error('Failed to post to connection:', targetConnectionId, error)
          }
        }
      }),
    )

    return createResponse(200, { status: 'success', onlineCount: count })
  } catch (error) {
    console.error('sendOnlineStatus error:', error)
    return createResponse(500, { status: 'error', message: 'Unable to broadcast online status.' })
  }
}
