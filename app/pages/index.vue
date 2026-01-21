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
    <section class="py-20 bg-amber-300/50">
      <div class="max-w-[95%] mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-yellow-600 mb-4">
            {{ $t('home.values.title').toUpperCase() }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.values.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 items-start">
          <!-- Left: Image placeholder -->
          <div>
            <div
              class="bg-gray-200 rounded-lg shadow-lg w-full h-[700px] flex items-center justify-center sticky top-8"
            >
              <p class="text-gray-400 text-lg">
                {{ $t('home.values.title') }}
              </p>
            </div>
            <!-- Replace with actual image when available:
            <img
              src="/images/values.jpg"
              alt="Values"
              class="rounded-lg shadow-lg w-full sticky top-8"
            />
            -->
          </div>

          <!-- Right: Values list with yellow background -->
          <div class="bg-yellow-600 rounded-lg shadow-xl p-8 md:p-10 lg:p-12">
            <div class="space-y-6">
              <!-- Passion for God -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-heart-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[0].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[0].description) }}
                  </p>
                </div>
              </div>

              <!-- Academic Excellence -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-academic-cap-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[1].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[1].description) }}
                  </p>
                </div>
              </div>

              <!-- Respect -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-hand-raised-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[2].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[2].description) }}
                  </p>
                </div>
              </div>

              <!-- Integrity -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-shield-check-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[3].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[3].description) }}
                  </p>
                </div>
              </div>

              <!-- Responsibility -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-clipboard-document-check-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[4].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[4].description) }}
                  </p>
                </div>
              </div>

              <!-- Service -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-hand-thumb-up-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[5].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[5].description) }}
                  </p>
                </div>
              </div>

              <!-- Innovation -->
              <div class="flex gap-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <UIcon
                      name="i-heroicons-light-bulb-solid"
                      class="w-7 h-7 text-white"
                    />
                  </div>
                </div>
                <div class="flex-1">
                  <h3 class="text-xl font-bold text-white mb-2">
                    {{ $rt($tm('home.values.items')[6].title) }}
                  </h3>
                  <p class="text-white/90 leading-relaxed">
                    {{ $rt($tm('home.values.items')[6].description) }}
                  </p>
                </div>
              </div>
            </div>
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
  import { ref, computed, onMounted, onUnmounted } from 'vue';
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

  // Simple refs for each position
  const value1 = ref<ValueItem | null>(null);
  const value2 = ref<ValueItem | null>(null);
  const value3 = ref<ValueItem | null>(null);

  const displayedValues = computed(() => {
    return [value1.value, value2.value, value3.value].filter(
      (v) => v !== null,
    ) as ValueItem[];
  });

  const rotationIntervals: NodeJS.Timeout[] = [];

  // All values excluding Passion for God
  const allValues = computed(() => {
    const values = tm('home.values.items') as any[];
    return values.slice(1).map((value: any, index: number) => ({
      key: `value-${index + 1}`,
      data: value,
      originalIndex: index + 1,
    }));
  });

  onMounted(() => {
    // Initialize with 3 random values
    const shuffled = [...allValues.value].sort(() => Math.random() - 0.5);
    if (shuffled[0]) {
      value1.value = { ...shuffled[0], key: `${shuffled[0].key}-0` };
    }
    if (shuffled[1]) {
      value2.value = { ...shuffled[1], key: `${shuffled[1].key}-1` };
    }
    if (shuffled[2]) {
      value3.value = { ...shuffled[2], key: `${shuffled[2].key}-2` };
    }

    // Rotation disabled for now to prevent crashes
    // TODO: Re-enable after finding the cause of crashes
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
