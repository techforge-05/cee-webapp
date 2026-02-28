<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.projects.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.projects.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('support.projects.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('support.projects.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('support.projects.intro', 'focalX') || 50}% ${singleMeta('support.projects.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction Section -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('support.projects.intro', 'text') || $t('support.projects.intro') }}
        </p>
      </div>
    </section>

    <!-- Current Projects Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl lg:text-5xl font-bold text-center text-blue-800 mb-12">
          {{ $t('support.projects.current.title') }}
        </h2>

        <!-- Empty state -->
        <div v-if="projectsWithIcons.length === 0" class="text-center py-12">
          <UIcon name="i-heroicons-wrench-screwdriver" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-xl text-gray-500">{{ $t('support.projects.noProjects') }}</p>
        </div>

        <div v-else class="flex flex-wrap justify-center gap-8">
          <NuxtLink
            v-for="(project, index) in projectsWithIcons"
            :key="index"
            :to="localePath(`/support/projects/${project.slug}`)"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block group w-full md:w-[calc(50%-1rem)]"
          >
            <div v-if="project.imageUrl" class="h-48 overflow-hidden">
              <img :src="project.imageUrl" :alt="project.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform" :style="{ objectPosition: `${project.focalX}% ${project.focalY}%` }" />
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
                  :color="getStatusColor(project.statusCode)"
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
    <section v-if="howToHelpWays.length > 0" class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-3xl lg:text-5xl font-bold text-center text-emerald-800 mb-4">
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
              <span class="text-lg text-gray-700">{{ way }}</span>
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
        <h2 class="text-3xl md:text-4xl lg:text-4xl font-bold mb-6">
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
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t } = useI18n();
const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta } = usePublicContent();

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

const statusKey = (code: string) => {
  const key = `support.projects.status.${code}`;
  const translated = t(key);
  return translated !== key ? translated : code;
};

const projectsWithIcons = computed(() => {
  const dbItems = getItems('support.projects.items');
  return dbItems.map((item, index) => ({
    title: field(item, 'title'),
    description: field(item, 'description'),
    slug: getMeta(item, 'slug'),
    statusCode: getMeta(item, 'status'),
    status: statusKey(getMeta(item, 'status')),
    goal: getMeta(item, 'goal'),
    imageUrl: getMeta(item, 'imageUrl'),
    focalX: item.metadata?.focalX ?? 50,
    focalY: item.metadata?.focalY ?? 50,
    icon: projectIcons[index] || 'i-heroicons-star',
  }));
});

const howToHelpWays = computed(() => {
  const dbItems = getItems('support.projects.howToHelp');
  return dbItems.map(item => field(item, 'text'));
});

const statusColors: Record<string, string> = {
  in_progress: 'info',
  planning: 'neutral',
  fundraising: 'warning',
  completed: 'success',
};

const getStatusColor = (code: string) => {
  return (statusColors[code] || 'neutral') as 'info' | 'neutral' | 'warning' | 'success';
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
