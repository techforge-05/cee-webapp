<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.missionVisionValues.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.missionVisionValues.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">
              {{ $t('about.missionVisionValues.intro.title') }}
            </h2>
            <p class="text-lg text-gray-700 mb-4">
              {{ $t('about.missionVisionValues.intro.paragraph1') }}
            </p>
            <p class="text-lg text-gray-700">
              {{ $t('about.missionVisionValues.intro.paragraph2') }}
            </p>
          </div>
          <div class="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
            <p class="text-gray-400 text-xl">Introduction Image</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-blue-50 rounded-lg p-8 md:p-12">
          <div class="flex items-start gap-4 mb-4">
            <UIcon name="i-heroicons-flag" class="w-12 h-12 text-blue-600 shrink-0" />
            <h2 class="text-3xl font-bold text-blue-900">
              {{ $t('about.missionVisionValues.mission.title') }}
            </h2>
          </div>
          <p class="text-xl text-gray-800 leading-relaxed">
            {{ $t('about.missionVisionValues.mission.statement') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-purple-50 rounded-lg p-8 md:p-12">
          <div class="flex items-start gap-4 mb-4">
            <UIcon name="i-heroicons-eye" class="w-12 h-12 text-purple-600 shrink-0" />
            <h2 class="text-3xl font-bold text-purple-900">
              {{ $t('about.missionVisionValues.vision.title') }}
            </h2>
          </div>
          <p class="text-xl text-gray-800 leading-relaxed">
            {{ $t('about.missionVisionValues.vision.statement') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-4xl font-bold text-center text-gray-900 mb-4">
          {{ $t('about.missionVisionValues.values.title') }}
        </h2>
        <p class="text-xl text-center text-gray-600 mb-12">
          {{ $t('about.missionVisionValues.values.subtitle') }}
        </p>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(value, index) in valuesWithIcons"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0">
                <UIcon :name="value.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ $rt(value.title) }}
              </h3>
            </div>
            <p class="text-gray-700">
              {{ $rt(value.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('about.missionVisionValues.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('about.missionVisionValues.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/admissions')"
            size="lg"
            color="white"
            variant="solid"
            class="text-blue-600"
          >
            {{ $t('about.missionVisionValues.cta.learnMore') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-white text-white hover:bg-white hover:text-blue-600"
          >
            {{ $t('about.missionVisionValues.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt: $rt } = useI18n();

const valueIcons = [
  'i-heroicons-heart-solid', // Passion for God
  'i-heroicons-shield-check-solid', // Integrity
  'i-heroicons-light-bulb-solid', // Creativity
  'i-heroicons-hand-raised-solid', // Respect
  'i-heroicons-hand-thumb-up-solid', // Service
  'i-heroicons-star-solid', // Excellence
  'i-heroicons-clipboard-document-check-solid', // Responsibility
];

const valuesWithIcons = computed(() => {
  const values = tm('about.missionVisionValues.values.items') as any[];
  return values.map((value: any, index: number) => ({
    ...value,
    icon: valueIcons[index],
  }));
});

// Set page metadata
useHead({
  title: 'Mission, Vision & Values - CEE',
  meta: [
    {
      name: 'description',
      content: 'Learn about CEE\'s mission, vision, and core values that guide our Christian education in Siguatepeque, Honduras.',
    },
  ],
});
</script>
