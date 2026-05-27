# AWS Monitoring and Observability for Cloud Portfolio

This guide adds production monitoring for Lambda, API Gateway, DynamoDB, and frontend Web Vitals.

## 1. Observability pillars

- Metrics: numeric signals about system health and performance. Examples: Lambda invocation count, API latency, DynamoDB capacity, frontend LCP.
- Logs: textual events captured during execution. Use CloudWatch Logs for Lambda function traces, API Gateway access logs, and custom application logs.
- Traces: distributed traces that show request flow across services. Use AWS X-Ray to connect Lambda execution, API Gateway routes, and downstream DynamoDB calls.

## 2. CloudWatch Dashboard

A monitoring dashboard provides a single view for:
- Lambda invocation count and duration
- API Gateway latency and error rate
- DynamoDB read/write capacity
- Frontend custom metrics for page load time and Web Vitals

A sample CloudFormation template is available at `cloudformation/monitoring-stack.yml`.

## 3. Enabling X-Ray tracing

### Lambda functions
- Enable active tracing for each Lambda in the AWS Console or IaC.
- In Node.js Lambda code, use `aws-xray-sdk-core` to wrap AWS SDK clients and capture DynamoDB calls.

### API Gateway
- Enable X-Ray tracing on the API stage by setting `TracingEnabled: true`.
- For REST APIs use `AWS::ApiGateway::Stage`; for HTTP/WebSocket APIs use `AWS::ApiGatewayV2::Stage`.

Example CloudFormation snippet:
```yaml
ApiGatewayStageTracing:
  Type: AWS::ApiGateway::Stage
  Properties:
    StageName: !Ref ApiStage
    RestApiId: !Ref ApiId
    TracingEnabled: true
```

### DynamoDB
- Instrument DynamoDB client calls with X-Ray so calls become subsegments in the trace.
- X-Ray will automatically link downstream AWS SDK calls when the SDK is wrapped.

## 4. Frontend performance monitoring

This project now reports Web Vitals to CloudWatch using `web-vitals`:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Page load time (load event end minus navigation start)

Frontend metric events are sent to `POST /metrics` and published to CloudWatch under the namespace `Portfolio/WebVitals`.

## 5. Anomaly detection

CloudWatch anomaly detection uses historical metric patterns to surface unusual behavior.

### Setup
1. Open CloudWatch > Alarms.
2. Create an alarm and choose a metric such as API `Latency`, Lambda `Duration`, or `5XXError`.
3. Select `Add anomaly detection band`.
4. Tune sensitivity by choosing the band width or standard deviation range.
5. Save the alarm and assign SNS or Slack notification targets.

### When to use it
- Spikes in latency that are not covered by fixed thresholds
- Gradual deviations in frontend performance
- Trends in DynamoDB capacity use before throttling occurs

## 6. Cost note

- CloudWatch free tier includes 10 custom metrics and 5GB of ingested logs per month.
- Custom metric publishes from the frontend metrics API count toward the custom metric quota.
- Keep Web Vitals payloads lightweight and avoid sending metrics more than once per page load.
- API Gateway, Lambda, and DynamoDB each incur additional monitoring costs for dashboards, logs, and custom metrics.

## 7. Deployment notes

### Backend dependencies
- `lambda/package.json` adds `aws-xray-sdk-core` for Lambda tracing.
- The backend deploy workflow is updated to install dependencies and package `node_modules` for Lambda functions.
- A new Lambda function named in `METRICS_FUNCTION_NAME` captures frontend Web Vitals and publishes them to CloudWatch.

### Frontend dependencies
- `web-vitals` is added to capture browser performance metrics.

## 8. Recommended alarms

- API error rate > 1% over 5 minutes
- API latency p95 > 500ms over 5 minutes
- Lambda throttles > 0 over 5 minutes

The CloudFormation template includes these alarms and a dashboard to visualize them.
