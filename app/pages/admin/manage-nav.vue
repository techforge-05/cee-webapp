<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('admin.manageNav.title') }}</h1>
      <p class="text-gray-500">{{ $t('admin.manageNav.subtitle') }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
    </div>

    <!-- Section cards -->
    <div v-else class="space-y-4">
      <UCard v-for="section in sectionRegistry" :key="section.key">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                :class="section.bgColor"
              >
                <UIcon :name="section.icon" class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $t(`nav.${section.key}`, section.label) }}
              </h3>
            </div>
            <div class="flex items-center gap-2">
              <!-- Edit / Save / Cancel buttons -->
              <template v-if="editingSections[section.key]">
                <UButton
                  icon="i-heroicons-x-mark"
                  size="xs"
                  variant="ghost"
                  color="error"
                  @click="cancelEdit(section.key)"
                >
                  {{ $t('admin.manageNav.cancel') }}
                </UButton>
                <UButton
                  icon="i-heroicons-check"
                  size="xs"
                  variant="ghost"
                  color="success"
                  :loading="savingSections[section.key]"
                  @click="saveSection(section)"
                >
                  {{ $t('admin.manageNav.save') }}
                </UButton>
              </template>
              <UButton
                v-else
                icon="i-heroicons-pencil"
                size="xs"
                variant="ghost"
                color="neutral"
                @click="startEdit(section.key)"
              >
                {{ $t('admin.manageNav.edit') }}
              </UButton>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <!-- Section toggle -->
          <div class="flex items-center justify-between py-1.5 px-2 rounded-lg bg-gray-50">
            <span class="text-sm font-medium text-gray-700">
              {{ sectionToggles[section.key] ? $t('admin.manageNav.sectionVisible') : $t('admin.manageNav.sectionHidden') }}
            </span>
            <USwitch
              v-model="draftSectionToggles[section.key]"
              :disabled="!editingSections[section.key]"
            />
          </div>

          <!-- Page toggles -->
          <div
            class="space-y-3 transition-opacity duration-200"
            :class="{ 'opacity-40 pointer-events-none': !draftSectionToggles[section.key] }"
          >
            <div
              v-for="page in section.pages"
              :key="page.slug"
              class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center gap-3">
                <UIcon :name="page.icon" class="w-5 h-5 text-gray-500" />
                <div>
                  <span class="text-sm font-medium text-gray-700">{{ page.label }}</span>
                  <p v-if="page.description" class="text-xs text-gray-400">{{ page.description }}</p>
                </div>
              </div>
              <USwitch
                v-model="draftPageToggles[`${section.key}/${page.slug}`]"
                :disabled="!editingSections[section.key]"
              />
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sectionRegistry } from '~/config/sectionRegistry'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const adminStore = useAdminStore()
const localePath = useLocalePath()
const { t } = useI18n()
const toast = useToast()
const { isVisible, loadVisibility, toggleVisibility } = useNavVisibility()

const loading = ref(true)

// Saved state (reflects what's in the DB)
const sectionToggles = reactive<Record<string, boolean>>({})
const pageToggles = reactive<Record<string, boolean>>({})

// Draft state (what the user is editing)
const draftSectionToggles = reactive<Record<string, boolean>>({})
const draftPageToggles = reactive<Record<string, boolean>>({})

// Per-section editing and saving state
const editingSections = reactive<Record<string, boolean>>({})
const savingSections = reactive<Record<string, boolean>>({})

onMounted(async () => {
  if (!adminStore.isSuperAdmin) {
    navigateTo(localePath('/admin'))
    return
  }

  await loadVisibility()
  initializeToggles()
  loading.value = false
})

function initializeToggles() {
  for (const section of sectionRegistry) {
    const sectionVisible = isVisible(section.key)
    sectionToggles[section.key] = sectionVisible
    draftSectionToggles[section.key] = sectionVisible
    editingSections[section.key] = false
    savingSections[section.key] = false
    for (const page of section.pages) {
      const key = `${section.key}/${page.slug}`
      const pageVisible = isVisible(section.key, page.slug)
      pageToggles[key] = pageVisible
      draftPageToggles[key] = pageVisible
    }
  }
}

function startEdit(sectionKey: string) {
  editingSections[sectionKey] = true
}

function cancelEdit(sectionKey: string) {
  // Revert drafts to saved state
  const section = sectionRegistry.find(s => s.key === sectionKey)
  if (!section) return

  draftSectionToggles[sectionKey] = sectionToggles[sectionKey] ?? true
  for (const page of section.pages) {
    const key = `${sectionKey}/${page.slug}`
    draftPageToggles[key] = pageToggles[key] ?? true
  }
  editingSections[sectionKey] = false
}

async function saveSection(section: typeof sectionRegistry[number]) {
  savingSections[section.key] = true

  try {
    // Save section toggle if changed
    const draftSection = draftSectionToggles[section.key] ?? true
    if (draftSection !== sectionToggles[section.key]) {
      const { error } = await toggleVisibility(section.key, null, draftSection)
      if (error) throw new Error('section')
      sectionToggles[section.key] = draftSection
    }

    // Save page toggles that changed
    for (const page of section.pages) {
      const key = `${section.key}/${page.slug}`
      const draftPage = draftPageToggles[key] ?? true
      if (draftPage !== pageToggles[key]) {
        const { error } = await toggleVisibility(section.key, page.slug, draftPage)
        if (error) throw new Error('page')
        pageToggles[key] = draftPage
      }
    }

    editingSections[section.key] = false
    toast.add({ title: t('admin.manageNav.toggleSuccess'), color: 'success' })
  } catch {
    toast.add({ title: t('admin.manageNav.toggleError'), color: 'error' })
  } finally {
    savingSections[section.key] = false
  }
}

useHead({
  title: () => `${t('admin.manageNav.title')} - Admin - CEE`,
})
</script>
