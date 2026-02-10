<template>
  <div class="space-y-6">
    <!-- Save bar -->
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-check"
        :loading="saving"
        @click="handleSave"
      >
        {{ $t('admin.editors.save') }}
      </UButton>
    </div>

    <!-- Category filter -->
    <div class="flex flex-wrap gap-2">
      <UButton
        v-for="cat in categoryOptions"
        :key="cat.value"
        :variant="filterCategory === cat.value ? 'solid' : 'outline'"
        size="sm"
        @click="filterCategory = cat.value"
      >
        {{ cat.label }}
      </UButton>
    </div>

    <!-- FAQ items -->
    <DataListManager
      v-model="filteredItems"
      :max-items="40"
      :min-items="1"
      :item-label="$t('admin.editors.faq.question')"
      @add="addFaqItem"
    >
      <template #default="{ item, index }">
        <div class="space-y-4">
          <!-- Category -->
          <UFormField :label="$t('admin.editors.faq.category')">
            <USelect
              :model-value="item.metadata?.category || 'general'"
              :items="categorySelectOptions"
              @update:model-value="updateCategory(index, $event)"
            />
          </UFormField>

          <!-- Question -->
          <BilingualTextField
            :model-value="{ es: item.content_es?.question || '', en: item.content_en?.question || '' }"
            :label="$t('admin.editors.faq.question')"
            :max-length="200"
            @update:model-value="updateField(index, 'question', $event)"
          />

          <!-- Answer -->
          <BilingualTextarea
            :model-value="{ es: item.content_es?.answer || '', en: item.content_en?.answer || '' }"
            :label="$t('admin.editors.faq.answer')"
            :rows="3"
            :max-length="1000"
            @update:model-value="updateField(index, 'answer', $event)"
          />

          <!-- Optional link -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField :label="$t('admin.editors.faq.linkText')">
              <div class="grid grid-cols-2 gap-2">
                <UInput
                  :model-value="item.content_es?.linkText || ''"
                  placeholder="ES"
                  @update:model-value="updateLinkField(index, 'linkText', 'es', $event)"
                />
                <UInput
                  :model-value="item.content_en?.linkText || ''"
                  placeholder="EN"
                  @update:model-value="updateLinkField(index, 'linkText', 'en', $event)"
                />
              </div>
            </UFormField>
            <UFormField :label="$t('admin.editors.faq.linkPath')">
              <UInput
                :model-value="item.metadata?.linkPath || ''"
                placeholder="/contact/form"
                @update:model-value="updateMetaField(index, 'linkPath', $event)"
              />
            </UFormField>
          </div>
        </div>
      </template>
    </DataListManager>

    <!-- Bottom save bar -->
    <div class="flex justify-end">
      <UButton
        icon="i-heroicons-check"
        :loading="saving"
        @click="handleSave"
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

const { loadItems, saveAll, items } = usePageContent()
const toast = useToast()
const { t } = useI18n()

const saving = ref(false)
const filterCategory = ref('all')
const allItems = ref<PageContentItem[]>([])

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'academics', label: 'Academics' },
  { value: 'financialAid', label: 'Financial Aid' },
  { value: 'general', label: 'General' },
]

const categorySelectOptions = [
  { value: 'admissions', label: 'Admissions' },
  { value: 'academics', label: 'Academics' },
  { value: 'financialAid', label: 'Financial Aid' },
  { value: 'general', label: 'General' },
]

// Filtered view of items
const filteredItems = computed({
  get: () => {
    if (filterCategory.value === 'all') return allItems.value
    return allItems.value.filter(i => (i.metadata?.category || 'general') === filterCategory.value)
  },
  set: (val) => {
    if (filterCategory.value === 'all') {
      allItems.value = val
    } else {
      // Replace filtered items in the main array
      const otherItems = allItems.value.filter(i => (i.metadata?.category || 'general') !== filterCategory.value)
      allItems.value = [...otherItems, ...val]
    }
  },
})

function addFaqItem() {
  allItems.value = [
    ...allItems.value,
    {
      page_key: 'contact.faq',
      content_es: { question: '', answer: '', linkText: '' },
      content_en: { question: '', answer: '', linkText: '' },
      sort_order: allItems.value.length,
      is_active: true,
      metadata: { category: filterCategory.value === 'all' ? 'general' : filterCategory.value, linkPath: '' },
    },
  ]
}

function updateField(index: number, field: string, val: BilingualText) {
  const items = filterCategory.value === 'all' ? allItems.value : filteredItems.value
  const item = items[index]
  if (!item) return

  const realIndex = filterCategory.value === 'all' ? index : allItems.value.indexOf(item)
  const arr = [...allItems.value]
  arr[realIndex] = {
    ...arr[realIndex],
    content_es: { ...arr[realIndex].content_es, [field]: val.es },
    content_en: { ...arr[realIndex].content_en, [field]: val.en },
  }
  allItems.value = arr
}

function updateCategory(index: number, val: string) {
  const items = filterCategory.value === 'all' ? allItems.value : filteredItems.value
  const item = items[index]
  if (!item) return

  const realIndex = filterCategory.value === 'all' ? index : allItems.value.indexOf(item)
  const arr = [...allItems.value]
  arr[realIndex] = {
    ...arr[realIndex],
    metadata: { ...arr[realIndex].metadata, category: val },
  }
  allItems.value = arr
}

function updateLinkField(index: number, field: string, lang: 'es' | 'en', val: string) {
  const items = filterCategory.value === 'all' ? allItems.value : filteredItems.value
  const item = items[index]
  if (!item) return

  const realIndex = filterCategory.value === 'all' ? index : allItems.value.indexOf(item)
  const arr = [...allItems.value]
  const key = lang === 'es' ? 'content_es' : 'content_en'
  arr[realIndex] = {
    ...arr[realIndex],
    [key]: { ...arr[realIndex][key], [field]: val },
  }
  allItems.value = arr
}

function updateMetaField(index: number, field: string, val: string) {
  const items = filterCategory.value === 'all' ? allItems.value : filteredItems.value
  const item = items[index]
  if (!item) return

  const realIndex = filterCategory.value === 'all' ? index : allItems.value.indexOf(item)
  const arr = [...allItems.value]
  arr[realIndex] = {
    ...arr[realIndex],
    metadata: { ...arr[realIndex].metadata, [field]: val },
  }
  allItems.value = arr
}

async function handleSave() {
  saving.value = true
  try {
    await saveAll('contact.faq', allItems.value)
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    await loadItems('contact.faq')
    allItems.value = items.value.map(i => ({ ...i }))
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
})
</script>
