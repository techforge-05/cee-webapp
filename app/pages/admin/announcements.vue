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
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <UBadge
                  :color="ann.is_active && !isExpired(ann.expires_at) ? 'success' : 'neutral'"
                  size="sm"
                  variant="subtle"
                >
                  {{ ann.is_active && !isExpired(ann.expires_at) ? $t('admin.editors.announcements.active') : $t('admin.editors.announcements.inactive') }}
                </UBadge>
                <span class="text-sm text-gray-500">{{ formatDate(ann.display_date) }}</span>
                <UBadge
                  v-if="ann.expires_at && isExpired(ann.expires_at)"
                  size="sm"
                  color="error"
                  variant="subtle"
                  icon="i-heroicons-clock"
                >
                  {{ $t('admin.editors.announcements.expired') }}
                </UBadge>
                <UBadge
                  v-else-if="ann.expires_at"
                  size="sm"
                  color="warning"
                  variant="subtle"
                  icon="i-heroicons-clock"
                >
                  {{ $t('admin.editors.announcements.expiresAt') }}: {{ formatDate(ann.expires_at) }}
                </UBadge>
                <UBadge
                  v-if="ann.event_id"
                  size="sm"
                  color="info"
                  variant="subtle"
                  icon="i-heroicons-link"
                >
                  {{ getLinkedEventLabel(ann.event_id) }}
                </UBadge>
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
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ editingAnn?.id ? $t('admin.editors.announcements.editAnnouncement') : $t('admin.editors.announcements.addAnnouncement') }}
        </h3>
      </template>

      <template #body>
        <div class="space-y-4">
          <BilingualTextField
            v-model="editFormTitle"
            :label="$t('admin.editors.announcements.announcementTitle')"
            :max-length="100"
            required
            stacked
          />

          <BilingualTextarea
            v-model="editFormDescription"
            :label="$t('admin.editors.announcements.description')"
            :rows="3"
            :max-length="500"
          />

          <UFormField
            :label="$t('admin.editors.announcements.linkedEventOptional')"
            :help="$t('admin.editors.announcements.linkedEventHint')"
            class="w-full"
          >
            <div class="w-full">
              <USelect
                v-model="editForm.event_id"
                :items="eventOptions"
                class="w-full"
              />
            </div>
          </UFormField>

          <UFormField :label="$t('admin.editors.announcements.displayDate')" required>
            <UInput v-model="editForm.display_date" type="date" />
          </UFormField>

          <UFormField
            :label="$t('admin.editors.announcements.expiresAt')"
            :help="$t('admin.editors.announcements.expiresAtHint')"
            required
          >
            <UInput v-model="editForm.expires_at" type="date" />
          </UFormField>

          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.editors.announcements.image') }}</h4>
            <ImageUploader
              v-model="editForm.image_url"
              folder="cee-assets/announcements"
            />
          </div>

          <UCheckbox
            v-model="editForm.is_featured"
            :label="$t('admin.editors.announcements.isFeatured')"
            :help="$t('admin.editors.announcements.isFeaturedHint')"
          />
          <UCheckbox v-model="editForm.is_active" :label="$t('admin.editors.announcements.isActive')" />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showModal = false">
            {{ $t('admin.components.confirm.cancel') }}
          </UButton>
          <UButton :loading="savingAnn" @click="handleSave">
            {{ $t('admin.editors.save') }}
          </UButton>
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
import type { Announcement } from '~/composables/useAnnouncements'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { announcements, loading, loadAnnouncements, saveAnnouncement, deleteAnnouncement, toggleActive } = useAnnouncements()
const { events: calendarEvents, loadEvents } = useCalendarAdmin()
const toast = useToast()
const { t } = useI18n()
const { deleteImage } = useImageUpload()

const showModal = ref(false)
const showDeleteConfirm = ref(false)
const savingAnn = ref(false)
const deletingAnn = ref(false)
const editingAnn = ref<Announcement | null>(null)
const deletingAnnRef = ref<Announcement | null>(null)
const _originalImageUrl = ref('')

watch(showModal, (open) => {
  if (!open && editForm.image_url && editForm.image_url !== _originalImageUrl.value) {
    deleteImage(editForm.image_url)
  }
})

const editForm = reactive({
  title_es: '',
  title_en: '',
  description_es: '',
  description_en: '',
  display_date: '',
  expires_at: '',
  image_url: '',
  image_alt_es: '',
  image_alt_en: '',
  event_id: 'none',
  is_featured: false,
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


const eventOptions = computed(() => {
  const opts = [{ value: 'none', label: t('admin.editors.announcements.noLinkedEvent') }]
  for (const event of calendarEvents.value) {
    if (event.id) {
      opts.push({ value: event.id, label: `${event.title_es} (${event.start_date})` })
    }
  }
  return opts
})

function getLinkedEventLabel(eventId: string) {
  const event = calendarEvents.value.find(e => e.id === eventId)
  return event ? event.title_es : t('admin.editors.announcements.linkedEventBadge')
}

function isExpired(expiresAt: string | undefined) {
  if (!expiresAt) return false
  const today = new Date().toISOString().split('T')[0]!
  return expiresAt < today
}

// When an event is selected, auto-fill the display date from the event's start_date
watch(() => editForm.event_id, (newId) => {
  if (newId && newId !== 'none') {
    const event = calendarEvents.value.find(e => e.id === newId)
    if (event) {
      editForm.display_date = event.start_date
    }
  }
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
  _originalImageUrl.value = ''
  Object.assign(editForm, {
    title_es: '', title_en: '',
    description_es: '', description_en: '',
    display_date: new Date().toISOString().split('T')[0],
    expires_at: '',
    image_url: '', image_alt_es: '', image_alt_en: '',
    event_id: 'none',
    is_featured: false,
    is_active: true,
  })
  showModal.value = true
}

function editAnnouncement(ann: Announcement) {
  editingAnn.value = ann
  _originalImageUrl.value = ann.image_url || ''
  Object.assign(editForm, {
    title_es: ann.title_es,
    title_en: ann.title_en,
    description_es: ann.description_es || '',
    description_en: ann.description_en || '',
    display_date: ann.display_date,
    expires_at: ann.expires_at || '',
    image_url: ann.image_url || '',
    image_alt_es: ann.image_alt_es || '',
    image_alt_en: ann.image_alt_en || '',
    event_id: ann.event_id || 'none',
    is_featured: ann.is_featured ?? false,
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
  if (!editForm.display_date || !editForm.title_es || !editForm.expires_at) {
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
      expires_at: editForm.expires_at || undefined,
      event_id: editForm.event_id !== 'none' ? editForm.event_id : undefined,
      is_featured: editForm.is_featured,
      is_active: editForm.is_active,
    }

    await saveAnnouncement(annData)
    _originalImageUrl.value = editForm.image_url
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
