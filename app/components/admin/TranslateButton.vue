<template>
  <UButton
    icon="i-heroicons-language"
    variant="ghost"
    color="neutral"
    size="xs"
    :loading="translating"
    :disabled="disabled || !sourceText?.trim()"
    :title="$t('admin.components.bilingual.translate')"
    @click="handleTranslate"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  sourceText: string
  from: 'es' | 'en'
  to: 'es' | 'en'
  disabled?: boolean
}>()

const emit = defineEmits<{
  translated: [text: string]
}>()

const { translate } = useTranslation()
const toast = useToast()
const { t } = useI18n()
const translating = ref(false)

async function handleTranslate() {
  if (!props.sourceText?.trim()) return

  translating.value = true
  try {
    const result = await translate(props.sourceText, props.from, props.to)
    emit('translated', result)
  } catch {
    toast.add({
      title: t('admin.components.bilingual.translateError'),
      color: 'error',
    })
  } finally {
    translating.value = false
  }
}
</script>
