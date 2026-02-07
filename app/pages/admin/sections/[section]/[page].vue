<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ pageLabel }}</h1>
      <p class="text-gray-500">Manage content for this page.</p>
    </div>

    <!-- Placeholder - will be built in Phase 4/5 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-500 mb-2">Page Editor Coming Soon</h2>
      <p class="text-gray-400 max-w-md mx-auto">
        The content editor for this page will be available in the next phase.
        You'll be able to manage images, text, and lists for this page.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permission'],
})

const route = useRoute()

const pageSlug = computed(() => route.params.page as string)

const pageLabel = computed(() => {
  return (pageSlug.value || '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

useHead({
  title: () => `${pageLabel.value} - Admin - CEE`,
})
</script>
