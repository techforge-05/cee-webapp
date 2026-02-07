<template>
  <NuxtLink
    :to="to"
    class="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 overflow-hidden"
  >
    <div class="p-5">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          :class="bgColor"
        >
          <UIcon :name="icon" class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-gray-900">{{ label }}</h3>
          <p v-if="description" class="text-sm text-gray-500 mt-0.5 truncate">{{ description }}</p>
        </div>
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5 text-gray-400 shrink-0" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  to: string
  bgColor: string
  description?: string
}>()
</script>
