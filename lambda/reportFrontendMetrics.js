const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const cloudwatch = new AWS.CloudWatch({ region: process.env.AWS_REGION || 'us-east-1' })

const NAMESPACE = process.env.WEB_VITALS_NAMESPACE || 'Portfolio/WebVitals'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
}

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
})

const metricUnitForName = (name) => {
  switch (name) {
    case 'LCP':
    case 'FID':
    case 'PageLoadTime':
      return 'Milliseconds'
    case 'CLS':
      return 'None'
    default:
      return 'None'
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { status: 'ok' })
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { status: 'error', message: 'Method not allowed. Use POST.' })
  }

  let payload
  try {
    payload = JSON.parse(event.body || '{}')
  } catch (error) {
    return createResponse(400, { status: 'error', message: 'Invalid JSON payload.' })
  }

  const { name, value, id, rating, pageUrl } = payload
  if (!name || typeof value !== 'number') {
    return createResponse(400, { status: 'error', message: 'Missing metric name or numeric value.' })
  }

  const dimensionData = [{ Name: 'Page', Value: pageUrl || 'portfolio' }]

  try {
    await cloudwatch
      .putMetricData({
        Namespace: NAMESPACE,
        MetricData: [
          {
            MetricName: name,
            Dimensions: dimensionData,
            Timestamp: new Date(),
            Unit: metricUnitForName(name),
            Value: value,
          },
        ],
      })
      .promise()

    console.log('Frontend metric received:', { name, value, id, rating, pageUrl })
    return createResponse(200, { status: 'success', message: 'Metric recorded.' })
  } catch (error) {
    console.error('Failed to publish frontend metric:', error)
    return createResponse(500, { status: 'error', message: 'Unable to publish metric.' })
  }
}
