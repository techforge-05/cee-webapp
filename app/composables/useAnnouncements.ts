export interface Announcement {
  id?: string
  title_es: string
  title_en: string
  description_es?: string
  description_en?: string
  image_url?: string
  image_alt_es?: string
  image_alt_en?: string
  display_date: string
  event_id?: string
  is_active: boolean
  created_by?: string
  created_at?: string
  updated_at?: string
}

export const useAnnouncements = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const announcements = ref<Announcement[]>([])

  const loadAnnouncements = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('announcements')
        .select('*')
        .order('display_date', { ascending: false })
        .limit(50)

      if (fetchError) throw fetchError
      announcements.value = (data || []) as Announcement[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const saveAnnouncement = async (announcement: Announcement): Promise<Announcement> => {
    if (announcement.id) {
      const { data, error: saveError } = await supabase
        .from('announcements')
        .update({
          title_es: announcement.title_es,
          title_en: announcement.title_en,
          description_es: announcement.description_es || '',
          description_en: announcement.description_en || '',
          image_url: announcement.image_url || null,
          image_alt_es: announcement.image_alt_es || null,
          image_alt_en: announcement.image_alt_en || null,
          display_date: announcement.display_date,
          event_id: announcement.event_id || null,
          is_active: announcement.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', announcement.id)
        .select()
        .single()

      if (saveError) throw saveError
      return data as Announcement
    } else {
      const user = useSupabaseUser()
      const { data, error: saveError } = await supabase
        .from('announcements')
        .insert({
          title_es: announcement.title_es,
          title_en: announcement.title_en,
          description_es: announcement.description_es || '',
          description_en: announcement.description_en || '',
          image_url: announcement.image_url || null,
          image_alt_es: announcement.image_alt_es || null,
          image_alt_en: announcement.image_alt_en || null,
          display_date: announcement.display_date,
          event_id: announcement.event_id || null,
          is_active: announcement.is_active,
          created_by: user.value?.id,
        })
        .select()
        .single()

      if (saveError) throw saveError
      return data as Announcement
    }
  }

  const deleteAnnouncement = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    announcements.value = announcements.value.filter(a => a.id !== id)
  }

  const toggleActive = async (id: string) => {
    const item = announcements.value.find(a => a.id === id)
    if (!item) return

    const { error: updateError } = await supabase
      .from('announcements')
      .update({ is_active: !item.is_active, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError
    item.is_active = !item.is_active
  }

  return { announcements, loading, error, loadAnnouncements, saveAnnouncement, deleteAnnouncement, toggleActive }
}
