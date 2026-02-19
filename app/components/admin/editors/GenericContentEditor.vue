<template>
  <div class="space-y-6 pb-24">
    <!-- Sections -->
    <SectionCard
      v-for="section in schema"
      :key="section.pageKey"
      v-model="openSections[section.pageKey]"
      :title="$t(section.labelKey)"
      :page-key="section.pageKey"
      @restored="handleSectionRestored(section.pageKey)"
    >
      <div class="space-y-4">
        <!-- Single item section -->
        <template v-if="section.type === 'single'">
          <!-- Check if section has imageUrl field -->
          <div
            v-if="hasImageField(section)"
            class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6"
          >
            <!-- Left: Data fields (60%) -->
            <div class="space-y-4">
              <template v-for="field in section.fields" :key="field.key">
                <BilingualTextField
                  v-if="field.type === 'text' && field.key !== 'imageUrl' && singleData[section.pageKey]"
                  v-model="singleData[section.pageKey][field.key]"
                  :label="$t(field.labelKey)"
                  :max-length="field.maxLength"
                  @update:model-value="trackChanges"
                />
                <BilingualTextarea
                  v-if="field.type === 'textarea' && singleData[section.pageKey]"
                  v-model="singleData[section.pageKey][field.key]"
                  :label="$t(field.labelKey)"
                  :max-length="field.maxLength"
                  :rows="field.rows || 3"
                  @update:model-value="trackChanges"
                />
                <UFormField
                  v-if="field.type === 'metadata' && field.key !== 'imageUrl' && metaData[section.pageKey]"
                  :label="$t(field.labelKey)"
                >
                  <UInput
                    v-model="metaData[section.pageKey][field.key]"
                    :maxlength="field.maxLength"
                    @update:model-value="trackChanges"
                  />
                </UFormField>
                <IconPicker
                  v-if="field.type === 'icon' && singleData[section.pageKey]"
                  :model-value="singleData[section.pageKey][field.key]?.es || ''"
                  :label="$t(field.labelKey)"
                  @update:model-value="updateSingleIconField(section.pageKey, field.key, $event)"
                />
              </template>
            </div>

            <!-- Right: Image (40%) -->
            <div>
              <UFormField :label="$t('admin.components.image.upload')">
                <ImageUploader
                  v-model="sectionImages[section.pageKey]"
                  :folder="`cee-assets/${sectionKey}/${pageSlug}`"
                  @update:model-value="trackChanges"
                />
              </UFormField>
            </div>
          </div>

          <!-- Standard single item layout (no image) -->
          <template v-else>
            <template v-for="field in section.fields" :key="field.key">
              <BilingualTextField
                v-if="field.type === 'text' && singleData[section.pageKey]"
                v-model="singleData[section.pageKey][field.key]"
                :label="$t(field.labelKey)"
                :max-length="field.maxLength"
                @update:model-value="trackChanges"
              />
              <BilingualTextarea
                v-if="field.type === 'textarea' && singleData[section.pageKey]"
                v-model="singleData[section.pageKey][field.key]"
                :label="$t(field.labelKey)"
                :max-length="field.maxLength"
                :rows="field.rows || 3"
                @update:model-value="trackChanges"
              />
              <UFormField
                v-if="field.type === 'metadata' && metaData[section.pageKey]"
                :label="$t(field.labelKey)"
              >
                <UInput
                  v-model="metaData[section.pageKey][field.key]"
                  :maxlength="field.maxLength"
                  @update:model-value="trackChanges"
                />
              </UFormField>
              <IconPicker
                v-if="field.type === 'icon' && singleData[section.pageKey]"
                :model-value="singleData[section.pageKey][field.key]?.es || ''"
                :label="$t(field.labelKey)"
                @update:model-value="updateSingleIconField(section.pageKey, field.key, $event)"
              />
            </template>
          </template>
        </template>

        <!-- List section -->
        <template v-else>
          <DataListManager
            v-model="listData[section.pageKey]"
            :max-items="section.maxItems"
            :min-items="section.minItems"
            :item-label="section.itemLabelKey ? $t(section.itemLabelKey) : undefined"
            @add="addListItem(section)"
            @update:model-value="trackChanges"
          >
            <template #default="{ item, index }">
              <!-- Check if list items have imageUrl field -->
              <div
                v-if="hasImageField(section)"
                class="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6"
              >
                <!-- Left: Data fields (60%) -->
                <div class="space-y-3">
                  <template v-for="field in section.fields" :key="field.key">
                    <BilingualTextField
                      v-if="field.type === 'text'"
                      :model-value="getBilingualValue(item, field.key)"
                      :label="$t(field.labelKey)"
                      :max-length="field.maxLength"
                      @update:model-value="updateListBilingualField(section.pageKey, index, field.key, $event)"
                    />
                    <BilingualTextarea
                      v-if="field.type === 'textarea'"
                      :model-value="getBilingualValue(item, field.key)"
                      :label="$t(field.labelKey)"
                      :max-length="field.maxLength"
                      :rows="field.rows || 3"
                      @update:model-value="updateListBilingualField(section.pageKey, index, field.key, $event)"
                    />
                    <UFormField
                      v-if="field.type === 'metadata' && field.key !== 'imageUrl'"
                      :label="$t(field.labelKey)"
                    >
                      <UInput
                        :model-value="item.metadata?.[field.key] || ''"
                        :maxlength="field.maxLength"
                        @update:model-value="updateListMetadataField(section.pageKey, index, field.key, $event as string)"
                      />
                    </UFormField>
                    <IconPicker
                      v-if="field.type === 'icon'"
                      :model-value="item.content_es?.[field.key] || ''"
                      :label="$t(field.labelKey)"
                      @update:model-value="updateListIconField(section.pageKey, index, field.key, $event)"
                    />
                  </template>
                </div>

                <!-- Right: Image (40%) -->
                <div>
                  <UFormField :label="$t('admin.components.image.upload')">
                    <ImageUploader
                      :model-value="item.metadata?.imageUrl || ''"
                      :folder="`cee-assets/${sectionKey}/${pageSlug}`"
                      @update:model-value="updateListMetadataField(section.pageKey, index, 'imageUrl', $event)"
                    />
                  </UFormField>
                </div>
              </div>

              <!-- Standard list item layout (no image) -->
              <div v-else class="space-y-3">
                <template v-for="field in section.fields" :key="field.key">
                  <BilingualTextField
                    v-if="field.type === 'text'"
                    :model-value="getBilingualValue(item, field.key)"
                    :label="$t(field.labelKey)"
                    :max-length="field.maxLength"
                    @update:model-value="updateListBilingualField(section.pageKey, index, field.key, $event)"
                  />
                  <BilingualTextarea
                    v-if="field.type === 'textarea'"
                    :model-value="getBilingualValue(item, field.key)"
                    :label="$t(field.labelKey)"
                    :max-length="field.maxLength"
                    :rows="field.rows || 3"
                    @update:model-value="updateListBilingualField(section.pageKey, index, field.key, $event)"
                  />
                  <UFormField v-if="field.type === 'metadata'" :label="$t(field.labelKey)">
                    <UInput
                      :model-value="item.metadata?.[field.key] || ''"
                      :maxlength="field.maxLength"
                      @update:model-value="updateListMetadataField(section.pageKey, index, field.key, $event as string)"
                    />
                  </UFormField>
                  <IconPicker
                    v-if="field.type === 'icon'"
                    :model-value="item.content_es?.[field.key] || ''"
                    :label="$t(field.labelKey)"
                    @update:model-value="updateListIconField(section.pageKey, index, field.key, $event)"
                  />
                </template>
              </div>
            </template>
          </DataListManager>
        </template>
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
import type { EditorSection } from './editorSchemas'

const props = defineProps<{
  schema: EditorSection[]
  sectionKey: string
  pageSlug: string
}>()

const { loadItems, saveAll: saveAllContent, items } = usePageContent()
const toast = useToast()
const { t } = useI18n()
const dirtyState = useDirtyState()

const saving = ref(false)
const loaded = ref(false)

const openSections = reactive<Record<string, boolean>>({})
const singleData = reactive<Record<string, Record<string, BilingualText>>>({})
const metaData = reactive<Record<string, Record<string, string>>>({})
const listData = reactive<Record<string, PageContentItem[]>>({})
const sectionImages = reactive<Record<string, string>>({})
const existingIds = reactive<Record<string, string | undefined>>({})

// Helper to check if section has imageUrl field
function hasImageField(section: EditorSection): boolean {
  return section.fields.some((f) => f.type === 'metadata' && f.key === 'imageUrl')
}

function toggleSection(key: string) {
  openSections[key] = !openSections[key]
}

function initSections() {
  props.schema.forEach((section) => {
    openSections[section.pageKey] = section.defaultOpen ?? false
    if (section.type === 'single') {
      singleData[section.pageKey] = {}
      metaData[section.pageKey] = {}
      sectionImages[section.pageKey] = ''
      section.fields.forEach((field) => {
        if (field.type === 'text' || field.type === 'textarea' || field.type === 'icon') {
          singleData[section.pageKey][field.key] = { es: '', en: '' }
        } else if (field.type === 'metadata') {
          if (field.key === 'imageUrl') {
            sectionImages[section.pageKey] = ''
          } else {
            metaData[section.pageKey][field.key] = ''
          }
        }
      })
    } else {
      listData[section.pageKey] = []
    }
  })
}

async function loadAllData() {
  try {
    for (const section of props.schema) {
      await loadItems(section.pageKey)

      if (section.type === 'single') {
        const item = items.value[0]
        existingIds[section.pageKey] = item?.id

        section.fields.forEach((field) => {
          if (field.type === 'text' || field.type === 'textarea' || field.type === 'icon') {
            singleData[section.pageKey][field.key] = {
              es: item?.content_es?.[field.key] || '',
              en: item?.content_en?.[field.key] || '',
            }
          } else if (field.type === 'metadata') {
            if (field.key === 'imageUrl') {
              sectionImages[section.pageKey] = item?.metadata?.[field.key] || ''
            } else {
              metaData[section.pageKey][field.key] = item?.metadata?.[field.key] || ''
            }
          }
        })
      } else {
        listData[section.pageKey] =
          items.value.length > 0 ? items.value.map((i) => ({ ...i })) : []
      }
    }

    // Initialize dirty state tracking
    initDirtyStateTracking()

    loaded.value = true
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
}

function initDirtyStateTracking() {
  const allData = {
    single: JSON.parse(JSON.stringify(singleData)),
    meta: JSON.parse(JSON.stringify(metaData)),
    list: JSON.parse(JSON.stringify(listData)),
    images: JSON.parse(JSON.stringify(sectionImages)),
  }
  dirtyState.init(allData)
}

function trackChanges() {
  nextTick(() => {
    const currentData = {
      single: JSON.parse(JSON.stringify(singleData)),
      meta: JSON.parse(JSON.stringify(metaData)),
      list: JSON.parse(JSON.stringify(listData)),
      images: JSON.parse(JSON.stringify(sectionImages)),
    }
    dirtyState.update(currentData)
  })
}

function getBilingualValue(item: PageContentItem, fieldKey: string): BilingualText {
  return {
    es: item.content_es?.[fieldKey] || '',
    en: item.content_en?.[fieldKey] || '',
  }
}

function updateListBilingualField(
  pageKey: string,
  index: number,
  fieldKey: string,
  val: BilingualText,
) {
  const arr = [...listData[pageKey]]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [fieldKey]: val.es },
    content_en: { ...arr[index].content_en, [fieldKey]: val.en },
  }
  listData[pageKey] = arr
  trackChanges()
}

function updateListMetadataField(pageKey: string, index: number, fieldKey: string, val: string) {
  const arr = [...listData[pageKey]]
  arr[index] = {
    ...arr[index],
    metadata: { ...(arr[index].metadata || {}), [fieldKey]: val },
  }
  listData[pageKey] = arr
  trackChanges()
}

function updateSingleIconField(pageKey: string, fieldKey: string, val: string) {
  singleData[pageKey][fieldKey] = { es: val, en: val }
  trackChanges()
}

function updateListIconField(pageKey: string, index: number, fieldKey: string, val: string) {
  const arr = [...listData[pageKey]]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [fieldKey]: val },
    content_en: { ...arr[index].content_en, [fieldKey]: val },
  }
  listData[pageKey] = arr
  trackChanges()
}

function addListItem(section: EditorSection) {
  const contentEs: Record<string, any> = {}
  const contentEn: Record<string, any> = {}
  const metadata: Record<string, any> = {}

  section.fields.forEach((field) => {
    if (field.type === 'text' || field.type === 'textarea' || field.type === 'icon') {
      contentEs[field.key] = ''
      contentEn[field.key] = ''
    } else if (field.type === 'metadata') {
      metadata[field.key] = ''
    }
  })

  listData[section.pageKey] = [
    ...listData[section.pageKey],
    {
      page_key: section.pageKey,
      content_es: contentEs,
      content_en: contentEn,
      sort_order: listData[section.pageKey].length,
      is_active: true,
      metadata,
    },
  ]
  trackChanges()
}

async function handleSave() {
  saving.value = true
  try {
    for (const section of props.schema) {
      if (section.type === 'single') {
        const contentEs: Record<string, any> = {}
        const contentEn: Record<string, any> = {}
        const metadata: Record<string, any> = {}

        section.fields.forEach((field) => {
          if (field.type === 'text' || field.type === 'textarea' || field.type === 'icon') {
            contentEs[field.key] = singleData[section.pageKey][field.key].es
            contentEn[field.key] = singleData[section.pageKey][field.key].en
          } else if (field.type === 'metadata') {
            if (field.key === 'imageUrl') {
              metadata[field.key] = sectionImages[section.pageKey]
            } else {
              metadata[field.key] = metaData[section.pageKey][field.key]
            }
          }
        })

        const existingId = existingIds[section.pageKey]
        const results = await saveAllContent(section.pageKey, [
          {
            ...(existingId ? { id: existingId } : {}),
            page_key: section.pageKey,
            content_es: contentEs,
            content_en: contentEn,
            metadata,
            sort_order: 0,
            is_active: true,
          },
        ])
        if (results && results[0]?.id) {
          existingIds[section.pageKey] = results[0].id
        }
      } else {
        await saveAllContent(section.pageKey, listData[section.pageKey])
      }
    }

    dirtyState.markClean()
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({
      title: t('admin.editors.saveError'),
      description: e.message,
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  const resetData = dirtyState.reset()

  // Restore all data from reset
  Object.assign(singleData, resetData.single)
  Object.assign(metaData, resetData.meta)
  Object.assign(listData, resetData.list)
  Object.assign(sectionImages, resetData.images)

  toast.add({
    title: t('admin.messages.changesDiscarded'),
    color: 'info',
  })
}

async function handleSectionRestored(pageKey: string) {
  // Reload data for this section
  await loadAllData()
  toast.add({
    title: t('admin.messages.sectionRestored'),
    color: 'success',
  })
}

initSections()
onMounted(() => {
  loadAllData()
})
</script>
