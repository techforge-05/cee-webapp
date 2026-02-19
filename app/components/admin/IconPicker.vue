<template>
  <div class="space-y-2">
    <p v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
    </p>
    <div class="flex items-center gap-3 lg:w-1/3">
      <div
        v-if="modelValue"
        class="flex items-center justify-center w-10 h-10 shrink-0 rounded-lg bg-primary-50 border border-primary-200"
      >
        <UIcon :name="modelValue" class="w-6 h-6 text-primary-600" />
      </div>
      <USelectMenu
        :model-value="modelValue || undefined"
        :items="iconOptions"
        value-key="value"
        :placeholder="$t('admin.editors.generic.selectIcon')"
        :loading="loading"
        virtualize
        class="flex-1"
        @update:model-value="onSelect"
      >
        <template #leading>
          <UIcon v-if="modelValue" :name="modelValue" class="w-4 h-4" />
        </template>
      </USelectMenu>
      <UButton
        v-if="modelValue"
        icon="i-heroicons-x-mark"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="$emit('update:modelValue', '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { iconOptions, loading, fetchIcons } = useIconList()

onMounted(() => {
  fetchIcons()
})

function onSelect(val: string) {
  emit('update:modelValue', val || '')
}
</script>
