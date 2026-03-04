<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.alumni.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-green-100">
          {{ $t('studentLife.alumni.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('studentLife.alumni.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('studentLife.alumni.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('studentLife.alumni.intro', 'focalX') || 50}% ${singleMeta('studentLife.alumni.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction Section -->
    <section v-if="singleField('studentLife.alumni.intro', 'title') || singleField('studentLife.alumni.intro', 'paragraph1')" class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 v-if="singleField('studentLife.alumni.intro', 'title')" class="text-3xl lg:text-5xl font-bold text-green-800 mb-6">
          {{ singleField('studentLife.alumni.intro', 'title') }}
        </h2>
        <p v-if="singleField('studentLife.alumni.intro', 'paragraph1')" class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%] mb-4">
          {{ singleField('studentLife.alumni.intro', 'paragraph1') }}
        </p>
        <p v-if="singleField('studentLife.alumni.intro', 'paragraph2')" class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('studentLife.alumni.intro', 'paragraph2') }}
        </p>
      </div>
    </section>

    <!-- Alumni Sections — alternating layout -->
    <template v-if="sections.length > 0">
      <section
        v-for="(section, index) in sections"
        :key="index"
        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
        class="py-8 sm:py-16"
      >
        <div class="px-2 sm:px-10 lg:px-16">
          <div
            :class="[
              'rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12',
              getSectionBg(index),
            ]"
          >
            <div :class="(section.imageUrl || section.videoUrl) ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
              <!-- Media on LEFT for odd index -->
              <div
                v-if="(section.imageUrl || section.videoUrl) && index % 2 === 1"
                class="rounded-none sm:rounded-lg overflow-hidden h-80 md:h-96 lg:h-112 order-1 lg:order-0"
              >
                <iframe
                  v-if="section.videoUrl"
                  :src="getEmbedUrl(section.videoUrl)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
                <img
                  v-else-if="section.imageUrl"
                  :src="section.imageUrl"
                  :alt="section.title"
                  class="w-full h-full object-cover"
                  :style="{ objectPosition: `${section.focalX}% ${section.focalY}%` }"
                  loading="lazy"
                />
              </div>

              <!-- Text content -->
              <div class="px-4 py-6 sm:px-0 sm:py-0">
                <h3 :class="['text-3xl md:text-5xl font-bold mb-4', getSectionTextColor(index)]">
                  {{ section.title }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
                  {{ section.content }}
                </p>
              </div>

              <!-- Media on RIGHT for even index -->
              <div
                v-if="(section.imageUrl || section.videoUrl) && index % 2 === 0"
                class="rounded-none sm:rounded-lg overflow-hidden h-80 md:h-96 lg:h-112"
              >
                <iframe
                  v-if="section.videoUrl"
                  :src="getEmbedUrl(section.videoUrl)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                />
                <img
                  v-else-if="section.imageUrl"
                  :src="section.imageUrl"
                  :alt="section.title"
                  class="w-full h-full object-cover"
                  :style="{ objectPosition: `${section.focalX}% ${section.focalY}%` }"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('studentLife.alumni.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('studentLife.alumni.cta.description') }}
        </p>
        <UButton
          :to="localePath('/contact/info')"
          size="lg"
          variant="solid"
          class="bg-white text-green-700 hover:bg-gray-100 justify-center"
        >
          {{ $t('studentLife.alumni.cta.contactUs') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { loadContent, getItems, field, singleField, singleMeta, meta, loading: contentLoading } = usePublicContent()

onMounted(() => loadContent(['studentLife.alumni.intro', 'studentLife.alumni.sections']))

const sections = computed(() =>
  getItems('studentLife.alumni.sections').map((item: any) => ({
    title: field(item, 'title'),
    content: field(item, 'content'),
    imageUrl: meta(item, 'imageUrl'),
    videoUrl: meta(item, 'videoUrl'),
    focalX: Number(meta(item, 'focalX')) || 50,
    focalY: Number(meta(item, 'focalY')) || 50,
  }))
)

const sectionBgs = ['bg-blue-50', 'bg-purple-50', 'bg-teal-50', 'bg-green-50', 'bg-orange-50']
const sectionTextColors = ['text-blue-900', 'text-purple-900', 'text-teal-900', 'text-green-900', 'text-orange-900']

function getSectionBg(index: number): string {
  return sectionBgs[index % sectionBgs.length]!
}

function getSectionTextColor(index: number): string {
  return sectionTextColors[index % sectionTextColors.length]!
}

function getEmbedUrl(url: string): string {
  if (!url) return ''
  // YouTube: convert watch?v=ID or youtu.be/ID to embed URL
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`
  // Vimeo: convert vimeo.com/ID to embed URL
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  // Loom: convert loom.com/share/ID to embed URL
  const loomMatch = url.match(/loom\.com\/share\/([\w]+)/)
  if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`
  // Google Drive: convert /view to /preview
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  // Already an embed URL or other
  return url
}

useHead({
  title: 'Alumni - CEE',
  meta: [
    {
      name: 'description',
      content: 'CEE alumni community. Discover the stories of our graduates and stay connected with the CEE family.',
    },
  ],
})
</script>
