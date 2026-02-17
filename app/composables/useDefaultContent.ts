import type { PageContentItem } from '~/composables/usePageContent'
import esMessages from '~~/i18n/locales/es.json'
import enMessages from '~~/i18n/locales/en.json'

/**
 * Composable for managing default content values from i18n JSON files
 * Maps page_keys to i18n paths and restores defaults to database
 */
export const useDefaultContent = () => {
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
   * Extract raw strings from compiled vue-i18n message AST nodes.
   * The @nuxtjs/i18n Vite plugin compiles JSON strings into AST objects
   * with the format { type: 0, body: { static: "actual string" } }.
   * This function recursively unwraps them back to plain strings.
   */
  function extractRawStrings(value: any): any {
    if (value == null) return value

    // Compiled vue-i18n message node → extract the static string
    if (typeof value === 'object' && 'type' in value && 'body' in value) {
      if (typeof value.body?.static === 'string') {
        return value.body.static
      }
      // Fallback: use loc.source if available
      if (typeof value.loc?.source === 'string') {
        return value.loc.source
      }
    }

    // Array → recursively process each element
    if (Array.isArray(value)) {
      return value.map(extractRawStrings)
    }

    // Plain object → recursively process each value
    if (typeof value === 'object') {
      const result: Record<string, any> = {}
      for (const [k, v] of Object.entries(value)) {
        result[k] = extractRawStrings(v)
      }
      return result
    }

    // Primitive → return as-is
    return value
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

    // Access nested path in imported locale files (avoids lazy loading issues)
    // Then extract raw strings from compiled vue-i18n AST nodes
    const esRaw = getNestedValue(esMessages, i18nPath)
    const enRaw = getNestedValue(enMessages, i18nPath)

    return {
      es: esRaw ? extractRawStrings(esRaw) : null,
      en: enRaw ? extractRawStrings(enRaw) : null,
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
    console.log('[useDefaultContent] defaults for', pageKey, defaults)

    // Check if defaults exist
    if (!defaults.es && !defaults.en) {
      console.warn('[useDefaultContent] No defaults found for', pageKey)
      return false // No defaults available
    }

    try {
      // Delete existing rows for this page_key
      const { error: deleteError } = await supabase
        .from('page_content')
        .delete()
        .eq('page_key', pageKey)

      if (deleteError) {
        console.error('[useDefaultContent] Delete error:', deleteError)
        throw deleteError
      }

      // Transform i18n data to page_content format
      const newItems = transformDefaultsToItems(pageKey, defaults)
      console.log('[useDefaultContent] Items to insert:', JSON.stringify(newItems, null, 2))

      // Insert new rows if there are items
      if (newItems.length > 0) {
        const { data: insertData, error: insertError } = await supabase
          .from('page_content')
          .insert(newItems as any)
          .select()

        console.log('[useDefaultContent] Insert result:', { insertData, insertError })

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
