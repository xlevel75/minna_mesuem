import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // KCISA open APIs (exhibitions / performances / festivals) block direct
      // browser calls (CORS + http mixed-content). Route them through the dev
      // server. In production this must be replaced by a real backend proxy.
      '/kcisa': {
        target: 'https://api.kcisa.kr',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kcisa/, ''),
      },
      // 한국관광공사 TourAPI (KorService2) — real-time festival data.
      '/tourapi': {
        target: 'https://apis.data.go.kr',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/tourapi/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
