<template>
  <header class="sticky top-0 z-30 bg-white border-b border-gray-200 h-16">
    <div class="flex items-center justify-between h-full px-4 lg:px-6">
      <!-- Left: Hamburger + Breadcrumbs -->
      <div class="flex items-center gap-3">
        <UButton
          icon="i-heroicons-bars-3"
          variant="ghost"
          color="neutral"
          size="sm"
          class="lg:hidden"
          @click="adminStore.toggleSidebar()"
        />

        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 text-sm">
          <NuxtLink
            :to="localePath('/admin')"
            class="text-gray-500 hover:text-gray-700"
          >
            Admin
          </NuxtLink>
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <UIcon
              name="i-heroicons-chevron-right"
              class="w-4 h-4 text-gray-400"
            />
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
              class="text-gray-500 hover:text-gray-700"
            >
              {{ crumb.label }}
            </NuxtLink>
            <span v-else class="text-gray-900 font-medium">
              {{ crumb.label }}
            </span>
          </template>
        </nav>
      </div>

      <!-- Right: Language + User -->
      <div class="flex items-center gap-3">
        <LanguageSwitcher />

        <div class="hidden sm:flex items-center gap-2 text-sm text-gray-600">
          <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
          <span class="truncate max-w-40">{{ adminStore.profile?.email }}</span>
        </div>

        <UButton
          variant="ghost"
          color="error"
          size="xs"
          @click="handleSignOut"
        >
          <UIcon name="i-heroicons-arrow-right-start-on-rectangle" class="w-4 h-4" />
          <span class="hidden sm:inline ml-1">{{ $t('nav.signOut') || 'Sign Out' }}</span>
        </UButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()
const supabase = useSupabaseClient()
const localePath = useLocalePath()
const route = useRoute()
const { t } = useI18n()

const sectionLabels: Record<string, string> = {
  home: 'Home',
  about: 'About',
  academics: 'Academics',
  studentLife: 'Student Life',
  support: 'Support',
  contact: 'Contact',
  admissions: 'Admissions',
  getInvolved: 'Get Involved',
}

const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs: Array<{ label: string; to?: string }> = []

  if (path.includes('/admin/users')) {
    crumbs.push({ label: 'Users', to: localePath('/admin/users') })
    if (route.params.id) {
      crumbs.push({ label: 'User Details' })
    }
  } else if (path.includes('/admin/manage-nav')) {
    crumbs.push({ label: 'Manage Nav' })
  } else if (path.includes('/admin/calendar')) {
    crumbs.push({ label: 'Calendar' })
  } else if (path.includes('/admin/announcements')) {
    crumbs.push({ label: 'Announcements' })
  } else if (path.includes('/admin/sections/')) {
    const section = route.params.section as string
    const page = route.params.page as string
    const sectionLabel =
      t(`nav.${section}`, sectionLabels[section] || section)

    crumbs.push({
      label: sectionLabel,
      to: page ? localePath(`/admin/sections/${section}`) : undefined,
    })

    if (page) {
      crumbs.push({ label: formatPageName(page) })
    }
  }

  return crumbs
})

const formatPageName = (page: string) => {
  return page
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleSignOut = async () => {
  adminStore.clearProfile()
  await supabase.auth.signOut()
  await navigateTo(localePath('/auth/login'))
}
</script>
