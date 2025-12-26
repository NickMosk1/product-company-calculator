import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/product-company-calculator/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})