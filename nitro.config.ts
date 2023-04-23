import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
  devProxy: {
    '/api/': {
      target: 'https://api.example.com/api/',
      changeOrigin: true,
      hostRewrite: true,
      cookieDomainRewrite: true,
      headers: {
        'X-Forwarded-Host': 'localhost:3000',
        'X-Forwarded-Proto': 'http'
      },
    }
  }
})