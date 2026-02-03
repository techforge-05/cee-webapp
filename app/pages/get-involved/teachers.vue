<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('getInvolved.teachers.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-amber-100">
          {{ $t('getInvolved.teachers.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 lg:py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-16 h-16 text-amber-500 mx-auto mb-4"
            />
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ $t('getInvolved.teachers.intro') }}
            </p>
          </div>

          <!-- What We Look For -->
          <div class="bg-amber-50 rounded-xl p-8 mb-8">
            <h2 class="text-2xl font-bold text-amber-800 mb-4">
              {{ $t('getInvolved.teachers.qualifications.title') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in qualifications"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(item) }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div class="bg-gray-50 rounded-xl p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              {{ $t('getInvolved.teachers.benefits.title') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in benefits"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-star"
                  class="w-6 h-6 text-amber-500 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(item) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-amber-500 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t('getInvolved.teachers.cta.title') }}
        </h2>
        <p class="text-lg text-amber-100 mb-6">
          {{ $t('getInvolved.teachers.cta.description') }}
        </p>
        <UButton
          :to="localePath('/contact/form')"
          size="lg"
          variant="solid"
          class="bg-white text-amber-700 hover:bg-gray-100"
        >
          {{ $t('getInvolved.teachers.cta.button') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm } = useI18n();

const qualifications = computed(() => tm('getInvolved.teachers.qualifications.items') as any[]);
const benefits = computed(() => tm('getInvolved.teachers.benefits.items') as any[]);

useHead({
  title: 'Potential Teachers - Get Involved - CEE',
});
</script>
