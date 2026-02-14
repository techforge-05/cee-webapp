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
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ $t('admin.dialogs.useDefault.title') }}
          </h3>
        </template>

        <p class="text-gray-600">
          {{ $t('admin.dialogs.useDefault.message') }}
        </p>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              variant="outline"
              color="neutral"
              @click="showModal = false"
            >
              {{ $t('admin.actions.cancel') }}
            </UButton>
            <UButton color="primary" class="bg-teal-600 hover:bg-teal-700" @click="confirmRestore">
              {{ $t('admin.actions.confirm') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- No Defaults Modal -->
    <UModal v-model:open="showNoDefaultsModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ $t('admin.dialogs.noDefaults.title') }}
          </h3>
        </template>

        <p class="text-gray-600">
          {{ $t('admin.dialogs.noDefaults.message') }}
        </p>

        <template #footer>
          <div class="flex justify-end">
            <UButton @click="showNoDefaultsModal = false">
              {{ $t('admin.actions.ok') }}
            </UButton>
          </div>
        </template>
      </UCard>
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
    showNoDefaultsModal.value = true
    return
  }

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
