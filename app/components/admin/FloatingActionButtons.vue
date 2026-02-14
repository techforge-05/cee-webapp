<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="show && !adminStore.sidebarOpen"
        class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
      >
        <div class="lg:ml-64 p-4">
          <div
            class="bg-white border-t border-gray-200 rounded-t-xl shadow-2xl pointer-events-auto"
          >
            <div
              class="flex items-center justify-center lg:justify-end gap-3 px-6 py-4"
            >
              <!-- Cancel Button -->
              <UButton
                variant="outline"
                color="neutral"
                size="lg"
                icon="i-heroicons-x-mark"
                :disabled="loading || !isDirty"
                @click="handleCancel"
              >
                {{ $t('admin.actions.cancel') }}
              </UButton>

              <!-- Save Button -->
              <UButton
                color="primary"
                size="lg"
                icon="i-heroicons-check"
                :loading="loading"
                :disabled="!isDirty"
                class="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300"
                @click="handleSave"
              >
                {{ $t('admin.actions.save') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirmation Modal for Cancel -->
    <UModal v-model:open="showCancelModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            {{ $t('admin.dialogs.unsavedChanges.title') }}
          </h3>
          <p class="text-sm text-gray-500 mb-6">
            {{ $t('admin.dialogs.unsavedChanges.message') }}
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              variant="outline"
              color="neutral"
              @click="showCancelModal = false"
            >
              {{ $t('admin.actions.cancel') }}
            </UButton>
            <UButton color="error" @click="confirmCancel">
              {{ $t('admin.actions.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </Teleport>
</template>

<script setup lang="ts">
const adminStore = useAdminStore()

const props = withDefaults(
  defineProps<{
    show?: boolean
    isDirty: boolean
    loading?: boolean
  }>(),
  {
    show: true,
    loading: false,
  }
)

const emit = defineEmits<{
  save: []
  cancel: []
}>()

const showCancelModal = ref(false)

function handleSave() {
  emit('save')
}

function handleCancel() {
  if (props.isDirty) {
    // Show confirmation modal if there are unsaved changes
    showCancelModal.value = true
  } else {
    // No changes, just emit cancel
    emit('cancel')
  }
}

function confirmCancel() {
  showCancelModal.value = false
  emit('cancel')
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from {
  transform: translateY(100%);
}

.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
