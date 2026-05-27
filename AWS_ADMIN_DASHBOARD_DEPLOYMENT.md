# AWS Admin Dashboard and Cognito Setup

This guide explains how to add an admin dashboard for your portfolio using AWS Cognito, API Gateway, Lambda, and DynamoDB.

## 1. Create required DynamoDB tables

### ContactSubmissions
- Partition key: `id` (String)
- Store admin message submissions from the contact form.

### PageViews
- Partition key: `id` (String)
- Store a single analytics item keyed by `pageViews`.

### ProjectInfo
- Partition key: `id` (String)
- Store dynamic project metadata under a single key like `portfolio-projects`.

## 2. Create Cognito User Pool

1. Open the AWS Cognito console.
2. Choose **Create user pool**.
3. Use **Review defaults** or **Step through settings**.
4. Under **Policies**, allow email-based sign-in or username sign-in.
5. Under **App clients**, create a new app client.
   - Disable client secret for browser-based applications.
   - Enable `Enable username password auth for admin APIs` if present.
6. Under **App client settings**, set:
   - Callback URL(s): `https://your-frontend-domain/admin/callback`
   - Sign out URL(s): `https://your-frontend-domain`
   - Allowed OAuth flows: `Implicit grant` or `Authorization code grant`.
   - Allowed OAuth scopes: `openid`, `profile`, `email`.
7. Save the changes.

## 3. Configure Cognito Hosted UI domain

1. In the Cognito console, select your user pool.
2. Go to **Domain name**.
3. Choose a domain prefix and save it.
4. Your hosted UI will be available at `https://<domain>.auth.<region>.amazoncognito.com`.

## 4. Create an admin user

1. In the Cognito console, go to **Users and groups**.
2. Choose **Create user**.
3. Set an email and username.
4. Send the invitation and complete email confirmation if required.
5. Optionally assign this user to an `admin` group.

## 5. Deploy Lambda functions

Use these handlers from the `lambda/` folder:
- `contact.js` — public contact submission endpoint (stores submissions in DynamoDB and optionally sends SES email)
- `visitorCounter.js` — public page view counter
- `getContactSubmissions.js` — admin-protected submissions read endpoint
- `getVisitorAnalytics.js` — admin-protected analytics endpoint
- `projects.js` — public GET for project data, protected PUT for admin content updates

### Required environment variables for Lambda functions
- `AWS_REGION` = e.g. `us-east-1`
- `CONTACT_TABLE_NAME` = `ContactSubmissions`
- `VISITOR_TABLE_NAME` = `PageViews`
- `PROJECTS_TABLE_NAME` = `ProjectInfo`
- `USE_SES` = `false` (or `true` when SES is configured)
- `SES_SENDER_EMAIL` and `SES_RECIPIENT_EMAIL` when using SES

## 6. Set up API Gateway routes

Use an HTTP API or REST API and configure the following routes:

### Public routes
- `POST /contact` -> Lambda `contact.js`
- `GET /visitor` -> Lambda `visitorCounter.js`
- `GET /projects` -> Lambda `projects.js`

### Admin routes protected by Cognito
- `GET /admin/submissions` -> Lambda `getContactSubmissions.js`
- `GET /admin/analytics` -> Lambda `getVisitorAnalytics.js`
- `PUT /admin/projects` -> Lambda `projects.js`

### Cognito authorizer setup
- Create a new Cognito authorizer in API Gateway with your User Pool.
- Attach the authorizer to the admin route methods only.
- Allow the `Authorization` header.

### CORS headers
- Enable CORS for all routes.
- Allow origins: `*` or your frontend domain.
- Allow methods: `OPTIONS, GET, POST, PUT`.
- Allow headers: `Content-Type, Authorization`.

## 7. Frontend environment variables

Add these values to `.env` or your hosting environment:

```env
VITE_API_BASE_URL=https://your-api-base.example.com
VITE_CONTACT_API_URL=https://your-api-base.example.com/contact
VITE_COGNITO_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
VITE_COGNITO_CLIENT_ID=your-app-client-id
VITE_COGNITO_REDIRECT_URI=https://your-frontend-domain/admin/callback
VITE_COGNITO_SIGN_OUT_URI=https://your-frontend-domain
```

## 8. Testing the authentication flow

1. Open `/admin/login` in the browser.
2. Click **Continue with Cognito**.
3. Sign in via the Hosted UI.
4. Confirm the browser redirects to `/admin/callback` and then to `/admin`.
5. Verify the admin dashboard loads submissions, analytics, and project content.
6. Update the JSON and save project metadata.
7. Visit the public home page and verify project listing updates.

## Comments and security notes

- JWT tokens include an access token and ID token. The frontend sends the access token in the `Authorization: Bearer` header to admin APIs.
- Cognito is recommended over custom authentication because it handles user identity, token issuance, security, password resets, and OAuth flows without you storing or managing credentials.
- Never store user passwords in your application. Cognito stores credentials securely.
- Token refresh is best handled using Authorization Code Grant with PKCE or a backend refresh flow. For a static frontend, use short-lived tokens and re-authenticate when the access token expires.
- AWS Cognito free tier includes 50,000 monthly active users for user pools, which is usually enough for low-traffic portfolio admin access.
- Always restrict admin API routes with proper Cognito authorization and do not expose admin-only data on public endpoints.

## Optional notes

- If you are hosting on Amplify or another static host, add a rewrite rule so all routes redirect to `index.html` for client-side routing.
- You can improve the admin dashboard later by adding group-based permissions and fine-grained access controls in Cognito.
