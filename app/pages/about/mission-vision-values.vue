<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.missionVisionValues.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.missionVisionValues.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('about.mvv.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('about.mvv.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('about.mvv.intro', 'focalX') || 50}% ${singleMeta('about.mvv.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction Section -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-teal-800 mb-6">
          {{ singleField('about.mvv.intro', 'title') || $t('about.missionVisionValues.intro.title') }}
        </h2>
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%] mb-4">
          {{ singleField('about.mvv.intro', 'paragraph1') || $t('about.missionVisionValues.intro.paragraph1') }}
        </p>
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('about.mvv.intro', 'paragraph2') || $t('about.missionVisionValues.intro.paragraph2') }}
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-8 sm:py-16">
      <div class="px-2 sm:px-10 lg:px-16">
        <div class="bg-blue-50 rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12">
          <div :class="singleMeta('about.mvv.mission', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
            <div class="px-4 py-6 sm:px-0 sm:py-0">
              <div class="flex items-start gap-4 mb-4">
                <UIcon
                  v-if="!singleMeta('about.mvv.mission', 'imageUrl')"
                  name="i-heroicons-flag"
                  class="w-12 h-12 text-blue-600 shrink-0"
                />
                <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-900">
                  {{ singleField('about.mvv.mission', 'title') || $t('about.missionVisionValues.mission.title') }}
                </h2>
              </div>
              <p class="text-xl text-gray-800 leading-relaxed">
                {{ singleField('about.mvv.mission', 'statement') || $t('about.missionVisionValues.mission.statement') }}
              </p>
            </div>
            <div v-if="singleMeta('about.mvv.mission', 'imageUrl')" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112">
              <img :src="singleMeta('about.mvv.mission', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('about.mvv.mission', 'focalX') || 50}% ${singleMeta('about.mvv.mission', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="py-16 bg-gray-50">
      <div class="px-2 sm:px-10 lg:px-16">
        <div class="bg-purple-50 rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12">
          <div :class="singleMeta('about.mvv.vision', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
            <div v-if="singleMeta('about.mvv.vision', 'imageUrl')" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112 order-1 lg:order-0">
              <img :src="singleMeta('about.mvv.vision', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('about.mvv.vision', 'focalX') || 50}% ${singleMeta('about.mvv.vision', 'focalY') || 50}%` }" alt="" />
            </div>
            <div class="px-4 py-6 sm:px-0 sm:py-0">
              <div class="flex items-start gap-4 mb-4">
                <UIcon
                  v-if="!singleMeta('about.mvv.vision', 'imageUrl')"
                  name="i-heroicons-eye"
                  class="w-12 h-12 text-purple-600 shrink-0"
                />
                <h2 class="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-900">
                  {{ singleField('about.mvv.vision', 'title') || $t('about.missionVisionValues.vision.title') }}
                </h2>
              </div>
              <p class="text-xl text-gray-800 leading-relaxed">
                {{ singleField('about.mvv.vision', 'statement') || $t('about.missionVisionValues.vision.statement') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-4xl lg:text-5xl font-bold text-center text-indigo-800 mb-4">
          {{ $t('about.missionVisionValues.values.title') }}
        </h2>
        <p class="text-xl text-center text-gray-600 mb-12">
          {{ $t('about.missionVisionValues.values.subtitle') }}
        </p>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(value, index) in valuesWithIcons"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
          >
            <div class="flex items-center gap-4 mb-4">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shrink-0"
              >
                <UIcon :name="value.icon" class="w-6 h-6 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ value.title }}
              </h3>
            </div>
            <p class="text-gray-700">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-4xl font-bold mb-6">
          {{ $t('about.missionVisionValues.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('about.missionVisionValues.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/admissions/who-can-apply')"
            size="lg"
            variant="solid"
            class="bg-white text-green-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('about.missionVisionValues.cta.learnMore') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-green-600 justify-center"
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
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'about.mvv.intro',
    'about.mvv.mission',
    'about.mvv.vision',
    'about.mvv.values',
  ]));

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
    const dbItems = getItems('about.mvv.values');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || valueIcons[index] || 'i-heroicons-star-solid',
      }));
    }
    const values = tm('about.missionVisionValues.values.items') as any[];
    return values.map((v: any, i: number) => ({
      title: typeof v.title === 'string' ? v.title : rt(v.title),
      description: typeof v.description === 'string' ? v.description : rt(v.description),
      icon: valueIcons[i],
    }));
  });

  // Set page metadata
  useHead({
    title: 'Mission, Vision & Values - CEE',
    meta: [
      {
        name: 'description',
        content:
          "Learn about CEE's mission, vision, and core values that guide our Christian education in Siguatepeque, Honduras.",
      },
    ],
  });
</script>
