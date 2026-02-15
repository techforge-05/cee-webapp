<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ pageLabel }}</h1>
      <p class="text-gray-500">{{ $t('admin.editors.manageContent') }}</p>
    </div>

    <!-- Specific editor component -->
    <component
      :is="editorComponent"
      v-if="editorComponent"
      :section-key="sectionKey"
      :page-slug="pageSlug"
    />

    <!-- Generic schema-driven editor -->
    <GenericContentEditor
      v-else-if="editorSchema"
      :schema="editorSchema"
      :section-key="sectionKey"
      :page-slug="pageSlug"
    />

    <!-- Coming Soon fallback -->
    <div
      v-else
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
    >
      <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-500 mb-2">{{ $t('admin.editors.comingSoon') }}</h2>
      <p class="text-gray-400 max-w-md mx-auto">
        {{ $t('admin.editors.comingSoonDescription') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getEditorSchema } from '~/components/admin/editors/editorSchemas'
import GenericContentEditor from '~/components/admin/editors/GenericContentEditor.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permission'],
})

const route = useRoute()

const sectionKey = computed(() => route.params.section as string)
const pageSlug = computed(() => route.params.page as string)

const pageLabel = computed(() => {
  return (pageSlug.value || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

// Map of section/page to specific editor components
const editorMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'home/home': defineAsyncComponent(() => import('~/components/admin/editors/HomePageEditor.vue')),
  'contact/faq': defineAsyncComponent(() => import('~/components/admin/editors/FaqEditor.vue')),
  'about/leadership': defineAsyncComponent(() => import('~/components/admin/editors/LeadershipEditor.vue')),
  'studentLife/gallery': defineAsyncComponent(() => import('~/components/admin/editors/GalleryEditor.vue')),
  'academics/calendar': defineAsyncComponent(() => import('~/components/admin/editors/CalendarInfoEditor.vue')),
  'admissions/calendar': defineAsyncComponent(() => import('~/components/admin/editors/CalendarInfoEditor.vue')),
  'support/projects': defineAsyncComponent(() => import('~/components/admin/editors/ProjectsEditor.vue')),
}

const editorComponent = computed(() => {
  const key = `${sectionKey.value}/${pageSlug.value}`
  return editorMap[key] || null
})

// Schema-driven fallback for pages without specific editors
const editorSchema = computed(() => {
  const key = `${sectionKey.value}/${pageSlug.value}`
  return getEditorSchema(key)
})

useHead({
  title: () => `${pageLabel.value} - Admin - CEE`,
})
</script>
