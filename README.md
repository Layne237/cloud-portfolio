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
```

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

## GitHub + Amplify Integration

1. Push your code to a GitHub repository.
2. Connect Amplify to the repository.
3. Amplify listens for new commits and builds the app automatically.
4. Every merge to the connected branch can trigger a new deployment.

## What CloudFront Does Automatically

AWS Amplify provisions an Amazon CloudFront distribution for you. CloudFront:

- caches your static assets globally
- serves content from the nearest edge location
- improves performance for users worldwide
- handles HTTPS and TLS termination
