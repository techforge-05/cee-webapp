<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('admissions.howToApply.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-emerald-100">
          {{ $t('admissions.howToApply.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 lg:py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <p class="text-xl text-gray-700 leading-relaxed mb-10 text-center">
            {{ $t('admissions.howToApply.intro') }}
          </p>

          <!-- Steps -->
          <div class="space-y-6">
            <div
              v-for="(step, index) in steps"
              :key="index"
              class="flex gap-4 md:gap-6"
            >
              <div
                class="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg md:text-xl"
              >
                {{ index + 1 }}
              </div>
              <div class="flex-1 pb-6 border-b border-gray-200">
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ $rt(step.title) }}
                </h3>
                <p class="text-gray-700">
                  {{ $rt(step.description) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Important Dates Section -->
    <section class="py-12 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-12 h-12 text-emerald-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t('admissions.howToApply.dates.title') }}
          </h2>
          <p class="text-lg text-gray-700">
            {{ $t('admissions.howToApply.dates.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-emerald-600 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t('admissions.howToApply.cta.title') }}
        </h2>
        <p class="text-lg text-emerald-100 mb-6">
          {{ $t('admissions.howToApply.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/contact/form')"
            size="lg"
            variant="solid"
            class="bg-white text-emerald-700 hover:bg-gray-100"
          >
            {{ $t('admissions.howToApply.cta.contact') }}
          </UButton>
          <UButton
            :to="localePath('/admissions/who-can-apply')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-emerald-700"
          >
            {{ $t('admissions.howToApply.cta.requirements') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm } = useI18n();

const steps = computed(() => tm('admissions.howToApply.steps') as any[]);

useHead({
  title: 'How to Apply - Admissions - CEE',
});
</script>
