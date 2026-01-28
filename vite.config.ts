import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.ico', 'robots.txt', '*.svg'],
          manifest: {
            name: 'X-Algorithm Viral Puanlayıcı',
            short_name: 'Viral Scorer',
            description: 'X gönderilerinizi paylaşmadan önce viral potansiyelini analiz edin',
            theme_color: '#000000',
            background_color: '#000000',
            display: 'standalone',
            scope: '/',
            start_url: '/',
            id: '/',
            orientation: 'portrait-primary',
            icons: [
              {
                src: '/icon-192x192.svg',
                sizes: '192x192',
                type: 'image/svg+xml',
                purpose: 'any'
              },
              {
                src: '/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                purpose: 'any'
              }
            ],
            screenshots: [
              {
                src: '/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                form_factor: 'narrow',
                label: 'X Viral Puanlayıcı - Mobil Görünüm'
              },
              {
                src: '/icon-512x512.svg',
                sizes: '512x512',
                type: 'image/svg+xml',
                form_factor: 'wide',
                label: 'X Viral Puanlayıcı - Masaüstü Görünüm'
              }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'gstatic-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  },
                  cacheableResponse: {
                    statuses: [0, 200]
                  }
                }
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
