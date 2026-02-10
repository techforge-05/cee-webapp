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
          v-model="model.es"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          class="w-full"
        />
        <div class="mt-1 flex justify-end">
          <TranslateButton
            :source-text="model.en"
            from="en"
            to="es"
            :disabled="disabled || !model.en"
            @translated="(text: string) => model.es = text"
          />
        </div>
      </UFormField>

      <!-- English -->
      <UFormField :label="$t('admin.components.bilingual.english')">
        <UTextarea
          v-model="model.en"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :required="required"
          :disabled="disabled"
          :rows="rows"
          class="w-full"
        />
        <div class="mt-1 flex justify-end">
          <TranslateButton
            :source-text="model.es"
            from="es"
            to="en"
            :disabled="disabled || !model.es"
            @translated="(text: string) => model.en = text"
          />
        </div>
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from './BilingualTextField.vue'

defineProps<{
  label?: string
  placeholder?: string
  required?: boolean
  maxLength?: number
  rows?: number
  disabled?: boolean
}>()

const model = defineModel<BilingualText>({ default: () => ({ es: '', en: '' }) })
</script>
