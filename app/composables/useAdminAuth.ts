/**
 * Composable for admin authentication and role/permission checking.
 * Wraps the admin store for convenient use in components and middleware.
 */
export const useAdminAuth = () => {
  const adminStore = useAdminStore()
  const user = useSupabaseUser()

  const isSuperAdmin = computed(() => adminStore.isSuperAdmin)
  const isAdmin = computed(() => adminStore.isAdmin)
  const isActive = computed(() => adminStore.isActive)
  const profile = computed(() => adminStore.profile)
  const hasCalendarAccess = computed(() => adminStore.hasCalendarAccess)
  const hasAnnouncementAccess = computed(() => adminStore.hasAnnouncementAccess)
  const allowedSections = computed(() => adminStore.allowedSections)
  const isProfileLoaded = computed(() => adminStore.isProfileLoaded)

  const hasPermission = (section: string, page?: string): boolean => {
    return adminStore.hasPermission(section, page)
  }

  const allowedPages = (section: string): string[] | null => {
    return adminStore.allowedPages(section)
  }

  const loadProfile = async () => {
    await adminStore.loadProfile()
  }

  const clearProfile = () => {
    adminStore.clearProfile()
  }

  return {
    user,
    profile,
    isSuperAdmin,
    isAdmin,
    isActive,
    isProfileLoaded,
    hasCalendarAccess,
    hasAnnouncementAccess,
    allowedSections,
    hasPermission,
    allowedPages,
    loadProfile,
    clearProfile,
  }
}
