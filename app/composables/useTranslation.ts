export const useTranslation = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const translate = async (text: string, from: string, to: string): Promise<string> => {
    if (!text.trim()) return ''

    loading.value = true
    error.value = null

    try {
      const result = await $fetch('/api/admin/translate', {
        method: 'POST',
        body: { text, from, to },
      })
      return result.translatedText
    } catch (e: any) {
      error.value = e.data?.message || 'Translation failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { translate, loading, error }
}
