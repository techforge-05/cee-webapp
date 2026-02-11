<template>
  <div class="space-y-6">
    <!-- Save bar -->
    <div class="flex justify-end">
      <UButton icon="i-heroicons-check" :loading="saving" @click="handleSave">
        {{ $t('admin.editors.save') }}
      </UButton>
    </div>

    <!-- Sections -->
    <UCard v-for="section in schema" :key="section.pageKey">
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="toggleSection(section.pageKey)"
        >
          <h3 class="text-lg font-semibold">{{ $t(section.labelKey) }}</h3>
          <UIcon
            :name="openSections[section.pageKey] ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openSections[section.pageKey]" class="space-y-4">
        <!-- Single item section -->
        <template v-if="section.type === 'single'">
          <template v-for="field in section.fields" :key="field.key">
            <BilingualTextField
              v-if="field.type === 'text' && singleData[section.pageKey]"
              v-model="singleData[section.pageKey][field.key]"
              :label="$t(field.labelKey)"
              :max-length="field.maxLength"
            />
            <BilingualTextarea
              v-if="field.type === 'textarea' && singleData[section.pageKey]"
              v-model="singleData[section.pageKey][field.key]"
              :label="$t(field.labelKey)"
              :max-length="field.maxLength"
              :rows="field.rows || 3"
            />
            <UFormField
              v-if="field.type === 'metadata' && metaData[section.pageKey]"
              :label="$t(field.labelKey)"
            >
              <UInput
                v-model="metaData[section.pageKey][field.key]"
                :maxlength="field.maxLength"
              />
            </UFormField>
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
          >
            <template #default="{ item, index }">
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
                  <UFormField v-if="field.type === 'metadata'" :label="$t(field.labelKey)">
                    <UInput
                      :model-value="item.metadata?.[field.key] || ''"
                      :maxlength="field.maxLength"
                      @update:model-value="updateListMetadataField(section.pageKey, index, field.key, $event as string)"
                    />
                  </UFormField>
                </template>
              </div>
            </template>
          </DataListManager>
        </template>
      </div>
    </UCard>

    <!-- Bottom save bar -->
    <div class="flex justify-end">
      <UButton icon="i-heroicons-check" :loading="saving" @click="handleSave">
        {{ $t('admin.editors.save') }}
      </UButton>
    </div>
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

const saving = ref(false)
const loaded = ref(false)

const openSections = reactive<Record<string, boolean>>({})
const singleData = reactive<Record<string, Record<string, BilingualText>>>({})
const metaData = reactive<Record<string, Record<string, string>>>({})
const listData = reactive<Record<string, PageContentItem[]>>({})
const existingIds = reactive<Record<string, string | undefined>>({})

function toggleSection(key: string) {
  openSections[key] = !openSections[key]
}

function initSections() {
  props.schema.forEach((section, idx) => {
    openSections[section.pageKey] = section.defaultOpen ?? idx === 0
    if (section.type === 'single') {
      singleData[section.pageKey] = {}
      metaData[section.pageKey] = {}
      section.fields.forEach((field) => {
        if (field.type === 'text' || field.type === 'textarea') {
          singleData[section.pageKey][field.key] = { es: '', en: '' }
        } else if (field.type === 'metadata') {
          metaData[section.pageKey][field.key] = ''
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
          if (field.type === 'text' || field.type === 'textarea') {
            singleData[section.pageKey][field.key] = {
              es: item?.content_es?.[field.key] || '',
              en: item?.content_en?.[field.key] || '',
            }
          } else if (field.type === 'metadata') {
            metaData[section.pageKey][field.key] = item?.metadata?.[field.key] || ''
          }
        })
      } else {
        listData[section.pageKey] =
          items.value.length > 0 ? items.value.map((i) => ({ ...i })) : []
      }
    }
    loaded.value = true
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
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
}

function updateListMetadataField(
  pageKey: string,
  index: number,
  fieldKey: string,
  val: string,
) {
  const arr = [...listData[pageKey]]
  arr[index] = {
    ...arr[index],
    metadata: { ...(arr[index].metadata || {}), [fieldKey]: val },
  }
  listData[pageKey] = arr
}

function addListItem(section: EditorSection) {
  const contentEs: Record<string, any> = {}
  const contentEn: Record<string, any> = {}
  const metadata: Record<string, any> = {}

  section.fields.forEach((field) => {
    if (field.type === 'text' || field.type === 'textarea') {
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
          if (field.type === 'text' || field.type === 'textarea') {
            contentEs[field.key] = singleData[section.pageKey][field.key].es
            contentEn[field.key] = singleData[section.pageKey][field.key].en
          } else if (field.type === 'metadata') {
            metadata[field.key] = metaData[section.pageKey][field.key]
          }
        })

        const existingId = existingIds[section.pageKey]
        await saveAllContent(section.pageKey, [
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
      } else {
        await saveAllContent(section.pageKey, listData[section.pageKey])
      }
    }
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

initSections()
onMounted(() => {
  loadAllData()
})
</script>
