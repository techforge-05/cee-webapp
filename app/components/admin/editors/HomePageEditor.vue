<template>
  <div class="space-y-6 pb-24">
    <!-- Welcome Section -->
    <SectionCard
      v-model="openSections.welcome"
      :title="$t('admin.editors.home.welcome')"
      :page-key="'home.welcome'"
      @restored="handleSectionRestored('home.welcome')"
    >
      <div class="space-y-4">
        <BilingualTextField
          v-model="welcomeTitle1"
          :label="$t('admin.editors.home.welcomeTitlePart1')"
          :max-length="100"
          @update:model-value="trackChanges"
        />
        <BilingualTextField
          v-model="welcomeTitle2"
          :label="$t('admin.editors.home.welcomeTitlePart2')"
          :max-length="100"
          @update:model-value="trackChanges"
        />
        <BilingualTextarea
          v-model="welcomeDescription"
          :label="$t('admin.editors.home.welcomeDescription')"
          :rows="3"
          :max-length="500"
          @update:model-value="trackChanges"
        />
      </div>
    </SectionCard>

    <!-- Enrollment Section -->
    <SectionCard
      v-model="openSections.enrollment"
      :title="$t('admin.editors.home.enrollment')"
      :page-key="'home.enrollment'"
      @restored="handleSectionRestored('home.enrollment')"
    >
      <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
        <!-- Left: Data fields -->
        <div class="space-y-4">
          <BilingualTextField
            v-model="enrollmentTitle"
            :label="$t('admin.editors.home.enrollmentTitle')"
            :max-length="100"
            @update:model-value="trackChanges"
          />
          <BilingualTextarea
            v-model="enrollmentDescription"
            :label="$t('admin.editors.home.enrollmentDescription')"
            :rows="3"
            :max-length="500"
            @update:model-value="trackChanges"
          />

          <div class="pt-2">
            <h4 class="text-sm font-medium text-gray-700 mb-3">{{ $t('admin.editors.home.enrollmentFeatures') }}</h4>
            <DataListManager
              v-model="enrollmentFeatures"
              :max-items="5"
              :min-items="1"
              :item-label="$t('admin.editors.home.feature')"
              @add="addEnrollmentFeature"
              @update:model-value="trackChanges"
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

        <!-- Right: Image -->
        <div>
          <UFormField :label="$t('admin.components.image.upload')">
            <ImageUploader
              v-model="enrollmentImage"
              folder="cee-assets/pages/home"
              @update:model-value="trackChanges"
            />
          </UFormField>
        </div>
      </div>
    </SectionCard>

    <!-- Values Section -->
    <SectionCard
      v-model="openSections.values"
      :title="$t('admin.editors.home.values')"
      :page-key="'home.values'"
      @restored="handleSectionRestored('home.values')"
    >
      <div class="space-y-4">
        <DataListManager
          v-model="valuesItems"
          :max-items="9"
          :min-items="3"
          :item-label="$t('admin.editors.home.value')"
          @add="addValueItem"
          @update:model-value="trackChanges"
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
    </SectionCard>

    <!-- Activities Section -->
    <SectionCard
      v-model="openSections.activities"
      :title="$t('admin.editors.home.activities')"
      :page-key="'home.activities'"
      @restored="handleSectionRestored('home.activities')"
    >
      <div class="space-y-4">
        <DataListManager
          v-model="activitiesItems"
          :max-items="8"
          :min-items="2"
          :item-label="$t('admin.editors.home.activity')"
          @add="addActivityItem"
          @update:model-value="trackChanges"
        >
          <template #default="{ item, index }">
            <!-- 60/40 Layout: Data left, Image right -->
            <div class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
              <!-- Left: Data fields (60%) -->
              <div class="space-y-3">
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

              <!-- Right: Image (40%) -->
              <div>
                <UFormField :label="$t('admin.components.image.upload')">
                  <ImageUploader
                    :model-value="item.metadata?.image_url || ''"
                    :folder="`cee-assets/pages/home`"
                    @update:model-value="updateActivityImageUrl(index, $event)"
                  />
                </UFormField>
                <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <UFormField :label="$t('admin.components.image.altEs')">
                    <UInput
                      :model-value="item.metadata?.image_alt_es || ''"
                      @update:model-value="updateActivityImageAlt(index, 'image_alt_es', $event)"
                    />
                  </UFormField>
                  <UFormField :label="$t('admin.components.image.altEn')">
                    <UInput
                      :model-value="item.metadata?.image_alt_en || ''"
                      @update:model-value="updateActivityImageAlt(index, 'image_alt_en', $event)"
                    />
                  </UFormField>
                </div>
              </div>
            </div>
          </template>
        </DataListManager>
      </div>
    </SectionCard>

    <!-- News / Announcements -->
    <SectionCard
      v-model="openSections.news"
      :title="$t('admin.editors.home.news')"
      :page-key="''"
    >
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
    </SectionCard>

    <!-- Floating Action Buttons -->
    <FloatingActionButtons
      :show="true"
      :is-dirty="dirtyState.isDirty.value"
      :loading="saving"
      @save="handleSave"
      @cancel="handleCancel"
    />
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
const dirtyState = useDirtyState()

const saving = ref(false)
const loaded = ref(false)

const localePath = useLocalePath()

const openSections = reactive({
  welcome: false,
  enrollment: false,
  values: false,
  activities: false,
  news: false,
})

// --- Welcome data ---
const welcomeTitle1 = ref<BilingualText>({ es: '', en: '' })
const welcomeTitle2 = ref<BilingualText>({ es: '', en: '' })
const welcomeDescription = ref<BilingualText>({ es: '', en: '' })

// --- Enrollment data ---
const enrollmentTitle = ref<BilingualText>({ es: '', en: '' })
const enrollmentDescription = ref<BilingualText>({ es: '', en: '' })
const enrollmentImage = ref('')
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
      enrollmentImage.value = e.metadata?.image_url || ''
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

    // Initialize dirty state tracking
    initDirtyStateTracking()

    loaded.value = true
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
}

function initDirtyStateTracking() {
  const allData = {
    welcome: {
      title1: JSON.parse(JSON.stringify(welcomeTitle1.value)),
      title2: JSON.parse(JSON.stringify(welcomeTitle2.value)),
      description: JSON.parse(JSON.stringify(welcomeDescription.value)),
    },
    enrollment: {
      title: JSON.parse(JSON.stringify(enrollmentTitle.value)),
      description: JSON.parse(JSON.stringify(enrollmentDescription.value)),
      image: enrollmentImage.value,
      features: JSON.parse(JSON.stringify(enrollmentFeatures.value)),
    },
    values: JSON.parse(JSON.stringify(valuesItems.value)),
    activities: JSON.parse(JSON.stringify(activitiesItems.value)),
  }
  dirtyState.init(allData)
}

function trackChanges() {
  nextTick(() => {
    const currentData = {
      welcome: {
        title1: JSON.parse(JSON.stringify(welcomeTitle1.value)),
        title2: JSON.parse(JSON.stringify(welcomeTitle2.value)),
        description: JSON.parse(JSON.stringify(welcomeDescription.value)),
      },
      enrollment: {
        title: JSON.parse(JSON.stringify(enrollmentTitle.value)),
        description: JSON.parse(JSON.stringify(enrollmentDescription.value)),
        features: JSON.parse(JSON.stringify(enrollmentFeatures.value)),
      },
      values: JSON.parse(JSON.stringify(valuesItems.value)),
      activities: JSON.parse(JSON.stringify(activitiesItems.value)),
    }
    dirtyState.update(currentData)
  })
}

// --- Add functions ---
function addEnrollmentFeature() {
  enrollmentFeatures.value = [
    ...enrollmentFeatures.value,
    { page_key: 'home.enrollment.features', content_es: { text: '' }, content_en: { text: '' }, sort_order: enrollmentFeatures.value.length, is_active: true },
  ]
  trackChanges()
}

function addValueItem() {
  valuesItems.value = [
    ...valuesItems.value,
    { page_key: 'home.values', content_es: { title: '', description: '' }, content_en: { title: '', description: '' }, sort_order: valuesItems.value.length, is_active: true },
  ]
  trackChanges()
}

function addActivityItem() {
  activitiesItems.value = [
    ...activitiesItems.value,
    { page_key: 'home.activities', content_es: { title: '', description: '' }, content_en: { title: '', description: '' }, sort_order: activitiesItems.value.length, is_active: true, metadata: {} },
  ]
  trackChanges()
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
  trackChanges()
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
  trackChanges()
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
  trackChanges()
}

function updateActivityImageUrl(index: number, url: string) {
  const arr = [...activitiesItems.value]
  arr[index] = {
    ...arr[index],
    metadata: {
      ...arr[index].metadata,
      image_url: url,
    },
  }
  activitiesItems.value = arr
  trackChanges()
}

function updateActivityImageAlt(index: number, field: string, val: string) {
  const arr = [...activitiesItems.value]
  arr[index] = {
    ...arr[index],
    metadata: {
      ...arr[index].metadata,
      [field]: val,
    },
  }
  activitiesItems.value = arr
  trackChanges()
}

// --- Save all ---
async function handleSave() {
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
      metadata: { image_url: enrollmentImage.value },
      sort_order: 0,
      is_active: true,
    }])

    // Save enrollment features
    await saveAllContent('home.enrollment.features', enrollmentFeatures.value)

    // Save values
    await saveAllContent('home.values', valuesItems.value)

    // Save activities
    await saveAllContent('home.activities', activitiesItems.value)

    dirtyState.markClean()
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  const resetData = dirtyState.reset()

  // Restore all data from reset
  welcomeTitle1.value = resetData.welcome.title1
  welcomeTitle2.value = resetData.welcome.title2
  welcomeDescription.value = resetData.welcome.description
  enrollmentTitle.value = resetData.enrollment.title
  enrollmentDescription.value = resetData.enrollment.description
  enrollmentImage.value = resetData.enrollment.image
  enrollmentFeatures.value = resetData.enrollment.features
  valuesItems.value = resetData.values
  activitiesItems.value = resetData.activities

  toast.add({
    title: t('admin.messages.changesDiscarded'),
    color: 'info',
  })
}

async function handleSectionRestored(pageKey: string) {
  // Reload data for all sections
  await loadAllData()
  toast.add({
    title: t('admin.messages.sectionRestored'),
    color: 'success',
  })
}

onMounted(() => {
  loadAllData()
})
</script>
