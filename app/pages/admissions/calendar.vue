<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 lg:py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('admissions.calendar.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-emerald-100">
          {{ $t('admissions.calendar.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('admissions.calendar.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('admissions.calendar.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('admissions.calendar.intro', 'focalX') || 50}% ${singleMeta('admissions.calendar.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('admissions.calendar.intro', 'text') || $t('admissions.calendar.intro') }}
        </p>
      </div>
    </section>

    <!-- Calendar Component - Filtered to show only admissions events -->
    <section class="py-12">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Calendar
          v-if="settingsLoaded"
          :default-event-types="['admissions']"
          :hide-event-type-filter="true"
          :initial-date="admissionsInitialDate"
        />
      </div>
    </section>

    <!-- No Events Notice -->
    <section class="py-8">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-2xl mx-auto">
          <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
            <p class="text-lg text-gray-700">
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
            class="bg-white text-emerald-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('admissions.calendar.cta.howToApply') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-emerald-700 justify-center"
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
const { loadContent, singleMeta, singleField } = usePublicContent();
const settingsLoaded = ref(false);

onMounted(async () => {
  await loadContent(['admissions.calendar.intro', 'admissions.calendar.settings']);
  settingsLoaded.value = true;
});

const admissionsInitialDate = computed(() => {
  // Check metadata first, then fall back to content_es (for after "Use default" restores)
  const raw = singleMeta('admissions.calendar.settings', 'defaultMonth')
    || singleField('admissions.calendar.settings', 'defaultMonth');
  const configuredMonth = parseInt(raw) || 7;
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-indexed
  const currentYear = now.getFullYear();

  // If current month is before configured month, show it this year
  // If current month is >= configured month, show it next year
  const targetYear = currentMonth < configuredMonth ? currentYear : currentYear + 1;
  return new Date(targetYear, configuredMonth - 1, 1); // month is 0-indexed in Date
});

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
