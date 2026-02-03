<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('admissions.calendar.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-emerald-100">
          {{ $t('admissions.calendar.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-12 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-document-text"
            class="w-16 h-16 text-emerald-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('admissions.calendar.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Calendar Component - Filtered to show only admissions events -->
    <section class="py-12">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Calendar
          :default-event-types="['admissions']"
          :hide-event-type-filter="true"
        />
      </div>
    </section>

    <!-- No Events Notice -->
    <section class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-2xl mx-auto">
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <UIcon
              name="i-heroicons-information-circle"
              class="w-10 h-10 text-emerald-600 mx-auto mb-3"
            />
            <p class="text-gray-700">
              {{ $t('admissions.calendar.noEventsNote') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-12 bg-emerald-600 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t('admissions.calendar.cta.title') }}
        </h2>
        <p class="text-lg text-emerald-100 mb-6">
          {{ $t('admissions.calendar.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/admissions/how-to-apply')"
            size="lg"
            variant="solid"
            class="bg-white text-emerald-700 hover:bg-gray-100"
          >
            {{ $t('admissions.calendar.cta.howToApply') }}
          </UButton>
          <UButton
            :to="localePath('/contact/form')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-emerald-700"
          >
            {{ $t('admissions.calendar.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();

useHead({
  title: 'Admissions Calendar - CEE',
  meta: [
    {
      name: 'description',
      content:
        'View important admissions dates, application deadlines, and enrollment periods for CEE.',
    },
  ],
});
</script>
