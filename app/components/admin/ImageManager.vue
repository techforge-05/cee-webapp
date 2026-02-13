<template>
  <div class="space-y-4">
    <ImageUploader
      :model-value="model.url"
      :folder="folder"
      @update:model-value="onUrlChange"
    />

    <BilingualTextField
      v-if="model.url"
      v-model="altTextModel"
      :label="$t('admin.components.image.altText')"
    />

    <BilingualTextField
      v-if="model.url && showTitle"
      v-model="titleModel"
      :label="$t('admin.components.image.title')"
    />
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from './BilingualTextField.vue'

export interface ImageData {
  url: string
  alt_es: string
  alt_en: string
  title_es?: string
  title_en?: string
}

withDefaults(defineProps<{
  folder?: string
  showTitle?: boolean
}>(), {
  folder: 'cee-assets/general',
  showTitle: false,
})

const model = defineModel<ImageData>({
  default: () => ({
    url: '',
    alt_es: '',
    alt_en: '',
    title_es: '',
    title_en: '',
  }),
})

function onUrlChange(url: string) {
  model.value = { ...model.value, url }
}

const altTextModel = computed<BilingualText>({
  get: () => ({ es: model.value.alt_es, en: model.value.alt_en }),
  set: (val) => {
    model.value = { ...model.value, alt_es: val.es, alt_en: val.en }
  },
})

const titleModel = computed<BilingualText>({
  get: () => ({ es: model.value.title_es || '', en: model.value.title_en || '' }),
  set: (val) => {
    model.value = { ...model.value, title_es: val.es, title_en: val.en }
  },
})
</script>
