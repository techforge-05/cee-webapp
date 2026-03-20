// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },

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
    todopagoPayUser: process.env.TODOPAGO_PAY_USER || '',
    todopagoPayPassword: process.env.TODOPAGO_PAY_PASSWORD || '',
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    paypalMode: process.env.PAYPAL_MODE || 'sandbox',
    public: {
      paypalClientId: process.env.NUXT_PUBLIC_PAYPAL_CLIENT_ID || '',
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    },
  },

  nitro: {
    externals: {
      // Bundle @supabase/supabase-js inline to avoid ESM resolution failures on Vercel
      inline: ['@supabase/supabase-js'],
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
