<template>
  <div>
    <!-- Super Admin: Users overview + Section cards -->
    <template v-if="adminStore.isSuperAdmin">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
        <p class="text-gray-500">Manage your website content, users, and settings.</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NuxtLink :to="localePath('/admin/users')" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <UIcon name="i-heroicons-users" class="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ userCount }}</p>
              <p class="text-xs text-gray-500">Users</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink :to="localePath('/admin/calendar')" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ eventCount }}</p>
              <p class="text-xs text-gray-500">Events</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink :to="localePath('/admin/announcements')" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <UIcon name="i-heroicons-megaphone" class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ announcementCount }}</p>
              <p class="text-xs text-gray-500">Announcements</p>
            </div>
          </div>
        </NuxtLink>
        <NuxtLink :to="localePath('/admin/sections/studentLife/gallery')" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <UIcon name="i-heroicons-photo" class="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900">{{ photoCount }}</p>
              <p class="text-xs text-gray-500">Gallery Photos</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Sections Grid -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Website Sections</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminSectionCard
            v-for="section in sections"
            :key="section.key"
            :icon="section.icon"
            :label="section.label"
            :to="localePath(`/admin/sections/${section.key}`)"
            :page-count="section.pages.length"
            :bg-color="section.bgColor"
          />
        </div>
      </div>
    </template>

    <!-- Admin: Sections they have access to -->
    <template v-else>
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">
          {{ adminStore.profile?.full_name ? `Welcome, ${adminStore.profile.full_name}` : 'Dashboard' }}
        </h1>
        <p class="text-gray-500">Manage the sections assigned to you.</p>
      </div>

      <!-- If only one section, show that section's pages directly -->
      <template v-if="adminSections.length === 1">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ adminSections[0].label }}</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminPageCard
            v-for="page in adminSections[0].pages"
            :key="page.slug"
            :icon="page.icon"
            :label="page.label"
            :to="localePath(page.to || `/admin/sections/${adminSections[0].key}/${page.slug}`)"
            :bg-color="adminSections[0].bgColor"
          />
        </div>
      </template>

      <!-- Multiple sections: show section cards -->
      <template v-else>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AdminSectionCard
            v-for="section in adminSections"
            :key="section.key"
            :icon="section.icon"
            :label="section.label"
            :to="localePath(`/admin/sections/${section.key}`)"
            :page-count="section.pages.length"
            :bg-color="section.bgColor"
          />
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const adminStore = useAdminStore()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const { t } = useI18n()

// Stats (super admin only)
const userCount = ref(0)
const eventCount = ref(0)
const announcementCount = ref(0)
const photoCount = ref(0)

// All sections definition with their pages
const allSections = [
  {
    key: 'home',
    icon: 'i-heroicons-home',
    bgColor: 'bg-blue-600',
    pages: [
      { slug: 'home', icon: 'i-heroicons-home', label: 'Home Page' },
    ],
  },
  {
    key: 'about',
    icon: 'i-heroicons-information-circle',
    bgColor: 'bg-pink-600',
    pages: [
      { slug: 'mission-vision-values', icon: 'i-heroicons-star', label: 'Mission, Vision & Values' },
      { slug: 'statement-of-faith', icon: 'i-heroicons-book-open', label: 'Statement of Faith' },
      { slug: 'philosophy', icon: 'i-heroicons-light-bulb', label: 'Philosophy' },
      { slug: 'history', icon: 'i-heroicons-clock', label: 'History' },
      { slug: 'leadership', icon: 'i-heroicons-user-group', label: 'Leadership' },
      { slug: 'town', icon: 'i-heroicons-map', label: 'Town' },
    ],
  },
  {
    key: 'academics',
    icon: 'i-heroicons-academic-cap',
    bgColor: 'bg-yellow-600',
    pages: [
      { slug: 'curriculum', icon: 'i-heroicons-academic-cap', label: 'Curriculum' },
      { slug: 'grades', icon: 'i-heroicons-chart-bar', label: 'Grades' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar', to: '/admin/calendar' },
    ],
  },
  {
    key: 'studentLife',
    icon: 'i-heroicons-face-smile',
    bgColor: 'bg-green-600',
    pages: [
      { slug: 'sports-clubs', icon: 'i-heroicons-trophy', label: 'Sports & Clubs' },
      { slug: 'service-projects', icon: 'i-heroicons-heart', label: 'Service Projects' },
      { slug: 'library', icon: 'i-heroicons-book-open', label: 'Library' },
      { slug: 'upcoming-events', icon: 'i-heroicons-calendar', label: 'Upcoming Events' },
      { slug: 'gallery', icon: 'i-heroicons-photo', label: 'Gallery' },
    ],
  },
  {
    key: 'support',
    icon: 'i-heroicons-heart',
    bgColor: 'bg-red-600',
    pages: [
      { slug: 'why-support', icon: 'i-heroicons-heart', label: 'Why Support' },
      { slug: 'scholarships', icon: 'i-heroicons-academic-cap', label: 'Scholarships' },
      { slug: 'donate', icon: 'i-heroicons-currency-dollar', label: 'Donate' },
      { slug: 'projects', icon: 'i-heroicons-wrench-screwdriver', label: 'Projects' },
    ],
  },
  {
    key: 'contact',
    icon: 'i-heroicons-phone',
    bgColor: 'bg-orange-600',
    pages: [
      { slug: 'info', icon: 'i-heroicons-phone', label: 'Contact Info' },
      { slug: 'directions', icon: 'i-heroicons-map-pin', label: 'Directions' },
      { slug: 'form', icon: 'i-heroicons-envelope', label: 'Contact Form' },
      { slug: 'faq', icon: 'i-heroicons-question-mark-circle', label: 'FAQ' },
    ],
  },
  {
    key: 'admissions',
    icon: 'i-heroicons-clipboard-document-check',
    bgColor: 'bg-emerald-600',
    pages: [
      { slug: 'who-can-apply', icon: 'i-heroicons-user-plus', label: 'Who Can Apply' },
      { slug: 'how-to-apply', icon: 'i-heroicons-clipboard-document-list', label: 'How to Apply' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar' },
    ],
  },
  {
    key: 'getInvolved',
    icon: 'i-heroicons-hand-raised',
    bgColor: 'bg-purple-600',
    pages: [
      { slug: 'teachers', icon: 'i-heroicons-user-group', label: 'Teachers' },
      { slug: 'volunteer', icon: 'i-heroicons-hand-raised', label: 'Volunteer' },
    ],
  },
]

// Sections with labels
const sections = computed(() =>
  allSections.map((s) => ({
    ...s,
    label: t(`nav.${s.key}`, s.key),
  })),
)

// Filtered sections for admin users
const adminSections = computed(() => {
  const allowed = adminStore.allowedSections
  return sections.value.filter((s) => allowed.includes(s.key)).map((s) => {
    const allowedPages = adminStore.allowedPages(s.key)
    return {
      ...s,
      pages: allowedPages === null
        ? s.pages
        : s.pages.filter((p) => allowedPages.includes(p.slug)),
    }
  })
})

// Load stats for super admin
onMounted(async () => {
  if (adminStore.isSuperAdmin) {
    const [users, events, announcements, photos] = await Promise.all([
      supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
      supabase.from('calendar_events').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
      supabase.from('gallery_photos').select('id', { count: 'exact', head: true }),
    ])
    userCount.value = users.count || 0
    eventCount.value = events.count || 0
    announcementCount.value = announcements.count || 0
    photoCount.value = photos.count || 0
  }
})

useHead({
  title: 'Admin Dashboard - CEE',
})
</script>
