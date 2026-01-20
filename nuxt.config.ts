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
    langDir: 'locales',
    locales: [
      {
        code: 'es',
        name: 'Español',
        language: 'es-ES',
        files: ['es.json'],
      },
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
        files: ['en.json'],
      },
    ],
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
});
