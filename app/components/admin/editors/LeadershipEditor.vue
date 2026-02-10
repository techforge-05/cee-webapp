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

    <!-- Board of Directors Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="openBoard = !openBoard"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.leadership.board') }}</h3>
          <UIcon
            :name="openBoard ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openBoard" class="space-y-6">
        <!-- Board group photo -->
        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-3">{{ $t('admin.editors.leadership.boardPhoto') }}</h4>
          <ImageManager
            v-model="boardPhoto"
            folder="cee-assets/about/leadership"
          />
        </div>

        <!-- Board members -->
        <DataListManager
          v-model="boardMembers"
          :max-items="12"
          :min-items="1"
          :item-label="$t('admin.editors.leadership.boardMember')"
          @add="addBoardMember"
        >
          <template #default="{ item, index }">
            <div class="space-y-3">
              <BilingualTextField
                :model-value="{ es: item.content_es?.name || '', en: item.content_en?.name || '' }"
                :label="$t('admin.editors.leadership.name')"
                :max-length="100"
                @update:model-value="updateBoardField(index, 'name', $event)"
              />
              <BilingualTextField
                :model-value="{ es: item.content_es?.position || '', en: item.content_en?.position || '' }"
                :label="$t('admin.editors.leadership.position')"
                :max-length="100"
                @update:model-value="updateBoardField(index, 'position', $event)"
              />
            </div>
          </template>
        </DataListManager>
      </div>
    </UCard>

    <!-- Directors Section -->
    <UCard>
      <template #header>
        <button
          class="flex items-center justify-between w-full text-left"
          @click="openDirectors = !openDirectors"
        >
          <h3 class="text-lg font-semibold">{{ $t('admin.editors.leadership.directors') }}</h3>
          <UIcon
            :name="openDirectors ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
            class="w-5 h-5 text-gray-400"
          />
        </button>
      </template>

      <div v-show="openDirectors" class="space-y-4">
        <DataListManager
          v-model="directors"
          :max-items="5"
          :min-items="1"
          :item-label="$t('admin.editors.leadership.director')"
          @add="addDirector"
        >
          <template #default="{ item, index }">
            <div class="space-y-4">
              <!-- Photo -->
              <ImageUploader
                :model-value="item.metadata?.photoUrl || ''"
                folder="cee-assets/directors"
                @update:model-value="updateDirectorMeta(index, 'photoUrl', $event)"
              />

              <!-- Name (same in both languages usually) -->
              <BilingualTextField
                :model-value="{ es: item.content_es?.name || '', en: item.content_en?.name || '' }"
                :label="$t('admin.editors.leadership.name')"
                :max-length="100"
                @update:model-value="updateDirectorField(index, 'name', $event)"
              />

              <!-- Title / Grade Range -->
              <BilingualTextField
                :model-value="{ es: item.content_es?.title || '', en: item.content_en?.title || '' }"
                :label="$t('admin.editors.leadership.directorTitle')"
                :max-length="100"
                @update:model-value="updateDirectorField(index, 'title', $event)"
              />

              <!-- Email -->
              <UFormField :label="$t('admin.editors.leadership.email')">
                <UInput
                  :model-value="item.metadata?.email || ''"
                  type="email"
                  @update:model-value="updateDirectorMeta(index, 'email', $event)"
                />
              </UFormField>
            </div>
          </template>
        </DataListManager>
      </div>
    </UCard>

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
import type { ImageData } from '../ImageManager.vue'
import type { PageContentItem } from '~/composables/usePageContent'

defineProps<{
  sectionKey: string
  pageSlug: string
}>()

const { loadItems, saveAll, saveItem, items } = usePageContent()
const toast = useToast()
const { t } = useI18n()

const saving = ref(false)
const openBoard = ref(true)
const openDirectors = ref(false)

const boardPhoto = ref<ImageData>({ url: '', alt_es: '', alt_en: '' })
const boardMembers = ref<PageContentItem[]>([])
const directors = ref<PageContentItem[]>([])

// Track original board photo item for updates
let boardPhotoItem: PageContentItem | null = null

function addBoardMember() {
  boardMembers.value = [
    ...boardMembers.value,
    {
      page_key: 'about.leadership.board',
      content_es: { name: '', position: '' },
      content_en: { name: '', position: '' },
      sort_order: boardMembers.value.length,
      is_active: true,
    },
  ]
}

function addDirector() {
  directors.value = [
    ...directors.value,
    {
      page_key: 'about.leadership.directors',
      content_es: { name: '', title: '' },
      content_en: { name: '', title: '' },
      sort_order: directors.value.length,
      is_active: true,
      metadata: { photoUrl: '', email: '' },
    },
  ]
}

function updateBoardField(index: number, field: string, val: BilingualText) {
  const arr = [...boardMembers.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  boardMembers.value = arr
}

function updateDirectorField(index: number, field: string, val: BilingualText) {
  const arr = [...directors.value]
  arr[index] = {
    ...arr[index],
    content_es: { ...arr[index].content_es, [field]: val.es },
    content_en: { ...arr[index].content_en, [field]: val.en },
  }
  directors.value = arr
}

function updateDirectorMeta(index: number, field: string, val: string) {
  const arr = [...directors.value]
  arr[index] = {
    ...arr[index],
    metadata: { ...arr[index].metadata, [field]: val },
  }
  directors.value = arr
}

async function handleSave() {
  saving.value = true
  try {
    // Save board photo as a single page_content item
    const photoData: PageContentItem = {
      ...(boardPhotoItem || { page_key: 'about.leadership.boardPhoto', sort_order: 0, is_active: true }),
      page_key: 'about.leadership.boardPhoto',
      content_es: { url: boardPhoto.value.url, alt: boardPhoto.value.alt_es },
      content_en: { url: boardPhoto.value.url, alt: boardPhoto.value.alt_en },
      sort_order: 0,
      is_active: true,
    }
    const savedPhoto = await saveItem(photoData)
    boardPhotoItem = savedPhoto

    // Save board members
    await saveAll('about.leadership.board', boardMembers.value)

    // Save directors
    await saveAll('about.leadership.directors', directors.value)

    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    // Load board photo
    await loadItems('about.leadership.boardPhoto')
    if (items.value.length > 0) {
      boardPhotoItem = items.value[0]
      boardPhoto.value = {
        url: boardPhotoItem.content_es?.url || '',
        alt_es: boardPhotoItem.content_es?.alt || '',
        alt_en: boardPhotoItem.content_en?.alt || '',
      }
    }

    // Load board members
    await loadItems('about.leadership.board')
    boardMembers.value = items.value.map(i => ({ ...i }))

    // Load directors
    await loadItems('about.leadership.directors')
    directors.value = items.value.map(i => ({ ...i }))
  } catch (e: any) {
    toast.add({ title: t('admin.editors.loadError'), description: e.message, color: 'error' })
  }
})
</script>
