// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  modules: ['@nuxtjs/supabase', '@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  ui: {
    colorMode: false,
  },

  css: ['~/assets/css/main.css'],

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: [
        '/',
        '/en',
        '/en/',
        '/auth/*',
        '/en/auth/*',
        '/about/*',
        '/en/about/*',
        '/academics/*',
        '/en/academics/*',
        '/student-life/*',
        '/en/student-life/*',
        '/parents/*',
        '/en/parents/*',
        '/support/*',
        '/en/support/*',
        '/contact/*',
        '/en/contact/*',
        '/admissions',
        '/admissions/*',
        '/en/admissions',
        '/en/admissions/*',
        '/get-involved',
        '/get-involved/*',
        '/en/get-involved',
        '/en/get-involved/*',
      ],
    },
  },

  runtimeConfig: {
    gmailUser: process.env.GMAIL_USER || '',
    gmailAppPassword: process.env.GMAIL_APP_PASSWORD || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
    todopagoUsername: process.env.TODOPAGO_USERNAME || '',
    todopagoPassword: process.env.TODOPAGO_PASSWORD || '',
    todopagoMerchantId: process.env.TODOPAGO_MERCHANT_ID || '',
    todopagoTerminalId: process.env.TODOPAGO_TERMINAL_ID || '',
    todopagoBaseUrl: process.env.TODOPAGO_BASE_URL || 'https://test-apitm-todopago.azurewebsites.net',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    paypalMode: process.env.PAYPAL_MODE || 'sandbox',
    public: {
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID || '',
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
