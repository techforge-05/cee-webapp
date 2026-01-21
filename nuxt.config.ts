// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/', '/en', '/en/', '/auth/*', '/en/auth/*'],
    },
  },

  i18n: {
    defaultLocale: 'es',
    langDir: 'locales',
    locales: [
      {
        code: 'es',
        name: 'Español',
        file: 'es.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    strategy: 'prefix_except_default',
  },
});
