<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.sportsClubs.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-green-100">
          {{ $t('studentLife.sportsClubs.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('studentLife.sports.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('studentLife.sports.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('studentLife.sports.intro', 'focalX') || 50}% ${singleMeta('studentLife.sports.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">
          {{ singleField('studentLife.sports.intro', 'title') || $t('studentLife.sportsClubs.intro.title') }}
        </h2>
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('studentLife.sports.intro', 'description') || $t('studentLife.sportsClubs.intro.description') }}
        </p>
      </div>
    </section>

    <!-- Sports Programs Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.sportsClubs.sports.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.sportsClubs.sports.description') }}
          </p>
        </div>
      </div>

      <div class="space-y-12">
        <div
          v-for="(sport, index) in sports"
          :key="index"
        >
          <div class="px-2 sm:px-10 lg:px-16">
            <div
              :class="[
                'rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12',
                getSportBg(index),
              ]"
            >
              <div :class="sport.image ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
                <!-- Image on left for odd index -->
                <div v-if="sport.image && index % 2 === 1" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112 order-1 lg:order-0">
                  <img
                    :src="sport.image"
                    :alt="sport.title"
                    class="w-full h-full object-cover"
                    :style="{ objectPosition: `${sport.focalX}% ${sport.focalY}%` }"
                    loading="lazy"
                  />
                </div>
                <!-- Text content -->
                <div class="px-4 py-6 sm:px-0 sm:py-0">
                  <h3 :class="['text-2xl md:text-5xl font-bold mb-4', getSportTextColor(index)]">
                    {{ sport.title }}
                  </h3>
                  <p class="text-lg text-gray-800 leading-relaxed">
                    {{ sport.description }}
                  </p>
                </div>
                <!-- Image on right for even index -->
                <div v-if="sport.image && index % 2 === 0" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112">
                  <img
                    :src="sport.image"
                    :alt="sport.title"
                    class="w-full h-full object-cover"
                    :style="{ objectPosition: `${sport.focalX}% ${sport.focalY}%` }"
                    loading="lazy"
                  />
                </div>
                <!-- Placeholder when no image -->
                <div v-if="!sport.image" class="hidden" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Sports -->
      <div class="px-6 sm:px-10 lg:px-16 mt-12">
        <div class="bg-gradient-to-r from-green-100 to-teal-100 rounded-lg p-8 md:p-12 text-center">
          <p class="text-xl md:text-2xl text-green-900 leading-relaxed font-medium">
            {{ singleField('studentLife.sports.otherSports', 'text') || $t('studentLife.sportsClubs.sports.otherSports') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section v-if="galleryImages.length > 0" class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('studentLife.sportsClubs.gallery.title') }}
        </h2>
        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="(img, index) in galleryImages"
            :key="index"
            class="h-80 md:h-96 rounded-lg overflow-hidden w-full md:w-[calc(33.333%-1rem)]"
          >
            <img
              :src="img.url"
              :alt="img.alt"
              class="w-full h-full object-cover"
              :style="{ objectPosition: `${img.focalX}% ${img.focalY}%` }"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16">
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
  const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'studentLife.sports.intro',
    'studentLife.sports.otherSports',
    'studentLife.sports.items',
    'studentLife.sports.gallery',
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
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
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

  const galleryImages = computed(() => {
    const dbItems = getItems('studentLife.sports.gallery');
    return dbItems
      .filter(item => getMeta(item, 'imageUrl'))
      .map(item => ({
        url: getMeta(item, 'imageUrl'),
        alt: field(item, 'alt') || '',
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      }));
  });

  const sportStyles = [
    { bg: 'bg-green-50', text: 'text-green-900' },
    { bg: 'bg-blue-50', text: 'text-blue-900' },
    { bg: 'bg-purple-50', text: 'text-purple-900' },
    { bg: 'bg-teal-50', text: 'text-teal-900' },
  ];

  const getSportBg = (index: number) => sportStyles[index % sportStyles.length]!.bg;
  const getSportTextColor = (index: number) => sportStyles[index % sportStyles.length]!.text;

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
