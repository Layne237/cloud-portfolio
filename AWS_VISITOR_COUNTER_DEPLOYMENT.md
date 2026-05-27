# AWS Visitor Counter Deployment Instructions

This document describes how to build a serverless visitor counter for the portfolio using DynamoDB, Lambda, and API Gateway.

## 1. Create the DynamoDB table

1. Open the AWS Console and navigate to **DynamoDB**.
2. Choose **Create table**.
3. Set **Table name** to `VisitorCounter`.
4. Add a **Partition key** named `id` with type `String`.
5. Keep the default settings and choose **Create table**.

### Add the default item

1. Open the table, go to the **Items** tab.
2. Choose **Create item**.
3. Add an item with:
   - `id` = `portfolio`
   - `count` = `0`
4. Save the item.

> DynamoDB is a fully managed NoSQL database. It is a great fit for this use case because it supports single-item updates with atomic counters and scales automatically.

## 2. Create an IAM role for Lambda

1. Open the AWS Console and navigate to **IAM** > **Roles**.
2. Choose **Create role**.
3. Choose **AWS service** and select **Lambda**.
4. Attach the following managed policies:
   - `AWSLambdaBasicExecutionRole`
   - `AmazonDynamoDBFullAccess` (or a custom policy with least privilege)

### Least privilege recommendation

For production, use a custom policy that only allows `dynamodb:GetItem`, `dynamodb:UpdateItem`, and `dynamodb:DescribeTable` on the `VisitorCounter` table.

## 3. Create the Lambda function

1. Open the AWS Lambda Console.
2. Choose **Create function**.
3. Choose **Author from scratch**.
4. Set **Function name** to `portfolio-visitor-counter`.
5. Choose **Runtime**: `Node.js 18.x`.
6. Choose the IAM role created earlier.
7. Create the function.
8. In the **Code** tab, upload a zip file containing `visitorCounter.js`.

### Package the Lambda code

```powershell
cd d:\cloud-portfolio\lambda
Compress-Archive -Path visitorCounter.js -DestinationPath ..\lambda-visitor-counter.zip
```

9. Set the handler to `visitorCounter.handler`.
10. Add environment variables under **Configuration** > **Environment variables**:
    - `VISITOR_TABLE_NAME` = `VisitorCounter`
    - `AWS_REGION` = `us-east-1` (or your region)

## 4. Set up API Gateway

1. Open the AWS Console and navigate to **API Gateway**.
2. Choose **Create API** and select **REST API**.
3. Choose **Build**.
4. Set the API name to `visitor-counter-api`.
5. Create the API.
6. Under **Resources**, choose **Actions** > **Create Resource**.
7. Set **Resource Name** to `visitor-count` and **Resource Path** to `/visitor-count`.
8. With the new resource selected, choose **Actions** > **Create Method**.
9. Select `GET` and click the checkmark.
10. Choose **Lambda Function** integration type and enter `portfolio-visitor-counter`.
11. If prompted, grant permission to API Gateway to invoke the Lambda.
12. Deploy the API by choosing **Actions** > **Deploy API** and create a stage like `prod`.

### Enable CORS

1. With `/visitor-count` selected, choose **Actions** > **Enable CORS**.
2. Allow `GET`, `OPTIONS` and add `Content-Type` to allowed headers.
3. Confirm and apply the changes.

## 5. Get the endpoint URL

1. After deployment, open the **Stages** view.
2. Copy the `Invoke URL` and append `/visitor-count`.
3. Example: `https://abcd1234.execute-api.us-east-1.amazonaws.com/prod/visitor-count`

## 6. Add endpoint to `.env`

In your project root, create or update `.env`:

```env
VITE_VISITOR_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/visitor-count
```

> Make sure the `VITE_` prefix is used so Vite exposes the variable to the client bundle.

## 7. Test the visitor counter

1. Restart your Vite dev server if it is running.
2. Open the portfolio and refresh the page.
3. The footer should display the incremented visitor count.

## Learning comments

- DynamoDB is a fully managed NoSQL database. It is ideal for this use case because it handles fast, small read/write updates and scales automatically as traffic grows.
- API Gateway acts as the HTTP front door and proxies incoming requests to the Lambda function. Lambda receives the request event, performs the logic, and returns a response.
- The Lambda execution role is the IAM identity that allows the function to access DynamoDB. Use least privilege so the function only has the permissions it actually needs.
- This architecture scales automatically because Lambda scales with concurrent requests and DynamoDB scales with throughput, so you do not need to manage servers.
- DynamoDB free tier includes 25 GB of storage and 1M requests per month. For a low-traffic visitor counter, the free tier is usually sufficient.
