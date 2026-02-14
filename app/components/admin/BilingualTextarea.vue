<template>
  <div class="space-y-2">
    <p v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Spanish -->
      <UFormField :label="$t('admin.components.bilingual.spanish')">
        <UTextarea
          :model-value="modelEs"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          class="w-full"
          @update:model-value="updateEs"
        />
        <div class="mt-1 flex justify-end">
          <TranslateButton
            :source-text="modelEn"
            from="en"
            to="es"
            :disabled="disabled"
            @translated="updateEs"
          />
        </div>
      </UFormField>

      <!-- English -->
      <UFormField :label="$t('admin.components.bilingual.english')">
        <UTextarea
          :model-value="modelEn"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          class="w-full"
          @update:model-value="updateEn"
        />
        <div class="mt-1 flex justify-end">
          <TranslateButton
            :source-text="modelEs"
            from="es"
            to="en"
            :disabled="disabled"
            @translated="updateEn"
          />
        </div>
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from './BilingualTextField.vue'

const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  rows?: number
  disabled?: boolean
  modelValue?: BilingualText
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BilingualText]
}>()

const model = computed({
  get: () => props.modelValue || { es: '', en: '' },
  set: (value: BilingualText) => emit('update:modelValue', value),
})

// Explicit computed properties for es and en to ensure reactivity
const modelEs = computed(() => model.value.es)
const modelEn = computed(() => model.value.en)

function updateEs(text: string) {
  emit('update:modelValue', { es: text, en: model.value.en })
}

function updateEn(text: string) {
  emit('update:modelValue', { es: model.value.es, en: text })
}
</script>
