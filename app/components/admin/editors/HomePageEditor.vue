<template>
  <div class="space-y-6">
    <!-- Save bar -->
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-check"
        :loading="saving"
        @click="saveAll"
      >
        {{ $t('admin.editors.save') }}
      </UButton>
    </div>

    <!-- Welcome Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="toggleSection('welcome')"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.home.welcome') }}</h3>
          <UIcon
            :name="openSections.welcome ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openSections.welcome" class="space-y-4">
        <BilingualTextField
          v-model="welcomeTitle1"
          :label="$t('admin.editors.home.welcomeTitlePart1')"
          :max-length="100"
        />
        <BilingualTextField
          v-model="welcomeTitle2"
          :label="$t('admin.editors.home.welcomeTitlePart2')"
          :max-length="100"
        />
        <BilingualTextarea
          v-model="welcomeDescription"
          :label="$t('admin.editors.home.welcomeDescription')"
          :rows="3"
          :max-length="500"
        />
      </div>
    </UCard>

    <!-- Enrollment Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="toggleSection('enrollment')"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.home.enrollment') }}</h3>
          <UIcon
            :name="openSections.enrollment ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openSections.enrollment" class="space-y-4">
        <BilingualTextField
          v-model="enrollmentTitle"
          :label="$t('admin.editors.home.enrollmentTitle')"
          :max-length="100"
        />
        <BilingualTextarea
          v-model="enrollmentDescription"
          :label="$t('admin.editors.home.enrollmentDescription')"
          :rows="3"
          :max-length="500"
        />

        <div class="pt-2">
          <h4 class="text-sm font-medium text-gray-700 mb-3">{{ $t('admin.editors.home.enrollmentFeatures') }}</h4>
          <DataListManager
            v-model="enrollmentFeatures"
            :max-items="5"
            :min-items="1"
            :item-label="$t('admin.editors.home.feature')"
            @add="addEnrollmentFeature"
          >
            <template #default="{ item, index }">
              <BilingualTextField
                :model-value="{ es: item.content_es?.text || '', en: item.content_en?.text || '' }"
                :label="`${$t('admin.editors.home.feature')} ${index + 1}`"
                @update:model-value="updateEnrollmentFeature(index, $event)"
              />
            </template>
          </DataListManager>
        </div>
      </div>
    </UCard>

    <!-- Values Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="toggleSection('values')"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.home.values') }}</h3>
          <UIcon
            :name="openSections.values ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openSections.values" class="space-y-4">
        <DataListManager
          v-model="valuesItems"
          :max-items="9"
          :min-items="3"
          :item-label="$t('admin.editors.home.value')"
          @add="addValueItem"
        >
          <template #default="{ item, index }">
            <div class="space-y-3">
              <BilingualTextField
                :model-value="{ es: item.content_es?.title || '', en: item.content_en?.title || '' }"
                :label="$t('admin.editors.home.valueTitle')"
                :max-length="50"
                @update:model-value="updateValueField(index, 'title', $event)"
              />
              <BilingualTextarea
                :model-value="{ es: item.content_es?.description || '', en: item.content_en?.description || '' }"
                :label="$t('admin.editors.home.valueDescription')"
                :rows="2"
                :max-length="200"
                @update:model-value="updateValueField(index, 'description', $event)"
              />
            </div>
          </template>
        </DataListManager>
      </div>
    </UCard>

    <!-- Activities Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="toggleSection('activities')"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.home.activities') }}</h3>
          <UIcon
            :name="openSections.activities ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openSections.activities" class="space-y-4">
        <DataListManager
          v-model="activitiesItems"
          :max-items="8"
          :min-items="2"
          :item-label="$t('admin.editors.home.activity')"
          @add="addActivityItem"
        >
          <template #default="{ item, index }">
            <div class="space-y-3">
              <ImageManager
                :model-value="{
                  url: item.metadata?.image_url || '',
                  alt_es: item.metadata?.image_alt_es || '',
                  alt_en: item.metadata?.image_alt_en || '',
                }"
                folder="cee-assets/pages/home"
                @update:model-value="updateActivityImage(index, $event)"
              />
              <BilingualTextField
                :model-value="{ es: item.content_es?.title || '', en: item.content_en?.title || '' }"
                :label="$t('admin.editors.home.activityTitle')"
                :max-length="50"
                @update:model-value="updateActivityField(index, 'title', $event)"
              />
              <BilingualTextarea
                :model-value="{ es: item.content_es?.description || '', en: item.content_en?.description || '' }"
                :label="$t('admin.editors.home.activityDescription')"
                :rows="2"
                :max-length="200"
                @update:model-value="updateActivityField(index, 'description', $event)"
              />
            </div>
          </template>
        </DataListManager>
      </div>
    </UCard>

    <!-- News / Announcements -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">{{ $t('admin.editors.home.news') }}</h3>
      </template>
      <div class="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
        <UIcon name="i-heroicons-information-circle" class="w-8 h-8 text-blue-600 shrink-0 mt-0.5" />
        <div class="flex-1">
          <p class="text-gray-700">{{ $t('admin.editors.home.newsFromAnnouncements') }}</p>
        </div>
        <UButton
          :to="localePath('/admin/announcements')"
          variant="outline"
          icon="i-heroicons-arrow-right"
        >
          {{ $t('admin.editors.home.goToAnnouncements') }}
        </UButton>
      </div>
    </UCard>

    <!-- Bottom save bar -->
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-check"
        :loading="saving"
        @click="saveAll"
      >
        {{ $t('admin.editors.save') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from '../BilingualTextField.vue'
import type { PageContentItem } from '~/composables/usePageContent'

defineProps<{
  sectionKey: string
  pageSlug: string
}>()

const { loadItems, saveAll: saveAllContent, items } = usePageContent()
const toast = useToast()
const { t } = useI18n()

const saving = ref(false)
const loaded = ref(false)

const localePath = useLocalePath()

const openSections = reactive({
  welcome: true,
  enrollment: false,
  values: false,
  activities: false,
})

function toggleSection(section: keyof typeof openSections) {
  openSections[section] = !openSections[section]
}

// --- Welcome data (stored as dynamic_content via page_content) ---
const welcomeTitle1 = ref<BilingualText>({ es: '', en: '' })
const welcomeTitle2 = ref<BilingualText>({ es: '', en: '' })
const welcomeDescription = ref<BilingualText>({ es: '', en: '' })

// --- Enrollment data ---
const enrollmentTitle = ref<BilingualText>({ es: '', en: '' })
const enrollmentDescription = ref<BilingualText>({ es: '', en: '' })
const enrollmentFeatures = ref<PageContentItem[]>([])

// --- Values data ---
const valuesItems = ref<PageContentItem[]>([])

// --- Activities data ---
const activitiesItems = ref<PageContentItem[]>([])

// --- Load all data ---
async function loadAllData() {
  try {
    // Load welcome text (single item per key)
    await loadItems('home.welcome')
    const welcomeData = items.value
    if (welcomeData.length > 0) {
      const w = welcomeData[0]
      welcomeTitle1.value = { es: w.content_es?.titlePartOne || '', en: w.content_en?.titlePartOne || '' }
      welcomeTitle2.value = { es: w.content_es?.titlePartTwo || '', en: w.content_en?.titlePartTwo || '' }
      welcomeDescription.value = { es: w.content_es?.description || '', en: w.content_en?.description || '' }
    }

    // Load enrollment text
    await loadItems('home.enrollment')
    const enrollData = items.value
    if (enrollData.length > 0) {
      const e = enrollData[0]
      enrollmentTitle.value = { es: e.content_es?.title || '', en: e.content_en?.title || '' }
      enrollmentDescription.value = { es: e.content_es?.description || '', en: e.content_en?.description || '' }
    }

    // Load enrollment features
    await loadItems('home.enrollment.features')
    enrollmentFeatures.value = items.value.length > 0
      ? items.value.map(i => ({ ...i }))
      : []

    // Load values
    await loadItems('home.values')
    valuesItems.value = items.value.length > 0
      ? items.value.map(i => ({ ...i }))
      : []

    // Load activities
    await loadItems('home.activities')
    activitiesItems.value = items.value.length > 0
      ? items.value.map(i => ({ ...i }))
      : []

    loaded.value = true
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
}

// --- Add functions ---
function addEnrollmentFeature() {
  enrollmentFeatures.value = [
    ...enrollmentFeatures.value,
    { page_key: 'home.enrollment.features', content_es: { text: '' }, content_en: { text: '' }, sort_order: enrollmentFeatures.value.length, is_active: true },
  ]
}

function addValueItem() {
  valuesItems.value = [
    ...valuesItems.value,
    { page_key: 'home.values', content_es: { title: '', description: '' }, content_en: { title: '', description: '' }, sort_order: valuesItems.value.length, is_active: true },
  ]
}

function addActivityItem() {
  activitiesItems.value = [
    ...activitiesItems.value,
    { page_key: 'home.activities', content_es: { title: '', description: '' }, content_en: { title: '', description: '' }, sort_order: activitiesItems.value.length, is_active: true, metadata: {} },
  ]
}

// --- Update functions for enrollment features ---
function updateEnrollmentFeature(index: number, val: BilingualText) {
  const arr = [...enrollmentFeatures.value]
  arr[index] = {
    ...arr[index],
    content_es: { text: val.es },
    content_en: { text: val.en },
  }
  enrollmentFeatures.value = arr
}

// --- Update functions for values ---
function updateValueField(index: number, field: string, val: BilingualText) {
  const arr = [...valuesItems.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  valuesItems.value = arr
}

// --- Update functions for activities ---
function updateActivityField(index: number, field: string, val: BilingualText) {
  const arr = [...activitiesItems.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  activitiesItems.value = arr
}

// --- Update functions for activity images ---
function updateActivityImage(index: number, imageData: { url: string; alt_es: string; alt_en: string }) {
  const arr = [...activitiesItems.value]
  arr[index] = {
    ...arr[index],
    metadata: {
      ...arr[index].metadata,
      image_url: imageData.url,
      image_alt_es: imageData.alt_es,
      image_alt_en: imageData.alt_en,
    },
  }
  activitiesItems.value = arr
}

// --- Save all ---
async function saveAll() {
  saving.value = true
  try {
    // Save welcome (single item)
    await saveAllContent('home.welcome', [{
      ...(items.value.find(i => i.page_key === 'home.welcome') || { page_key: 'home.welcome', sort_order: 0, is_active: true }),
      page_key: 'home.welcome',
      content_es: { titlePartOne: welcomeTitle1.value.es, titlePartTwo: welcomeTitle2.value.es, description: welcomeDescription.value.es },
      content_en: { titlePartOne: welcomeTitle1.value.en, titlePartTwo: welcomeTitle2.value.en, description: welcomeDescription.value.en },
      sort_order: 0,
      is_active: true,
    }])

    // Save enrollment text (single item)
    await saveAllContent('home.enrollment', [{
      ...(items.value.find(i => i.page_key === 'home.enrollment') || { page_key: 'home.enrollment', sort_order: 0, is_active: true }),
      page_key: 'home.enrollment',
      content_es: { title: enrollmentTitle.value.es, description: enrollmentDescription.value.es },
      content_en: { title: enrollmentTitle.value.en, description: enrollmentDescription.value.en },
      sort_order: 0,
      is_active: true,
    }])

    // Save enrollment features
    await saveAllContent('home.enrollment.features', enrollmentFeatures.value)

    // Save values
    await saveAllContent('home.values', valuesItems.value)

    // Save activities
    await saveAllContent('home.activities', activitiesItems.value)

    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAllData()
})
</script>
