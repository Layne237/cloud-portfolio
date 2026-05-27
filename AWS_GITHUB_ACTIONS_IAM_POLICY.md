# GitHub Actions IAM Policy for AWS Deployment

This sample IAM policy grants least-privilege access for GitHub Actions deployments of the frontend and backend.

> Replace `arn:aws:s3:::your-bucket-name/*` and other placeholder ARNs with your actual resources.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AmplifyDeploy",
      "Effect": "Allow",
      "Action": [
        "amplify:StartJob",
        "amplify:GetApp",
        "amplify:GetBranch"
      ],
      "Resource": [
        "arn:aws:amplify:<REGION>:<ACCOUNT_ID>:apps/<APP_ID>/*"
      ]
    },
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-frontend-bucket",
        "arn:aws:s3:::your-frontend-bucket/*"
      ]
    },
    {
      "Sid": "CloudFrontInvalidate",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetDistribution"
      ],
      "Resource": [
        "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
      ]
    },
    {
      "Sid": "LambdaDeploy",
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction"
      ],
      "Resource": [
        "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:your-contact-function",
        "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:your-visitor-function",
        "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:your-getContactSubmissions-function",
        "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:your-getVisitorAnalytics-function",
        "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:your-projects-function"
      ]
    }
  ]
}
```

## Notes

- For GitHub Actions, create a dedicated IAM user and attach this policy.
- Do not use root credentials.
- Configure the user with only the AWS permissions needed for your deployment type.
- For real production usage, replace `*` placeholders with exact ARNs.
