<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.serviceProjects.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-rose-100">
          {{ $t('studentLife.serviceProjects.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('studentLife.serviceProjects.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('studentLife.serviceProjects.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('studentLife.serviceProjects.intro', 'focalX') || 50}% ${singleMeta('studentLife.serviceProjects.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('studentLife.serviceProjects.intro', 'text') || $t('studentLife.serviceProjects.intro') }}
        </p>
      </div>
    </section>

    <!-- Our Service Initiatives -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-800 mb-4">
            {{ $t('studentLife.serviceProjects.projects.title') }}
          </h2>
        </div>
      </div>

      <div class="space-y-12">
        <div
          v-for="(project, index) in projects"
          :key="index"
        >
          <div class="px-2 sm:px-10 lg:px-16">
            <div
              :class="[
                'rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12',
                getProjectBg(index),
              ]"
            >
              <div :class="project.image ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
                <!-- Image on left for odd index -->
                <div v-if="project.image && index % 2 === 1" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112 order-1 lg:order-0">
                  <img
                    :src="project.image"
                    :alt="project.title"
                    class="w-full h-full object-cover"
                    :style="{ objectPosition: `${project.focalX}% ${project.focalY}%` }"
                    loading="lazy"
                  />
                </div>
                <!-- Text content -->
                <div class="px-4 py-6 sm:px-0 sm:py-0">
                  <h3 :class="['text-2xl md:text-5xl font-bold mb-4', getProjectTextColor(index)]">
                    {{ project.title }}
                  </h3>
                  <p class="text-lg text-gray-800 leading-relaxed">
                    {{ project.description }}
                  </p>
                </div>
                <!-- Image on right for even index -->
                <div v-if="project.image && index % 2 === 0" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112">
                  <img
                    :src="project.image"
                    :alt="project.title"
                    class="w-full h-full object-cover"
                    :style="{ objectPosition: `${project.focalX}% ${project.focalY}%` }"
                    loading="lazy"
                  />
                </div>
                <!-- Placeholder when no image -->
                <div v-if="!project.image" class="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Service Matters Section -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-5xl font-bold text-emerald-800 mb-4">
            {{ $t('studentLife.serviceProjects.whyService.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.serviceProjects.whyService.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
            :class="getBenefitBorderColor(index)"
          >
            <h3 class="text-lg md:text-2xl font-bold text-gray-900 mb-2">
              {{ benefit.title }}
            </h3>
            <p class="text-gray-600 text-sm md:text-lg">
              {{ benefit.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4">
            {{ $t('studentLife.serviceProjects.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.serviceProjects.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-rose-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('studentLife.serviceProjects.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-rose-700 justify-center"
            >
              {{ $t('studentLife.serviceProjects.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'studentLife.serviceProjects.intro',
    'studentLife.serviceProjects.benefits',
    'studentLife.serviceProjects.items',
  ]));

  const benefits = computed(() => {
    const dbItems = getItems('studentLife.serviceProjects.benefits');
    if (dbItems.length > 0) {
      return dbItems.map((item) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
      }));
    }
    const items = tm('studentLife.serviceProjects.whyService.benefits') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((b: any) => ({
      title: typeof b.title === 'string' ? b.title : rt(b.title),
      description: typeof b.description === 'string' ? b.description : rt(b.description),
    }));
  });

  const projects = computed(() => {
    const dbItems = getItems('studentLife.serviceProjects.items');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        image: item.metadata?.imageUrl || null,
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      }));
    }
    const items = tm('studentLife.serviceProjects.projects.items') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((p: any) => ({
      title: typeof p.title === 'string' ? p.title : rt(p.title),
      description: typeof p.description === 'string' ? p.description : rt(p.description),
      image: p.image ? (typeof p.image === 'string' ? p.image : rt(p.image)) : null,
      focalX: 50,
      focalY: 50,
    }));
  });

  const projectStyles = [
    { bg: 'bg-rose-50', text: 'text-rose-900' },
    { bg: 'bg-teal-50', text: 'text-teal-900' },
    { bg: 'bg-amber-50', text: 'text-amber-900' },
    { bg: 'bg-blue-50', text: 'text-blue-900' },
  ];

  const getProjectBg = (index: number) => projectStyles[index % projectStyles.length]!.bg;
  const getProjectTextColor = (index: number) => projectStyles[index % projectStyles.length]!.text;

  const getBenefitBorderColor = (index: number) => {
    const colors = ['border-rose-500', 'border-teal-500', 'border-amber-500', 'border-blue-500'];
    return colors[index % colors.length];
  };

  useHead({
    title: 'Service Projects - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Learn about service learning and community outreach programs at CEE that help students put their faith into action.',
      },
    ],
  });
</script>
