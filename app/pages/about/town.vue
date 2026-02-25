<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.town.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.town.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction with Image -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-purple-600 mb-6" />
            <h2 class="text-3xl font-bold text-gray-900 mb-6">
              {{ singleField('about.town.intro', 'title') || $t('about.town.intro.title') }}
            </h2>
            <p class="text-lg text-gray-700 mb-4">
              {{ singleField('about.town.intro', 'paragraph1') || $t('about.town.intro.paragraph1') }}
            </p>
            <p class="text-lg text-gray-700">
              {{ singleField('about.town.intro', 'paragraph2') || $t('about.town.intro.paragraph2') }}
            </p>
          </div>
          <div v-if="singleMeta('about.town.intro', 'imageUrl')" class="h-96 rounded-lg overflow-hidden">
            <img
              :src="singleMeta('about.town.intro', 'imageUrl')"
              alt=""
              class="w-full h-full object-cover"
              :style="{ objectPosition: `${singleMeta('about.town.intro', 'focalX') || 50}% ${singleMeta('about.town.intro', 'focalY') || 50}%` }"
            />
          </div>
          <div v-else class="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
            <UIcon name="i-heroicons-map-pin" class="w-16 h-16 text-gray-400" />
          </div>
        </div>
      </div>
    </section>

    <!-- Location & Climate -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Location Card -->
          <div class="bg-blue-50 rounded-lg p-8">
            <div class="flex items-start gap-4 mb-4">
              <UIcon name="i-heroicons-map" class="w-12 h-12 text-blue-600 shrink-0" />
              <h2 class="text-3xl font-bold text-blue-900">
                {{ $t('about.town.location.title') }}
              </h2>
            </div>
            <ul class="space-y-3 text-lg text-gray-800">
              <li
                v-for="(item, index) in locationItems"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Climate Card -->
          <div class="bg-purple-50 rounded-lg p-8">
            <div class="flex items-start gap-4 mb-4">
              <UIcon name="i-heroicons-sun" class="w-12 h-12 text-purple-600 shrink-0" />
              <h2 class="text-3xl font-bold text-purple-900">
                {{ singleField('about.town.climate', 'title') || $t('about.town.climate.title') }}
              </h2>
            </div>
            <p class="text-lg text-gray-800 mb-4">
              {{ singleField('about.town.climate', 'description') || $t('about.town.climate.description') }}
            </p>
            <ul class="space-y-3 text-lg text-gray-800">
              <li v-for="(item, index) in climateItems" :key="index" class="flex items-start gap-3">
                <UIcon name="i-heroicons-check-circle" class="w-6 h-6 text-purple-600 shrink-0 mt-1" />
                <span>{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Mountain Image Section -->
    <section class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div v-if="singleMeta('about.town.mountainImage', 'imageUrl')" class="h-96 rounded-lg overflow-hidden">
          <img
            :src="singleMeta('about.town.mountainImage', 'imageUrl')"
            :alt="singleField('about.town.mountainImage', 'alt') || ''"
            class="w-full h-full object-cover"
            :style="{ objectPosition: `${singleMeta('about.town.mountainImage', 'focalX') || 50}% ${singleMeta('about.town.mountainImage', 'focalY') || 50}%` }"
          />
        </div>
        <div v-else class="bg-gray-300 h-96 rounded-lg flex items-center justify-center">
          <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
        </div>
      </div>
    </section>

    <!-- Activities Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <UIcon name="i-heroicons-sparkles" class="w-16 h-16 text-purple-600 mx-auto mb-6" />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('about.town.activities.title') }}
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            {{ $t('about.town.activities.subtitle') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(activity, index) in activities"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getActivityBgColor(index)"
            >
              <UIcon :name="activity.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3 text-center">
              {{ activity.title }}
            </h3>
            <p class="text-gray-700 text-center">
              {{ activity.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('about.town.gallery.title') }}
        </h2>
        <div class="flex flex-wrap justify-center gap-6">
          <template v-if="galleryImages.length > 0">
            <div
              v-for="(img, index) in galleryImages"
              :key="index"
              class="h-64 rounded-lg overflow-hidden w-full md:w-[calc(33.333%-1rem)]"
            >
              <img
                :src="img.url"
                :alt="img.alt"
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${img.focalX}% ${img.focalY}%` }"
              />
            </div>
          </template>
          <template v-else>
            <div class="bg-gray-300 h-64 rounded-lg flex items-center justify-center w-full md:w-[calc(33.333%-1rem)]">
              <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
            </div>
            <div class="bg-gray-300 h-64 rounded-lg flex items-center justify-center w-full md:w-[calc(33.333%-1rem)]">
              <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
            </div>
            <div class="bg-gray-300 h-64 rounded-lg flex items-center justify-center w-full md:w-[calc(33.333%-1rem)]">
              <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('about.town.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('about.town.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('about.town.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700 justify-center"
            >
              {{ $t('about.town.cta.contactUs') }}
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
const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent([
  'about.town.intro',
  'about.town.location',
  'about.town.climate',
  'about.town.climateItems',
  'about.town.activities',
  'about.town.mountainImage',
  'about.town.gallery',
]));

const galleryImages = computed(() => {
  const dbItems = getItems('about.town.gallery');
  return dbItems
    .filter(item => getMeta(item, 'imageUrl'))
    .map(item => ({
      url: getMeta(item, 'imageUrl'),
      alt: field(item, 'alt') || '',
      focalX: item.metadata?.focalX ?? 50,
      focalY: item.metadata?.focalY ?? 50,
    }));
});

const locationItems = computed(() => {
  const dbItems = getItems('about.town.location');
  if (dbItems.length > 0) {
    return dbItems.map((item) => field(item, 'text'));
  }
  const items = tm('about.town.location.items') as any[];
  return items.map(item => typeof item === 'string' ? item : rt(item));
});

const climateItems = computed(() => {
  const dbItems = getItems('about.town.climateItems');
  if (dbItems.length > 0) {
    return dbItems.map((item) => field(item, 'text'));
  }
  const items = tm('about.town.climateItems') as any[];
  return items.map(item => typeof item === 'string' ? item : rt(item));
});

const activityIcons = [
  'i-heroicons-home-modern',
  'i-heroicons-trophy',
  'i-heroicons-cake',
  'i-heroicons-film',
  'i-heroicons-musical-note',
];

const activities = computed(() => {
  const dbItems = getItems('about.town.activities');
  if (dbItems.length > 0) {
    return dbItems.map((item, index) => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
      icon: field(item, 'icon') || activityIcons[index % activityIcons.length],
    }));
  }
  const items = tm('about.town.activities.items') as any[];
  return items.map((activity: any, index: number) => ({
    title: typeof activity.title === 'string' ? activity.title : rt(activity.title),
    description: typeof activity.description === 'string' ? activity.description : rt(activity.description),
    icon: activityIcons[index],
  }));
});

const getActivityBgColor = (index: number) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-orange-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  return colors[index % colors.length];
};

// Set page metadata
useHead({
  title: 'Our Town - Siguatepeque - CEE',
  meta: [
    {
      name: 'description',
      content: 'Discover Siguatepeque, Honduras - the beautiful mountain city where CEE is located, with excellent climate, rich culture, and wonderful community.',
    },
  ],
});
</script>
