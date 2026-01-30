<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-rose-600 to-pink-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.serviceProjects.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-rose-100">
          {{ $t('studentLife.serviceProjects.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-heart"
            class="w-16 h-16 text-rose-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('studentLife.serviceProjects.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Why Service Matters Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.serviceProjects.whyService.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.serviceProjects.whyService.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getBenefitBgColor(index)"
            >
              <UIcon :name="benefitIcons[index]" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {{ $rt(benefit.title) }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ $rt(benefit.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Service Initiatives -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.serviceProjects.projects.title') }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(project, index) in projects"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4"
            :class="getProjectBorderColor(index)"
          >
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-14 h-14 rounded-full flex items-center justify-center"
                  :class="getProjectBgColor(index)"
                >
                  <UIcon :name="projectIcons[index]" class="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ $rt(project.title) }}
                </h3>
                <p class="text-gray-700 leading-relaxed">
                  {{ $rt(project.description) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Get Involved Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center bg-rose-50 rounded-2xl p-10">
          <UIcon
            name="i-heroicons-hand-raised"
            class="w-12 h-12 text-rose-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.serviceProjects.getInvolved.title') }}
          </h2>
          <p class="text-lg text-gray-700">
            {{ $t('studentLife.serviceProjects.getInvolved.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-rose-600 to-pink-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('studentLife.serviceProjects.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.serviceProjects.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-rose-700 hover:bg-gray-100"
            >
              {{ $t('studentLife.serviceProjects.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-rose-700"
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
  const { tm, rt: $rt } = useI18n();

  const benefitIcons = [
    'i-heroicons-heart',
    'i-heroicons-star',
    'i-heroicons-user-group',
    'i-heroicons-sparkles',
  ];

  const projectIcons = [
    'i-heroicons-home',
    'i-heroicons-globe-americas',
    'i-heroicons-shopping-bag',
    'i-heroicons-academic-cap',
  ];

  const benefits = computed(() => {
    const items = tm('studentLife.serviceProjects.whyService.benefits') as any[];
    return Array.isArray(items) ? items : [];
  });

  const projects = computed(() => {
    const items = tm('studentLife.serviceProjects.projects.items') as any[];
    return Array.isArray(items) ? items : [];
  });

  const getBenefitBgColor = (index: number) => {
    const colors = ['bg-rose-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500'];
    return colors[index % colors.length];
  };

  const getProjectBgColor = (index: number) => {
    const colors = ['bg-rose-500', 'bg-teal-500', 'bg-amber-500', 'bg-blue-500'];
    return colors[index % colors.length];
  };

  const getProjectBorderColor = (index: number) => {
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
