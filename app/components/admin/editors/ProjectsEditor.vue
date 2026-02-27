<template>
  <div class="space-y-6 pb-24">
    <!-- Introduction Section -->
    <SectionCard
      v-model="openIntro"
      :title="$t('admin.editors.support.projects.intro')"
      :page-key="'support.projects.intro'"
      @restored="handleSectionRestored"
    >
      <BilingualTextarea
        :model-value="{ es: introItem.content_es?.text || '', en: introItem.content_en?.text || '' }"
        :label="$t('admin.editors.generic.text')"
        :rows="3"
        :max-length="1000"
        @update:model-value="updateIntroField('text', $event)"
      />
      <UFormField :label="$t('admin.editors.generic.imageUrl')" class="mt-4">
        <ImageUploader
          :model-value="introItem.metadata?.imageUrl || ''"
          folder="cee-assets/projects"
          :focal-x="Number(introItem.metadata?.focalX) || 50"
          :focal-y="Number(introItem.metadata?.focalY) || 50"
          @update:model-value="updateIntroMeta('imageUrl', $event)"
          @update:focal-x="updateIntroMeta('focalX', String($event))"
          @update:focal-y="updateIntroMeta('focalY', String($event))"
        />
      </UFormField>
    </SectionCard>

    <!-- Projects Section -->
    <SectionCard
      v-model="openProjects"
      :title="$t('admin.editors.support.projects.projects')"
      :page-key="'support.projects.items'"
      @restored="handleSectionRestored"
    >
      <DataListManager
        v-model="projectItems"
        :max-items="12"
        :min-items="0"
        :item-label="$t('admin.editors.support.projects.project')"
        @add="addProject"
        @update:model-value="trackChanges"
      >
        <template #default="{ item, index }">
          <div class="space-y-4">
            <!-- Title (bilingual) -->
            <BilingualTextField
              :model-value="{ es: item.content_es?.title || '', en: item.content_en?.title || '' }"
              :label="$t('admin.editors.generic.title')"
              :max-length="150"
              @update:model-value="updateProjectField(index, 'title', $event)"
            />

            <!-- Description (bilingual) -->
            <BilingualTextarea
              :model-value="{ es: item.content_es?.description || '', en: item.content_en?.description || '' }"
              :label="$t('admin.editors.generic.description')"
              :rows="3"
              :max-length="1000"
              @update:model-value="updateProjectField(index, 'description', $event)"
            />

            <!-- Metadata row: Status, Slug, Goal -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UFormField :label="$t('admin.editors.generic.status')">
                <div class="flex items-center gap-2">
                  <USelect
                    v-if="!isCustomStatus(index)"
                    :model-value="item.metadata?.status || ''"
                    :items="statusOptions"
                    class="w-full"
                    @update:model-value="handleStatusChange(index, $event as string)"
                  />
                  <template v-else>
                    <UInput
                      :model-value="item.metadata?.status || ''"
                      :placeholder="$t('admin.editors.generic.customValue')"
                      class="w-full"
                      @update:model-value="updateProjectMeta(index, 'status', $event)"
                    />
                    <UButton
                      variant="ghost"
                      color="neutral"
                      size="xs"
                      @click="clearCustomStatus(index)"
                    >
                      <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
                    </UButton>
                  </template>
                </div>
              </UFormField>
              <UFormField :label="$t('admin.editors.generic.slug')">
                <UInput
                  :model-value="item.metadata?.slug || ''"
                  placeholder="project-name"
                  @update:model-value="updateProjectMeta(index, 'slug', $event)"
                />
              </UFormField>
              <UFormField :label="$t('admin.editors.generic.goal')">
                <UInput
                  :model-value="item.metadata?.goal || ''"
                  placeholder="$5,000"
                  @update:model-value="updateProjectMeta(index, 'goal', $event)"
                />
              </UFormField>
            </div>

            <!-- Completion Message (shown when status is completed) -->
            <div v-if="item.metadata?.status === 'completed'" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <BilingualTextarea
                :model-value="{ es: item.content_es?.completionMessage || '', en: item.content_en?.completionMessage || '' }"
                :label="$t('admin.editors.support.projects.completionMessage')"
                :rows="3"
                :max-length="500"
                @update:model-value="updateProjectField(index, 'completionMessage', $event)"
              />
            </div>

            <!-- Image upload -->
            <UFormField :label="$t('admin.editors.generic.imageUrl')">
              <ImageUploader
                :model-value="item.metadata?.imageUrl || ''"
                folder="cee-assets/projects"
                :focal-x="Number(item.metadata?.focalX) || 50"
                :focal-y="Number(item.metadata?.focalY) || 50"
                @update:model-value="updateProjectMeta(index, 'imageUrl', $event)"
                @update:focal-x="updateProjectMeta(index, 'focalX', String($event))"
                @update:focal-y="updateProjectMeta(index, 'focalY', String($event))"
              />
            </UFormField>

            <!-- Auto-generate slug button -->
            <div v-if="item.content_es?.title && !item.metadata?.slug" class="flex items-center gap-2">
              <UButton
                variant="outline"
                size="xs"
                icon="i-heroicons-sparkles"
                @click="autoGenerateSlug(index)"
              >
                {{ $t('admin.editors.support.projects.generateSlug') }}
              </UButton>
            </div>

            <!-- Nested needs list -->
            <div class="border-t border-gray-200 pt-4 mt-4">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">
                {{ $t('admin.editors.support.projects.needs') }}
              </h4>
              <DataListManager
                v-model="projectNeeds[getSlugKey(index)]"
                :max-items="10"
                :min-items="0"
                :item-label="$t('admin.editors.support.projects.need')"
                @add="addNeed(index)"
                @update:model-value="trackChanges"
              >
                <template #default="{ item: needItem, index: needIndex }">
                  <BilingualTextField
                    :model-value="{ es: needItem.content_es?.text || '', en: needItem.content_en?.text || '' }"
                    :label="$t('admin.editors.generic.text')"
                    :max-length="300"
                    @update:model-value="updateNeedField(getSlugKey(index), needIndex, 'text', $event)"
                  />
                </template>
              </DataListManager>
            </div>
          </div>
        </template>
      </DataListManager>
    </SectionCard>

    <!-- How to Help Section -->
    <SectionCard
      v-model="openHowToHelp"
      :title="$t('admin.editors.support.projects.howToHelp')"
      :page-key="'support.projects.howToHelp'"
      @restored="handleSectionRestored"
    >
      <DataListManager
        v-model="howToHelpItems"
        :max-items="8"
        :min-items="0"
        :item-label="$t('admin.editors.generic.item')"
        @add="addHowToHelpItem"
        @update:model-value="trackChanges"
      >
        <template #default="{ item, index }">
          <BilingualTextField
            :model-value="{ es: item.content_es?.text || '', en: item.content_en?.text || '' }"
            :label="$t('admin.editors.generic.text')"
            :max-length="300"
            @update:model-value="updateHowToHelpField(index, 'text', $event)"
          />
        </template>
      </DataListManager>
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

const { loadItems, saveAll, saveItem, deleteItem, items } = usePageContent()
const supabase = useSupabaseClient()
const toast = useToast()
const { t } = useI18n()
const dirtyState = useDirtyState()

const saving = ref(false)
const openIntro = ref(false)
const openProjects = ref(false)
const openHowToHelp = ref(false)

const statusOptions = [
  { value: '__custom__', label: t('admin.editors.generic.custom') },
  { value: 'planning', label: t('support.projects.status.planning') },
  { value: 'in_progress', label: t('support.projects.status.in_progress') },
  { value: 'fundraising', label: t('support.projects.status.fundraising') },
  { value: 'completed', label: t('support.projects.status.completed') },
]
const statusValues = statusOptions.filter(o => o.value !== '__custom__').map(o => o.value)
const customStatusIndexes = reactive(new Set<number>())

function isCustomStatus(index: number): boolean {
  if (customStatusIndexes.has(index)) return true
  const value = projectItems.value[index]?.metadata?.status
  if (!value) return false
  return !statusValues.includes(value)
}

function handleStatusChange(index: number, value: string) {
  if (value === '__custom__') {
    customStatusIndexes.add(index)
    updateProjectMeta(index, 'status', '')
  } else {
    customStatusIndexes.delete(index)
    updateProjectMeta(index, 'status', value)
  }
}

function clearCustomStatus(index: number) {
  customStatusIndexes.delete(index)
  updateProjectMeta(index, 'status', '')
}

// Data refs
const introItem = ref<PageContentItem>({
  page_key: 'support.projects.intro',
  content_es: { text: '' },
  content_en: { text: '' },
  sort_order: 0,
  is_active: true,
})
const projectItems = ref<PageContentItem[]>([])
const howToHelpItems = ref<PageContentItem[]>([])
const projectNeeds = ref<Record<string, PageContentItem[]>>({})

// Track original slugs to detect changes and clean up old needs
const originalSlugs = ref<string[]>([])

function getSlugKey(index: number): string {
  return projectItems.value[index]?.metadata?.slug || `_new_${index}`
}

async function loadAllData() {
  try {
    // Load intro
    await loadItems('support.projects.intro')
    if (items.value.length > 0) {
      introItem.value = { ...items.value[0] }
    }

    // Load project items
    await loadItems('support.projects.items')
    projectItems.value = items.value.map(i => ({ ...i }))

    // Track original slugs
    originalSlugs.value = projectItems.value
      .map(p => p.metadata?.slug)
      .filter(Boolean) as string[]

    // Load needs for each project
    for (const project of projectItems.value) {
      const slug = project.metadata?.slug
      if (slug) {
        const needsKey = `support.projects.${slug}.needs`
        await loadItems(needsKey)
        projectNeeds.value[slug] = items.value.map(i => ({ ...i }))
      }
    }

    // Load how to help
    await loadItems('support.projects.howToHelp')
    howToHelpItems.value = items.value.map(i => ({ ...i }))

    initDirtyStateTracking()
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
}

function initDirtyStateTracking() {
  const allData = {
    intro: JSON.parse(JSON.stringify(introItem.value)),
    projects: JSON.parse(JSON.stringify(projectItems.value)),
    needs: JSON.parse(JSON.stringify(projectNeeds.value)),
    howToHelp: JSON.parse(JSON.stringify(howToHelpItems.value)),
  }
  dirtyState.init(allData)
}

function trackChanges() {
  nextTick(() => {
    const currentData = {
      intro: JSON.parse(JSON.stringify(introItem.value)),
      projects: JSON.parse(JSON.stringify(projectItems.value)),
      needs: JSON.parse(JSON.stringify(projectNeeds.value)),
      howToHelp: JSON.parse(JSON.stringify(howToHelpItems.value)),
    }
    dirtyState.update(currentData)
  })
}

// --- Intro ---
function updateIntroField(field: string, val: BilingualText) {
  introItem.value = {
    ...introItem.value,
    content_es: { ...introItem.value.content_es, [field]: val.es },
    content_en: { ...introItem.value.content_en, [field]: val.en },
  }
  trackChanges()
}

function updateIntroMeta(field: string, val: string) {
  introItem.value = {
    ...introItem.value,
    metadata: { ...introItem.value.metadata, [field]: val },
  }
  trackChanges()
}

// --- Projects ---
function addProject() {
  projectItems.value = [
    ...projectItems.value,
    {
      page_key: 'support.projects.items',
      content_es: { title: '', description: '' },
      content_en: { title: '', description: '' },
      sort_order: projectItems.value.length,
      is_active: true,
      metadata: { slug: '', status: '', goal: '', imageUrl: '' },
    },
  ]
  trackChanges()
}

function updateProjectField(index: number, field: string, val: BilingualText) {
  const arr = [...projectItems.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  projectItems.value = arr
  trackChanges()
}

function updateProjectMeta(index: number, field: string, val: string) {
  const arr = [...projectItems.value]
  const oldSlug = arr[index].metadata?.slug || ''
  arr[index] = {
    ...arr[index],
    metadata: { ...arr[index].metadata, [field]: val },
  }
  projectItems.value = arr

  // If slug changed, migrate needs to new key
  if (field === 'slug' && oldSlug && val && oldSlug !== val) {
    const oldNeeds = projectNeeds.value[oldSlug] || []
    const newNeeds = { ...projectNeeds.value }
    delete newNeeds[oldSlug]
    newNeeds[val] = oldNeeds
    projectNeeds.value = newNeeds
  }

  trackChanges()
}

function autoGenerateSlug(index: number) {
  const title = projectItems.value[index]?.content_es?.title || ''
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  updateProjectMeta(index, 'slug', slug)
}

// --- Needs ---
function addNeed(projectIndex: number) {
  const key = getSlugKey(projectIndex)
  const current = projectNeeds.value[key] || []
  projectNeeds.value = {
    ...projectNeeds.value,
    [key]: [
      ...current,
      {
        page_key: `support.projects.${key}.needs`,
        content_es: { text: '' },
        content_en: { text: '' },
        sort_order: current.length,
        is_active: true,
      },
    ],
  }
  trackChanges()
}

function updateNeedField(slugKey: string, needIndex: number, field: string, val: BilingualText) {
  const needsArr = [...(projectNeeds.value[slugKey] || [])]
  needsArr[needIndex] = {
    ...needsArr[needIndex],
    content_es: { ...needsArr[needIndex].content_es, [field]: val.es },
    content_en: { ...needsArr[needIndex].content_en, [field]: val.en },
  }
  projectNeeds.value = { ...projectNeeds.value, [slugKey]: needsArr }
  trackChanges()
}

// --- How to Help ---
function addHowToHelpItem() {
  howToHelpItems.value = [
    ...howToHelpItems.value,
    {
      page_key: 'support.projects.howToHelp',
      content_es: { text: '' },
      content_en: { text: '' },
      sort_order: howToHelpItems.value.length,
      is_active: true,
    },
  ]
  trackChanges()
}

function updateHowToHelpField(index: number, field: string, val: BilingualText) {
  const arr = [...howToHelpItems.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  howToHelpItems.value = arr
  trackChanges()
}

// --- Save ---
async function handleSave() {
  saving.value = true
  try {
    // Save intro
    const savedIntro = await saveItem(introItem.value)
    introItem.value = savedIntro

    // Save project items
    await saveAll('support.projects.items', projectItems.value)

    // Determine which slugs were removed
    const currentSlugs = projectItems.value
      .map(p => p.metadata?.slug)
      .filter(Boolean) as string[]
    const removedSlugs = originalSlugs.value.filter(s => !currentSlugs.includes(s))

    // Delete needs for removed projects
    for (const slug of removedSlugs) {
      const needsKey = `support.projects.${slug}.needs`
      const { data: existingNeeds } = await supabase
        .from('page_content')
        .select('id')
        .eq('page_key', needsKey)
      if (existingNeeds) {
        for (const n of existingNeeds) {
          await deleteItem(n.id)
        }
      }
    }

    // Save needs for each current project
    for (const slug of currentSlugs) {
      const needsKey = `support.projects.${slug}.needs`
      const needsList = (projectNeeds.value[slug] || []).map((n, i) => ({
        ...n,
        page_key: needsKey,
        sort_order: i,
      }))
      await saveAll(needsKey, needsList)
    }

    // Save how to help
    await saveAll('support.projects.howToHelp', howToHelpItems.value)

    // Update tracked slugs
    originalSlugs.value = [...currentSlugs]

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
  introItem.value = resetData.intro
  projectItems.value = resetData.projects
  projectNeeds.value = resetData.needs
  howToHelpItems.value = resetData.howToHelp

  toast.add({ title: t('admin.messages.changesDiscarded'), color: 'info' })
}

async function handleSectionRestored() {
  await loadAllData()
  toast.add({ title: t('admin.messages.sectionRestored'), color: 'success' })
}

onMounted(() => {
  loadAllData()
})
</script>
