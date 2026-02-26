<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-700">
        {{ $t('admin.components.carousel.images') }} ({{ model.length }}/{{ maxItems }})
      </span>
      <UButton
        icon="i-heroicons-plus"
        size="sm"
        :disabled="model.length >= maxItems"
        @click="addItem"
      >
        {{ $t('admin.components.carousel.addImage') }}
      </UButton>
    </div>

    <!-- Empty state -->
    <div
      v-if="model.length === 0"
      class="text-center py-8 text-gray-400 border border-dashed rounded-lg"
    >
      <UIcon name="i-heroicons-photo" class="w-8 h-8 mx-auto mb-2" />
      <p class="text-sm">{{ $t('admin.components.carousel.noImages') }}</p>
    </div>

    <!-- Image list -->
    <div v-else class="space-y-4">
      <UCard v-for="(item, index) in model" :key="index">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">
              {{ $t('admin.components.carousel.images') }} {{ index + 1 }}
            </span>
            <div class="flex gap-1">
              <UButton
                icon="i-heroicons-chevron-up"
                size="xs"
                variant="ghost"
                color="neutral"
                :disabled="index === 0"
                :title="$t('admin.components.dataList.moveUp')"
                @click="moveUp(index)"
              />
              <UButton
                icon="i-heroicons-chevron-down"
                size="xs"
                variant="ghost"
                color="neutral"
                :disabled="index === model.length - 1"
                :title="$t('admin.components.dataList.moveDown')"
                @click="moveDown(index)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="xs"
                variant="ghost"
                color="error"
                :disabled="model.length <= minItems"
                :title="$t('admin.components.dataList.removeItem')"
                @click="removeItem(index)"
              />
            </div>
          </div>
        </template>

        <ImageManager
          v-model="model[index]"
          :folder="folder"
          :show-title="showTitle"
        />
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageData } from './ImageManager.vue'

withDefaults(defineProps<{
  folder?: string
  maxItems?: number
  minItems?: number
  showTitle?: boolean
}>(), {
  folder: 'cee-assets/general',
  maxItems: 10,
  minItems: 0,
  showTitle: false,
})

const model = defineModel<ImageData[]>({ default: () => [] })
const { deleteImage } = useImageUpload()

function addItem() {
  model.value = [
    ...model.value,
    { url: '', alt_es: '', alt_en: '', title_es: '', title_en: '' },
  ]
}

function removeItem(index: number) {
  const removedItem = model.value[index]
  model.value = model.value.filter((_, i) => i !== index)
  // Fire-and-forget: delete from Cloudinary
  if (removedItem?.url) deleteImage(removedItem.url)
}

function moveUp(index: number) {
  if (index === 0) return
  const arr = [...model.value]
  ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
  model.value = arr
}

function moveDown(index: number) {
  if (index === model.value.length - 1) return
  const arr = [...model.value]
  ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
  model.value = arr
}
</script>
