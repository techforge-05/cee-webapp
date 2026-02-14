import type { PageContentItem } from '~/composables/usePageContent'

/**
 * Composable for managing default content values from i18n JSON files
 * Maps page_keys to i18n paths and restores defaults to database
 */
export const useDefaultContent = () => {
  const { messages } = useI18n()
  const supabase = useSupabaseClient()

  // Mapping of abbreviated page_key parts to full i18n paths
  const abbreviationMap: Record<string, string> = {
    mvv: 'missionVisionValues',
    sof: 'statementOfFaith',
  }

  /**
   * Map page_key to i18n path (handles abbreviations)
   * Example: "about.mvv.intro" → "about.missionVisionValues.intro"
   * @param pageKey - The page_key from page_content table
   * @returns The corresponding i18n path, or null if mapping fails
   */
  function pageKeyToI18nPath(pageKey: string): string | null {
    const parts = pageKey.split('.')

    // Replace abbreviated parts with full names
    const mappedParts = parts.map((part) => abbreviationMap[part] || part)

    return mappedParts.join('.')
  }

  /**
   * Get nested value from object using dot-notation path
   * @param obj - The object to traverse
   * @param path - Dot-separated path (e.g., "about.mvv.intro")
   * @returns The value at the path, or null if not found
   */
  function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  /**
   * Read default values from i18n JSON for a given page_key
   * @param pageKey - The page_key to get defaults for
   * @returns Object with Spanish and English default values, or nulls if not found
   */
  function getDefaultValues(pageKey: string): {
    es: Record<string, any> | null
    en: Record<string, any> | null
  } {
    const i18nPath = pageKeyToI18nPath(pageKey)
    if (!i18nPath) {
      return { es: null, en: null }
    }

    // Access nested path in messages object
    const esData = getNestedValue(messages.value.es, i18nPath)
    const enData = getNestedValue(messages.value.en, i18nPath)

    return {
      es: esData || null,
      en: enData || null,
    }
  }

  /**
   * Transform i18n defaults to page_content items format
   * Handles both single items (objects) and list items (arrays)
   * @param pageKey - The page_key for the items
   * @param defaults - The default values from i18n
   * @returns Array of PageContentItem objects ready for database insertion
   */
  function transformDefaultsToItems(
    pageKey: string,
    defaults: { es: any; en: any }
  ): PageContentItem[] {
    // Handle list items (arrays)
    if (Array.isArray(defaults.es)) {
      return defaults.es.map((esItem, index) => ({
        page_key: pageKey,
        content_es: typeof esItem === 'object' ? esItem : { text: esItem },
        content_en:
          typeof defaults.en[index] === 'object'
            ? defaults.en[index]
            : { text: defaults.en[index] },
        sort_order: index,
        is_active: true,
      }))
    }
    // Handle single item (object)
    else if (typeof defaults.es === 'object' && defaults.es !== null) {
      return [
        {
          page_key: pageKey,
          content_es: defaults.es,
          content_en: defaults.en,
          sort_order: 0,
          is_active: true,
        },
      ]
    }

    return []
  }

  /**
   * Restore defaults for a section: delete existing DB rows and recreate from i18n
   * @param pageKey - The page_key to restore defaults for
   * @returns true if successful, false if no defaults available
   * @throws Error if database operation fails
   */
  async function restoreDefaults(pageKey: string): Promise<boolean> {
    const defaults = getDefaultValues(pageKey)

    // Check if defaults exist
    if (!defaults.es && !defaults.en) {
      return false // No defaults available
    }

    try {
      // Delete existing rows for this page_key
      const { error: deleteError } = await supabase
        .from('page_content')
        .delete()
        .eq('page_key', pageKey)

      if (deleteError) {
        throw deleteError
      }

      // Transform i18n data to page_content format
      const newItems = transformDefaultsToItems(pageKey, defaults)

      // Insert new rows if there are items
      if (newItems.length > 0) {
        const { error: insertError } = await supabase
          .from('page_content')
          .insert(newItems)

        if (insertError) {
          throw insertError
        }
      }

      return true
    } catch (error) {
      console.error('Error restoring defaults:', error)
      throw error
    }
  }

  return {
    pageKeyToI18nPath,
    getDefaultValues,
    restoreDefaults,
  }
}
