import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/A.ico', 'images/an1lbayram_light.png', 'images/an1lbayram_night.png', 'robots.txt', 'sitemap.xml'],
      manifest: {
        name: 'Anıl Bayram - Software Developer',
        short_name: 'Anıl Bayram',
        description: 'Front-End geliştirici, yazılım meraklısı ve teknoloji tutkunu. Portfolio ve projelerim.',
        theme_color: '#00adb5',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'icons/A.ico',
            sizes: 'any',
            type: 'image/x-icon',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
