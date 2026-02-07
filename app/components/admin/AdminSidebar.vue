<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-40 h-screen bg-gray-900 text-white transition-transform duration-300',
      'w-64 lg:translate-x-0',
      adminStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3 h-16 px-4 border-b border-gray-700">
      <img
        src="/images/logo.png"
        alt="CEE"
        class="h-10 w-auto"
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
      <!-- Super admin only items -->
      <template v-if="adminStore.isSuperAdmin">
        <SidebarItem
          icon="i-heroicons-users"
          :label="$t('nav.admin.users') || 'Users'"
          :to="localePath('/admin/users')"
          :active="isActive('/admin/users')"
        />
        <SidebarItem
          icon="i-heroicons-cog-6-tooth"
          :label="$t('nav.admin.manageNav') || 'Manage Nav'"
          :to="localePath('/admin/manage-nav')"
          :active="isActive('/admin/manage-nav')"
        />
      </template>

      <!-- Calendar & Announcements -->
      <SidebarItem
        v-if="adminStore.hasCalendarAccess"
        icon="i-heroicons-calendar-days"
        :label="$t('nav.admin.calendar') || 'Calendar'"
        :to="localePath('/admin/calendar')"
        :active="isActive('/admin/calendar')"
      />
      <SidebarItem
        v-if="adminStore.hasAnnouncementAccess"
        icon="i-heroicons-megaphone"
        :label="$t('nav.admin.announcements') || 'Announcements'"
        :to="localePath('/admin/announcements')"
        :active="isActive('/admin/announcements')"
      />

      <!-- Divider -->
      <div
        v-if="adminStore.isSuperAdmin || adminStore.hasCalendarAccess || adminStore.hasAnnouncementAccess"
        class="border-t border-gray-700 my-3"
      />

      <!-- Section items -->
      <SidebarItem
        v-for="section in visibleSections"
        :key="section.key"
        :icon="section.icon"
        :label="section.label"
        :to="localePath(`/admin/sections/${section.key}`)"
        :active="isActive(`/admin/sections/${section.key}`)"
      />
    </nav>

    <!-- User info at bottom -->
    <div class="border-t border-gray-700 p-4">
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
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
      @click="adminStore.closeSidebar()"
    />
  </Transition>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const allSections = [
  { key: 'home', icon: 'i-heroicons-home', labelKey: 'Home' },
  { key: 'about', icon: 'i-heroicons-information-circle', labelKey: 'About' },
  { key: 'academics', icon: 'i-heroicons-academic-cap', labelKey: 'Academics' },
  { key: 'studentLife', icon: 'i-heroicons-face-smile', labelKey: 'Student Life' },
  { key: 'support', icon: 'i-heroicons-heart', labelKey: 'Support' },
  { key: 'contact', icon: 'i-heroicons-phone', labelKey: 'Contact' },
  { key: 'admissions', icon: 'i-heroicons-clipboard-document-check', labelKey: 'Admissions' },
  { key: 'getInvolved', icon: 'i-heroicons-hand-raised', labelKey: 'Get Involved' },
]

const visibleSections = computed(() => {
  const allowed = adminStore.allowedSections
  return allSections
    .filter((s) => allowed.includes(s.key))
    .map((s) => ({
      ...s,
      label: t(`nav.${s.key}`, s.labelKey),
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

const isActive = (path: string) => {
  return route.path.includes(path)
}
</script>

<script lang="ts">
// Sub-component for sidebar items
const SidebarItem = defineComponent({
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    to: { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  template: `
    <NuxtLink
      :to="to"
      :class="[
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        active
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white',
      ]"
    >
      <UIcon :name="icon" class="w-5 h-5 shrink-0" />
      <span>{{ label }}</span>
    </NuxtLink>
  `,
})
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
