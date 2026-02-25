<template>
  <div>
    <!-- Preview when image exists -->
    <div v-if="modelValue" class="relative group">
      <div ref="containerEl" class="relative cursor-crosshair overflow-hidden rounded-lg border border-gray-200" @click="handleFocalPointClick">
        <img
          ref="imageEl"
          :src="modelValue"
          alt="Preview"
          class="w-full max-h-64 object-cover"
          :style="{ objectPosition: `${focalX}% ${focalY}%` }"
        />
        <!-- Focal point dot (draggable) -->
        <div
          :class="[
            'absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 border-white bg-primary-500/70 shadow-md z-10',
            isDraggingDot ? 'cursor-grabbing scale-125' : 'cursor-grab',
            isDraggingDot ? '' : 'transition-all duration-150',
          ]"
          :style="{ left: `${focalX}%`, top: `${focalY}%` }"
          @mousedown.stop.prevent="startDrag"
          @touchstart.stop.prevent="startDrag"
        />
        <!-- Crosshair lines -->
        <div
          class="absolute h-px w-full bg-white/40 pointer-events-none"
          :style="{ top: `${focalY}%` }"
        />
        <div
          class="absolute w-px h-full bg-white/40 pointer-events-none top-0"
          :style="{ left: `${focalX}%` }"
        />
      </div>
      <!-- Hint -->
      <p class="text-xs text-gray-400 mt-1 text-center">
        {{ $t('admin.components.image.focalPointHint') }}
      </p>
      <!-- Action buttons -->
      <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <UButton
          icon="i-heroicons-arrow-path"
          variant="solid"
          color="neutral"
          size="xs"
          :title="$t('admin.components.image.upload')"
          @click.stop="triggerFileInput"
        />
        <UButton
          icon="i-heroicons-trash"
          variant="solid"
          color="error"
          size="xs"
          :title="$t('admin.components.image.remove')"
          @click.stop="removeImage"
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
  focalX?: number
  focalY?: number
}>(), {
  folder: 'cee-assets/general',
  maxSize: 10,
  accept: 'image/*',
  focalX: 50,
  focalY: 50,
})

const emit = defineEmits<{
  'update:focalX': [value: number]
  'update:focalY': [value: number]
}>()

const modelValue = defineModel<string>({ default: '' })

const { upload, loading: uploading, compressing } = useImageUpload()
const toast = useToast()
const { t } = useI18n()

const realFileInput = ref<HTMLInputElement | null>(null)
const imageEl = ref<HTMLImageElement | null>(null)
const containerEl = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const isDraggingDot = ref(false)
const justDragged = ref(false)

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
    // Reset focal point to center on new image
    emit('update:focalX', 50)
    emit('update:focalY', 50)
  } catch {
    toast.add({
      title: t('admin.components.image.uploadError'),
      color: 'error',
    })
  }
}

function removeImage() {
  modelValue.value = ''
  emit('update:focalX', 50)
  emit('update:focalY', 50)
}

function handleFocalPointClick(event: MouseEvent) {
  if (justDragged.value) return
  const target = event.currentTarget as HTMLElement
  if (!target) return

  const rect = target.getBoundingClientRect()
  const x = Math.round(((event.clientX - rect.left) / rect.width) * 100)
  const y = Math.round(((event.clientY - rect.top) / rect.height) * 100)

  emit('update:focalX', Math.max(0, Math.min(100, x)))
  emit('update:focalY', Math.max(0, Math.min(100, y)))
}

function getPositionFromEvent(event: MouseEvent | TouchEvent) {
  const container = containerEl.value
  if (!container) return null
  const rect = container.getBoundingClientRect()
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
  const x = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)))
  const y = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)))
  return { x, y }
}

function onDrag(event: MouseEvent | TouchEvent) {
  const pos = getPositionFromEvent(event)
  if (!pos) return
  emit('update:focalX', pos.x)
  emit('update:focalY', pos.y)
}

function stopDrag() {
  isDraggingDot.value = false
  justDragged.value = true
  setTimeout(() => { justDragged.value = false }, 0)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

function startDrag(event: MouseEvent | TouchEvent) {
  isDraggingDot.value = true
  onDrag(event)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag, { passive: false })
  document.addEventListener('touchend', stopDrag)
}

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>
