<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.calendar.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.calendar.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('academics.calendar.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Calendar Component -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Calendar />
      </div>
    </section>

    <!-- Important Dates Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.calendar.importantDates.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(item, index) in importantDates"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getDateBgColor(index)"
            >
              <UIcon :name="item.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ item.title }}
            </h3>
            <p class="text-gray-700">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Download/Print Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-blue-50 rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div class="text-center">
            <UIcon
              name="i-heroicons-arrow-down-tray"
              class="w-12 h-12 text-blue-600 mx-auto mb-6"
            />
            <h2 class="text-3xl font-bold text-blue-900 mb-4">
              {{ $t('academics.calendar.download.title') }}
            </h2>
            <p class="text-xl text-gray-800 mb-6">
              {{ $t('academics.calendar.download.description') }}
            </p>
            <div class="flex justify-center">
              <UButton
                size="lg"
                icon="i-heroicons-document-arrow-down"
                color="secondary"
              >
                {{ $t('academics.calendar.download.pdf') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('academics.calendar.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('academics.calendar.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('academics.calendar.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700 justify-center"
            >
              {{ $t('academics.calendar.cta.contactUs') }}
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
  const { loadContent, getItems, field } = usePublicContent();

  onMounted(() => loadContent([
    'academics.calendar.importantDates',
  ]));

  const importantDateIcons = [
    'i-heroicons-calendar',
    'i-heroicons-book-open',
    'i-heroicons-sparkles',
  ];

  const importantDates = computed(() => {
    const dbItems = getItems('academics.calendar.importantDates');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || importantDateIcons[index % importantDateIcons.length],
      }));
    }
    const items = tm('academics.calendar.importantDates.items') as any[];
    return items.map((item: any, index: number) => ({
      title: typeof item.title === 'string' ? item.title : rt(item.title),
      description: typeof item.description === 'string' ? item.description : rt(item.description),
      icon: importantDateIcons[index % importantDateIcons.length],
    }));
  });

  const getDateBgColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Academic Calendar - CEE',
    meta: [
      {
        name: 'description',
        content:
          'View the academic calendar for CEE with important dates, holidays, exams, and school events throughout the year.',
      },
    ],
  });
</script>
