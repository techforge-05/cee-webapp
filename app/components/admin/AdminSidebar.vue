<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-60 h-screen bg-gray-900 text-white transition-transform duration-300 flex flex-col',
      'w-64 lg:translate-x-0',
      adminStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3 py-3 px-4 border-b border-gray-700 shrink-0">
      <img
        src="/images/logo.png"
        alt="CEE"
        class="h-12 w-auto"
      />
      <div class="flex flex-col leading-tight">
        <span class="text-sm font-bold text-white">CEE</span>
        <span class="text-xs text-gray-400">Admin Panel</span>
      </div>
      <!-- Close button (mobile) -->
      <UButton
        icon="i-heroicons-x-mark"
        variant="ghost"
        color="neutral"
        size="sm"
        class="lg:hidden ml-auto text-gray-400 hover:text-white"
        @click="adminStore.closeSidebar()"
      />
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <!-- Dashboard -->
      <NuxtLink
        :to="localePath('/admin')"
        :class="sidebarItemClass(isDashboardActive)"
        @click="adminStore.closeSidebar()"
      >
        <UIcon name="i-heroicons-squares-2x2" class="w-5 h-5 shrink-0" />
        <span>{{ $t('nav.admin.dashboard') || 'Dashboard' }}</span>
      </NuxtLink>

      <!-- Super admin only items -->
      <template v-if="adminStore.isSuperAdmin">
        <NuxtLink
          :to="localePath('/admin/users')"
          :class="sidebarItemClass(isActive('/admin/users'))"
          @click="adminStore.closeSidebar()"
        >
          <UIcon name="i-heroicons-users" class="w-5 h-5 shrink-0" />
          <span>{{ $t('nav.admin.users') || 'Users' }}</span>
        </NuxtLink>
        <NuxtLink
          :to="localePath('/admin/manage-nav')"
          :class="sidebarItemClass(isActive('/admin/manage-nav'))"
          @click="adminStore.closeSidebar()"
        >
          <UIcon name="i-heroicons-cog-6-tooth" class="w-5 h-5 shrink-0" />
          <span>{{ $t('nav.admin.manageNav') || 'Manage Nav' }}</span>
        </NuxtLink>
      </template>

      <!-- Calendar & Announcements & Gallery -->
      <NuxtLink
        v-if="adminStore.hasCalendarAccess"
        :to="localePath('/admin/calendar')"
        :class="sidebarItemClass(isActive('/admin/calendar'))"
        @click="adminStore.closeSidebar()"
      >
        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 shrink-0" />
        <span>{{ $t('nav.admin.calendar') || 'Calendar' }}</span>
      </NuxtLink>
      <NuxtLink
        v-if="adminStore.hasAnnouncementAccess"
        :to="localePath('/admin/announcements')"
        :class="sidebarItemClass(isActive('/admin/announcements'))"
        @click="adminStore.closeSidebar()"
      >
        <UIcon name="i-heroicons-megaphone" class="w-5 h-5 shrink-0" />
        <span>{{ $t('nav.admin.announcements') || 'Announcements' }}</span>
      </NuxtLink>
      <NuxtLink
        :to="localePath('/admin/sections/studentLife/gallery')"
        :class="sidebarItemClass(isActive('/admin/sections/studentLife/gallery'))"
        @click="adminStore.closeSidebar()"
      >
        <UIcon name="i-heroicons-photo" class="w-5 h-5 shrink-0" />
        <span>{{ $t('nav.admin.gallery') || 'Gallery' }}</span>
      </NuxtLink>

      <!-- Divider -->
      <div
        v-if="adminStore.isSuperAdmin || adminStore.hasCalendarAccess || adminStore.hasAnnouncementAccess"
        class="border-t border-gray-700 my-3"
      />

      <!-- Section items -->
      <NuxtLink
        v-for="section in visibleSections"
        :key="section.key"
        :to="localePath(`/admin/sections/${section.key}`)"
        :class="sidebarItemClass(isSectionActive(section.key))"
        @click="adminStore.closeSidebar()"
      >
        <UIcon :name="section.icon" class="w-5 h-5 shrink-0" />
        <span>{{ section.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User info at bottom -->
    <div class="border-t border-gray-700 p-4 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium">
          {{ initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ adminStore.profile?.full_name || adminStore.profile?.email }}</p>
          <p class="text-xs text-gray-400 truncate capitalize">{{ adminStore.profile?.role?.replace('_', ' ') }}</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Overlay (mobile) -->
  <Transition name="fade">
    <div
      v-if="adminStore.sidebarOpen"
      class="fixed inset-0 bg-black/50 z-55 lg:hidden"
      @click="adminStore.closeSidebar()"
    />
  </Transition>
</template>

<script setup lang="ts">
import { sectionRegistry } from '~/config/sectionRegistry'

const adminStore = useAdminStore()
const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const visibleSections = computed(() => {
  const allowed = adminStore.allowedSections
  return sectionRegistry
    .filter((s) => allowed.includes(s.key))
    .map((s) => ({
      ...s,
      label: t(`nav.${s.key}`, s.label),
    }))
})

const initials = computed(() => {
  const name = adminStore.profile?.full_name || adminStore.profile?.email || ''
  if (!name) return '?'
  const parts = name.split(/[\s@]/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
})

const isDashboardActive = computed(() => {
  const adminPath = localePath('/admin')
  return route.path === adminPath || route.path === adminPath + '/'
})

const isActive = (path: string) => {
  return route.path.includes(path)
}

// Paths with their own top-level sidebar entries — should not activate parent sections
const topLevelShortcuts = ['/admin/sections/studentLife/gallery']

const isSectionActive = (sectionKey: string) => {
  const sectionPath = `/admin/sections/${sectionKey}`
  if (!route.path.includes(sectionPath)) return false
  return !topLevelShortcuts.some(p => route.path.includes(p))
}

const sidebarItemClass = (active: boolean) => [
  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
  active
    ? 'bg-teal-700 text-white'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
