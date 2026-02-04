<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.philosophy.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.philosophy.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-light-bulb"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('about.philosophy.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Philosophy Sections -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="space-y-12">
          <!-- Biblical Foundation -->
          <div class="bg-blue-50 rounded-lg p-8 md:p-12">
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                name="i-heroicons-book-open"
                class="w-12 h-12 text-blue-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-blue-900">
                {{ $t('about.philosophy.biblical.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ $t('about.philosophy.biblical.content') }}
            </p>
          </div>

          <!-- Human Dignity -->
          <div class="bg-purple-50 rounded-lg p-8 md:p-12">
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                name="i-heroicons-user-group"
                class="w-12 h-12 text-purple-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-purple-900">
                {{ $t('about.philosophy.dignity.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ $t('about.philosophy.dignity.content') }}
            </p>
          </div>

          <!-- Bilingual Education -->
          <div class="bg-indigo-50 rounded-lg p-8 md:p-12">
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                name="i-heroicons-globe-americas"
                class="w-12 h-12 text-indigo-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-indigo-900">
                {{ $t('about.philosophy.bilingual.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ $t('about.philosophy.bilingual.content') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Principles -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('about.philosophy.principles.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(principle, index) in principles"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getIconBgColor(index)"
            >
              <UIcon :name="principle.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $rt(principle.title) }}
            </h3>
            <p class="text-gray-700">
              {{ $rt(principle.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('about.philosophy.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('about.philosophy.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100"
            >
              {{ $t('about.philosophy.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700"
            >
              {{ $t('about.philosophy.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm } = useI18n();

  const principleIcons = [
    'i-heroicons-book-open-solid',
    'i-heroicons-heart-solid',
    'i-heroicons-globe-americas-solid',
  ];

  const principles = computed(() => {
    const items = tm('about.philosophy.principles.items') as any[];
    return items.map((principle: any, index: number) => ({
      title: principle.title,
      description: principle.description,
      icon: principleIcons[index],
    }));
  });

  const getIconBgColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Our Philosophy - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Our educational philosophy at CEE is rooted in biblical wisdom, human dignity, and bilingual excellence for the development of our students.',
      },
    ],
  });
</script>
