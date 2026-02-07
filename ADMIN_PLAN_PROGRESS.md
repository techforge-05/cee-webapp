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
**Status: NOT STARTED**

| Task | Status | Notes |
|------|--------|-------|
| BilingualTextField | Pending | |
| BilingualTextarea | Pending | |
| TranslateButton + API | Pending | Google Translate API |
| ImageUploader | Pending | Cloudinary upload |
| ImageManager | Pending | |
| CarouselManager | Pending | |
| DataListManager | Pending | |
| DataItemEditor | Pending | |
| ConfirmDialog | Pending | |

---

## Phase 4: High Priority Content Management
**Status: NOT STARTED**

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
