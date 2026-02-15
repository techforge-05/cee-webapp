<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.projects.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.projects.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-wrench-screwdriver"
            class="w-16 h-16 text-red-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ singleField('support.projects.intro', 'text') || $t('support.projects.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Current Projects Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          {{ $t('support.projects.current.title') }}
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <NuxtLink
            v-for="(project, index) in projectsWithIcons"
            :key="index"
            :to="localePath(`/support/projects/${project.slug}`)"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block group"
          >
            <div v-if="project.imageUrl" class="h-48 overflow-hidden">
              <img :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div v-else class="h-48 bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
              <UIcon :name="project.icon" class="w-20 h-20 text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-gray-900">
                  {{ project.title }}
                </h3>
                <UBadge
                  :color="getStatusColor(project.status)"
                  variant="subtle"
                  size="sm"
                >
                  {{ project.status }}
                </UBadge>
              </div>
              <p class="text-gray-700 mb-4">
                {{ project.description }}
              </p>
              <p class="text-sm text-gray-500">
                <strong>{{ $t('support.projectDetails.projectGoal') }}:</strong>
                {{ project.goal }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How to Help Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">
            {{ $t('support.projects.howToHelp.title') }}
          </h2>
          <p class="text-xl text-center text-gray-700 mb-8">
            {{ $t('support.projects.howToHelp.description') }}
          </p>

          <div class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="(way, index) in howToHelpWays"
              :key="index"
              class="flex items-start gap-3 bg-white rounded-lg p-4"
            >
              <UIcon
                name="i-heroicons-check-circle"
                class="w-6 h-6 text-green-600 shrink-0 mt-0.5"
              />
              <span class="text-gray-700">{{ way }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
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
            class="bg-white text-teal-700 hover:bg-gray-100"
          >
            {{ $t('support.projects.cta.donate') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600"
          >
            {{ $t('support.projects.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { loadContent, getItems, field, meta: getMeta, singleField } = usePublicContent();

onMounted(() => loadContent([
  'support.projects.intro',
  'support.projects.items',
  'support.projects.howToHelp',
]));

const projectIcons = [
  'i-heroicons-building-office-2',
  'i-heroicons-beaker',
  'i-heroicons-home-modern',
  'i-heroicons-book-open',
];

const projectsWithIcons = computed(() => {
  const dbItems = getItems('support.projects.items');
  if (dbItems.length > 0) {
    return dbItems.map((item, index) => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
      slug: getMeta(item, 'slug'),
      status: getMeta(item, 'status'),
      goal: getMeta(item, 'goal'),
      imageUrl: getMeta(item, 'imageUrl'),
      icon: projectIcons[index] || 'i-heroicons-star',
    }));
  }
  const items = tm('support.projects.current.items') as any[];
  return items.map((item: any, index: number) => ({
    title: typeof item.title === 'string' ? item.title : rt(item.title),
    description: typeof item.description === 'string' ? item.description : rt(item.description),
    slug: typeof item.slug === 'string' ? item.slug : rt(item.slug),
    status: typeof item.status === 'string' ? item.status : rt(item.status),
    goal: typeof item.goal === 'string' ? item.goal : rt(item.goal),
    icon: projectIcons[index],
  }));
});

const howToHelpWays = computed(() => {
  const dbItems = getItems('support.projects.howToHelp');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('support.projects.howToHelp.ways') as any[];
  return Array.isArray(items) ? items.map((w: any) => typeof w === 'string' ? w : rt(w)) : [];
});

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('progress') || statusLower.includes('progreso')) {
    return 'info' as const;
  }
  if (statusLower.includes('planning') || statusLower.includes('planificación')) {
    return 'neutral' as const;
  }
  if (statusLower.includes('fundraising') || statusLower.includes('recaudación')) {
    return 'warning' as const;
  }
  return 'neutral' as const;
};

useHead({
  title: 'Projects - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Explore current projects at CEE that need your support. Help improve our facilities and educational experience for students.',
    },
  ],
});
</script>
