<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.statementOfFaith.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.statementOfFaith.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-book-open"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('about.statementOfFaith.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Beliefs Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="space-y-8">
          <div
            v-for="(belief, index) in beliefs"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-l-4"
            :class="getBorderColor(index)"
          >
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center"
                  :class="getIconBgColor(index)"
                >
                  <UIcon :name="belief.icon" class="w-6 h-6 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-4">
                  {{ $rt(belief.title) }}
                </h3>
                <p class="text-lg text-gray-700 leading-relaxed">
                  {{ $rt(belief.content) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Closing Statement -->
    <section
      class="py-16 bg-gradient-to-r from-purple-700 to-indigo-800 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon name="i-heroicons-heart" class="w-16 h-16 mx-auto mb-6" />
          <p class="text-2xl font-semibold mb-8">
            {{ $t('about.statementOfFaith.closing') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/about/mission-vision-values')"
              size="lg"
              variant="solid"
              class="bg-white text-purple-700 hover:bg-gray-100"
            >
              {{ $t('about.statementOfFaith.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-purple-700"
            >
              {{ $t('about.statementOfFaith.cta.contactUs') }}
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

  const beliefIcons = [
    'i-heroicons-sparkles', // The Triune God
    'i-heroicons-users', // Humanity's Fallen Nature
    'i-heroicons-gift', // God's Grace
    'i-heroicons-star', // Jesus Christ
    'i-heroicons-bolt', // The Holy Spirit
    'i-heroicons-book-open', // Scripture
    'i-heroicons-home', // The Church
    'i-heroicons-megaphone', // The Great Commission
    'i-heroicons-home', // Love and Service
  ];

  const beliefs = computed(() => {
    const items = tm('about.statementOfFaith.beliefs') as any[];
    return items.map((belief: any, index: number) => ({
      ...belief,
      icon: beliefIcons[index],
    }));
  });

  const getBorderColor = (index: number) => {
    const colors = [
      'border-purple-500',
      'border-blue-500',
      'border-indigo-500',
      'border-violet-500',
      'border-fuchsia-500',
      'border-purple-600',
      'border-blue-600',
      'border-indigo-600',
      'border-violet-600',
    ];
    return colors[index % colors.length];
  };

  const getIconBgColor = (index: number) => {
    const colors = [
      'bg-purple-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-purple-600',
      'bg-blue-600',
      'bg-indigo-600',
      'bg-violet-600',
    ];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Statement of Faith - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Our Christian beliefs and theological foundation that guide our educational mission at CEE in Siguatepeque, Honduras.',
      },
    ],
  });
</script>
