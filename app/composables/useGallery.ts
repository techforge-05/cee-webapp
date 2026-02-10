export interface GalleryPhoto {
  id?: string
  title_es: string
  title_en: string
  year: number
  category: string
  url: string
  alt_text_es?: string
  alt_text_en?: string
  sort_order: number
  created_by?: string
  created_at?: string
  updated_at?: string
}

export const useGallery = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const photos = ref<GalleryPhoto[]>([])

  const loadPhotos = async (year?: number, category?: string) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('gallery_photos')
        .select('*')
        .order('year', { ascending: false })
        .order('sort_order', { ascending: true })

      if (year) query = query.eq('year', year)
      if (category) query = query.eq('category', category)

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      photos.value = (data || []) as GalleryPhoto[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const savePhoto = async (photo: GalleryPhoto): Promise<GalleryPhoto> => {
    if (photo.id) {
      const { data, error: saveError } = await supabase
        .from('gallery_photos')
        .update({
          title_es: photo.title_es,
          title_en: photo.title_en,
          year: photo.year,
          category: photo.category,
          url: photo.url,
          alt_text_es: photo.alt_text_es || '',
          alt_text_en: photo.alt_text_en || '',
          sort_order: photo.sort_order,
          updated_at: new Date().toISOString(),
        })
        .eq('id', photo.id)
        .select()
        .single()

      if (saveError) throw saveError
      return data as GalleryPhoto
    } else {
      const user = useSupabaseUser()
      const { data, error: saveError } = await supabase
        .from('gallery_photos')
        .insert({
          title_es: photo.title_es,
          title_en: photo.title_en,
          year: photo.year,
          category: photo.category,
          url: photo.url,
          alt_text_es: photo.alt_text_es || '',
          alt_text_en: photo.alt_text_en || '',
          sort_order: photo.sort_order,
          created_by: user.value?.id,
        })
        .select()
        .single()

      if (saveError) throw saveError
      return data as GalleryPhoto
    }
  }

  const deletePhoto = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('gallery_photos')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    photos.value = photos.value.filter(p => p.id !== id)
  }

  return { photos, loading, error, loadPhotos, savePhoto, deletePhoto }
}
