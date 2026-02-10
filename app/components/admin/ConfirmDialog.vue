<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-500 mb-6">
          {{ message }}
        </p>
        <div class="flex justify-end gap-3">
          <UButton
            variant="outline"
            @click="handleCancel"
          >
            {{ cancelLabel || $t('admin.components.confirm.cancel') }}
          </UButton>
          <UButton
            :color="confirmColor || 'error'"
            :loading="loading"
            @click="$emit('confirm')"
          >
            {{ confirmLabel || $t('admin.components.confirm.confirm') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: string
  loading?: boolean
}>()

const isOpen = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>
