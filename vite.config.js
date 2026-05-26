import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite needs a base URL so static assets are resolved correctly in production.
// AWS Amplify serves the app from the root by default, but you can also override
// it with VITE_BASE_URL for subdirectory deployments.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  define: {
    'process.env': {},
  },
})
