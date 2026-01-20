<template>
  <div class="bg-white">
    <!-- Section 1: Hero Video (Full viewport) -->
    <section class="relative h-screen bg-gradient-to-br from-blue-600 to-blue-800">
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
      <div class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
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
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.welcome.title') }}
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            {{ $t('home.welcome.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: Values and Principles -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.values.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.values.subtitle') }}
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <UCard
            v-for="(value, index) in $tm('home.values.items')"
            :key="index"
            class="text-center"
          >
            <template #header>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ value.title }}
              </h3>
            </template>
            <p class="text-gray-600">
              {{ value.description }}
            </p>
          </UCard>
        </div>
      </div>
    </section>

    <!-- Section 4: Enrollment -->
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
                <UIcon name="i-heroicons-check-circle-20-solid" class="w-6 h-6 text-green-500 mr-3" />
                {{ feature }}
              </li>
            </ul>
            <UButton size="lg">
              {{ $t('home.enrollment.cta') }}
            </UButton>
          </div>
          <div>
            <!-- Placeholder for enrollment image -->
            <div class="bg-gray-200 rounded-lg shadow-lg w-full h-96 flex items-center justify-center">
              <p class="text-gray-400 text-lg">{{ $t('home.enrollment.title') }}</p>
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
                {{ activity.title }}
              </h3>
            </template>
            <p class="text-gray-600">
              {{ activity.description }}
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
                {{ newsItem.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ newsItem.date }}
              </p>
            </template>
            <p class="text-gray-600">
              {{ newsItem.excerpt }}
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
})
</script>
