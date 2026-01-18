# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Nuxt 4 web application with Supabase authentication and internationalization (i18n). Uses Nuxt UI v4 for components and Tailwind CSS v4 for styling.

## Essential Commands

```bash
# Development
pnpm install          # Install dependencies
pnpm dev              # Start dev server at http://localhost:3000

# Production
pnpm build            # Build for production
pnpm preview          # Preview production build

# Cache management (if config changes aren't applying)
rm -rf .nuxt          # Clear Nuxt cache, then restart dev server
```

## Architecture

### Module Configuration (nuxt.config.ts)

Three key modules are configured with specific interdependencies:

1. **@nuxtjs/supabase**: Authentication module
   - Configured with `redirectOptions` to handle auth redirects
   - Default login path: `/auth/login` (NOT `/login`)
   - OAuth callback: `/auth/callback`
   - Exclude home and auth pages from auto-redirect: `['/', '/auth/*']`

2. **@nuxt/ui v4.3.0**: Component library (125+ components, all prefixed with `U`)
   - **ALWAYS** use Nuxt UI components instead of custom HTML elements
   - All components are prefixed with `U`: `UButton`, `UInput`, `UCard`, `UFormGroup`, etc.
   - Component documentation: https://ui.nuxt.com/components
   - Automatically handles Tailwind CSS v4 configuration
   - **DO NOT** manually import `tailwindcss` in CSS files
   - **DO NOT** create tailwind.config or postcss.config files
   - The module manages all styling infrastructure automatically

3. **@nuxtjs/i18n**: Internationalization
   - **MUST** specify `langDir: 'locales'` in config
   - Translation files: `locales/en.json` and `locales/es.json`
   - Default locale: Spanish (`es`)
   - Strategy: `prefix_except_default` (Spanish routes have no prefix, English routes use `/en`)
   - URLs: `/auth/login` (Spanish), `/en/auth/login` (English)

### CSS/Styling Architecture

- **app/assets/css/main.css**: Should only import Tailwind and Nuxt UI (`@import 'tailwindcss'; @import '@nuxt/ui';`)
- Nuxt UI v4 auto-configures Tailwind CSS v4 - no manual config needed
- After config changes, clear `.nuxt` cache and restart dev server

### Authentication Flow

1. **Protected routes**: Supabase module auto-redirects to `/auth/login` for unauthenticated users
2. **Login/Signup**: Located in `/auth/login` and `/auth/signup`
3. **OAuth callback**: `/auth/callback` handles OAuth redirects (Google login)
4. **Session management**: Use `useSupabaseUser()` composable (reactive, auto-imported)
5. **Client access**: Use `useSupabaseClient()` composable (auto-imported)

**Important**: Login page uses `onMounted()` (not `watchEffect()`) to check auth status and redirect. This prevents redirect loops.

### Internationalization (i18n) Architecture

- **Route generation**: Always use `localePath()` for navigation to ensure proper locale prefixes
- **Translation access**: Use `$t()` in templates or `t()` from `useI18n()` in script
- **Locale switching**: Use `setLocale()` from `useI18n()` composable
- **Current locale**: Access via `locale.value` from `useI18n()`
- **Component**: `LanguageSwitcher` component available globally

### File Structure

```
app/
  app.vue              # Root component wrapping with UApp and i18n locale
  pages/
    index.vue          # Home page (public, shows different UI for auth/unauth users)
    auth/
      login.vue        # Email/password + Google OAuth login
      signup.vue       # User registration
      callback.vue     # OAuth redirect handler
  components/
    LanguageSwitcher.vue  # Dropdown for locale switching
  assets/
    css/
      main.css         # Tailwind + Nuxt UI imports only

locales/
  en.json              # English translations
  es.json              # Spanish translations (default)
```

### Database Schema Management

This project uses **Supabase SDK** (not Prisma). Schema is managed in the database, not in application code.

**Workflow for schema changes**:
```bash
# 1. Initialize Supabase (if not done)
npx supabase init

# 2. Link to remote project
npx supabase link --project-ref YOUR_PROJECT_ID

# 3. Create migration file
npx supabase migration new migration_name

# 4. Edit SQL file in supabase/migrations/
# (Write CREATE TABLE, ALTER TABLE, etc.)

# 5. Push to remote database
npx supabase db push

# 6. Generate TypeScript types
npx supabase gen types typescript --linked > types/supabase.ts
```

**Type safety**: Import generated types and pass to `createClient<Database>()` for full autocomplete.

## Common Patterns

### Using Nuxt UI Components
**ALWAYS** use Nuxt UI v4.3.0 components instead of plain HTML elements:

```vue
<!-- ✅ CORRECT - Use Nuxt UI components -->
<UButton @click="handleClick">Click me</UButton>
<UInput v-model="email" type="email" />
<UCard>
  <template #header>Title</template>
  Content here
</UCard>
<UFormGroup label="Email" name="email">
  <UInput v-model="email" />
</UFormGroup>

<!-- ❌ WRONG - Don't use plain HTML -->
<button @click="handleClick">Click me</button>
<input v-model="email" type="email" />
<div class="card">Content</div>
```

Common Nuxt UI components:
- `UButton`, `UInput`, `UCard`, `UFormGroup`
- `UDropdown`, `UModal`, `UAlert`, `UBadge`
- `UAvatar`, `UIcon`, `UTooltip`, `UAccordion`
- See full list: https://ui.nuxt.com/components

### Navigation with i18n
```typescript
const localePath = useLocalePath()
await navigateTo(localePath('/auth/login'))  // Correct
await navigateTo('/auth/login')              // Wrong - breaks i18n
```

### Authentication Check
```typescript
const user = useSupabaseUser()  // Reactive ref
if (user.value) {
  // User is authenticated
}
```

### Translation Usage
```vue
<template>
  <h1>{{ $t('auth.login.title') }}</h1>
</template>

<script setup>
const { t } = useI18n()
const errorMsg = t('auth.errors.signInError')
</script>
```

## Environment Setup

Required environment variables in `.env`:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

For Google OAuth, configure in Supabase dashboard with callback URL: `http://localhost:3000/auth/callback` (dev) or `https://yourdomain.com/auth/callback` (prod).

## Important Constraints

1. **Never** remove `langDir: 'locales'` from i18n config - causes translation failures
2. **Never** manually configure Tailwind CSS when using Nuxt UI v4 - let the module handle it
3. **Never** use hardcoded paths for navigation - always use `localePath()` for i18n support
4. **Always** clear `.nuxt` cache after `nuxt.config.ts` changes
5. **Always** use `onMounted()` (not `watchEffect()`) for one-time auth redirects to avoid loops
