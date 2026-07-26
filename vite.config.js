import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg',
        'icons/*.png',
        'offline.html',
      ],

      // ── Web App Manifest ──────────────────────────────────────────────
      manifest: {
        name: 'Red Palm Weevil Detection System',
        short_name: 'RPW Detect',
        description: 'AI-Based Red Palm Weevil Detection and Monitoring System',
        theme_color: '#16a34a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/?source=pwa',
        lang: 'en',
        categories: ['agriculture', 'utilities'],
        screenshots: [
          {
            src: '/icons/screenshot-wide.png',
            type: 'image/png',
            form_factor: 'wide',
            label: 'RPW Detection Dashboard',
          },
          {
            src: '/icons/screenshot-narrow.png',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'RPW Detection Mobile',
          },
          {
            src: '/icons/screenshot-3.png',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'RPW Trap Details',
          },
        ],
        icons: [
          { src: '/icons/icon-72x72.png',          sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96x96.png',          sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128x128.png',        sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png',        sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png',        sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-180x180.png',        sizes: '180x180', type: 'image/png' },
          { src: '/icons/icon-192x192.png',        sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-384x384.png',        sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png',        sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-maskable-192.png',   sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icons/icon-maskable-512.png',   sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },

      // ── Workbox Service Worker ────────────────────────────────────────
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        // Offline fallback
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/, /^\/firebase-messaging-sw\.js/],

        runtimeCaching: [
          // Firebase Firestore — NetworkFirst (live data with offline fallback)
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firestore-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Firebase Storage images — CacheFirst (images rarely change)
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-storage-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Firebase Auth — NetworkFirst
          {
            urlPattern: /^https:\/\/identitytoolkit\.googleapis\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'firebase-auth-cache',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Google Fonts — StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-cache' },
          },
        ],
      },

      // ── Dev options ───────────────────────────────────────────────────
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
})
