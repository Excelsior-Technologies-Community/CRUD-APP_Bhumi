import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /api requests to the Express backend during dev.
      // This avoids CORS preflight issues entirely — the browser
      // sees same-origin requests, not cross-origin ones.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Also proxy /uploads so image <src> tags work in dev
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
