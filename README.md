# CEE WebApp

A Nuxt 4 application with Supabase authentication and Nuxt UI components.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Copy your project URL and anon key from the project settings
3. Update the `.env` file with your credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### 3. Enable Google OAuth (Optional)

To enable Google sign-in:

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials (Client ID and Client Secret)
5. Add authorized redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

### 4. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

- **Authentication**:
  - Email/Password sign up and login
  - Google OAuth login
  - Automatic session management

- **Internationalization (i18n)**:
  - Bilingual support (English & Spanish)
  - Language switcher component
  - SEO-friendly URL strategy
  - Browser language detection

- **UI Components**: Built with Nuxt UI (125+ components)
- **Responsive Design**: Mobile-first, fully responsive layout
- **Dark Mode**: Automatic dark mode support
- **TypeScript**: Full type safety

## Pages

- `/` - Home page (shows user info when logged in)
- `/auth/login` - Sign in page
- `/auth/signup` - Sign up page
- `/auth/callback` - OAuth callback handler

## Tech Stack

- **Nuxt 4.2.2** - Vue.js framework
- **@nuxtjs/supabase 2.0.3** - Supabase integration
- **@nuxt/ui 4.3.0** - UI component library (125+ components)
- **@nuxtjs/i18n 10.2.1** - Internationalization
- **Supabase** - Backend as a Service (Auth + Database)
- **Tailwind CSS** - Styling framework

## Development

The app uses:

- Auto-imported composables from @nuxtjs/supabase:
  - `useSupabaseClient()` - Access Supabase client
  - `useSupabaseUser()` - Get current user
- Auto-imported composables from @nuxtjs/i18n:
  - `useI18n()` - Access i18n instance
  - `useLocalePath()` - Generate localized paths
  - `$t()` - Translate text
- Nuxt UI components (all prefixed with `U`)
- File-based routing in `app/pages`
- Translation files in `locales/` directory (en.json, es.json)

### Adding Translations

To add new translations, edit the JSON files in the `locales/` directory:

- `locales/en.json` - English translations
- `locales/es.json` - Spanish translations

### Language Switcher

The `LanguageSwitcher` component is available globally and can be used anywhere in your app.

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Next Steps

1. Set up your Supabase database tables
2. Configure Row Level Security (RLS) policies
3. Add protected routes using middleware
4. Customize the UI theme in `nuxt.config.ts`

https://www.imagine.art/image
