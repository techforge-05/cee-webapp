<template>
  <div class="space-y-2">
    <p v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Spanish -->
      <UFormField :label="$t('admin.components.bilingual.spanish')">
        <div class="flex gap-2">
          <UInput
            :model-value="modelEs"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :required="required"
            :disabled="disabled"
            class="flex-1"
            @update:model-value="updateEs"
          />
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
        <div class="flex gap-2">
          <UInput
            :model-value="modelEn"
            :placeholder="placeholder"
            :maxlength="maxLength"
            :required="required"
            :disabled="disabled"
            class="flex-1"
            @update:model-value="updateEn"
          />
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
export interface BilingualText {
  es: string
  en: string
}

const props = defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
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
