<template>
  <div class="min-h-screen bg-white">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
    </div>

    <!-- Not Found -->
    <div v-else-if="!project" class="py-32 text-center">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h1 class="text-2xl font-bold text-gray-500 mb-2">{{ $t('support.projectDetails.notFound', 'Project Not Found') }}</h1>
      <UButton :to="localePath('/support/projects')" variant="outline" class="mt-4">
        {{ $t('support.projectDetails.backToProjects') }}
      </UButton>
    </div>

    <!-- Project Content -->
    <template v-else>
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <NuxtLink
            :to="localePath('/support/projects')"
            class="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors"
          >
            <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
            {{ $t('support.projectDetails.backToProjects') }}
          </NuxtLink>
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            {{ project.title }}
          </h1>
        </div>
      </section>

      <!-- Project Image -->
      <section class="py-16 bg-gray-50">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div v-if="project.imageUrl" class="rounded-2xl overflow-hidden h-64 md:h-96">
            <img
              :src="project.imageUrl"
              :alt="project.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div v-else class="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl h-64 md:h-96 flex items-center justify-center">
            <UIcon
              :name="projectIcon"
              class="w-32 h-32 text-red-400"
            />
          </div>
        </div>
      </section>

      <!-- Project Details (active project) -->
      <section v-if="!isCompleted" class="py-16">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div class="grid lg:grid-cols-3 gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <p class="text-xl text-gray-700 leading-relaxed mb-8">
                {{ project.description }}
              </p>

              <template v-if="needs.length > 0">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">
                  {{ $t('support.projectDetails.whyNeeded') }}
                </h2>
                <ul class="space-y-4">
                  <li
                    v-for="(need, index) in needs"
                    :key="index"
                    class="flex items-start gap-3"
                  >
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-6 h-6 text-green-600 shrink-0 mt-0.5"
                    />
                    <span class="text-gray-700">{{ need }}</span>
                  </li>
                </ul>
              </template>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-amber-50 rounded-xl p-6 sticky top-24">
                <div v-if="project.status" class="mb-6">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">
                    {{ $t('support.projectDetails.currentStatus') }}
                  </h3>
                  <UBadge :color="getStatusColor(project.statusCode)" variant="subtle" size="lg">
                    {{ project.status }}
                  </UBadge>
                </div>

                <div v-if="project.goal" class="mb-6">
                  <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">
                    {{ $t('support.projectDetails.projectGoal') }}
                  </h3>
                  <p class="text-gray-700">
                    {{ project.goal }}
                  </p>
                </div>

                <UButton
                  :to="`${localePath('/support/donate')}?purpose=${slug}#donate-online`"
                  size="lg"
                  color="primary"
                  class="w-full bg-red-600 hover:bg-red-700"
                >
                  {{ $t('support.projectDetails.donateToProject') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Completed Project Celebration -->
      <section v-else class="py-16">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div class="max-w-3xl mx-auto">
            <!-- Status Badge -->
            <div class="flex justify-center mb-8">
              <UBadge color="success" variant="subtle" size="lg">
                {{ project.status }}
              </UBadge>
            </div>

            <!-- Description -->
            <p class="text-xl text-gray-700 leading-relaxed mb-10 text-center">
              {{ project.description }}
            </p>

            <!-- Celebration Card -->
            <div class="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 md:p-12 text-center">
              <UIcon name="i-heroicons-trophy" class="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h2 class="text-2xl md:text-3xl font-bold text-green-800 mb-4">
                {{ $t('support.projectDetails.completed.title') }}
              </h2>
              <p class="text-lg text-gray-700 leading-relaxed">
                {{ project.completionMessage || $t('support.projectDetails.completed.defaultMessage') }}
              </p>
            </div>

            <!-- Goal achieved -->
            <div v-if="project.goal" class="mt-8 text-center">
              <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">
                {{ $t('support.projectDetails.projectGoal') }}
              </h3>
              <p class="text-gray-700">{{ project.goal }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section -->
      <section class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            {{ $t('support.projects.cta.title') }}
          </h2>
          <p class="text-xl mb-8 max-w-3xl mx-auto">
            {{ $t('support.projects.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/support/donate')"
              size="lg"
              variant="solid"
              class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('support.projects.cta.donate') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
            >
              {{ $t('support.projects.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const localePath = useLocalePath()
const { t } = useI18n()
const { loadContent, getItems, field, meta: getMeta } = usePublicContent()

const slug = computed(() => route.params.slug as string)
const loading = ref(true)

const projectIcons = [
  'i-heroicons-building-office-2',
  'i-heroicons-beaker',
  'i-heroicons-home-modern',
  'i-heroicons-book-open',
  'i-heroicons-wrench-screwdriver',
  'i-heroicons-star',
]

const statusColors: Record<string, string> = {
  in_progress: 'info',
  planning: 'neutral',
  fundraising: 'warning',
  completed: 'success',
}

const getStatusColor = (code: string) => {
  return (statusColors[code] || 'neutral') as 'info' | 'neutral' | 'warning' | 'success'
}

const statusKey = (code: string) => {
  const key = `support.projects.status.${code}`
  const translated = t(key)
  return translated !== key ? translated : code
}

await loadContent(['support.projects.items'])

// Find the project by matching slug in metadata
const projectItem = computed(() => {
  const items = getItems('support.projects.items')
  return items.find(item => getMeta(item, 'slug') === slug.value) || null
})

const projectIndex = computed(() => {
  const items = getItems('support.projects.items')
  return items.findIndex(item => getMeta(item, 'slug') === slug.value)
})

const projectIcon = computed(() => {
  return projectIcons[projectIndex.value % projectIcons.length] || 'i-heroicons-star'
})

const project = computed(() => {
  if (!projectItem.value) return null
  const statusCode = getMeta(projectItem.value, 'status')
  return {
    title: field(projectItem.value, 'title'),
    description: field(projectItem.value, 'description'),
    statusCode,
    status: statusKey(statusCode),
    goal: getMeta(projectItem.value, 'goal'),
    imageUrl: getMeta(projectItem.value, 'imageUrl'),
    completionMessage: field(projectItem.value, 'completionMessage'),
  }
})

const isCompleted = computed(() => project.value?.statusCode === 'completed')

// Load needs for this specific project
const needsKey = computed(() => `support.projects.${slug.value}.needs`)

const needs = computed(() => {
  const items = getItems(needsKey.value)
  if (items.length > 0) {
    return items.map(item => field(item, 'text'))
  }
  return []
})

onMounted(async () => {
  try {
    await loadContent([needsKey.value])
  } finally {
    loading.value = false
  }
})

useHead({
  title: () => project.value ? `${project.value.title} - CEE` : 'Project - CEE',
})
</script>
