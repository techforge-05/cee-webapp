<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ sectionLabel }}</h1>
      <p class="text-gray-500">Manage pages in this section.</p>
    </div>

    <!-- Pages Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AdminPageCard
        v-for="page in visiblePages"
        :key="page.slug"
        :icon="page.icon"
        :label="page.label"
        :to="localePath(`/admin/sections/${sectionKey}/${page.slug}`)"
        :bg-color="sectionConfig?.bgColor || 'bg-gray-600'"
        :description="page.description"
      />
    </div>

    <!-- No pages message -->
    <div
      v-if="visiblePages.length === 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
    >
      <UIcon name="i-heroicons-folder-open" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">No pages available in this section.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth', 'admin-permission'],
})

const route = useRoute()
const localePath = useLocalePath()
const adminStore = useAdminStore()
const { t } = useI18n()

const sectionKey = computed(() => route.params.section as string)

const sectionConfigs: Record<string, { bgColor: string; pages: Array<{ slug: string; icon: string; label: string; description?: string }> }> = {
  home: {
    bgColor: 'bg-blue-600',
    pages: [
      { slug: 'home', icon: 'i-heroicons-home', label: 'Home Page', description: 'Hero, welcome, values, activities, news' },
    ],
  },
  about: {
    bgColor: 'bg-pink-600',
    pages: [
      { slug: 'mission-vision-values', icon: 'i-heroicons-star', label: 'Mission, Vision & Values', description: 'Core values and mission statement' },
      { slug: 'statement-of-faith', icon: 'i-heroicons-book-open', label: 'Statement of Faith', description: 'Religious beliefs and principles' },
      { slug: 'philosophy', icon: 'i-heroicons-light-bulb', label: 'Philosophy', description: 'Educational philosophy' },
      { slug: 'history', icon: 'i-heroicons-clock', label: 'History', description: 'Timeline and founders' },
      { slug: 'leadership', icon: 'i-heroicons-user-group', label: 'Leadership', description: 'Board and directors' },
      { slug: 'town', icon: 'i-heroicons-map', label: 'Town', description: 'Siguatepeque information' },
    ],
  },
  academics: {
    bgColor: 'bg-yellow-600',
    pages: [
      { slug: 'curriculum', icon: 'i-heroicons-academic-cap', label: 'Curriculum', description: 'Programs and subjects' },
      { slug: 'grades', icon: 'i-heroicons-chart-bar', label: 'Grades', description: 'Grade levels and groupings' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar', description: 'Academic calendar and dates' },
    ],
  },
  studentLife: {
    bgColor: 'bg-green-600',
    pages: [
      { slug: 'sports-clubs', icon: 'i-heroicons-trophy', label: 'Sports & Clubs', description: 'Athletic programs' },
      { slug: 'service-projects', icon: 'i-heroicons-heart', label: 'Service Projects', description: 'Community service initiatives' },
      { slug: 'library', icon: 'i-heroicons-book-open', label: 'Library', description: 'Rules, hours, reading levels' },
      { slug: 'upcoming-events', icon: 'i-heroicons-calendar', label: 'Upcoming Events', description: 'Annual events' },
      { slug: 'gallery', icon: 'i-heroicons-photo', label: 'Gallery', description: 'Photo gallery management' },
    ],
  },
  support: {
    bgColor: 'bg-red-600',
    pages: [
      { slug: 'why-support', icon: 'i-heroicons-heart', label: 'Why Support', description: 'Impact areas' },
      { slug: 'scholarships', icon: 'i-heroicons-academic-cap', label: 'Scholarships', description: 'Scholarship info' },
      { slug: 'donate', icon: 'i-heroicons-currency-dollar', label: 'Donate', description: 'Donation methods and wish lists' },
      { slug: 'projects', icon: 'i-heroicons-wrench-screwdriver', label: 'Projects', description: 'Current projects' },
    ],
  },
  contact: {
    bgColor: 'bg-orange-600',
    pages: [
      { slug: 'info', icon: 'i-heroicons-phone', label: 'Contact Info', description: 'Phone, email, hours' },
      { slug: 'directions', icon: 'i-heroicons-map-pin', label: 'Directions', description: 'Maps and directions' },
      { slug: 'form', icon: 'i-heroicons-envelope', label: 'Contact Form', description: 'Form settings' },
      { slug: 'faq', icon: 'i-heroicons-question-mark-circle', label: 'FAQ', description: 'Questions and answers' },
    ],
  },
  admissions: {
    bgColor: 'bg-emerald-600',
    pages: [
      { slug: 'who-can-apply', icon: 'i-heroicons-user-plus', label: 'Who Can Apply', description: 'Eligibility and requirements' },
      { slug: 'how-to-apply', icon: 'i-heroicons-clipboard-document-list', label: 'How to Apply', description: 'Application steps' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar', description: 'Admissions dates' },
    ],
  },
  getInvolved: {
    bgColor: 'bg-purple-600',
    pages: [
      { slug: 'teachers', icon: 'i-heroicons-user-group', label: 'Teachers', description: 'Requirements and benefits' },
      { slug: 'volunteer', icon: 'i-heroicons-hand-raised', label: 'Volunteer', description: 'Volunteer opportunities' },
    ],
  },
}

const sectionConfig = computed(() => sectionConfigs[sectionKey.value])

const sectionLabel = computed(() =>
  t(`nav.${sectionKey.value}`, sectionKey.value),
)

const visiblePages = computed(() => {
  const config = sectionConfig.value
  if (!config) return []

  const allowedPages = adminStore.allowedPages(sectionKey.value)

  if (allowedPages === null) return config.pages
  return config.pages.filter((p) => allowedPages.includes(p.slug))
})

useHead({
  title: () => `${sectionLabel.value} - Admin - CEE`,
})
</script>
