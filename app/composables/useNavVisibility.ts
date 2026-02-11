export function useNavVisibility() {
  const client = useSupabaseClient()
  const visibility = useState<Record<string, boolean>>('navVisibility', () => ({}))
  const loaded = useState('navVisibilityLoaded', () => false)

  function getKey(section: string, page?: string | null) {
    return page ? `${section}/${page}` : section
  }

  function isVisible(section: string, page?: string): boolean {
    // If section-level is hidden, all pages are hidden
    if (visibility.value[section] === false) return false
    // If specific page check, check page-level
    if (page) {
      const key = getKey(section, page)
      return visibility.value[key] !== false
    }
    return visibility.value[section] !== false
  }

  async function loadVisibility() {
    if (loaded.value) return
    const { data } = await client
      .from('nav_visibility')
      .select('section, page, is_visible')
    if (data) {
      const map: Record<string, boolean> = {}
      for (const row of data) {
        map[getKey(row.section, row.page)] = row.is_visible
      }
      visibility.value = map
      loaded.value = true
    }
  }

  async function toggleVisibility(section: string, page: string | null, isVisibleVal: boolean) {
    const { error } = page
      ? await client
          .from('nav_visibility')
          .update({ is_visible: isVisibleVal, updated_at: new Date().toISOString() })
          .eq('section', section)
          .eq('page', page)
      : await client
          .from('nav_visibility')
          .update({ is_visible: isVisibleVal, updated_at: new Date().toISOString() })
          .eq('section', section)
          .is('page', null)

    if (!error) {
      visibility.value[getKey(section, page)] = isVisibleVal
    }
    return { error }
  }

  function reload() {
    loaded.value = false
    return loadVisibility()
  }

  return { visibility, isVisible, loadVisibility, toggleVisibility, reload, loaded }
}
