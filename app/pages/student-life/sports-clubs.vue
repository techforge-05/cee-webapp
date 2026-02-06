<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.sportsClubs.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-green-100">
          {{ $t('studentLife.sportsClubs.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-trophy"
            class="w-16 h-16 text-green-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('studentLife.sportsClubs.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Sports Programs Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.sportsClubs.sports.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.sportsClubs.sports.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(sport, index) in sports"
            :key="index"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500"
          >
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <img
                v-if="sport.image"
                :src="$rt(sport.image)"
                :alt="$rt(sport.title)"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center text-gray-400">
                <UIcon :name="sportIcons[index]" class="w-12 h-12 mb-2" />
                <p class="text-sm">{{ $rt(sport.title) }}</p>
              </div>
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ $rt(sport.title) }}
              </h3>
              <p class="text-gray-700">
                {{ $rt(sport.description) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Other Sports -->
        <div class="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <p class="text-lg text-gray-700 leading-relaxed">
            {{ $t('studentLife.sportsClubs.sports.otherSports') }}
          </p>
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
            {{ $t('studentLife.sportsClubs.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.sportsClubs.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100"
            >
              {{ $t('studentLife.sportsClubs.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700"
            >
              {{ $t('studentLife.sportsClubs.cta.contactUs') }}
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

  const sportIcons = [
    'i-heroicons-globe-americas',
    'i-heroicons-hand-raised',
    'i-heroicons-fire',
    'i-heroicons-bolt',
  ];

  const sports = computed(() => {
    const items = tm('studentLife.sportsClubs.sports.items') as any[];
    return Array.isArray(items) ? items : [];
  });

  useHead({
    title: 'Sports - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Explore sports and clubs at CEE including soccer, volleyball, basketball, reading, painting, music, and theater.',
      },
    ],
  });
</script>
