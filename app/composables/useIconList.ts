interface IconOption {
  value: string
  label: string
  icon: string
}

const FALLBACK_HEROICONS = [
  'academic-cap', 'arrow-path', 'bell', 'bolt', 'book-open',
  'bookmark', 'briefcase', 'building-office', 'calendar', 'camera',
  'chart-bar', 'check-circle', 'clipboard', 'clock', 'cloud',
  'cog', 'computer-desktop', 'cube', 'document', 'envelope',
  'eye', 'film', 'flag', 'folder', 'gift',
  'globe-alt', 'hand-raised', 'heart', 'home', 'key',
  'light-bulb', 'link', 'lock-closed', 'map-pin', 'megaphone',
  'microphone', 'moon', 'musical-note', 'newspaper', 'paint-brush',
  'paper-airplane', 'pencil', 'phone', 'photo', 'play',
  'puzzle-piece', 'rocket-launch', 'scale', 'scissors', 'shield-check',
  'shopping-cart', 'sparkles', 'star', 'sun', 'trophy',
  'truck', 'user', 'users', 'video-camera', 'wrench',
]

const FALLBACK_LUCIDE = [
  'activity', 'airplay', 'award', 'baby', 'badge-check',
  'bike', 'book', 'box', 'brush', 'bus',
  'cake', 'calculator', 'car', 'check', 'church',
  'coffee', 'compass', 'contact', 'crown', 'database',
  'dollar-sign', 'download', 'edit', 'file', 'flame',
  'flower', 'gamepad', 'graduation-cap', 'guitar', 'hammer',
  'handshake', 'headphones', 'hexagon', 'image', 'inbox',
  'info', 'lamp', 'laptop', 'layout', 'leaf',
  'library', 'lightbulb', 'list', 'mail', 'map',
  'medal', 'message-circle', 'mic', 'monitor', 'mountain',
  'music', 'notebook', 'package', 'paintbrush', 'palette',
  'pen', 'pencil', 'piano', 'pin', 'plane',
  'plug', 'podcast', 'printer', 'puzzle', 'radio',
  'rocket', 'ruler', 'save', 'school', 'scissors',
  'search', 'send', 'settings', 'share', 'shield',
  'ship', 'smile', 'sparkle', 'sparkles', 'star',
  'sun', 'tablet', 'target', 'timer', 'tool',
  'tree-pine', 'trophy', 'truck', 'tv', 'umbrella',
  'upload', 'user', 'users', 'video', 'wallet',
  'wand', 'watch', 'wifi', 'wrench', 'zap',
]

function extractNames(data: any): string[] {
  const allNames: string[] = []
  if (data.uncategorized) allNames.push(...data.uncategorized)
  if (data.categories) {
    for (const names of Object.values(data.categories)) {
      allNames.push(...(names as string[]))
    }
  }
  return [...new Set(allNames)].sort()
}

function heroiconLabel(name: string): string {
  if (name.endsWith('-20-solid')) return `${name.replace(/-20-solid$/, '')} (mini)`
  if (name.endsWith('-solid')) return `${name.replace(/-solid$/, '')} (solid)`
  return name
}

export const useIconList = () => {
  const allOptions = useState<IconOption[]>('icon-options', () => [])
  const loading = ref(false)

  async function fetchIcons() {
    if (allOptions.value.length > 0) return
    loading.value = true
    try {
      const [heroData, lucideData] = await Promise.all([
        $fetch<any>('https://api.iconify.design/collection?prefix=heroicons'),
        $fetch<any>('https://api.iconify.design/collection?prefix=lucide'),
      ])

      const heroNames = extractNames(heroData)
      const lucideNames = extractNames(lucideData)

      const options: IconOption[] = []

      // Heroicons (outline first, then solid, skip 20-solid mini variants)
      for (const name of heroNames) {
        if (name.endsWith('-20-solid') || name.endsWith('-16-solid')) continue
        options.push({
          value: `i-heroicons-${name}`,
          label: `${heroiconLabel(name)}  ·  heroicons`,
          icon: `i-heroicons-${name}`,
        })
      }

      // Lucide
      for (const name of lucideNames) {
        options.push({
          value: `i-lucide-${name}`,
          label: `${name}  ·  lucide`,
          icon: `i-lucide-${name}`,
        })
      }

      allOptions.value = options
    } catch {
      // Fallback: build from hardcoded lists
      const options: IconOption[] = []
      for (const name of FALLBACK_HEROICONS) {
        options.push({
          value: `i-heroicons-${name}`,
          label: `${name}  ·  heroicons`,
          icon: `i-heroicons-${name}`,
        })
      }
      for (const name of FALLBACK_LUCIDE) {
        options.push({
          value: `i-lucide-${name}`,
          label: `${name}  ·  lucide`,
          icon: `i-lucide-${name}`,
        })
      }
      allOptions.value = options
    }
    loading.value = false
  }

  return { iconOptions: allOptions, loading, fetchIcons }
}
