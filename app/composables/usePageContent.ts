export interface PageContentItem {
  id?: string
  page_key: string
  content_es: Record<string, any>
  content_en: Record<string, any>
  sort_order: number
  is_active: boolean
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export const usePageContent = () => {
  const supabase = useSupabaseClient()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const items = ref<PageContentItem[]>([])

  const loadItems = async (pageKey: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', pageKey)
        .order('sort_order', { ascending: true })

      if (fetchError) throw fetchError
      items.value = (data || []) as PageContentItem[]
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const saveItem = async (item: PageContentItem): Promise<PageContentItem> => {
    const payload = {
      page_key: item.page_key,
      content_es: item.content_es,
      content_en: item.content_en,
      sort_order: item.sort_order,
      is_active: item.is_active,
      metadata: item.metadata || {},
    }

    if (item.id) {
      // Try update existing
      const { data, error: saveError } = await supabase
        .from('page_content')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', item.id)
        .select()

      if (saveError) throw saveError

      // If update matched a row, return it
      if (data && data.length > 0) {
        return data[0] as PageContentItem
      }
      // Row not found — fall through to insert
    }

    // Insert new
    const { data, error: saveError } = await supabase
      .from('page_content')
      .insert(payload)
      .select()

    if (saveError) throw saveError
    if (!data || data.length === 0) throw new Error('Insert returned no data')
    return data[0] as PageContentItem
  }

  const deleteItem = async (id: string) => {
    const { error: deleteError } = await supabase
      .from('page_content')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError
    items.value = items.value.filter((i) => i.id !== id)
  }

  const reorderItems = async (pageKey: string, orderedIds: string[]) => {
    const updates = orderedIds.map((id, index) =>
      supabase.from('page_content').update({ sort_order: index }).eq('id', id),
    )
    await Promise.all(updates)
  }

  const saveAll = async (pageKey: string, itemsToSave: PageContentItem[]) => {
    loading.value = true
    error.value = null

    try {
      // Fetch current items for this pageKey to determine deletions
      const { data: currentItems } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_key', pageKey)

      const results: PageContentItem[] = []
      for (let i = 0; i < itemsToSave.length; i++) {
        const item = { ...itemsToSave[i], page_key: pageKey, sort_order: i }
        const saved = await saveItem(item)
        results.push(saved)
      }

      // Delete items that were removed
      const savedIds = new Set(results.map((r) => r.id))
      const toDelete = (currentItems || []).filter((i: any) => i.id && !savedIds.has(i.id))
      for (const item of toDelete) {
        await deleteItem(item.id!)
      }

      items.value = results
      return results
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return { items, loading, error, loadItems, saveItem, deleteItem, reorderItems, saveAll }
}
