<template>
  <div class="bg-white">
    <!-- Section 1: Hero Video (Full viewport) -->
    <section
      class="relative h-screen bg-linear-to-br from-blue-600 to-blue-800"
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
    <section
      class="relative py-32 bg-linear-to-br from-green-600 to-green-800 overflow-hidden"
    >
      <!-- Decorative background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute inset-0"
          style="
            background-image: repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              rgba(255, 255, 255, 0.1) 35px,
              rgba(255, 255, 255, 0.1) 70px
            );
          "
        ></div>
      </div>

      <div class="max-w-4xl ml-[15%] px-4 relative z-10">
        <div class="text-left">
          <h2
            class="text-2xl md:text-5xl font-black text-white mb-1 uppercase tracking-tight"
          >
            {{ $t('home.welcome.titlePartOne') }}
          </h2>
          <h1
            class="text-5xl md:text-7xl font-black text-white mb-8 uppercase tracking-tight"
          >
            {{ $t('home.welcome.titlePartTwo') }}
          </h1>
          <p
            class="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl"
          >
            {{ $t('home.welcome.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: Offered Grades and Programs -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
              {{ $t('home.enrollment.title') }}
            </h2>
            <p class="text-lg text-gray-600 mb-6">
              {{ $t('home.enrollment.description') }}
            </p>
            <ul class="space-y-3 mb-8">
              <li
                v-for="(feature, index) in $tm('home.enrollment.features')"
                :key="index"
                class="flex items-center text-gray-700"
              >
                <UIcon
                  name="i-heroicons-check-circle-20-solid"
                  class="w-6 h-6 text-green-500 mr-3"
                />
                {{ $rt(feature) }}
              </li>
            </ul>
            <UButton size="lg">
              {{ $t('home.enrollment.cta') }}
            </UButton>
          </div>
          <div>
            <!-- Placeholder for enrollment image -->
            <div
              class="bg-gray-200 rounded-lg shadow-lg w-full h-96 flex items-center justify-center"
            >
              <p class="text-gray-400 text-lg">
                {{ $t('home.enrollment.title') }}
              </p>
            </div>
            <!-- Replace with actual image when available:
            <img
              src="/images/enrollment.jpg"
              alt="Enrollment"
              class="rounded-lg shadow-lg w-full"
            />
            -->
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Values and Principles -->
    <section class="py-32 bg-yellow-500/50">
      <div class="max-w-[80%] mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-yellow-600 mb-4">
            {{ $t('home.values.title').toUpperCase() }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.values.subtitle') }}
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- First box: Passion for God (always visible, no rotation) -->
          <div
            class="h-80 text-center bg-yellow-600 rounded-lg p-10 shadow-xl flex flex-col items-center justify-center border-18 border-yellow-800/50"
          >
            <h3 class="text-xl font-semibold text-white mb-4">
              {{ $rt($tm('home.values.items')[0].title) }}
            </h3>
            <p class="text-white/90">
              {{ $rt($tm('home.values.items')[0].description) }}
            </p>
          </div>

          <!-- Rotating boxes (positions 2-4) -->
          <div
            v-for="(value, index) in displayedValues"
            :key="index"
            class="relative h-80"
          >
            <Transition name="value-fade" mode="out-in">
              <div
                :key="value.key"
                class="absolute inset-0 text-center bg-yellow-600 rounded-lg p-10 shadow-xl flex flex-col items-center justify-center"
              >
                <h3 class="text-xl font-semibold text-white mb-4">
                  {{ $rt(value.data.title) }}
                </h3>
                <p class="text-white/90">
                  {{ $rt(value.data.description) }}
                </p>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: School Activities -->
    <section class="py-20 bg-gray-50">
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
    <section class="py-20">
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
  import { ref, onMounted, onUnmounted } from 'vue';
  import { useI18n } from 'vue-i18n';

  // Remove default layout styling since we want full-width sections
  definePageMeta({
    layout: 'default',
  });

  interface ValueItem {
    key: string;
    data: any;
    originalIndex: number;
  }

  const { tm } = useI18n();
  const displayedValues = ref<ValueItem[]>([]);
  const rotationIntervals: NodeJS.Timeout[] = [];
  const usedIndices = new Set<number>();

  // Get all values from i18n (excluding first one - Passion for God)
  const getAllValues = () => {
    const values = tm('home.values.items') as any[];
    return values
      .slice(1) // Skip first value (Passion for God)
      .map((value: any, index: number) => ({
        key: `value-${index + 1}-${Date.now()}`,
        data: value,
        originalIndex: index + 1,
      }));
  };

  // Get a random unused value
  const getRandomUnusedValue = (): ValueItem => {
    const allValues = getAllValues();
    const availableValues = allValues.filter(
      (v) => !usedIndices.has(v.originalIndex),
    );

    if (availableValues.length === 0) {
      // If all values are used, reset and pick any
      usedIndices.clear();
    }

    const pool = availableValues.length > 0 ? availableValues : allValues;
    const randomValue = pool[Math.floor(Math.random() * pool.length)];

    // Fallback to first value if somehow undefined
    return randomValue || allValues[0];
  };

  // Initialize with 3 different random values (excluding Passion for God)
  const initializeValues = () => {
    const allValues = getAllValues();
    const shuffled = [...allValues].sort(() => Math.random() - 0.5);
    displayedValues.value = shuffled.slice(0, 3);

    // Track used indices
    usedIndices.clear();
    displayedValues.value.forEach((v) => usedIndices.add(v.originalIndex));
  };

  // Rotate a single value at a specific index
  const rotateSingleValue = (index: number) => {
    const currentValue = displayedValues.value[index];
    if (!currentValue) return;

    // Remove current value from used set
    usedIndices.delete(currentValue.originalIndex);

    // Get new random value
    const newValue = getRandomUnusedValue();

    // Add new value to used set
    usedIndices.add(newValue.originalIndex);

    // Update the value
    displayedValues.value[index] = newValue;
  };

  onMounted(() => {
    // Initialize with 3 random values (excluding Passion for God)
    initializeValues();

    // Set up individual rotation intervals for each rotating card (3 cards)
    // Each card rotates every 30 seconds, but staggered by 10 seconds
    [0, 1, 2].forEach((index) => {
      setTimeout(() => {
        // First rotation after initial delay
        rotateSingleValue(index);

        // Then rotate every 30 seconds
        const interval = setInterval(() => {
          rotateSingleValue(index);
        }, 30000);

        rotationIntervals.push(interval);
      }, index * 10000); // Stagger by 10 seconds
    });
  });

  onUnmounted(() => {
    rotationIntervals.forEach((interval) => clearInterval(interval));
  });
</script>

<style scoped>
  .value-fade-enter-active,
  .value-fade-leave-active {
    transition: opacity 1.2s ease;
  }

  .value-fade-enter-from {
    opacity: 0;
  }

  .value-fade-leave-to {
    opacity: 0;
  }
</style>
