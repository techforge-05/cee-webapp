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

  // Full page_key → i18n path overrides for nested structures
  const pageKeyOverrides: Record<string, string> = {
    'academics.curriculum.kindergarten': 'academics.curriculum.programs.kindergarten',
    'academics.curriculum.elementary': 'academics.curriculum.programs.elementary',
    'academics.curriculum.elementarySubjects': 'academics.curriculum.programs.elementary.subjects',
    'academics.curriculum.secondary': 'academics.curriculum.programs.secondary',
    'academics.curriculum.secondarySubjects79': 'academics.curriculum.programs.secondary.grades79.subjects',
    'academics.curriculum.secondarySubjects1011': 'academics.curriculum.programs.secondary.grades1011.subjects',
    'academics.grades.specialPrograms': 'academics.programs.special.items',
    'studentLife.sports.intro': 'studentLife.sportsClubs.intro',
    'studentLife.sports.items': 'studentLife.sportsClubs.sports.items',
    'studentLife.sports.otherSports': 'studentLife.sportsClubs.sports.otherSports',
    'studentLife.serviceProjects.benefits': 'studentLife.serviceProjects.whyService.benefits',
    'studentLife.serviceProjects.items': 'studentLife.serviceProjects.projects.items',
    'studentLife.library.goals': 'studentLife.library.purpose.goals',
    'studentLife.library.hours': 'studentLife.library.hours.schedule',
    'studentLife.library.gradeSupport': 'studentLife.library.gradeSupport.levels',
    'studentLife.library.rules': 'studentLife.library.borrowing.rules',
    'studentLife.upcomingEvents.annualEvents': 'studentLife.upcomingEvents.annualEvents.events',
    'support.projects.howToHelp': 'support.projects.howToHelp.ways',
    'contact.form.subjectOptions': 'contact.form.fields.subject.options',
    'contact.faq': 'contact.faq.questions',
  }

  /**
   * Map page_key to i18n path (handles abbreviations and full overrides)
   * Example: "about.mvv.intro" → "about.missionVisionValues.intro"
   * Example: "academics.curriculum.kindergarten" → "academics.curriculum.programs.kindergarten"
   * @param pageKey - The page_key from page_content table
   * @returns The corresponding i18n path, or null if mapping fails
   */
  function pageKeyToI18nPath(pageKey: string): string | null {
    // Check full-path overrides first
    if (pageKeyOverrides[pageKey]) {
      return pageKeyOverrides[pageKey] ?? null
    }

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
   * Flatten nested string arrays into newline-separated strings.
   * e.g. { focus: ["a","b","c"] } → { focus: "a\nb\nc" }
   * This ensures textarea fields can display array data from i18n defaults.
   */
  function flattenStringArrays(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v) && v.every((i) => typeof i === 'string')) {
        result[k] = v.join('\n')
      } else {
        result[k] = v
      }
    }
    return result
  }

  /**
   * Convert an array of i18n items to PageContentItem rows
   */
  function arrayToItems(pageKey: string, esArray: any[], enArray: any[]): PageContentItem[] {
    return esArray.map((esItem, index) => ({
      page_key: pageKey,
      content_es: typeof esItem === 'object' ? flattenStringArrays(esItem) : { text: esItem },
      content_en:
        typeof enArray?.[index] === 'object'
          ? flattenStringArrays(enArray[index])
          : { text: enArray?.[index] },
      sort_order: index,
      is_active: true,
    }))
  }

  /**
   * Process i18n defaults into page_content items.
   * Handles five patterns:
   * 1. Plain string → single row with { text: string }
   * 2. Direct array → multiple rows under pageKey
   * 3. Object with only scalars → single row under pageKey
   * 4. Object with scalars + arrays:
   *    - 'items' array → primary list content under pageKey
   *    - Named arrays (e.g. 'subjects', 'features') → stored under pageKey.{property}
   * 5. Object of objects (2+ child objects) → each child object becomes a list row
   *    (e.g., timeline periods: late1980s, early1990, etc.)
   */
  function processDefaults(
    pageKey: string,
    defaults: { es: any; en: any }
  ): PageContentItem[] {
    const source = defaults.es ?? defaults.en

    // Plain string → single row wrapped in { text }
    if (typeof source === 'string') {
      return [
        {
          page_key: pageKey,
          content_es: { text: defaults.es },
          content_en: { text: defaults.en },
          sort_order: 0,
          is_active: true,
        },
      ]
    }

    // Direct array → multiple rows under pageKey
    if (Array.isArray(source)) {
      return arrayToItems(pageKey, defaults.es || [], defaults.en || [])
    }

    // Object → separate scalar fields from array fields and child objects
    if (typeof source === 'object' && source !== null) {
      const allItems: PageContentItem[] = []
      const esScalars: Record<string, any> = {}
      const enScalars: Record<string, any> = {}
      const childObjectKeys: string[] = []

      for (const key of Object.keys(source)) {
        const esVal = defaults.es?.[key]
        const enVal = defaults.en?.[key]

        if (Array.isArray(esVal)) {
          if (key === 'items') {
            // Primary list content → rows under the SAME pageKey
            allItems.push(...arrayToItems(pageKey, esVal, enVal || []))
          } else {
            // Named array → rows under pageKey.{property}
            allItems.push(
              ...arrayToItems(`${pageKey}.${key}`, esVal, enVal || [])
            )
          }
        } else if (typeof esVal === 'object' && esVal !== null) {
          // Child object — potential list item (e.g., timeline periods)
          childObjectKeys.push(key)
        } else {
          esScalars[key] = esVal
          enScalars[key] = enVal
        }
      }

      // Object of objects → each child object becomes a list row,
      // but only if they are leaf objects (no nested arrays).
      // Child objects with arrays are separate sections handled by their own editors.
      const areLeafObjects = childObjectKeys.every((key) => {
        const val = defaults.es?.[key] ?? defaults.en?.[key]
        return !Object.values(val || {}).some((v: any) => Array.isArray(v))
      })
      if (childObjectKeys.length >= 2 && areLeafObjects) {
        childObjectKeys.forEach((key, index) => {
          allItems.push({
            page_key: pageKey,
            content_es: defaults.es?.[key] || {},
            content_en: defaults.en?.[key] || {},
            sort_order: index,
            is_active: true,
          })
        })
      }

      // Only create a scalar main row if there are NO list items under the same pageKey.
      // This avoids polluting list-type sections with a spurious header row.
      const hasItemsUnderSameKey = allItems.some(
        (i) => i.page_key === pageKey
      )
      if (Object.keys(esScalars).length > 0 && !hasItemsUnderSameKey) {
        allItems.push({
          page_key: pageKey,
          content_es: esScalars,
          content_en: enScalars,
          sort_order: 0,
          is_active: true,
        })
      }

      return allItems
    }

    return []
  }

  /**
   * Custom processors for page_keys with non-standard i18n structures.
   * These handle cases where fields need to be split between content and metadata.
   */
  const customProcessors: Record<
    string,
    (pageKey: string, defaults: { es: any; en: any }) => PageContentItem[]
  > = {
    'contact.faq': (pk, defaults) => {
      const esArr = defaults.es || []
      const enArr = defaults.en || []
      return esArr.map((esItem: any, i: number) => {
        const enItem = enArr[i] || {}
        return {
          page_key: pk,
          content_es: {
            question: esItem.question || '',
            answer: esItem.answer || '',
            linkText: esItem.link?.text || '',
          },
          content_en: {
            question: enItem.question || '',
            answer: enItem.answer || '',
            linkText: enItem.link?.text || '',
          },
          metadata: {
            category: esItem.category || 'general',
            linkPath: esItem.link?.path || '',
          },
          sort_order: i,
          is_active: true,
        }
      })
    },
  }

  /**
   * Restore defaults for a section: delete existing DB rows and recreate from i18n.
   * Also deletes and restores child page_keys (e.g., home.enrollment.features).
   */
  async function restoreDefaults(pageKey: string): Promise<boolean> {
    const defaults = getDefaultValues(pageKey)

    if (!defaults.es && !defaults.en) {
      return false
    }

    // Use custom processor if available, otherwise generic
    const newItems = customProcessors[pageKey]
      ? customProcessors[pageKey](pageKey, defaults)
      : processDefaults(pageKey, defaults)
    if (newItems.length === 0) {
      return false
    }

    try {
      // Delete this page_key AND any child page_keys (e.g., home.enrollment + home.enrollment.features)
      const { error: deleteError } = await supabase
        .from('page_content')
        .delete()
        .or(`page_key.eq.${pageKey},page_key.like.${pageKey}.%`)

      if (deleteError) throw deleteError

      const { error: insertError } = await supabase
        .from('page_content')
        .insert(newItems as any)

      if (insertError) throw insertError

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
