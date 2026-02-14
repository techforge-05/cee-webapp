<template>
  <div>
    <UButton
      variant="outline"
      color="neutral"
      size="sm"
      icon="i-heroicons-arrow-path"
      :loading="loading"
      @click="handleClick"
    >
      {{ $t('admin.actions.useDefault') }}
    </UButton>

    <!-- Confirmation Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ $t('admin.dialogs.useDefault.title') }}
          </h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ $t('admin.dialogs.useDefault.message') }}
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              variant="outline"
              color="neutral"
              @click="showModal = false"
            >
              {{ $t('admin.actions.cancel') }}
            </UButton>
            <UButton
              color="primary"
              class="bg-teal-600 hover:bg-teal-700"
              @click="confirmRestore"
            >
              {{ $t('admin.actions.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- No Defaults Modal -->
    <UModal v-model:open="showNoDefaultsModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ $t('admin.dialogs.noDefaults.title') }}
          </h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ $t('admin.dialogs.noDefaults.message') }}
          </p>
          <div class="flex justify-end">
            <UButton @click="showNoDefaultsModal = false">
              {{ $t('admin.actions.ok') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  pageKey: string
}>()

const emit = defineEmits<{
  restored: []
}>()

const { restoreDefaults, getDefaultValues } = useDefaultContent()
const toast = useToast()
const { t } = useI18n()

const loading = ref(false)
const showModal = ref(false)
const showNoDefaultsModal = ref(false)

function handleClick() {
  // Check if defaults exist
  const defaults = getDefaultValues(props.pageKey)
  if (!defaults.es && !defaults.en) {
    showModal.value = false  // Explicitly close confirmation modal
    showNoDefaultsModal.value = true
    return
  }

  showNoDefaultsModal.value = false  // Explicitly close no-defaults modal
  showModal.value = true
}

async function confirmRestore() {
  showModal.value = false
  loading.value = true

  try {
    const success = await restoreDefaults(props.pageKey)
    if (success) {
      toast.add({
        title: t('admin.messages.defaultsRestored'),
        color: 'success',
      })
      emit('restored')
    }
  } catch (error: any) {
    toast.add({
      title: t('admin.messages.restoreError'),
      description: error.message,
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>
