import imageCompression from 'browser-image-compression'

export const useImageUpload = () => {
  const loading = ref(false)
  const compressing = ref(false)
  const error = ref<string | null>(null)

  const MAX_SIZE_MB = 10

  const upload = async (file: File, folder: string = 'cee-assets/general'): Promise<string> => {
    loading.value = true
    error.value = null

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed')
      }

      // Compress if file exceeds the upload limit
      let fileToUpload: File = file
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        compressing.value = true
        fileToUpload = await imageCompression(file, {
          maxSizeMB: MAX_SIZE_MB,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
        })
        compressing.value = false
      }

      const formData = new FormData()
      formData.append('file', fileToUpload)
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
      compressing.value = false
      loading.value = false
    }
  }

  const deleteImage = async (url: string): Promise<void> => {
    if (!url) return
    try {
      await $fetch('/api/admin/delete-image', {
        method: 'POST',
        body: { url },
      })
    } catch (e) {
      console.warn('[ImageUpload] Failed to delete old image:', e)
    }
  }

  return { upload, deleteImage, loading, compressing, error }
}
