<template>
  <NuxtLink
    :to="to"
    class="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden"
  >
    <div class="p-6">
      <div class="flex items-start gap-4">
        <div
          class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
          :class="bgColor"
        >
          <UIcon :name="icon" class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ label }}</h3>
          <p class="text-sm text-gray-500">{{ pageCount }} {{ pageCount === 1 ? 'page' : 'pages' }}</p>
        </div>
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400 shrink-0 mt-1" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  to: string
  pageCount: number
  bgColor: string
}>()
</script>
