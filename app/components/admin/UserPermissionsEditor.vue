<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-sm font-semibold text-gray-900 mb-1">{{ $t('admin.permissions.title') }}</h3>
      <p class="text-sm text-gray-500">{{ $t('admin.permissions.description') }}</p>
    </div>

    <!-- Section permissions -->
    <div class="space-y-3">
      <div
        v-for="section in sectionConfigs"
        :key="section.key"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <!-- Section header -->
        <div class="flex items-center gap-3 px-4 py-3 bg-gray-50">
          <UCheckbox
            :model-value="isSectionFullAccess(section.key)"
            :indeterminate="isSectionPartial(section.key)"
            @update:model-value="toggleSection(section.key, $event)"
          />
          <UIcon :name="section.icon" class="w-5 h-5 text-gray-600" />
          <span class="font-medium text-sm text-gray-900">{{ section.label }}</span>
          <UButton
            v-if="section.pages.length > 1"
            variant="ghost"
            size="xs"
            :icon="expandedSections.has(section.key) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="ml-auto"
            @click="toggleExpand(section.key)"
          />
        </div>

        <!-- Individual pages (expandable) -->
        <div
          v-if="expandedSections.has(section.key) && section.pages.length > 1"
          class="border-t border-gray-200 px-4 py-2 space-y-2"
        >
          <div
            v-for="page in section.pages"
            :key="page.slug"
            class="flex items-center gap-3 pl-8 py-1"
          >
            <UCheckbox
              :model-value="hasPagePermission(section.key, page.slug)"
              @update:model-value="togglePage(section.key, page.slug, $event)"
            />
            <UIcon :name="page.icon" class="w-4 h-4 text-gray-400" />
            <span class="text-sm text-gray-700">{{ page.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar & Announcements access -->
    <div class="border border-gray-200 rounded-lg px-4 py-3 space-y-3">
      <div class="flex items-center gap-3">
        <UCheckbox
          :model-value="modelValue.canCalendar"
          @update:model-value="emit('update:modelValue', { ...modelValue, canCalendar: $event })"
        />
        <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-gray-600" />
        <span class="text-sm text-gray-900">{{ $t('admin.permissions.calendarAccess') }}</span>
      </div>
      <div class="flex items-center gap-3">
        <UCheckbox
          :model-value="modelValue.canAnnouncements"
          @update:model-value="emit('update:modelValue', { ...modelValue, canAnnouncements: $event })"
        />
        <UIcon name="i-heroicons-megaphone" class="w-5 h-5 text-gray-600" />
        <span class="text-sm text-gray-900">{{ $t('admin.permissions.announcementAccess') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface PermissionEntry {
  section: string
  page: string | null
}

export interface PermissionsModel {
  permissions: PermissionEntry[]
  canCalendar: boolean
  canAnnouncements: boolean
}

const props = defineProps<{
  modelValue: PermissionsModel
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PermissionsModel]
}>()

const { t } = useI18n()

const expandedSections = ref(new Set<string>())

const sectionConfigs = [
  {
    key: 'home',
    icon: 'i-heroicons-home',
    pages: [
      { slug: 'home', icon: 'i-heroicons-home', label: 'Home Page' },
    ],
  },
  {
    key: 'about',
    icon: 'i-heroicons-information-circle',
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
    pages: [
      { slug: 'curriculum', icon: 'i-heroicons-academic-cap', label: 'Curriculum' },
      { slug: 'grades', icon: 'i-heroicons-chart-bar', label: 'Grades' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar' },
    ],
  },
  {
    key: 'studentLife',
    icon: 'i-heroicons-face-smile',
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
    pages: [
      { slug: 'who-can-apply', icon: 'i-heroicons-user-plus', label: 'Who Can Apply' },
      { slug: 'how-to-apply', icon: 'i-heroicons-clipboard-document-list', label: 'How to Apply' },
      { slug: 'calendar', icon: 'i-heroicons-calendar-days', label: 'Calendar' },
    ],
  },
  {
    key: 'getInvolved',
    icon: 'i-heroicons-hand-raised',
    pages: [
      { slug: 'teachers', icon: 'i-heroicons-user-group', label: 'Teachers' },
      { slug: 'volunteer', icon: 'i-heroicons-hand-raised', label: 'Volunteer' },
    ],
  },
].map(s => ({
  ...s,
  label: t(`admin.permissions.sections.${s.key}`, s.key),
}))

function toggleExpand(sectionKey: string) {
  const newSet = new Set(expandedSections.value)
  if (newSet.has(sectionKey)) {
    newSet.delete(sectionKey)
  } else {
    newSet.add(sectionKey)
  }
  expandedSections.value = newSet
}

function isSectionFullAccess(sectionKey: string): boolean {
  return props.modelValue.permissions.some(
    p => p.section === sectionKey && p.page === null
  )
}

function isSectionPartial(sectionKey: string): boolean {
  if (isSectionFullAccess(sectionKey)) return false
  return props.modelValue.permissions.some(p => p.section === sectionKey)
}

function hasPagePermission(sectionKey: string, pageSlug: string): boolean {
  return props.modelValue.permissions.some(
    p => p.section === sectionKey && (p.page === null || p.page === pageSlug)
  )
}

function toggleSection(sectionKey: string, checked: boolean) {
  const filtered = props.modelValue.permissions.filter(p => p.section !== sectionKey)
  if (checked) {
    filtered.push({ section: sectionKey, page: null })
  }
  emit('update:modelValue', { ...props.modelValue, permissions: filtered })
}

function togglePage(sectionKey: string, pageSlug: string, checked: boolean) {
  let perms = [...props.modelValue.permissions]

  // Remove full section access if toggling individual pages
  perms = perms.filter(p => !(p.section === sectionKey && p.page === null))

  if (checked) {
    if (!perms.some(p => p.section === sectionKey && p.page === pageSlug)) {
      perms.push({ section: sectionKey, page: pageSlug })
    }
    // If all pages are now selected, upgrade to full section access
    const section = sectionConfigs.find(s => s.key === sectionKey)
    if (section) {
      const selectedPages = perms.filter(p => p.section === sectionKey).map(p => p.page)
      if (section.pages.every(p => selectedPages.includes(p.slug))) {
        perms = perms.filter(p => p.section !== sectionKey)
        perms.push({ section: sectionKey, page: null })
      }
    }
  } else {
    perms = perms.filter(p => !(p.section === sectionKey && p.page === pageSlug))
  }

  emit('update:modelValue', { ...props.modelValue, permissions: perms })
}
</script>
