import { defineStore } from 'pinia'

interface DynamicContent {
  key: string
  locale: string
  value: string
  category?: string
}

interface Media {
  key: string
  url: string
  alt_text_es?: string
  alt_text_en?: string
  category?: string
}

export const useContentStore = defineStore('content', {
  state: () => ({
    dynamicContent: {} as Record<string, Record<string, string>>, // { locale: { key: value } }
    media: {} as Record<string, Media>, // { key: mediaObject }
    isLoaded: false,
  }),

  getters: {
    // Get content by key and locale
    getContent: (state) => (key: string, locale: string) => {
      return state.dynamicContent[locale]?.[key] || null
    },

    // Get media by key
    getMedia: (state) => (key: string) => {
      return state.media[key] || null
    },

    // Get media URL by key
    getMediaUrl: (state) => (key: string) => {
      return state.media[key]?.url || null
    },

    // Get media alt text by key and locale
    getMediaAlt: (state) => (key: string, locale: string) => {
      const media = state.media[key]
      if (!media) return ''
      return locale === 'es' ? media.alt_text_es : media.alt_text_en
    },
  },

  actions: {
    async loadContent() {
      if (this.isLoaded) return

      const supabase = useSupabaseClient()

      try {
        // Fetch dynamic content
        const { data: contentData, error: contentError } = await supabase
          .from('dynamic_content')
          .select('*')

        if (contentError) throw contentError

        // Organize content by locale and key
        const organized: Record<string, Record<string, string>> = {}
        contentData?.forEach((item: DynamicContent) => {
          if (!organized[item.locale]) {
            organized[item.locale] = {}
          }
          organized[item.locale][item.key] = item.value
        })

        this.dynamicContent = organized

        // Fetch media
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('*')

        if (mediaError) throw mediaError

        // Organize media by key
        const mediaOrganized: Record<string, Media> = {}
        mediaData?.forEach((item: Media) => {
          mediaOrganized[item.key] = item
        })

        this.media = mediaOrganized

        this.isLoaded = true
      } catch (error) {
        console.error('Error loading dynamic content:', error)
      }
    },

    async updateContent(key: string, locale: string, value: string, category?: string) {
      const supabase = useSupabaseClient()

      const { error } = await supabase
        .from('dynamic_content')
        .upsert({ key, locale, value, category })

      if (error) throw error

      // Update local state
      if (!this.dynamicContent[locale]) {
        this.dynamicContent[locale] = {}
      }
      this.dynamicContent[locale][key] = value
    },

    async updateMedia(key: string, url: string, altTextEs?: string, altTextEn?: string, category?: string) {
      const supabase = useSupabaseClient()

      const { error } = await supabase
        .from('media')
        .upsert({
          key,
          url,
          alt_text_es: altTextEs,
          alt_text_en: altTextEn,
          category
        })

      if (error) throw error

      // Update local state
      this.media[key] = {
        key,
        url,
        alt_text_es: altTextEs,
        alt_text_en: altTextEn,
        category,
      }
    },
  },
})
