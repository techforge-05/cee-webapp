/**
 * Middleware that checks section/page-level permissions for admin routes.
 * Used on /admin/sections/[section]/* routes.
 * Super admins bypass all checks.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const adminStore = useAdminStore()
  const localePath = useLocalePath()

  // Ensure profile is loaded
  if (!adminStore.isProfileLoaded) {
    await adminStore.loadProfile()
  }

  // Super admins bypass all permission checks
  if (adminStore.isSuperAdmin) return

  const section = to.params.section as string
  const page = to.params.page as string | undefined

  if (section && !adminStore.hasPermission(section, page)) {
    return navigateTo(localePath('/admin'))
  }
})
