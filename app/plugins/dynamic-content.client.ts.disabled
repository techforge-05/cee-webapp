/**
 * Plugin to load dynamic content from database on app initialization
 * This runs on client-side only to avoid SSR hydration issues
 */
export default defineNuxtPlugin(async () => {
  const contentStore = useContentStore()

  // Load content on app start
  await contentStore.loadContent()
})
