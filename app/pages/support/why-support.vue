<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.whySupport.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.whySupport.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div :class="singleMeta('support.whySupport.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto'">
          <div>
            <div class="flex items-center gap-4 mb-8">
              <div
                class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0"
              >
                <UIcon
                  name="i-heroicons-building-library"
                  class="w-8 h-8 text-red-600"
                />
              </div>
              <h2 class="text-3xl font-bold text-gray-900">
                {{ singleField('support.whySupport.intro', 'title') || $t('support.whySupport.intro.title') }}
              </h2>
            </div>
            <div class="prose prose-lg max-w-none">
              <p class="text-lg text-gray-700 mb-6 leading-relaxed">
                {{ singleField('support.whySupport.intro', 'paragraph1') || $t('support.whySupport.intro.paragraph1') }}
              </p>
              <p class="text-lg text-gray-700 leading-relaxed">
                {{ singleField('support.whySupport.intro', 'paragraph2') || $t('support.whySupport.intro.paragraph2') }}
              </p>
            </div>
          </div>
          <div v-if="singleMeta('support.whySupport.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('support.whySupport.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('support.whySupport.intro', 'focalX') || 50}% ${singleMeta('support.whySupport.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Nonprofit Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-orange-50 rounded-2xl p-8 md:p-12">
          <div v-if="singleMeta('support.whySupport.nonprofit', 'imageUrl')" class="rounded-lg overflow-hidden mb-6">
            <img :src="singleMeta('support.whySupport.nonprofit', 'imageUrl')" class="w-full h-64 object-cover" :style="{ objectPosition: `${singleMeta('support.whySupport.nonprofit', 'focalX') || 50}% ${singleMeta('support.whySupport.nonprofit', 'focalY') || 50}%` }" alt="" />
          </div>
          <div class="flex items-start gap-4 mb-4">
            <UIcon
              name="i-heroicons-heart"
              class="w-12 h-12 text-orange-600 shrink-0"
            />
            <div>
              <h2 class="text-3xl font-bold text-orange-900 mb-4">
                {{ singleField('support.whySupport.nonprofit', 'title') || $t('support.whySupport.nonprofit.title') }}
              </h2>
              <p class="text-xl text-gray-800 leading-relaxed">
                {{ singleField('support.whySupport.nonprofit', 'description') || $t('support.whySupport.nonprofit.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          {{ $t('support.whySupport.impact.title') }}
        </h2>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(item, index) in impactItemsWithIcons"
            :key="index"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(50%-1rem)]"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0"
              >
                <UIcon :name="item.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ item.title }}
                </h3>
                <p class="text-gray-700">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('support.whySupport.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('support.whySupport.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/support/donate')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('support.whySupport.cta.donate') }}
          </UButton>
          <UButton
            :to="localePath('/support/scholarships')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
          >
            {{ $t('support.whySupport.cta.learnMore') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta } = usePublicContent();

onMounted(() => loadContent([
  'support.whySupport.intro',
  'support.whySupport.nonprofit',
  'support.whySupport.impact',
]));

const impactIcons = [
  'i-heroicons-academic-cap',
  'i-heroicons-building-office-2',
  'i-heroicons-book-open',
  'i-heroicons-sparkles',
];

const impactItemsWithIcons = computed(() => {
  const dbItems = getItems('support.whySupport.impact');
  if (dbItems.length > 0) {
    return dbItems.map((item, index) => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
      icon: field(item, 'icon') || impactIcons[index] || 'i-heroicons-star',
    }));
  }
  const items = tm('support.whySupport.impact.items') as any[];
  return items.map((item: any, index: number) => ({
    title: typeof item.title === 'string' ? item.title : rt(item.title),
    description: typeof item.description === 'string' ? item.description : rt(item.description),
    icon: impactIcons[index],
  }));
});

useHead({
  title: 'Why Support Our School - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Learn why supporting CEE matters and how your donations help provide quality Christian education in Siguatepeque, Honduras.',
    },
  ],
});
</script>
