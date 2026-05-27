const AWSXRay = require('aws-xray-sdk-core')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: process.env.AWS_REGION || 'us-east-1' })
const TABLE_NAME = process.env.CONTACT_TABLE_NAME || 'ContactSubmissions'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
}

const isEmailValid = (email) => {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: CORS_HEADERS,
  body: JSON.stringify(body),
})

const saveSubmission = async (submission) => {
  const item = {
    id: crypto.randomUUID(),
    ...submission,
  }

  await dynamodb.put({ TableName: TABLE_NAME, Item: item }).promise()
  return item
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

  const name = (payload.name || '').trim()
  const email = (payload.email || '').trim()
  const message = (payload.message || '').trim()

  if (!name || !email || !message) {
    return createResponse(400, {
      status: 'error',
      message: 'Name, email, and message are required.',
    })
  }

  if (!isEmailValid(email)) {
    return createResponse(400, { status: 'error', message: 'A valid email address is required.' })
  }

  const submissionDetails = {
    name,
    email,
    message,
    timestamp: new Date().toISOString(),
  }

  try {
    await saveSubmission(submissionDetails)

    if (process.env.USE_SES === 'true') {
      const ses = new AWS.SES({ region: process.env.AWS_REGION || 'us-east-1' })

      if (!process.env.SES_SENDER_EMAIL || !process.env.SES_RECIPIENT_EMAIL) {
        throw new Error('Missing SES_SENDER_EMAIL or SES_RECIPIENT_EMAIL environment variable.')
      }

      const emailParams = {
        Source: process.env.SES_SENDER_EMAIL,
        Destination: {
          ToAddresses: [process.env.SES_RECIPIENT_EMAIL],
        },
        Message: {
          Subject: {
            Data: `New contact form submission from ${name}`,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
              Charset: 'UTF-8',
            },
          },
        },
      }

      await ses.sendEmail(emailParams).promise()
      console.log('Contact form email sent via SES:', submissionDetails)
    } else {
      console.log('Contact form submission saved:', submissionDetails)
    }

    return createResponse(200, {
      status: 'success',
      message: 'Your message was submitted successfully.',
    })
  } catch (error) {
    console.error('Contact handler error:', error)
    return createResponse(500, {
      status: 'error',
      message: 'Server error while processing contact request.',
    })
  }
}
