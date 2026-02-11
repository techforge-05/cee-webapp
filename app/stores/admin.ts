import { defineStore } from 'pinia'
import { getSectionKeys } from '~/config/sectionRegistry'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin'
  status: 'active' | 'invited' | 'expired' | 'disabled'
  invited_by: string | null
  invited_at: string | null
  created_at: string
  updated_at: string
}

export interface UserPermission {
  id: string
  user_id: string
  section: string
  page: string | null
  can_calendar: boolean
  can_announcements: boolean
  created_at: string
}

export const useAdminStore = defineStore('admin', {
  state: () => ({
    profile: null as UserProfile | null,
    permissions: [] as UserPermission[],
    isProfileLoaded: false,
    sidebarOpen: false,
  }),

  getters: {
    isSuperAdmin: (state) => state.profile?.role === 'super_admin',
    isAdmin: (state) => !!state.profile,
    isActive: (state) => state.profile?.status === 'active',

    hasCalendarAccess: (state) => {
      if (state.profile?.role === 'super_admin') return true
      return state.permissions.some((p) => p.can_calendar)
    },

    hasAnnouncementAccess: (state) => {
      if (state.profile?.role === 'super_admin') return true
      return state.permissions.some((p) => p.can_announcements)
    },

    allowedSections: (state) => {
      if (state.profile?.role === 'super_admin') {
        return getSectionKeys()
      }
      const sections = new Set<string>()
      state.permissions.forEach((p) => sections.add(p.section))
      return Array.from(sections)
    },
  },

  actions: {
    hasPermission(section: string, page?: string): boolean {
      if (this.profile?.role === 'super_admin') return true

      if (page) {
        // Check for specific page permission or full section access
        return this.permissions.some(
          (p) =>
            p.section === section && (p.page === page || p.page === null),
        )
      }

      // Check for any permission in the section
      return this.permissions.some((p) => p.section === section)
    },

    allowedPages(section: string): string[] | null {
      if (this.profile?.role === 'super_admin') return null // null = all pages

      const sectionPerms = this.permissions.filter(
        (p) => p.section === section,
      )

      // If any permission has page === null, user has full section access
      if (sectionPerms.some((p) => p.page === null)) return null

      return sectionPerms.map((p) => p.page!).filter(Boolean)
    },

    async loadProfile() {
      if (this.isProfileLoaded) return

      const supabase = useSupabaseClient()
      const user = useSupabaseUser()

      if (!user.value) {
        this.isProfileLoaded = true
        return
      }

      // On SSR, useSupabaseUser() returns JWT payload with `sub` instead of `id`
      const userId = user.value.id ?? user.value.sub

      if (!userId) {
        this.isProfileLoaded = true
        return
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // No profile found - user is not an admin
            this.isProfileLoaded = true
            return
          }
          throw profileError
        }

        this.profile = profile as UserProfile

        // Load permissions
        const { data: permissions, error: permError } = await supabase
          .from('user_permissions')
          .select('*')
          .eq('user_id', userId)

        if (permError) throw permError

        this.permissions = (permissions || []) as UserPermission[]
        this.isProfileLoaded = true
      } catch (error) {
        console.error('Error loading admin profile:', error)
        this.isProfileLoaded = true
      }
    },

    clearProfile() {
      this.profile = null
      this.permissions = []
      this.isProfileLoaded = false
    },

    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    closeSidebar() {
      this.sidebarOpen = false
    },
  },
})
