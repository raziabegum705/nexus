import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'https://nexus-b0mf.onrender.com',
        changeOrigin: true
      }
    }
  }
})
