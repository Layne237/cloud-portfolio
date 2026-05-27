# Cloud Portfolio

This repository is a modern React portfolio for Song Martin Ariel Eudes, built with Vite, TailwindCSS, and Framer Motion. It is prepared for AWS Amplify static hosting and cloud-ready deployment.

## Local Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Layne237/your-portfolio-repo.git
   cd your-portfolio-repo
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build the production assets:
   ```bash
   npm run build
   ```

## AWS Amplify Deployment Steps

AWS Amplify can host this static React app with continuous deployment from GitHub.

1. Create an Amplify app in the AWS Console.
2. Connect your GitHub repository and choose the branch you want to deploy.
3. Amplify detects the project type and uses the `build` script defined in `package.json`.
4. Add any required environment variables in the Amplify Console under App Settings > Environment variables.
5. Deploy the app. Amplify also provisions a CloudFront distribution automatically for CDN delivery.

### Why Amplify needs these files

- `.gitignore` ensures build artifacts, secrets, and node modules are not pushed to GitHub.
- `package.json` defines the build script Amplify uses during deployment.
- `README.md` documents project setup and deployment so collaborators can onboard quickly.
- `404.html` is recommended for Amplify routing to handle direct deep links or invalid paths.

## Environment Variables Guide

In Vite, client-side environment variables must start with `VITE_`.

Example `.env` values:

```env
VITE_API_URL=https://api.example.com
VITE_BASE_URL=/
VITE_CONTACT_API_URL=https://your-api-url.example.com/contact
VITE_PROJECTS_API_URL=https://your-api-url.example.com/projects
VITE_API_BASE_URL=https://your-api-url.example.com
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your-cognito-app-client-id
VITE_COGNITO_REDIRECT_URI=https://your-frontend-domain/admin/callback
VITE_COGNITO_SIGN_OUT_URI=https://your-frontend-domain
VITE_WS_URL=wss://your-websocket-api-id.execute-api.us-east-1.amazonaws.com/production
```

The contact form uses `VITE_CONTACT_API_URL` to send submissions to the serverless backend. The live presence feature uses `VITE_WS_URL` to connect to the AWS WebSocket API. The frontend performance monitoring feature sends Web Vitals to `POST /metrics` by default, or to `${VITE_API_BASE_URL}/metrics` when `VITE_API_BASE_URL` is configured.

When using Amplify, configure these values in the AWS Console rather than committing them to GitHub.

### How environment variables work in production

During the build process, Vite replaces `import.meta.env.VITE_*` values with the environment variables defined for that build. This means the final static site contains the resolved values and does not read `.env` at runtime in the browser.

## Build Process

When you run `npm run build`, Vite:

- bundles JavaScript and CSS
- compiles JSX
- optimizes assets
- outputs a static `dist/` folder

Amplify deploys the contents of this folder as a static site.

## CI/CD with GitHub Actions

The repository includes two GitHub Actions workflows:

- `.github/workflows/deploy.yml` — frontend build and deployment to AWS Amplify or S3
- `.github/workflows/backend-deploy.yml` — Lambda packaging and backend deployment

### Deployment badges

> Replace `<OWNER>` and `<REPO>` with your GitHub account and repo name.

[![Frontend Deploy](https://github.com/<OWNER>/<REPO>/actions/workflows/deploy.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/deploy.yml)
[![Backend Deploy](https://github.com/<OWNER>/<REPO>/actions/workflows/backend-deploy.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/backend-deploy.yml)

### GitHub Secrets required

Set these secrets in `Settings > Secrets > Actions`:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET` (for S3 deploy)
- `CLOUDFRONT_DISTRIBUTION_ID` (optional)
- `DEPLOY_TARGET` (`amplify` or `s3`)
- `AMPLIFY_APP_ID` (if using Amplify)
- `AMPLIFY_BRANCH_NAME` (if using Amplify)
- `CONTACT_FUNCTION_NAME`
- `VISITOR_FUNCTION_NAME`
- `GET_SUBMISSIONS_FUNCTION_NAME`
- `GET_ANALYTICS_FUNCTION_NAME`
- `PROJECTS_FUNCTION_NAME`
- `METRICS_FUNCTION_NAME`

If you use AWS Amplify, also configure `VITE_CONTACT_API_URL` and related Vite env vars.

### GitHub Actions concepts

- **Runner**: the virtual machine that executes your workflow.
- **Job**: a set of steps executed on a runner.
- **Step**: an individual command or action inside a job.

The workflows in this repository:

1. Checkout the repository
2. Install Node dependencies
3. Run tests and linting
4. Build the frontend
5. Deploy frontend assets to Amplify or S3
6. Package Lambda functions and update backend code

### Protecting production deployments

The workflows use GitHub environment names: `development`, `staging`, and `production`.
You can configure environment protection in GitHub Repository Settings > Environments and require manual approval for the `production` environment.

### Rollback strategy

- For frontend S3 deployments: restore the previous version in the S3 bucket or use a CloudFront invalidation after restoring.
- For Amplify deployments: use the Amplify Console to redeploy a previous branch build or rollback to a previous release.
- For Lambda deployments: update the function again with a previous deployment package or use Lambda versions/aliases if enabled.

### Cost considerations

- GitHub Actions is free for public repositories, including CI/CD minutes.
- AWS Amplify and S3/CloudFront usage may incur cost once traffic grows.
- CloudFront invalidations are usually low-cost for a small number of paths.
- Use the AWS free tier for Lambda and S3 if available.

See `AWS_GITHUB_ACTIONS_IAM_POLICY.md` for the recommended IAM policy for GitHub Actions.

## GitHub + Amplify Integration

1. Push your code to a GitHub repository.
2. Connect Amplify to the repository.
3. Amplify listens for new commits and builds the app automatically.
4. Every merge to the connected branch can trigger a new deployment.

## Contact Form Backend

The frontend contact form is already implemented in `src/components/sections/Contact.jsx`.
For backend deployment and AWS Lambda setup, follow the instructions in `AWS_LAMBDA_CONTACT_DEPLOYMENT.md`.
For admin auth, analytics, and dashboard setup, see `AWS_ADMIN_DASHBOARD_DEPLOYMENT.md`.
For production monitoring, observability, and CloudWatch alarms, see `AWS_MONITORING_DEPLOYMENT.md`.

## What CloudFront Does Automatically

AWS Amplify provisions an Amazon CloudFront distribution for you. CloudFront:

- caches your static assets globally
- serves content from the nearest edge location
- improves performance for users worldwide
- handles HTTPS and TLS termination
