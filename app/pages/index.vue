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
      class="relative py-20 overflow-hidden"
      style="
        background-image: url('/images/welcome3.jpeg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
      "
    >
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-black/30"></div>

      <div class="max-w-4xl mx-auto md:ml-[15%] md:mr-0 px-4 relative z-10">
        <div class="text-center md:text-left">
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
            class="text-xl md:text-xl font-bold text-white leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            {{ $t('home.welcome.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: Offered Grades and Programs -->
    <section class="py-20 md:py-28">
      <div class="max-w-7xl mx-auto px-2 md:px-6">
        <div class="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <h2
              class="text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-5 md:mb-6"
            >
              {{ $t('home.enrollment.title') }}
            </h2>
            <p
              class="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
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
            <UButton
              size="lg"
              class="text-lg md:text-xl px-6 md:px-8 py-3 md:py-4"
            >
              {{ $t('home.enrollment.cta') }}
            </UButton>
          </div>
          <div>
            <!-- Placeholder for enrollment image -->
            <div
              class="bg-gray-200 rounded-lg shadow-2xl w-full h-80 md:h-[450px] lg:h-[500px] flex items-center justify-center"
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
    <section class="py-20 md:py-28 bg-white">
      <div class="max-w-7xl mx-auto px-4 md:px-6">
        <div class="text-center mb-12">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {{ $t('home.values.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.values.subtitle') }}
          </p>
        </div>
        <div class="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <!-- Left: Image -->
          <div class="order-2 md:order-1">
            <div
              class="bg-gray-200 rounded-lg shadow-2xl w-full h-96 md:h-[500px] flex items-center justify-center"
            >
              <p class="text-gray-400 text-xl md:text-2xl">
                Values Image
              </p>
            </div>
            <!-- Replace with actual image when available:
            <img
              src="/images/values.jpg"
              alt="Values"
              class="rounded-lg shadow-2xl w-full h-96 md:h-[500px] object-cover"
            />
            -->
          </div>

          <!-- Right: Values List -->
          <div class="order-1 md:order-2">
            <ul class="space-y-6">
              <li
                v-for="(value, index) in $tm('home.values.items')"
                :key="index"
                class="border-l-4 border-blue-600 pl-4"
              >
                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {{ $rt(value.title) }}
                </h3>
                <p class="text-lg text-gray-700">
                  {{ $rt(value.description) }}
                </p>
              </li>
            </ul>
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
  // Remove default layout styling since we want full-width sections
  definePageMeta({
    layout: 'default',
  });
</script>
