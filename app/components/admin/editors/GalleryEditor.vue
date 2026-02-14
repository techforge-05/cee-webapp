<template>
  <div class="space-y-6 pb-24">
    <!-- Gallery Section -->
    <SectionCard
      v-model="openGallery"
      :title="$t('admin.editors.gallery.title')"
      :page-key="''"
    >
      <div class="space-y-6">
        <!-- Filters + Add -->
        <div class="flex flex-wrap items-center gap-4">
          <UFormField :label="$t('admin.editors.gallery.year')">
            <USelect
              v-model="filterYear"
              :items="yearOptions"
            />
          </UFormField>
          <UFormField :label="$t('admin.editors.gallery.category')">
            <USelect
              v-model="filterCategory"
              :items="categoryOptions"
            />
          </UFormField>
          <div class="ml-auto">
            <UButton
              icon="i-heroicons-plus"
              @click="openAddModal"
            >
              {{ $t('admin.editors.gallery.addPhoto') }}
            </UButton>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        </div>

        <!-- Empty state -->
        <div
          v-else-if="photos.length === 0"
          class="text-center py-12 border border-gray-200 rounded-lg"
        >
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">{{ $t('admin.editors.gallery.noPhotos') }}</p>
        </div>

        <!-- Photo grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="relative group rounded-lg overflow-hidden border border-gray-200"
          >
            <img
              v-if="photo.url"
              :src="photo.url"
              :alt="photo.alt_text_es || photo.title_es"
              class="w-full h-40 object-cover"
            />
            <div
              v-else
              class="w-full h-40 bg-gray-100 flex items-center justify-center"
            >
              <UIcon name="i-heroicons-photo" class="w-8 h-8 text-gray-300" />
            </div>

            <!-- Overlay actions -->
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <UButton
                icon="i-heroicons-pencil"
                size="sm"
                variant="solid"
                color="neutral"
                @click="editPhoto(photo)"
              />
              <UButton
                icon="i-heroicons-trash"
                size="sm"
                variant="solid"
                color="error"
                @click="confirmDelete(photo)"
              />
            </div>

            <!-- Info -->
            <div class="p-2">
              <p class="text-sm font-medium text-gray-900 truncate">{{ photo.title_es }}</p>
              <div class="flex items-center gap-2 mt-1">
                <UBadge size="xs" variant="subtle">{{ photo.year }}</UBadge>
                <UBadge size="xs" variant="subtle" :color="getCategoryColor(photo.category)">{{ photo.category }}</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">
            {{ editingPhoto?.id ? $t('admin.editors.gallery.editPhoto') : $t('admin.editors.gallery.addPhoto') }}
          </h3>

          <!-- Image upload -->
          <ImageUploader
            v-model="editForm.url"
            folder="cee-assets/gallery"
          />

          <!-- Title -->
          <BilingualTextField
            v-model="editFormTitle"
            :label="$t('admin.editors.gallery.photoTitle')"
            :max-length="100"
          />

          <!-- Alt text -->
          <BilingualTextField
            v-model="editFormAlt"
            :label="$t('admin.components.image.altText')"
            :max-length="150"
          />

          <!-- Year -->
          <UFormField :label="$t('admin.editors.gallery.year')">
            <UInput
              v-model.number="editForm.year"
              type="number"
              :min="2000"
              :max="2100"
            />
          </UFormField>

          <!-- Category -->
          <UFormField :label="$t('admin.editors.gallery.category')">
            <USelect
              v-model="editForm.category"
              :items="categoriesOnly"
            />
          </UFormField>

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" @click="showModal = false">
              {{ $t('admin.components.confirm.cancel') }}
            </UButton>
            <UButton :loading="savingPhoto" @click="handleSavePhoto">
              {{ $t('admin.editors.save') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="$t('admin.editors.gallery.deleteTitle')"
      :message="$t('admin.editors.gallery.deleteMessage')"
      confirm-color="error"
      :loading="deleting"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from '../BilingualTextField.vue'
import type { GalleryPhoto } from '~/composables/useGallery'

defineProps<{
  sectionKey: string
  pageSlug: string
}>()

const { photos, loading, loadPhotos, savePhoto, deletePhoto } = useGallery()
const toast = useToast()
const { t } = useI18n()

const openGallery = ref(false)
const filterYear = ref('all')
const filterCategory = ref('all')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const savingPhoto = ref(false)
const deleting = ref(false)
const editingPhoto = ref<GalleryPhoto | null>(null)
const deletingPhoto = ref<GalleryPhoto | null>(null)

const currentYear = new Date().getFullYear()
const yearOptions = computed(() => {
  const years = [{ value: 'all', label: t('admin.editors.gallery.allYears') }]
  for (let y = currentYear; y >= 2020; y--) {
    years.push({ value: String(y), label: String(y) })
  }
  return years
})

const categoriesOnly = [
  { value: 'events', label: 'Events' },
  { value: 'sports', label: 'Sports' },
  { value: 'academics', label: 'Academics' },
  { value: 'arts', label: 'Arts' },
  { value: 'community', label: 'Community' },
  { value: 'celebrations', label: 'Celebrations' },
]

const categoryOptions = computed(() => [
  { value: 'all', label: t('admin.editors.gallery.allCategories') },
  ...categoriesOnly,
])

const editForm = reactive({
  url: '',
  title_es: '',
  title_en: '',
  alt_es: '',
  alt_en: '',
  year: currentYear,
  category: 'events',
})

const editFormTitle = computed<BilingualText>({
  get: () => ({ es: editForm.title_es, en: editForm.title_en }),
  set: (val) => { editForm.title_es = val.es; editForm.title_en = val.en },
})

const editFormAlt = computed<BilingualText>({
  get: () => ({ es: editForm.alt_es, en: editForm.alt_en }),
  set: (val) => { editForm.alt_es = val.es; editForm.alt_en = val.en },
})

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    events: 'primary',
    sports: 'success',
    academics: 'info',
    arts: 'warning',
    community: 'error',
    celebrations: 'secondary',
  }
  return colors[category] || 'neutral'
}

function openAddModal() {
  editingPhoto.value = null
  editForm.url = ''
  editForm.title_es = ''
  editForm.title_en = ''
  editForm.alt_es = ''
  editForm.alt_en = ''
  editForm.year = currentYear
  editForm.category = 'events'
  showModal.value = true
}

function editPhoto(photo: GalleryPhoto) {
  editingPhoto.value = photo
  editForm.url = photo.url
  editForm.title_es = photo.title_es
  editForm.title_en = photo.title_en
  editForm.alt_es = photo.alt_text_es || ''
  editForm.alt_en = photo.alt_text_en || ''
  editForm.year = photo.year
  editForm.category = photo.category
  showModal.value = true
}

function confirmDelete(photo: GalleryPhoto) {
  deletingPhoto.value = photo
  showDeleteConfirm.value = true
}

async function handleSavePhoto() {
  if (!editForm.url) {
    toast.add({ title: t('admin.editors.gallery.uploadFirst'), color: 'warning' })
    return
  }

  savingPhoto.value = true
  try {
    const photo: GalleryPhoto = {
      ...(editingPhoto.value?.id ? { id: editingPhoto.value.id } : {}),
      title_es: editForm.title_es,
      title_en: editForm.title_en,
      year: editForm.year,
      category: editForm.category,
      url: editForm.url,
      alt_text_es: editForm.alt_es,
      alt_text_en: editForm.alt_en,
      sort_order: editingPhoto.value?.sort_order ?? photos.value.length,
    }

    await savePhoto(photo)
    showModal.value = false
    await refreshPhotos()
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    savingPhoto.value = false
  }
}

async function handleDelete() {
  if (!deletingPhoto.value?.id) return
  deleting.value = true
  try {
    await deletePhoto(deletingPhoto.value.id)
    showDeleteConfirm.value = false
    toast.add({ title: t('admin.editors.deleteSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.deleteError'), description: e.message, color: 'error' })
  } finally {
    deleting.value = false
  }
}

async function refreshPhotos() {
  const year = filterYear.value !== 'all' ? Number(filterYear.value) : undefined
  const category = filterCategory.value !== 'all' ? filterCategory.value : undefined
  await loadPhotos(year, category)
}

watch([filterYear, filterCategory], () => {
  refreshPhotos()
})

onMounted(() => {
  refreshPhotos()
})
</script>
