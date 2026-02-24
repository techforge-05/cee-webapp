<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
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
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ singleField('studentLife.sports.intro', 'title') || $t('studentLife.sportsClubs.intro.title') }}
          </h2>
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ singleField('studentLife.sports.intro', 'description') || $t('studentLife.sportsClubs.intro.description') }}
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

        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="(sport, index) in sports"
            :key="index"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 border-green-500 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
          >
            <div class="h-48 bg-gray-200 flex items-center justify-center">
              <img
                v-if="sport.image"
                :src="sport.image"
                :alt="sport.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div v-else class="text-center text-gray-400">
                <UIcon :name="sportIcons[index]" class="w-12 h-12 mb-2" />
                <p class="text-sm">{{ sport.title }}</p>
              </div>
            </div>
            <div class="p-6 text-center">
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ sport.title }}
              </h3>
              <p class="text-gray-700">
                {{ sport.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Other Sports -->
        <div class="mt-12 bg-green-50 rounded-lg p-8 text-center">
          <p class="text-lg text-gray-700 leading-relaxed">
            {{ singleField('studentLife.sports.otherSports', 'text') || $t('studentLife.sportsClubs.sports.otherSports') }}
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
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('studentLife.sportsClubs.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700 justify-center"
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
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, meta: getMeta, singleField, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'studentLife.sports.intro',
    'studentLife.sports.otherSports',
    'studentLife.sports.items',
  ]));

  const sportIcons = [
    'i-heroicons-globe-americas',
    'i-heroicons-hand-raised',
    'i-heroicons-fire',
    'i-heroicons-bolt',
  ];

  const sports = computed(() => {
    const dbItems = getItems('studentLife.sports.items');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        image: getMeta(item, 'imageUrl') || null,
      }));
    }
    const items = tm('studentLife.sportsClubs.sports.items') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((s: any) => ({
      title: typeof s.title === 'string' ? s.title : rt(s.title),
      description: typeof s.description === 'string' ? s.description : rt(s.description),
      image: s.image ? (typeof s.image === 'string' ? s.image : rt(s.image)) : null,
    }));
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
