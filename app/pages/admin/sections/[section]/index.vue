<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ sectionLabel }}</h1>
      <p class="text-gray-500">Manage pages in this section.</p>
    </div>

    <!-- Pages Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminPageCard
        v-for="page in visiblePages"
        :key="page.slug"
        :icon="page.icon"
        :label="page.label"
        :to="localePath(`/admin/sections/${sectionKey}/${page.slug}`)"
        :bg-color="sectionConfig?.bgColor || 'bg-gray-600'"
        :description="page.description"
      />
    </div>

    <!-- No pages message -->
    <div
      v-if="visiblePages.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
    >
      <UIcon name="i-heroicons-folder-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">No pages available in this section.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSectionConfig } from '~/config/sectionRegistry'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permission'],
})

const route = useRoute()
const localePath = useLocalePath()
const adminStore = useAdminStore()
const { t } = useI18n()

const sectionKey = computed(() => route.params.section as string)

const sectionConfig = computed(() => getSectionConfig(sectionKey.value))

const sectionLabel = computed(() =>
  t(`nav.${sectionKey.value}`, sectionKey.value),
)

const visiblePages = computed(() => {
  const config = sectionConfig.value
  if (!config) return []

  const allowedPages = adminStore.allowedPages(sectionKey.value)

  if (allowedPages === null) return config.pages
  return config.pages.filter((p) => allowedPages.includes(p.slug))
})

useHead({
  title: () => `${sectionLabel.value} - Admin - CEE`,
})
</script>
