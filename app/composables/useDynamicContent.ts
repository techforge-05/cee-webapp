/**
 * Composable for accessing dynamic content from the database
 * Falls back to static i18n translations if DB content is not available
 */
export const useDynamicContent = () => {
  const { t, locale } = useI18n()
  const contentStore = useContentStore()

  /**
   * Get translated content - tries DB first, falls back to i18n
   * @param key - The content key (e.g., 'school.name', 'home.hero.title')
   * @param fallbackKey - Optional i18n key to use as fallback
   */
  const getContent = (key: string, fallbackKey?: string): string => {
    const dbContent = contentStore.getContent(key, locale.value)

    if (dbContent) {
      return dbContent
    }

    // Fallback to static i18n
    if (fallbackKey) {
      return t(fallbackKey)
    }

    // Try using the same key in i18n
    return t(key)
  }

  /**
   * Get media URL by key
   * @param key - The media key (e.g., 'school.logo', 'home.hero.image')
   */
  const getMediaUrl = (key: string): string | null => {
    return contentStore.getMediaUrl(key)
  }

  /**
   * Get media alt text in current locale
   * @param key - The media key
   */
  const getMediaAlt = (key: string): string => {
    return contentStore.getMediaAlt(key, locale.value)
  }

  /**
   * Load all dynamic content from database
   */
  const loadDynamicContent = async () => {
    await contentStore.loadContent()
  }

  return {
    getContent,
    getMediaUrl,
    getMediaAlt,
    loadDynamicContent,
    isLoaded: computed(() => contentStore.isLoaded),
  }
}
