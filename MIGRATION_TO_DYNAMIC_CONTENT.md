# Migration Guide: Static Locales → Dynamic Database Content

This guide explains how to migrate from static JSON locale files to database-driven dynamic content when the app design is finalized.

## Current State

Currently, all content is stored in:
- `locales/es.json` - Spanish translations
- `locales/en.json` - English translations
- `public/images/` - Static images

Content is accessed via: `{{ $t('key') }}` in templates.

## Why Migrate?

After migration, school personnel can:
- Edit text content without code changes
- Upload and manage images through admin panel
- Update content in real-time
- Manage bilingual content easily

## Pre-Migration Checklist

- [ ] App design is finalized
- [ ] All static content is in JSON files
- [ ] All images are in `public/images/`
- [ ] You know which content should be editable by school personnel

## Migration Steps

### 1. Push Database Schema

Run the migration to create tables:

```bash
npx supabase db push
```

This creates two tables:
- `dynamic_content` - For text content (school name, descriptions, etc.)
- `media` - For images (logos, banners, photos)

### 2. Identify Dynamic vs Static Content

**Keep as static** (in JSON):
- UI labels (buttons, form fields)
- Error messages
- Navigation items
- Auth messages

**Make dynamic** (move to database):
- School name and description
- Homepage hero titles/subtitles
- About page content
- News/announcements
- Gallery images
- Banner images

### 3. Copy Content to Database

Option A: Manual (Supabase Dashboard)
1. Go to Supabase Dashboard → Table Editor
2. Open `dynamic_content` table
3. Insert rows for each editable text

Example:
| key | locale | value | category |
|-----|--------|-------|----------|
| school.name | es | Centro Educativo Ejemplo | school_info |
| school.name | en | Example Educational Center | school_info |
| home.hero.title | es | Bienvenidos | homepage |
| home.hero.title | en | Welcome | homepage |

Option B: Script (TODO: Create seeding script)

### 4. Upload Images to Supabase Storage

```bash
# Create storage bucket
npx supabase storage create images --public

# Upload images (via dashboard or script)
```

Then add entries to `media` table:
| key | url | alt_text_es | alt_text_en | category |
|-----|-----|-------------|-------------|----------|
| school.logo | https://[project].supabase.co/storage/v1/object/public/images/logo.png | Logo de la escuela | School logo | logos |

### 5. Update Components to Use Dynamic Content

**Before** (static):
```vue
<template>
  <h1>{{ $t('school.name') }}</h1>
  <img src="/images/logo.png" :alt="$t('school.logoAlt')" />
</template>
```

**After** (dynamic):
```vue
<template>
  <h1>{{ getContent('school.name', 'app.name') }}</h1>
  <img
    v-if="getMediaUrl('school.logo')"
    :src="getMediaUrl('school.logo') || ''"
    :alt="getMediaAlt('school.logo')"
  />
</template>

<script setup>
const { getContent, getMediaUrl, getMediaAlt } = useDynamicContent()
</script>
```

### 6. Test Content Loading

1. Start dev server: `pnpm dev`
2. Check browser console for errors
3. Verify content loads from database
4. Test language switching
5. Verify fallbacks to static i18n work

### 7. Build Admin Panel (Future)

Create admin pages for school personnel to:
- Edit text content (WYSIWYG editor?)
- Upload/manage images
- Preview changes before publishing

## Content Management After Migration

### For Developers

Static UI content stays in JSON files. Edit as before.

### For School Personnel

Dynamic content can be edited via:
1. Supabase Dashboard (temporary solution)
2. Admin Panel (to be built)

### Updating Content Programmatically

```typescript
const contentStore = useContentStore()

// Update text content
await contentStore.updateContent(
  'school.name',           // key
  'es',                    // locale
  'Nuevo Nombre',          // value
  'school_info'            // category (optional)
)

// Update media
await contentStore.updateMedia(
  'school.logo',           // key
  'https://...',           // url
  'Logo',                  // alt_text_es
  'Logo',                  // alt_text_en
  'logos'                  // category (optional)
)
```

## Rollback Plan

If issues occur, revert by:

1. Remove dynamic content usage from components
2. Restore `{{ $t('key') }}` syntax
3. Keep database tables (don't drop)
4. Can re-attempt migration later

## Files Already Created

These files are ready for migration:

✅ **Database Schema**
- `supabase/migrations/20250119000000_create_dynamic_content.sql`

✅ **Pinia Store**
- `app/stores/content.ts` - Content management store

✅ **Composable**
- `app/composables/useDynamicContent.ts` - Helper functions

✅ **Plugin**
- `app/plugins/dynamic-content.client.ts` - Auto-loads content

✅ **Documentation**
- `CLAUDE.md` - Updated with dynamic content architecture

## Notes

- Keep this file until migration is complete
- Delete after successful migration
- Document any custom changes or additions
