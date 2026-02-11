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
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| GenericContentEditor component | Done | `app/components/admin/editors/GenericContentEditor.vue` - schema-driven editor with single/list section support |
| Editor schemas configuration | Done | `app/components/admin/editors/editorSchemas.ts` - schemas for 19 pages across 7 sections |
| CalendarInfoEditor component | Done | `app/components/admin/editors/CalendarInfoEditor.vue` - info redirect for calendar pages |
| [page].vue schema fallback | Done | Updated with priority: specific editor > schema editor > "Coming Soon" fallback |
| i18n translations | Done | Added `admin.editors.generic.*`, `admin.editors.calendarInfo.*`, and section-specific keys to both en.json + es.json |

### Architecture
- **GenericContentEditor**: One reusable component (~230 lines) driven by schema configs instead of 21 individual editor files
- **EditorSchemas**: Type-safe schema definitions (~550 lines) with field shorthand helpers (`f.title()`, `f.description()`, etc.)
- **Field types**: `text` (BilingualTextField), `textarea` (BilingualTextarea), `metadata` (plain UInput)
- **Section types**: `single` (one item per pageKey), `list` (multiple items via DataListManager)
- **CalendarInfoEditor**: Redirects to Calendar page for `academics/calendar` and `admissions/calendar`

### Pages Covered (19 schema-driven + 2 calendar)
- **About (5)**: mission-vision-values, statement-of-faith, philosophy, history, town
- **Academics (2+1)**: curriculum, grades, calendar (CalendarInfoEditor)
- **Student Life (4)**: sports-clubs, service-projects, library, upcoming-events
- **Support (4)**: why-support, scholarships, donate, projects
- **Contact (3)**: info, directions, form
- **Admissions (2+1)**: who-can-apply, how-to-apply, calendar (CalendarInfoEditor)
- **Get Involved (2)**: teachers, volunteer

### Files Created in Phase 5
```
app/components/admin/editors/GenericContentEditor.vue
app/components/admin/editors/editorSchemas.ts
app/components/admin/editors/CalendarInfoEditor.vue
```

### Files Modified in Phase 5
```
app/pages/admin/sections/[section]/[page].vue   (added schema fallback + CalendarInfoEditor mappings)
i18n/locales/en.json                             (added ~120 admin.editors.* translation keys)
i18n/locales/es.json                             (added ~120 admin.editors.* translation keys)
```

## Phase 6: Nav Management & Polish
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| useNavVisibility composable | Done | `app/composables/useNavVisibility.ts` - load/toggle/isVisible with useState caching |
| Manage Nav admin page | Done | `app/pages/admin/manage-nav.vue` - section+page toggles, instant save, super_admin only |
| Navbar visibility integration | Done | `app/components/Navbar.vue` - desktop nav filtered, badge buttons, mobile menu sections+pages all use `isVisible()` |
| AdminHeader section labels fix | Done | `app/components/admin/AdminHeader.vue` - uses `getSectionConfig()` from sectionRegistry instead of hardcoded map |
| i18n translations | Done | `admin.manageNav.*` keys in both en.json + es.json |

### Files Created in Phase 6
```
app/composables/useNavVisibility.ts
```

### Files Modified in Phase 6
```
app/pages/admin/manage-nav.vue              (replaced placeholder with full implementation)
app/components/Navbar.vue                   (added nav_visibility filtering for desktop + mobile)
app/components/admin/AdminHeader.vue        (use sectionRegistry for breadcrumb labels)
i18n/locales/en.json                        (added admin.manageNav.* translations)
i18n/locales/es.json                        (added admin.manageNav.* translations)
```

## Phase 7: Public Site Migration
**Status: COMPLETE**

| Task | Status | Notes |
|------|--------|-------|
| usePublicContent composable | Done | `app/composables/usePublicContent.ts` - read-only, locale-aware, cached via useState, batch-loadable |
| Migrate Gallery page | Done | `app/pages/student-life/gallery.vue` - reads from `gallery_photos` table via `useGallery` |
| Migrate Upcoming Events page | Done | `app/pages/student-life/upcoming-events.vue` - calendar_events + page_content for annual events |
| Migrate Home page | Done | `app/pages/index.vue` - values, activities, news, enrollment features |
| Migrate About section (4 pages) | Done | mission-vision-values, statement-of-faith, philosophy, town (history skipped — tightly coupled template) |
| Migrate Academics section (2 pages) | Done | curriculum (5 subject lists + benefits), grades (specialPrograms + approach; gradeLevels skipped — missing fields) |
| Migrate Student Life (3 pages) | Done | sports-clubs, service-projects, library (4 arrays: goals, schedules, levels, rules) |
| Migrate Support section (3 pages) | Done | why-support, donate (ways + wishLists), projects (current + howToHelp); scholarships skipped — no arrays |
| Migrate Contact section (2 pages) | Done | directions (landmarks), form (subjectOptions); info skipped — no arrays |
| Migrate Admissions (2 pages) | Done | who-can-apply (grades + requirements), how-to-apply (steps) |
| Migrate Get Involved (2 pages) | Done | teachers (qualifications + benefits), volunteer (opportunities) |

### Architecture
- **usePublicContent**: Composable with `loadContent()`, `getItems()`, `getSingle()`, `field()`, `meta()` — reads `page_content` table
- **Fallback strategy**: DB data preferred via `getItems()`, i18n used as fallback when DB is empty
- **Pattern**: Computed properties resolve both i18n message objects and DB strings to plain strings, eliminating `$rt()` from templates
- **Metadata fields**: Used for non-bilingual data (schedule day/hours, URLs, project status/goal/slug)

### Pages Skipped (no data-driven arrays)
- `about/history.vue` — timeline template too tightly coupled to hardcoded colors/icons per era
- `academics/grades.vue` gradeLevels — admin editor missing focus[] and ageRange fields
- `support/scholarships.vue` — no arrays to migrate
- `contact/info.vue` — no arrays to migrate

### Files Created in Phase 7
```
app/composables/usePublicContent.ts
```

### Files Modified in Phase 7 (~20 pages)
```
app/pages/index.vue
app/pages/student-life/gallery.vue
app/pages/student-life/upcoming-events.vue
app/pages/student-life/sports-clubs.vue
app/pages/student-life/service-projects.vue
app/pages/student-life/library.vue
app/pages/about/mission-vision-values.vue
app/pages/about/statement-of-faith.vue
app/pages/about/philosophy.vue
app/pages/about/town.vue
app/pages/academics/curriculum.vue
app/pages/academics/grades.vue
app/pages/support/why-support.vue
app/pages/support/donate.vue
app/pages/support/projects/index.vue
app/pages/contact/directions.vue
app/pages/contact/form.vue
app/pages/admissions/who-can-apply.vue
app/pages/admissions/how-to-apply.vue
app/pages/get-involved/teachers.vue
app/pages/get-involved/volunteer.vue
```

## Phase 7b: Fix Public Site Migration — SINGLE-type Content + PageKey Mismatches
**Status: COMPLETE**

### Problem
Admin-edited content wasn't appearing on public pages because:
1. **Missing SINGLE-type content**: Phase 7 only connected LIST-type pageKeys (arrays). ~60 single-type pageKeys (intro paragraphs, mission statements, descriptions) were never fetched.
2. **PageKey naming mismatches** (5 support pages): Public pages used wrong keys like `support.donate.ways.items` when admin saves as `support.donate.ways`.

### Solution

| Task | Status | Notes |
|------|--------|-------|
| Add `singleField`/`singleMeta` to usePublicContent | Done | Convenience helpers to avoid verbose `field(getSingle(...), ...)` calls |
| Fix support pageKey mismatches (5 keys) | Done | `why-support.vue`, `donate.vue`, `projects/index.vue` |
| Add singles to About section (4 pages) | Done | mvv(intro/mission/vision), sof(intro/closing), philosophy(intro/biblical/dignity/bilingual), town(intro/climate) |
| Add singles to Academics (2 pages) | Done | curriculum(intro/kindergarten/elementary/secondary), grades(intro) |
| Add singles to Student Life (4 pages) | Done | sports(intro/otherSports), service-projects(intro), library(7 singles + contact email meta), upcoming-events(intro/stayInformed) |
| Add singles to Support (3 pages) | Done | whySupport(intro/nonprofit), donate(intro/spanishBooks/contact+email/phone meta), projects(intro) |
| Add singles to Contact (2 pages) | Done | directions(intro/address/fromTegucigalpa/fromSanPedro/parking), form(intro/success/error) |
| Add singles to Admissions (2 pages) | Done | whoCanApply(intro), howToApply(intro/dates) |
| Add singles to Get Involved (2 pages) | Done | teachers(intro/requirements/applicationForms+url meta/contact+email meta), volunteer(intro/shortTerm/howTo/contact+email meta) |

### Architecture
- **`singleField(pageKey, fieldKey)`**: Gets bilingual field from a single-item pageKey (resolves to current locale)
- **`singleMeta(pageKey, metaKey)`**: Gets metadata field (email, phone, URL) from a single-item pageKey
- **Template pattern**: `{{ singleField('about.mvv.intro', 'title') || $t('about.missionVisionValues.intro.title') }}`
- **Metadata pattern**: `:href="mailto:${singleMeta('key', 'email') || 'fallback@email.org'}"`
- All 19 public pages updated (same files as Phase 7)

### PageKey Fixes Applied
| File | Wrong Key | Correct Key |
|------|-----------|-------------|
| `support/why-support.vue` | `support.whySupport.impact.items` | `support.whySupport.impact` |
| `support/donate.vue` | `support.donate.ways.items` | `support.donate.ways` |
| `support/donate.vue` | `support.donate.wishLists.items` | `support.donate.wishLists` |
| `support/projects/index.vue` | `support.projects.current.items` | `support.projects.items` |
| `support/projects/index.vue` | `support.projects.howToHelp.ways` | `support.projects.howToHelp` |

---

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
