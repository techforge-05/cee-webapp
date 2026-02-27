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
          <div :class="singleMeta('admissions.howToApply.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10' : 'mb-10 text-center'">
            <div>
              <p class="text-2xl md:text-3xl font-semibold text-emerald-800 leading-snug">
                {{ singleField('admissions.howToApply.intro', 'text') || $t('admissions.howToApply.intro') }}
              </p>
            </div>
            <div v-if="singleMeta('admissions.howToApply.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
              <img :src="singleMeta('admissions.howToApply.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('admissions.howToApply.intro', 'focalX') || 50}% ${singleMeta('admissions.howToApply.intro', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>

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
                  {{ step.title }}
                </h3>
                <p class="text-gray-700">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Admission Dates Section -->
    <section class="py-12 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-calendar-days"
            class="w-12 h-12 text-emerald-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ admissionsEvents.length > 0
              ? $t('admissions.howToApply.dates.upcomingTitle')
              : (singleField('admissions.howToApply.dates', 'title') || $t('admissions.howToApply.dates.title'))
            }}
          </h2>
          <!-- When there are upcoming admissions events -->
          <div v-if="admissionsEvents.length > 0">
            <div class="flex flex-wrap justify-center gap-4 mt-8 mb-6">
              <div
                v-for="event in admissionsEvents"
                :key="event.id"
                class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]"
              >
                <div class="flex items-start gap-4">
                  <div class="bg-emerald-100 text-emerald-700 rounded-lg px-3 py-2 text-center shrink-0">
                    <div class="text-xl font-bold leading-none">{{ formatDay(event.start_date) }}</div>
                    <div class="text-xs uppercase mt-1">{{ formatMonth(event.start_date) }}</div>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ event.title }}</h3>
                    <p v-if="event.description" class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                  </div>
                </div>
              </div>
            </div>
            <UButton
              :to="localePath('/admissions/calendar')"
              variant="outline"
              class="border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-center"
            >
              <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
              {{ $t('admissions.howToApply.dates.viewCalendar') }}
            </UButton>
          </div>

          <!-- Default: no upcoming events -->
          <div v-else>
            <p class="text-lg text-gray-700 mb-4">
              {{ singleField('admissions.howToApply.dates', 'description') || $t('admissions.howToApply.dates.description') }}
            </p>
            <UButton
              :to="localePath('/contact/info')"
              variant="outline"
              class="border-emerald-600 text-emerald-600 hover:bg-emerald-50 justify-center"
            >
              <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
              {{ $t('admissions.howToApply.dates.contactLink') }}
            </UButton>
          </div>

          <div v-if="singleMeta('admissions.howToApply.dates', 'imageUrl')" class="rounded-lg overflow-hidden mt-6">
            <img :src="singleMeta('admissions.howToApply.dates', 'imageUrl')" class="w-full h-64 object-cover" :style="{ objectPosition: `${singleMeta('admissions.howToApply.dates', 'focalX') || 50}% ${singleMeta('admissions.howToApply.dates', 'focalY') || 50}%` }" alt="" />
          </div>
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
            :to="localePath('/contact/info')"
            size="lg"
            variant="solid"
            class="bg-white text-emerald-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('admissions.howToApply.cta.contact') }}
          </UButton>
          <UButton
            :to="localePath('/admissions/who-can-apply')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-emerald-700 justify-center"
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
const { locale, tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta } = usePublicContent();
const { events: calendarEvents, loadEvents } = useCalendarAdmin();

onMounted(() => {
  loadContent([
    'admissions.howToApply.intro',
    'admissions.howToApply.dates',
    'admissions.howToApply.steps',
  ]);
  loadEvents();
});

const admissionsEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return calendarEvents.value
    .filter(e => e.event_type === 'admissions' && new Date(e.start_date) >= today)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .map(e => ({
      ...e,
      title: locale.value === 'en' ? e.title_en : e.title_es,
      description: locale.value === 'en' ? (e.description_en || '') : (e.description_es || ''),
    }));
});

const formatDay = (dateStr: string) => {
  if (!dateStr) return '--';
  return new Date(dateStr).getDate();
};

const formatMonth = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = locale.value === 'es'
    ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[date.getMonth()];
};

const steps = computed(() => {
  const dbItems = getItems('admissions.howToApply.steps');
  if (dbItems.length > 0) {
    return dbItems.map(item => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
    }));
  }
  const items = tm('admissions.howToApply.steps') as any[];
  if (!Array.isArray(items)) return [];
  return items.map((s: any) => ({
    title: typeof s.title === 'string' ? s.title : rt(s.title),
    description: typeof s.description === 'string' ? s.description : rt(s.description),
  }));
});

useHead({
  title: 'How to Apply - Admissions - CEE',
});
</script>
