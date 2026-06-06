// @ts-ignore
import fs from 'node:fs'
// @ts-ignore
import path from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon'],
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    }
  },
  nitro: {
    preset: 'cloudflare-pages'
  },

  // Tambahkan hook ini untuk menghapus file _redirects sebelum di-deploy
  hooks: {
    'nitro:build:public-assets': (nitro) => {
      const redirectsPath = path.join(nitro.options.output.publicDir, '_redirects')
      
      if (fs.existsSync(redirectsPath)) {
        fs.unlinkSync(redirectsPath)
        console.log('Successfully removed _redirects to prevent Cloudflare deployment loop.')
      }
    }
  }
})