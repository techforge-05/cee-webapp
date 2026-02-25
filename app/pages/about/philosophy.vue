<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
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
        <div :class="singleMeta('about.philosophy.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto text-center'">
          <div :class="!singleMeta('about.philosophy.intro', 'imageUrl') && 'text-center'">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-16 h-16 text-purple-600 mb-6"
              :class="!singleMeta('about.philosophy.intro', 'imageUrl') && 'mx-auto'"
            />
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ singleField('about.philosophy.intro', 'text') || $t('about.philosophy.intro') }}
            </p>
          </div>
          <div v-if="singleMeta('about.philosophy.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('about.philosophy.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('about.philosophy.intro', 'focalX') || 50}% ${singleMeta('about.philosophy.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Philosophy Sections -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="space-y-12">
          <!-- Biblical Foundation -->
          <div class="bg-blue-50 rounded-lg p-8 md:p-12">
            <div v-if="singleMeta('about.philosophy.biblical', 'imageUrl')" class="rounded-lg overflow-hidden mb-6">
              <img :src="singleMeta('about.philosophy.biblical', 'imageUrl')" class="w-full h-64 object-cover" :style="{ objectPosition: `${singleMeta('about.philosophy.biblical', 'focalX') || 50}% ${singleMeta('about.philosophy.biblical', 'focalY') || 50}%` }" alt="" />
            </div>
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                :name="singleField('about.philosophy.biblical', 'icon') || 'i-heroicons-book-open'"
                class="w-12 h-12 text-blue-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-blue-900">
                {{ singleField('about.philosophy.biblical', 'title') || $t('about.philosophy.biblical.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ singleField('about.philosophy.biblical', 'content') || $t('about.philosophy.biblical.content') }}
            </p>
          </div>

          <!-- Human Dignity -->
          <div class="bg-purple-50 rounded-lg p-8 md:p-12">
            <div v-if="singleMeta('about.philosophy.dignity', 'imageUrl')" class="rounded-lg overflow-hidden mb-6">
              <img :src="singleMeta('about.philosophy.dignity', 'imageUrl')" class="w-full h-64 object-cover" :style="{ objectPosition: `${singleMeta('about.philosophy.dignity', 'focalX') || 50}% ${singleMeta('about.philosophy.dignity', 'focalY') || 50}%` }" alt="" />
            </div>
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                :name="singleField('about.philosophy.dignity', 'icon') || 'i-heroicons-user-group'"
                class="w-12 h-12 text-purple-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-purple-900">
                {{ singleField('about.philosophy.dignity', 'title') || $t('about.philosophy.dignity.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ singleField('about.philosophy.dignity', 'content') || $t('about.philosophy.dignity.content') }}
            </p>
          </div>

          <!-- Bilingual Education -->
          <div class="bg-indigo-50 rounded-lg p-8 md:p-12">
            <div v-if="singleMeta('about.philosophy.bilingual', 'imageUrl')" class="rounded-lg overflow-hidden mb-6">
              <img :src="singleMeta('about.philosophy.bilingual', 'imageUrl')" class="w-full h-64 object-cover" :style="{ objectPosition: `${singleMeta('about.philosophy.bilingual', 'focalX') || 50}% ${singleMeta('about.philosophy.bilingual', 'focalY') || 50}%` }" alt="" />
            </div>
            <div class="flex items-start gap-4 mb-6">
              <UIcon
                :name="singleField('about.philosophy.bilingual', 'icon') || 'i-heroicons-globe-americas'"
                class="w-12 h-12 text-indigo-600 shrink-0"
              />
              <h2 class="text-3xl font-bold text-indigo-900">
                {{ singleField('about.philosophy.bilingual', 'title') || $t('about.philosophy.bilingual.title') }}
              </h2>
            </div>
            <p class="text-xl text-gray-800 leading-relaxed">
              {{ singleField('about.philosophy.bilingual', 'content') || $t('about.philosophy.bilingual.content') }}
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
        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(principle, index) in principles"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getIconBgColor(index)"
            >
              <UIcon :name="principle.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ principle.title }}
            </h3>
            <p class="text-gray-700">
              {{ principle.description }}
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
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('about.philosophy.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700 justify-center"
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
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'about.philosophy.intro',
    'about.philosophy.biblical',
    'about.philosophy.dignity',
    'about.philosophy.bilingual',
    'about.philosophy.principles',
  ]));

  const principleIcons = [
    'i-heroicons-book-open-solid',
    'i-heroicons-heart-solid',
    'i-heroicons-globe-americas-solid',
  ];

  const principles = computed(() => {
    const dbItems = getItems('about.philosophy.principles');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || principleIcons[index] || 'i-heroicons-star-solid',
      }));
    }
    const items = tm('about.philosophy.principles.items') as any[];
    return items.map((principle: any, index: number) => ({
      title: typeof principle.title === 'string' ? principle.title : rt(principle.title),
      description: typeof principle.description === 'string' ? principle.description : rt(principle.description),
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
