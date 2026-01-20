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
    vueI18n: './i18n.config.mjs',
    locales: [
      {
        code: 'es',
        name: 'Español',
      },
      {
        code: 'en',
        name: 'English',
      },
    ],
    defaultLocale: 'es',
    strategy: 'prefix_except_default',
  },
});
