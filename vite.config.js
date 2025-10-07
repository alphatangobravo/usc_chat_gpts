import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use VITE_BASE_PATH from the workflow env; fallback to '/'
const basePath = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  plugins: [react()],
  base: basePath,
})
