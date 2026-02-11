<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('admin.editors.announcements.title') }}</h1>
        <p class="text-gray-500">{{ $t('admin.editors.announcements.subtitle') }}</p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        @click="openAddModal"
      >
        {{ $t('admin.editors.announcements.addAnnouncement') }}
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="announcements.length === 0"
      class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <UIcon name="i-heroicons-megaphone" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">{{ $t('admin.editors.announcements.noAnnouncements') }}</p>
    </div>

    <!-- Announcements list -->
    <div v-else class="space-y-3">
      <UCard v-for="ann in announcements" :key="ann.id">
        <div class="flex items-start justify-between gap-4">
          <div class="flex gap-4 flex-1 min-w-0">
            <!-- Thumbnail -->
            <img
              v-if="ann.image_url"
              :src="ann.image_url"
              :alt="ann.image_alt_es || ann.title_es"
              class="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <UBadge
                  :color="ann.is_active ? 'success' : 'neutral'"
                  size="sm"
                  variant="subtle"
                >
                  {{ ann.is_active ? $t('admin.editors.announcements.active') : $t('admin.editors.announcements.inactive') }}
                </UBadge>
                <span class="text-sm text-gray-500">{{ formatDate(ann.display_date) }}</span>
              </div>
              <h3 class="font-semibold text-gray-900 truncate">{{ ann.title_es }}</h3>
              <p v-if="ann.title_en" class="text-sm text-gray-500 truncate">{{ ann.title_en }}</p>
            </div>
          </div>
          <div class="flex gap-1 shrink-0">
            <UButton
              :icon="ann.is_active ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              size="xs"
              variant="ghost"
              color="neutral"
              :title="ann.is_active ? $t('admin.editors.announcements.deactivate') : $t('admin.editors.announcements.activate')"
              @click="handleToggle(ann)"
            />
            <UButton
              icon="i-heroicons-pencil"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="editAnnouncement(ann)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              variant="ghost"
              color="error"
              @click="confirmDelete(ann)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="showModal">
      <template #content>
        <div class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold">
            {{ editingAnn?.id ? $t('admin.editors.announcements.editAnnouncement') : $t('admin.editors.announcements.addAnnouncement') }}
          </h3>

          <!-- Title -->
          <BilingualTextField
            v-model="editFormTitle"
            :label="$t('admin.editors.announcements.announcementTitle')"
            :max-length="100"
            required
          />

          <!-- Description -->
          <BilingualTextarea
            v-model="editFormDescription"
            :label="$t('admin.editors.announcements.description')"
            :rows="3"
            :max-length="500"
          />

          <!-- Display date -->
          <UFormField :label="$t('admin.editors.announcements.displayDate')" required>
            <UInput v-model="editForm.display_date" type="date" />
          </UFormField>

          <!-- Image -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.editors.announcements.image') }}</h4>
            <ImageManager
              v-model="editFormImage"
              folder="cee-assets/announcements"
            />
          </div>

          <!-- Link to event -->
          <UFormField :label="$t('admin.editors.announcements.linkedEvent')">
            <USelect
              v-model="editForm.event_id"
              :items="eventOptions"
            />
          </UFormField>

          <!-- Active -->
          <UCheckbox v-model="editForm.is_active" :label="$t('admin.editors.announcements.isActive')" />

          <!-- Actions -->
          <div class="flex justify-end gap-2 pt-2">
            <UButton variant="ghost" @click="showModal = false">
              {{ $t('admin.components.confirm.cancel') }}
            </UButton>
            <UButton :loading="savingAnn" @click="handleSave">
              {{ $t('admin.editors.save') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="$t('admin.editors.announcements.deleteTitle')"
      :message="$t('admin.editors.announcements.deleteMessage')"
      confirm-color="error"
      :loading="deletingAnn"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from '~/components/admin/BilingualTextField.vue'
import type { ImageData } from '~/components/admin/ImageManager.vue'
import type { Announcement } from '~/composables/useAnnouncements'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { announcements, loading, loadAnnouncements, saveAnnouncement, deleteAnnouncement, toggleActive } = useAnnouncements()
const { events: calendarEvents, loadEvents } = useCalendarAdmin()
const toast = useToast()
const { t } = useI18n()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const savingAnn = ref(false)
const deletingAnn = ref(false)
const editingAnn = ref<Announcement | null>(null)
const deletingAnnRef = ref<Announcement | null>(null)

const editForm = reactive({
  title_es: '',
  title_en: '',
  description_es: '',
  description_en: '',
  display_date: '',
  image_url: '',
  image_alt_es: '',
  image_alt_en: '',
  event_id: 'none',
  is_active: true,
})

const editFormTitle = computed<BilingualText>({
  get: () => ({ es: editForm.title_es, en: editForm.title_en }),
  set: (val) => { editForm.title_es = val.es; editForm.title_en = val.en },
})

const editFormDescription = computed<BilingualText>({
  get: () => ({ es: editForm.description_es, en: editForm.description_en }),
  set: (val) => { editForm.description_es = val.es; editForm.description_en = val.en },
})

const editFormImage = computed<ImageData>({
  get: () => ({
    url: editForm.image_url,
    alt_es: editForm.image_alt_es,
    alt_en: editForm.image_alt_en,
  }),
  set: (val) => {
    editForm.image_url = val.url
    editForm.image_alt_es = val.alt_es
    editForm.image_alt_en = val.alt_en
  },
})

const eventOptions = computed(() => {
  const opts = [{ value: 'none', label: t('admin.editors.announcements.noLinkedEvent') }]
  for (const event of calendarEvents.value) {
    if (event.id) {
      opts.push({ value: event.id, label: `${event.title_es} (${event.start_date})` })
    }
  }
  return opts
})

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function openAddModal() {
  editingAnn.value = null
  Object.assign(editForm, {
    title_es: '', title_en: '',
    description_es: '', description_en: '',
    display_date: new Date().toISOString().split('T')[0],
    image_url: '', image_alt_es: '', image_alt_en: '',
    event_id: 'none',
    is_active: true,
  })
  showModal.value = true
}

function editAnnouncement(ann: Announcement) {
  editingAnn.value = ann
  Object.assign(editForm, {
    title_es: ann.title_es,
    title_en: ann.title_en,
    description_es: ann.description_es || '',
    description_en: ann.description_en || '',
    display_date: ann.display_date,
    image_url: ann.image_url || '',
    image_alt_es: ann.image_alt_es || '',
    image_alt_en: ann.image_alt_en || '',
    event_id: ann.event_id || 'none',
    is_active: ann.is_active,
  })
  showModal.value = true
}

function confirmDelete(ann: Announcement) {
  deletingAnnRef.value = ann
  showDeleteConfirm.value = true
}

async function handleToggle(ann: Announcement) {
  try {
    await toggleActive(ann.id!)
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  }
}

async function handleSave() {
  if (!editForm.display_date || !editForm.title_es) {
    toast.add({ title: t('admin.editors.announcements.requiredFields'), color: 'warning' })
    return
  }

  savingAnn.value = true
  try {
    const annData: Announcement = {
      ...(editingAnn.value?.id ? { id: editingAnn.value.id } : {}),
      title_es: editForm.title_es,
      title_en: editForm.title_en,
      description_es: editForm.description_es,
      description_en: editForm.description_en,
      display_date: editForm.display_date,
      image_url: editForm.image_url || undefined,
      image_alt_es: editForm.image_alt_es || undefined,
      image_alt_en: editForm.image_alt_en || undefined,
      event_id: editForm.event_id !== 'none' ? editForm.event_id : undefined,
      is_active: editForm.is_active,
    }

    await saveAnnouncement(annData)
    showModal.value = false
    await loadAnnouncements()
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    savingAnn.value = false
  }
}

async function handleDelete() {
  if (!deletingAnnRef.value?.id) return
  deletingAnn.value = true
  try {
    await deleteAnnouncement(deletingAnnRef.value.id)
    showDeleteConfirm.value = false
    toast.add({ title: t('admin.editors.deleteSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.deleteError'), description: e.message, color: 'error' })
  } finally {
    deletingAnn.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    loadAnnouncements(),
    loadEvents(),
  ])
})

useHead({
  title: `${t('admin.editors.announcements.title')} - Admin - CEE`,
})
</script>
