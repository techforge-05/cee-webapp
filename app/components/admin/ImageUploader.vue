<template>
  <div>
    <!-- Preview when image exists -->
    <div v-if="modelValue" class="relative group">
      <img
        :src="modelValue"
        alt="Preview"
        class="w-full max-h-64 object-cover rounded-lg border border-gray-200"
      />
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
        <UButton
          icon="i-heroicons-arrow-path"
          variant="solid"
          color="neutral"
          size="sm"
          :title="$t('admin.components.image.upload')"
          @click="triggerFileInput"
        />
        <UButton
          icon="i-heroicons-trash"
          variant="solid"
          color="error"
          size="sm"
          :title="$t('admin.components.image.remove')"
          @click="removeImage"
        />
      </div>
    </div>

    <!-- Upload zone when no image -->
    <div
      v-else
      :class="[
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-gray-400',
      ]"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-gray-400 mx-auto mb-3" />
      <p class="text-sm text-gray-600">
        {{ $t('admin.components.image.dragDrop') }}
      </p>
      <p class="text-xs text-gray-400 mt-1">
        {{ $t('admin.components.image.maxSize', { size: maxSize }) }}
      </p>
    </div>

    <!-- Hidden file input -->
    <input
      ref="fileInput"
      type="hidden"
      :accept="accept"
    />
    <input
      ref="realFileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Loading overlay -->
    <div
      v-if="compressing || uploading"
      class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
    >
      <div class="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
        <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-primary-500" />
        <span class="text-sm font-medium">
          {{ compressing ? $t('admin.components.image.compressing') : $t('admin.components.image.uploading') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  folder?: string
  maxSize?: number
  accept?: string
}>(), {
  folder: 'cee-assets/general',
  maxSize: 10,
  accept: 'image/*',
})

const modelValue = defineModel<string>({ default: '' })

const { upload, loading: uploading, compressing } = useImageUpload()
const toast = useToast()
const { t } = useI18n()

const realFileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function triggerFileInput() {
  realFileInput.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) processFile(file)
  // Reset input so same file can be re-selected
  input.value = ''
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

async function processFile(file: File) {
  // Validate type
  if (!file.type.startsWith('image/')) {
    toast.add({
      title: t('admin.components.image.uploadError'),
      description: 'Only image files are allowed',
      color: 'error',
    })
    return
  }

  try {
    const url = await upload(file, props.folder)
    modelValue.value = url
  } catch {
    toast.add({
      title: t('admin.components.image.uploadError'),
      color: 'error',
    })
  }
}

function removeImage() {
  modelValue.value = ''
}
</script>
