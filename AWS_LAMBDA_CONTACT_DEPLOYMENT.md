# AWS Lambda Contact Form Deployment Instructions

This document explains how to deploy the `lambda/contact.js` serverless backend and connect it to your React frontend.

## 1. Package the Lambda function

1. Create a deployment package from the `lambda` folder.
2. If you are not using third-party Node dependencies, you can zip the function file directly.

```powershell
cd d:\cloud-portfolio\lambda
Compress-Archive -Path contact.js -DestinationPath ..\lambda-contact.zip
```

> If you later add dependencies, install them in `lambda/` and include `node_modules` in the zip.

## 2. Create the Lambda function in AWS Console

1. Open the AWS Lambda Console.
2. Choose **Create function**.
3. Select **Author from scratch**.
4. Set **Function name** to something like `cloud-portfolio-contact`.
5. Choose **Runtime**: `Node.js 18.x`.
6. Create or choose an existing execution role with permissions for `AWSLambdaBasicExecutionRole`.
7. After creation, upload `lambda-contact.zip` under the **Code** tab.
8. Set the **Handler** to `contact.handler`.

## 3. Add an API Gateway trigger

You can expose the Lambda function via an API Gateway HTTP API or Lambda Function URL.

### HTTP API trigger

1. In the Lambda console, open **Configuration** > **Triggers**.
2. Choose **Add trigger** and select **API Gateway**.
3. Choose **HTTP API**.
4. Create a new API or attach to an existing one.
5. Enable **CORS** and allow at least `POST` and `OPTIONS`.
   - If needed, manually add `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Headers: Content-Type`.
6. Save the trigger and copy the invoke URL.

> The Lambda function returns the required CORS headers from `lambda/contact.js`, so request headers are allowed across domains.

### Lambda Function URL alternative

1. In the Lambda console, open **Configuration** > **Function URL**.
2. Create a function URL with `Auth type` set to `NONE` or `AWS_IAM` depending on your needs.
3. Enable CORS, allowing `*` or your frontend domain.

## 4. Set environment variables for the Lambda

In the Lambda **Configuration** > **Environment variables** section, add:

- `USE_SES` = `true` or `false`
- `AWS_REGION` = `us-east-1` (or your preferred region)
- `SES_SENDER_EMAIL` = `sender@example.com`
- `SES_RECIPIENT_EMAIL` = `recipient@example.com`

> If `USE_SES` is `false`, the Lambda logs the submission to CloudWatch instead of sending email.

## 5. Update the frontend API URL

The React contact form uses the environment variable `VITE_CONTACT_API_URL`.

- For local development, create or update `.env` in the project root:

```env
VITE_CONTACT_API_URL=https://your-api-url.example.com/contact
```

- For Amplify or similar deployment, set `VITE_CONTACT_API_URL` in the build environment variables.

## 6. Test the contact form

1. Deploy or run the frontend.
2. Fill in name, email, and message.
3. Submit the form.
4. Check CloudWatch logs if the Lambda is invoked but the email is not delivered.

## Serverless architecture notes

- The frontend is static and hosted separately from the backend.
- The browser sends HTTP requests to an API endpoint, not directly to SMTP.
- API Gateway or Lambda Function URL serves as the HTTP front door for the Lambda.
- Lambda functions are ephemeral: they only run when a request arrives, so you do not manage a persistent server.
- This is ideal for a contact form because the workload is event-driven and low volume.
- A serverless backend can still access AWS services like SES for email, or log submissions for manual processing.
