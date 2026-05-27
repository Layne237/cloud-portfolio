import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite needs a base URL so static assets are resolved correctly in production.
// AWS Amplify serves the app from the root by default, so '/' is the correct base.
// If you deploy under a subdirectory, set VITE_BASE_URL accordingly.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
  build: {
    // Ensure Vite writes the production output to dist, matching Amplify's baseDirectory
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    'process.env': {},
  },
})
