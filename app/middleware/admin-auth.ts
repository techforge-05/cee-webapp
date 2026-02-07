/**
 * Middleware that protects all /admin/* routes.
 * Checks:
 * 1. User is authenticated (Supabase handles redirect if not)
 * 2. User has an admin profile (user_profiles record)
 * 3. User status is 'active'
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const localePath = useLocalePath()

  // If not authenticated, redirect to login
  if (!user.value) {
    return navigateTo(localePath('/auth/login'))
  }

  // Load admin profile
  const adminStore = useAdminStore()
  await adminStore.loadProfile()

  // If no admin profile exists, user is not an admin
  if (!adminStore.profile) {
    return navigateTo(localePath('/'))
  }

  // If account is not active
  if (adminStore.profile.status !== 'active') {
    return navigateTo(localePath('/auth/login'))
  }
})
