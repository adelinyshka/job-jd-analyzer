import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/analyze': 'http://localhost:30000'
    }
  },
  plugins: [react()],
})



