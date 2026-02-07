<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Announcements</h1>
      <p class="text-gray-500">Manage school announcements.</p>
    </div>

    <!-- Placeholder - will be built in Phase 4 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <UIcon name="i-heroicons-megaphone" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-500 mb-2">Announcement Management Coming Soon</h2>
      <p class="text-gray-400">This page will be available in Phase 4.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

useHead({
  title: 'Announcements - Admin - CEE',
})
</script>
