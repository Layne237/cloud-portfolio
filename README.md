# Cloud Portfolio

Modern React portfolio for Song Martin Ariel Eudes, built with Vite, TailwindCSS, and Framer Motion. Deployed on Vercel.

## Local Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
```

## Deploy to Vercel

1. Push to GitHub.
2. Import repo into [Vercel](https://vercel.com/new).
3. Set required environment variables in Vercel Dashboard → Project Settings → Environment Variables (see `.env.example`).
4. Deploy — Vercel auto-detects the Vite framework and uses `vercel.json` config.

## Environment Variables

All client-side vars must be prefixed with `VITE_`. See `.env.example` for the full list:

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Base URL for API Gateway |
| `VITE_CONTACT_API_URL` | Contact form endpoint |
| `VITE_PROJECTS_API_URL` | Projects API endpoint |
| `VITE_VISITOR_API_URL` | Visitor counter endpoint |
| `VITE_WS_URL` | WebSocket URL for live presence |
| `VITE_USER_POOL_ID` | Cognito user pool ID (optional) |
| `VITE_USER_POOL_CLIENT_ID` | Cognito app client ID (optional) |

## Stack

- **Framework**: React 19 + Vite 8
- **Styling**: TailwindCSS 3
- **Animation**: Framer Motion 11
- **Icons**: react-icons
- **Hosting**: Vercel (static SPA)
- **Backend**: AWS Lambda / API Gateway (external)
