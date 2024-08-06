import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import image from '@rollup/plugin-image'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    rollupOptions: {
      plugins: [
        image(),
      ],
    }
  }
})
