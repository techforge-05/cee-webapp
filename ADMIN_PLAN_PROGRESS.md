# CEE Admin Panel - Progress Tracker

## Full Plan Reference
See `.claude/plans/merry-swimming-gray.md` for the complete plan.

---

## Phase 1: Foundation
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| Database migrations (all tables + RLS) | Done | `supabase/migrations/20260206000000_create_admin_tables.sql` - 7 new tables + ALTER calendar_events |
| Admin layout (`layouts/admin.vue`) | Done | Responsive layout with sidebar |
| Admin middleware (`admin-auth.ts`) | Done | Auth + admin role check |
| Admin middleware (`admin-permission.ts`) | Done | Section/page permission check |
| Admin store (`stores/admin.ts`) | Done | Profile, permissions, sidebar state |
| Core composable (`useAdminAuth.ts`) | Done | Convenience wrapper around admin store |
| Admin dashboard page (`/admin/index.vue`) | Done | Super admin: stats + sections. Admin: assigned sections |
| Admin sidebar component | Done | `components/admin/AdminSidebar.vue` - responsive, role-aware |
| Admin header component | Done | `components/admin/AdminHeader.vue` - breadcrumbs, user info |
| Section dashboard page | Done | `/admin/sections/[section]/index.vue` - page cards |
| Per-page editor (placeholder) | Done | `/admin/sections/[section]/[page].vue` - coming soon placeholder |
| Admin section card component | Done | `components/admin/AdminSectionCard.vue` |
| Admin page card component | Done | `components/admin/AdminPageCard.vue` |
| Manage Nav page (placeholder) | Done | `/admin/manage-nav.vue` |
| Calendar page (placeholder) | Done | `/admin/calendar.vue` |
| Announcements page (placeholder) | Done | `/admin/announcements.vue` |
| i18n admin labels | Done | Added `nav.admin.*` and `nav.home` to en.json + es.json |
| Create first super admin (manual) | TODO | See instructions below |

### Manual Steps to Complete Phase 1

#### 1. Push Database Migration
```bash
npx supabase db push
```

#### 2. Create First Super Admin
After logging into the app with your email/password:
1. Go to Supabase Dashboard → Table Editor → `user_profiles`
2. Insert a row:
   - `id`: Your auth user's UUID (find in Authentication → Users)
   - `email`: Your email
   - `full_name`: Your name
   - `role`: `super_admin`
   - `status`: `active`

---

## Phase 2: User Management
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| Users list page (`/admin/users/index.vue`) | Done | Full CRUD table with search, invite/delete/disable/re-invite actions, pending invitations |
| User detail page (`/admin/users/[id].vue`) | Done | Profile edit + permissions editor, role/status management |
| InviteUserModal component | Done | `components/admin/InviteUserModal.vue` - email, role, permission checkboxes |
| UserPermissionsEditor component | Done | `components/admin/UserPermissionsEditor.vue` - section/page toggles, calendar/announcement access |
| Invite API endpoint | Done | `server/api/admin/invite.post.ts` - creates invitation + sends Gmail email |
| Resend-invite API endpoint | Done | `server/api/admin/resend-invite.post.ts` - renews token + resends email |
| Accept-invite page | Done | `pages/auth/accept-invite.vue` - token validation + registration form |
| Forgot password page | Done | `pages/auth/forgot-password.vue` - email input + Supabase resetPasswordForEmail |
| Reset password page | Done | `pages/auth/reset-password.vue` - new password form + Supabase updateUser |
| Login page "Forgot Password?" link | Done | Added to `pages/auth/login.vue` |
| i18n translations (Phase 2) | Done | admin.users, admin.userDetail, admin.invite, admin.permissions, auth.forgotPassword, auth.resetPassword, auth.acceptInvite |
| Nodemailer dependency | Done | `nodemailer` + `@types/nodemailer` installed |
| Runtime config (Gmail) | Done | Added `gmailUser`, `gmailAppPassword`, `supabaseServiceKey` to `nuxt.config.ts` |

### Files Created in Phase 2
```
app/components/admin/UserPermissionsEditor.vue
app/components/admin/InviteUserModal.vue
app/pages/admin/users/[id].vue
app/pages/auth/accept-invite.vue
app/pages/auth/forgot-password.vue
app/pages/auth/reset-password.vue
server/api/admin/invite.post.ts
server/api/admin/resend-invite.post.ts
```

### Files Modified in Phase 2
```
app/pages/admin/users/index.vue      (replaced placeholder with full implementation)
app/pages/auth/login.vue             (added "Forgot Password?" link)
nuxt.config.ts                       (added runtimeConfig for Gmail)
i18n/locales/en.json                 (added Phase 2 translations)
i18n/locales/es.json                 (added Phase 2 translations)
package.json                         (added nodemailer, @types/nodemailer)
```

### Manual Steps to Complete Phase 2

#### 1. Gmail App Password Setup
1. Enable 2-Step Verification on your Google Workspace account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Add to `.env`:
```env
GMAIL_USER=your-email@your-domain.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

---

## Phase 3: Reusable Components
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| ConfirmDialog | Done | `app/components/admin/ConfirmDialog.vue` - UModal, v-model open, confirm/cancel emits |
| BilingualTextField | Done | `app/components/admin/BilingualTextField.vue` - Side-by-side ES/EN UInput, exports `BilingualText` |
| BilingualTextarea | Done | `app/components/admin/BilingualTextarea.vue` - Same but UTextarea |
| TranslateButton | Done | `app/components/admin/TranslateButton.vue` - Google Translate via server API |
| Translate server route | Done | `server/api/admin/translate.post.ts` - REST API call, admin auth |
| useTranslation composable | Done | `app/composables/useTranslation.ts` |
| ImageUploader | Done | `app/components/admin/ImageUploader.vue` - Drag-and-drop + click, Cloudinary upload |
| Upload server route | Done | `server/api/admin/upload.post.ts` - Multipart form, Cloudinary upload_stream |
| useImageUpload composable | Done | `app/composables/useImageUpload.ts` |
| ImageManager | Done | `app/components/admin/ImageManager.vue` - ImageUploader + bilingual alt/title fields |
| CarouselManager | Done | `app/components/admin/CarouselManager.vue` - Ordered ImageManager list with reorder |
| DataListManager | Done | `app/components/admin/DataListManager.vue` - Generic CRUD list with scoped slots |
| usePageContent composable | Done | `app/composables/usePageContent.ts` - CRUD for page_content table |
| i18n translations | Done | `admin.components.*` keys in both en.json + es.json |
| nuxt.config.ts runtimeConfig | Done | Added googleTranslateApiKey, cloudinary keys |
| Cloudinary dependency | Done | `cloudinary` v2.9.0 installed |

### Files Created in Phase 3
```
app/components/admin/ConfirmDialog.vue
app/components/admin/BilingualTextField.vue
app/components/admin/BilingualTextarea.vue
app/components/admin/TranslateButton.vue
app/components/admin/ImageUploader.vue
app/components/admin/ImageManager.vue
app/components/admin/CarouselManager.vue
app/components/admin/DataListManager.vue
app/composables/useTranslation.ts
app/composables/useImageUpload.ts
app/composables/usePageContent.ts
server/api/admin/translate.post.ts
server/api/admin/upload.post.ts
```

### Files Modified in Phase 3
```
nuxt.config.ts            (added runtimeConfig for Cloudinary + Google Translate)
package.json              (added cloudinary dependency)
i18n/locales/en.json      (added admin.components.* translations)
i18n/locales/es.json      (added admin.components.* translations)
```

### Manual Steps for Phase 3
#### 1. Google Cloud Translation API Setup
1. Go to Google Cloud Console
2. Enable Cloud Translation API
3. Create an API key
4. Add to `.env`: `GOOGLE_TRANSLATE_API_KEY=your-key`

#### 2. Cloudinary Setup
1. Create free Cloudinary account at cloudinary.com
2. Get cloud name, API key, API secret from dashboard
3. Add to `.env`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Phase 4: High Priority Content Management
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| Dynamic page editor infrastructure | Done | `[page].vue` - component map with `defineAsyncComponent`, "Coming Soon" fallback |
| Home page editor | Done | `app/components/admin/editors/HomePageEditor.vue` - welcome, enrollment, values, activities, news sections |
| FAQ editor | Done | `app/components/admin/editors/FaqEditor.vue` - category filter, bilingual Q&A, optional links |
| Leadership editor | Done | `app/components/admin/editors/LeadershipEditor.vue` - board photo, members, directors with photos |
| Gallery photo manager | Done | `app/components/admin/editors/GalleryEditor.vue` - photo grid, add/edit/delete modal, year/category filters |
| useGallery composable | Done | `app/composables/useGallery.ts` - CRUD for gallery_photos table |
| Calendar event management | Done | `app/pages/admin/calendar.vue` - full CRUD with modal, type filters, bilingual fields |
| useCalendarAdmin composable | Done | `app/composables/useCalendarAdmin.ts` - CRUD for calendar_events table |
| Announcement management | Done | `app/pages/admin/announcements.vue` - full CRUD with modal, active toggle, event linking |
| useAnnouncements composable | Done | `app/composables/useAnnouncements.ts` - CRUD for announcements table |
| usePageContent fix | Done | Fixed `saveAll` to fetch current items per pageKey before determining deletions |
| i18n translations | Done | `admin.editors.*` keys in both en.json + es.json |

### Files Created in Phase 4
```
app/components/admin/editors/HomePageEditor.vue
app/components/admin/editors/FaqEditor.vue
app/components/admin/editors/LeadershipEditor.vue
app/components/admin/editors/GalleryEditor.vue
app/composables/useGallery.ts
app/composables/useCalendarAdmin.ts
app/composables/useAnnouncements.ts
```

### Files Modified in Phase 4
```
app/pages/admin/sections/[section]/[page].vue   (dynamic editor loading via component map)
app/pages/admin/calendar.vue                     (replaced placeholder with full implementation)
app/pages/admin/announcements.vue                (replaced placeholder with full implementation)
app/composables/usePageContent.ts                (fixed saveAll deletion logic)
i18n/locales/en.json                             (added admin.editors.* translations)
i18n/locales/es.json                             (added admin.editors.* translations)
```

## Phase 5: Remaining Content Pages
**Status: NOT STARTED**

## Phase 6: Nav Management & Polish
**Status: NOT STARTED**

## Phase 7: Public Site Migration
**Status: NOT STARTED**

## Phase 8: Testing & Deploy
**Status: NOT STARTED**

---

## Integration Setup Needed
- [ ] Google Cloud Translation API key (`GOOGLE_TRANSLATE_API_KEY`)
- [ ] Gmail App Password (`GMAIL_USER`, `GMAIL_APP_PASSWORD`)
- [ ] Cloudinary account setup (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
- [x] First super admin user creation (instructions above)
- [x] Database migration file created (run `npx supabase db push`)

## Decided Integrations
- **Image Storage**: Cloudinary (25 credits/month free tier, auto-optimization)
- **Translation**: Google Cloud Translation API (free tier)
- **Email**: Gmail via Google Workspace (Nodemailer)
