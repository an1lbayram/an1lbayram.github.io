import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
    // e2e/*.spec.js are Playwright tests (run via `npm run test:e2e`), not
    // Vitest — without this exclude, Vitest's default *.spec.js glob picks
    // them up too and fails on Playwright's incompatible test.beforeEach().
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      includeAssets: ['icons/A.ico', 'images/an1lbayram_light_440.webp', 'images/an1lbayram_night_440.webp', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Anıl Bayram - Software Developer',
        short_name: 'Anıl Bayram',
        description: 'Front-End geliştirici, yazılım meraklısı ve teknoloji tutkunu. Portfolio ve projelerim.',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icons/A.ico',
            sizes: 'any',
            type: 'image/x-icon',
          },
          {
            src: 'images/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'images/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
