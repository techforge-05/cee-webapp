export interface PublicContentItem {
  id: string
  page_key: string
  content_es: Record<string, any>
  content_en: Record<string, any>
  sort_order: number
  is_active: boolean
  metadata?: Record<string, any>
}

export function usePublicContent() {
  const supabase = useSupabaseClient()
  const { locale } = useI18n()

  // Global cache keyed by pageKey
  const cache = useState<Record<string, PublicContentItem[]>>('publicContent', () => ({}))
  const loading = useState<boolean>('publicContentLoading', () => false)

  async function loadContent(pageKeys: string[]): Promise<void> {
    const toFetch = pageKeys.filter(k => !(k in cache.value))
    if (toFetch.length === 0) return

    loading.value = true
    try {
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .in('page_key', toFetch)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (data) {
        for (const key of toFetch) {
          cache.value[key] = (data as PublicContentItem[])
            .filter(item => item.page_key === key)
        }
      }
    } finally {
      loading.value = false
    }
  }

  function getItems(pageKey: string): PublicContentItem[] {
    return cache.value[pageKey] || []
  }

  function getSingle(pageKey: string): PublicContentItem | null {
    return cache.value[pageKey]?.[0] || null
  }

  function field(item: PublicContentItem | null, fieldKey: string): string {
    if (!item) return ''
    const content = locale.value === 'en' ? item.content_en : item.content_es
    return content?.[fieldKey] ?? ''
  }

  function meta(item: PublicContentItem | null, metaKey: string): string {
    if (!item) return ''
    return item.metadata?.[metaKey] ?? ''
  }

  // Shorthand: get a bilingual field from a single-item pageKey
  function singleField(pageKey: string, fieldKey: string): string {
    const item = getSingle(pageKey)
    return item ? field(item, fieldKey) : ''
  }

  // Shorthand: get a metadata field from a single-item pageKey
  function singleMeta(pageKey: string, metaKey: string): string {
    const item = getSingle(pageKey)
    return item ? meta(item, metaKey) : ''
  }

  return { loadContent, getItems, getSingle, field, meta, singleField, singleMeta, cache, loading }
}
