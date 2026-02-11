<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
    <UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-blue-400 mx-auto mb-4" />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">
      {{ $t('admin.editors.calendarInfo.title') }}
    </h2>
    <p class="text-gray-500 max-w-md mx-auto mb-6">
      {{ $t('admin.editors.calendarInfo.message') }}
    </p>
    <UButton :to="localePath('/admin/calendar')" icon="i-heroicons-arrow-right" trailing>
      {{ $t('admin.editors.calendarInfo.goToCalendar') }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sectionKey: string
  pageSlug: string
}>()

const localePath = useLocalePath()
</script>
