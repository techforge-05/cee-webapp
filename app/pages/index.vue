<template>
  <div class="bg-white">
    <!-- Section 1: Hero Video (Full viewport) -->
    <section
      class="relative min-h-[500px] h-screen max-h-[800px] lg:max-h-none bg-linear-to-br from-blue-600 to-blue-800"
    >
      <!-- Video will go here when available -->
      <!-- <video
        class="absolute inset-0 w-full h-full object-cover"
        autoplay
        muted
        loop
        playsinline
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video> -->
      <div
        class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
      >
        <div class="text-center text-white px-4">
          <h1 class="text-5xl md:text-6xl font-bold mb-4">
            {{ $t('app.name') }}
          </h1>
          <p class="text-xl md:text-2xl">
            {{ $t('home.welcome.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 2: Welcome -->
    <!-- background-size: cover; -->
    <section
      class="relative py-10 md:py-20 overflow-hidden"
      style="
        background-image: url('/images/main-3.png');
        background-position: center;
        background-repeat: repeat;
      "
    >
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-green-400/30"></div>

      <div class="max-w-4xl mx-auto md:ml-[15%] md:mr-0 px-4 relative z-10">
        <div class="text-center md:text-left">
          <h2
            class="text-2xl md:text-5xl font-black text-white mb-1 uppercase tracking-tight"
          >
            {{ $t('home.welcome.titlePartOne') }}
          </h2>
          <h1
            class="text-5xl md:text-7xl font-black text-white mb-5 uppercase tracking-tight"
          >
            {{ $t('home.welcome.titlePartTwo') }}
          </h1>
          <h3
            class="text-xl md:text-3xl font-black text-white mb-8 tracking-tight"
          >
            "Jardín, Escuela e Instituto Bilingüe Siguatepeque"
          </h3>
          <p
            class="text-xl md:text-xl font-bold text-white leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            {{ $t('home.welcome.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: Offered Grades and Programs -->
    <section class="py-10 md:py-16 lg:py-28">
      <div class="max-w-7xl mx-auto px-2 md:px-6">
        <div class="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <h2
              class="text-center md:text-left text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-5 md:mb-6"
            >
              {{ $t('home.enrollment.title') }}
            </h2>
            <p
              class="text-center md:text-left text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
            >
              {{ $t('home.enrollment.description') }}
            </p>
            <ul class="space-y-4 md:space-y-5 mb-8 md:mb-10">
              <li
                v-for="(feature, index) in $tm('home.enrollment.features')"
                :key="index"
                class="flex items-center text-gray-700 text-lg md:text-xl"
              >
                <UIcon
                  name="i-heroicons-check-circle-20-solid"
                  class="w-7 h-7 md:w-8 md:h-8 text-green-500 mr-3 md:mr-4 flex-shrink-0"
                />
                {{ $rt(feature) }}
              </li>
            </ul>
            <div class="text-center md:text-left">
              <UButton
                size="lg"
                class="text-lg md:text-xl px-6 md:px-8 py-3 md:py-4"
              >
                {{ $t('home.enrollment.cta') }}
              </UButton>
            </div>
          </div>
          <div>
            <!-- Placeholder for enrollment image -->
            <div
              class="bg-gray-200 rounded-lg shadow-2xl w-full h-64 md:h-80 lg:h-96 xl:h-112.5 flex items-center justify-center"
            >
              <p class="text-gray-400 text-xl md:text-2xl">
                {{ $t('home.enrollment.title') }}
              </p>
            </div>
            <!-- Replace with actual image when available:
            <img
              src="/images/enrollment.jpg"
              alt="Enrollment"
              class="rounded-lg shadow-2xl w-full h-80 md:h-[450px] lg:h-[500px] object-cover"
            />
            -->
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Values and Principles -->
    <section class="grid md:grid-cols-2">
      <!-- Left: Full Image -->
      <div
        class="hidden md:flex relative items-center justify-center overflow-hidden"
      >
        <div
          class="bg-gray-300 w-full h-full min-h-80 md:min-h-96 lg:min-h-100 flex items-center justify-center"
        >
          <p class="text-gray-400 text-xl md:text-2xl">Values Image</p>
        </div>
        <!-- Replace with actual image when available:
        <img
          src="/images/values.jpg"
          alt="Values"
          class="w-full h-full min-h-80 md:min-h-96 lg:min-h-100 object-cover"
        />
        -->
      </div>

      <!-- Right: Title and Values List with yellow background -->
      <!-- background-size: cover; -->
      <div
        class="flex items-center"
        style="
          background-image: url('/images/main-yellow.png');
          background-position: center;
          background-repeat: no-repeat;
        "
      >
        <div
          class="bg-yellow-600/30 w-full h-full py-10 md:py-14 lg:py-20 px-8"
        >
          <div class="w-full flex flex-col items-center">
            <div class="mb-12">
              <h2
                class="text-4xl md:text-5xl font-bold text-purple-900 mb-4 text-center"
              >
                {{ $t('home.values.title') }}
              </h2>
              <p class="text-xl text-gray-700 font-semibold text-center">
                {{ $t('home.values.subtitle') }}
              </p>
            </div>
            <ul class="space-y-6">
              <li
                v-for="(value, index) in valuesWithIcons"
                :key="index"
                class="flex flex-col items-center md:flex-row md:items-start gap-1 md:gap-4"
              >
                <div class="flex gap-2 items-center">
                  <UIcon
                    :name="value.icon"
                    class="w-8 h-8 text-fuchsia-800 shrink-0 mt-1"
                  />
                  <h3
                    class="flex items-center text-xl md:text-2xl font-bold text-fuchsia-900 shadow-lg rounded-md px-2"
                  >
                    {{ $rt(value.title) }}
                  </h3>
                </div>
                <p
                  class="text-lg text-gray-700 text-center md:text-left md:pt-2 font-semibold"
                >
                  {{ $rt(value.description) }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: School Activities -->
    <section class="py-10 md:py-14 lg:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.activities.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.activities.subtitle') }}
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UCard
            v-for="(activity, index) in $tm('home.activities.items')"
            :key="index"
          >
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ $rt(activity.title) }}
              </h3>
            </template>
            <p class="text-gray-600">
              {{ $rt(activity.description) }}
            </p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Section 6: News -->
    <section class="py-5 md:py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.news.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.news.subtitle') }}
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-8">
          <UCard
            v-for="(newsItem, index) in $tm('home.news.items')"
            :key="index"
          >
            <template #header>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ $rt(newsItem.title) }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ $rt(newsItem.date) }}
              </p>
            </template>
            <p class="text-gray-600">
              {{ $rt(newsItem.excerpt) }}
            </p>
          </UCard>
        </div>
        <div class="text-center mt-12">
          <UButton variant="outline" size="lg">
            {{ $t('home.news.viewAll') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  // Remove default layout styling since we want full-width sections
  definePageMeta({
    layout: 'default',
  });

  const { tm } = useI18n();

  // Icon mapping for each value
  const valueIcons = [
    'i-heroicons-heart-solid', // Passion for God
    'i-heroicons-shield-check-solid', // Integrity
    'i-heroicons-light-bulb-solid', // Creativity
    'i-heroicons-hand-raised-solid', // Respect
    'i-heroicons-hand-thumb-up-solid', // Service
    'i-heroicons-star-solid', // Excellence
    'i-heroicons-clipboard-document-check-solid', // Responsibility
  ];

  // Values with icons
  const valuesWithIcons = computed(() => {
    const values = tm('home.values.items') as any[];
    return values.map((value: any, index: number) => ({
      ...value,
      icon: valueIcons[index],
    }));
  });
</script>
