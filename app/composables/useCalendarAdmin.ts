export interface CalendarEvent {
  id?: string
  title_es: string
  title_en: string
  description_es?: string
  description_en?: string
  start_date: string
  end_date?: string
  event_type: string
  location?: string
  all_day: boolean
  start_time?: string
  end_time?: string
  color?: string
  image_url?: string
  image_alt_es?: string
  image_alt_en?: string
  created_by?: string
  created_at?: string
  updated_at?: string
}

export const EVENT_TYPES = [
  { value: 'holiday', label: 'Holiday' },
  { value: 'exam', label: 'Exam' },
  { value: 'event', label: 'Event' },
  { value: 'no_school', label: 'No School' },
  { value: 'parent_meeting', label: 'Parent Meeting' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'inscription', label: 'Inscription' },
]

export const useCalendarAdmin = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const events = ref<CalendarEvent[]>([])

  const loadEvents = async (filters?: { type?: string; month?: number; year?: number }) => {
    loading.value = true
    error.value = null

    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .order('start_date', { ascending: false })

      if (filters?.type) query = query.eq('event_type', filters.type)
      if (filters?.year && filters?.month) {
        const startOfMonth = `${filters.year}-${String(filters.month).padStart(2, '0')}-01`
        const endOfMonth = new Date(filters.year, filters.month, 0).toISOString().split('T')[0]
        query = query.gte('start_date', startOfMonth).lte('start_date', endOfMonth)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      events.value = (data || []) as CalendarEvent[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const saveEvent = async (event: CalendarEvent): Promise<CalendarEvent> => {
    if (event.id) {
      const { data, error: saveError } = await supabase
        .from('calendar_events')
        .update({
          title_es: event.title_es,
          title_en: event.title_en,
          description_es: event.description_es || '',
          description_en: event.description_en || '',
          start_date: event.start_date,
          end_date: event.end_date || null,
          event_type: event.event_type,
          location: event.location || '',
          all_day: event.all_day,
          start_time: event.all_day ? null : event.start_time || null,
          end_time: event.all_day ? null : event.end_time || null,
          color: event.color || null,
          image_url: event.image_url || null,
          image_alt_es: event.image_alt_es || null,
          image_alt_en: event.image_alt_en || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', event.id)
        .select()
        .single()

      if (saveError) throw saveError
      return data as CalendarEvent
    } else {
      const user = useSupabaseUser()
      const { data, error: saveError } = await supabase
        .from('calendar_events')
        .insert({
          title_es: event.title_es,
          title_en: event.title_en,
          description_es: event.description_es || '',
          description_en: event.description_en || '',
          start_date: event.start_date,
          end_date: event.end_date || null,
          event_type: event.event_type,
          location: event.location || '',
          all_day: event.all_day,
          start_time: event.all_day ? null : event.start_time || null,
          end_time: event.all_day ? null : event.end_time || null,
          color: event.color || null,
          image_url: event.image_url || null,
          image_alt_es: event.image_alt_es || null,
          image_alt_en: event.image_alt_en || null,
          created_by: user.value?.id,
        })
        .select()
        .single()

      if (saveError) throw saveError
      return data as CalendarEvent
    }
  }

  const deleteEvent = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    events.value = events.value.filter(e => e.id !== id)
  }

  return { events, loading, error, loadEvents, saveEvent, deleteEvent }
}
