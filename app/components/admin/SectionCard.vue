<template>
  <UCard
    :class="[
      'border-2 shadow-md transition-all hover:shadow-lg',
      isOpen ? 'border-teal-200 bg-teal-50/30' : 'border-gray-200',
    ]"
  >
    <template #header>
      <div class="flex items-center justify-between gap-4">
        <button
          class="flex items-center gap-3 flex-1 text-left group min-w-0 cursor-pointer"
          @click="toggleOpen"
        >
          <!-- Vertical accent bar -->
          <div
            :class="[
              'w-1 h-8 rounded-full transition-colors flex-shrink-0',
              isOpen ? 'bg-teal-500' : 'bg-gray-300 group-hover:bg-teal-400',
            ]"
          />

          <!-- Section title -->
          <h3
            :class="[
              'text-lg font-semibold transition-colors truncate',
              isOpen ? 'text-teal-700' : 'text-gray-700 group-hover:text-teal-600',
            ]"
          >
            {{ title }}
          </h3>

          <!-- Chevron icon -->
          <UIcon
            :name="
              isOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
            "
            :class="[
              'w-5 h-5 transition-colors ml-auto flex-shrink-0',
              isOpen ? 'text-teal-500' : 'text-gray-400 group-hover:text-teal-500',
            ]"
          />
        </button>

        <!-- Use Default Button (only if pageKey provided) -->
        <UseDefaultButton
          v-if="pageKey"
          :page-key="pageKey"
          class="flex-shrink-0"
          @restored="$emit('restored')"
        />
      </div>
    </template>

    <!-- Content (v-show preserves form state) -->
    <div v-show="isOpen">
      <slot />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    pageKey?: string
    modelValue?: boolean
  }>(),
  {
    modelValue: false,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'restored': []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function toggleOpen() {
  isOpen.value = !isOpen.value
}
</script>
