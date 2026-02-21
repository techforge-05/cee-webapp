<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('admin.editors.calendar.title') }}</h1>
        <p class="text-gray-500">{{ $t('admin.editors.calendar.subtitle') }}</p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        @click="openAddModal"
      >
        {{ $t('admin.editors.calendar.addEvent') }}
      </UButton>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-4 mb-6">
      <UFormField :label="$t('admin.editors.calendar.eventType')">
        <USelect
          v-model="filterType"
          :items="typeFilterOptions"
        />
      </UFormField>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
    </div>

    <!-- Empty state -->
    <div
      v-else-if="events.length === 0"
      class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      <UIcon name="i-heroicons-calendar-days" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">{{ $t('admin.editors.calendar.noEvents') }}</p>
    </div>

    <!-- Events list -->
    <div v-else class="space-y-3">
      <UCard v-for="event in events" :key="event.id">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <UBadge :color="getTypeColor(event.event_type)" size="sm" variant="subtle">
                {{ event.event_type }}
              </UBadge>
              <span class="text-sm text-gray-500">
                {{ formatDate(event.start_date) }}
                <template v-if="event.end_date && event.end_date !== event.start_date">
                  - {{ formatDate(event.end_date) }}
                </template>
              </span>
              <span v-if="!event.all_day && event.start_time" class="text-sm text-gray-400">
                {{ event.start_time }}<template v-if="event.end_time"> - {{ event.end_time }}</template>
              </span>
            </div>
            <h3 class="font-semibold text-gray-900">{{ event.title_es }}</h3>
            <p v-if="event.title_en" class="text-sm text-gray-500">{{ event.title_en }}</p>
            <p v-if="event.location" class="text-sm text-gray-400 mt-1">
              <UIcon name="i-heroicons-map-pin" class="w-3 h-3 inline" /> {{ event.location }}
            </p>
          </div>
          <div class="flex gap-1 shrink-0">
            <UButton
              icon="i-heroicons-pencil"
              size="xs"
              variant="ghost"
              color="neutral"
              @click="editEvent(event)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              variant="ghost"
              color="error"
              @click="confirmDelete(event)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="showModal">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <h3 class="text-lg font-semibold">
            {{ editingEvent?.id ? $t('admin.editors.calendar.editEvent') : $t('admin.editors.calendar.addEvent') }}
          </h3>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="showModal = false"
          />
        </div>
      </template>

      <template #body>
        <div class="space-y-4">
          <!-- Title -->
          <BilingualTextField
            v-model="editFormTitle"
            :label="$t('admin.editors.calendar.eventTitle')"
            :max-length="100"
            required
          />

          <!-- Description -->
          <BilingualTextarea
            v-model="editFormDescription"
            :label="$t('admin.editors.calendar.eventDescription')"
            :rows="3"
            :max-length="500"
          />

          <!-- Dates -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField :label="$t('admin.editors.calendar.startDate')" required>
              <UInput v-model="editForm.start_date" type="date" />
            </UFormField>
            <UFormField :label="$t('admin.editors.calendar.endDate')">
              <UInput v-model="editForm.end_date" type="date" />
            </UFormField>
          </div>

          <!-- All day + times -->
          <div class="flex items-center gap-4">
            <UCheckbox v-model="editForm.all_day" :label="$t('admin.editors.calendar.allDay')" />
          </div>
          <div v-if="!editForm.all_day" class="grid grid-cols-2 gap-4">
            <UFormField :label="$t('admin.editors.calendar.startTime')">
              <UInput v-model="editForm.start_time" type="time" />
            </UFormField>
            <UFormField :label="$t('admin.editors.calendar.endTime')">
              <UInput v-model="editForm.end_time" type="time" />
            </UFormField>
          </div>

          <!-- Event type -->
          <UFormField :label="$t('admin.editors.calendar.eventType')">
            <USelect v-model="editForm.event_type" :items="eventTypeOptions" class="min-w-44" />
          </UFormField>

          <!-- Location -->
          <UFormField :label="$t('admin.editors.calendar.location')">
            <UInput v-model="editForm.location" :max-length="200" />
          </UFormField>

          <!-- Color -->
          <UFormField :label="$t('admin.editors.calendar.color')">
            <UPopover>
              <button
                type="button"
                class="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                <span class="w-6 h-6 rounded-full border border-gray-200" :style="{ backgroundColor: editForm.color }" />
                <span class="text-sm text-gray-600">{{ editForm.color }}</span>
              </button>
              <template #content>
                <div class="grid grid-cols-4 gap-2 p-3">
                  <button
                    v-for="c in colorOptions"
                    :key="c"
                    type="button"
                    class="w-8 h-8 rounded-full border-2 transition-all"
                    :class="editForm.color === c ? 'border-gray-900 scale-110 ring-2 ring-offset-2 ring-gray-400' : 'border-gray-200 hover:border-gray-400'"
                    :style="{ backgroundColor: c }"
                    @click="editForm.color = c"
                  />
                </div>
              </template>
            </UPopover>
          </UFormField>

          <!-- Image -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">{{ $t('admin.editors.calendar.eventImage') }}</h4>
            <ImageUploader
              v-model="editForm.image_url"
              folder="cee-assets/events"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton variant="ghost" @click="showModal = false">
            {{ $t('admin.components.confirm.cancel') }}
          </UButton>
          <UButton :loading="savingEvent" @click="handleSave">
            {{ $t('admin.editors.save') }}
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirm -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="$t('admin.editors.calendar.deleteTitle')"
      :message="$t('admin.editors.calendar.deleteMessage')"
      confirm-color="error"
      :loading="deletingEvent"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { BilingualText } from '~/components/admin/BilingualTextField.vue'
import type { CalendarEvent } from '~/composables/useCalendarAdmin'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const { events, loading, loadEvents, saveEvent, deleteEvent } = useCalendarAdmin()
const toast = useToast()
const { t } = useI18n()

const filterType = ref('all')
const showModal = ref(false)
const showDeleteConfirm = ref(false)
const savingEvent = ref(false)
const deletingEvent = ref(false)
const editingEvent = ref<CalendarEvent | null>(null)
const deletingEventRef = ref<CalendarEvent | null>(null)

const eventTypeOptions = EVENT_TYPES

const colorOptions = [
  '#3b82f6', // blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#22c55e', // green
  '#eab308', // yellow
  '#f97316', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#64748b', // slate
]

const typeFilterOptions = computed(() => [
  { value: 'all', label: t('admin.editors.calendar.allTypes') },
  ...EVENT_TYPES,
])

const editForm = reactive({
  title_es: '',
  title_en: '',
  description_es: '',
  description_en: '',
  start_date: '',
  end_date: '',
  event_type: 'event',
  location: '',
  all_day: true,
  start_time: '',
  end_time: '',
  color: '#3b82f6',
  image_url: '',
})

const editFormTitle = computed<BilingualText>({
  get: () => ({ es: editForm.title_es, en: editForm.title_en }),
  set: (val) => { editForm.title_es = val.es; editForm.title_en = val.en },
})

const editFormDescription = computed<BilingualText>({
  get: () => ({ es: editForm.description_es, en: editForm.description_en }),
  set: (val) => { editForm.description_es = val.es; editForm.description_en = val.en },
})

type BadgeColor = 'success' | 'warning' | 'primary' | 'error' | 'info' | 'secondary' | 'neutral'

function getTypeColor(type: string): BadgeColor {
  const colors: Record<string, BadgeColor> = {
    holiday: 'success',
    exam: 'warning',
    event: 'primary',
    no_school: 'error',
    parent_meeting: 'info',
    admissions: 'secondary',
  }
  return colors[type] || 'neutral' as BadgeColor
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-HN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function openAddModal() {
  editingEvent.value = null
  Object.assign(editForm, {
    title_es: '', title_en: '',
    description_es: '', description_en: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    event_type: 'event',
    location: '',
    all_day: true,
    start_time: '', end_time: '',
    color: '#3b82f6',
    image_url: '',
  })
  showModal.value = true
}

function editEvent(event: CalendarEvent) {
  editingEvent.value = event
  Object.assign(editForm, {
    title_es: event.title_es,
    title_en: event.title_en,
    description_es: event.description_es || '',
    description_en: event.description_en || '',
    start_date: event.start_date,
    end_date: event.end_date || '',
    event_type: event.event_type,
    location: event.location || '',
    all_day: event.all_day,
    start_time: event.start_time || '',
    end_time: event.end_time || '',
    color: event.color || '#3b82f6',
    image_url: event.image_url || '',
  })
  showModal.value = true
}

function confirmDelete(event: CalendarEvent) {
  deletingEventRef.value = event
  showDeleteConfirm.value = true
}

async function handleSave() {
  if (!editForm.start_date || !editForm.title_es) {
    toast.add({ title: t('admin.editors.calendar.requiredFields'), color: 'warning' })
    return
  }

  savingEvent.value = true
  try {
    const eventData: CalendarEvent = {
      ...(editingEvent.value?.id ? { id: editingEvent.value.id } : {}),
      title_es: editForm.title_es,
      title_en: editForm.title_en,
      description_es: editForm.description_es,
      description_en: editForm.description_en,
      start_date: editForm.start_date,
      end_date: editForm.end_date || undefined,
      event_type: editForm.event_type,
      location: editForm.location,
      all_day: editForm.all_day,
      start_time: editForm.all_day ? undefined : editForm.start_time,
      end_time: editForm.all_day ? undefined : editForm.end_time,
      color: editForm.color,
      image_url: editForm.image_url,
    }

    await saveEvent(eventData)
    showModal.value = false
    await refreshEvents()
    toast.add({ title: t('admin.editors.saveSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.saveError'), description: e.message, color: 'error' })
  } finally {
    savingEvent.value = false
  }
}

async function handleDelete() {
  if (!deletingEventRef.value?.id) return
  deletingEvent.value = true
  try {
    await deleteEvent(deletingEventRef.value.id)
    showDeleteConfirm.value = false
    toast.add({ title: t('admin.editors.deleteSuccess'), color: 'success' })
  } catch (e: any) {
    toast.add({ title: t('admin.editors.deleteError'), description: e.message, color: 'error' })
  } finally {
    deletingEvent.value = false
  }
}

async function refreshEvents() {
  await loadEvents(filterType.value !== 'all' ? { type: filterType.value } : undefined)
}

watch(filterType, () => refreshEvents())

onMounted(() => refreshEvents())

useHead({
  title: `${t('admin.editors.calendar.title')} - Admin - CEE`,
})
</script>
