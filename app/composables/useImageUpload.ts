export const useImageUpload = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const upload = async (file: File, folder: string = 'cee-assets/general'): Promise<string> => {
    loading.value = true
    error.value = null

    try {
      // Validate file size (default 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed')
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const result = await $fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      return result.url
    } catch (e: any) {
      error.value = e.data?.message || e.message || 'Upload failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { upload, loading, error }
}
