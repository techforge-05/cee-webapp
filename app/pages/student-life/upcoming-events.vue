<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.upcomingEvents.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-indigo-100">
          {{ $t('studentLife.upcomingEvents.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-12 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div :class="singleMeta('studentLife.upcomingEvents.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto text-center'">
          <div :class="!singleMeta('studentLife.upcomingEvents.intro', 'imageUrl') && 'text-center'">
            <UIcon
              v-if="!singleMeta('studentLife.upcomingEvents.intro', 'imageUrl')"
              name="i-heroicons-calendar-days"
              class="w-16 h-16 text-indigo-600 mb-6"
              :class="!singleMeta('studentLife.upcomingEvents.intro', 'imageUrl') && 'mx-auto'"
            />
            <h2 class="text-2xl md:text-3xl font-bold text-indigo-700 mb-4">
              {{ singleField('studentLife.upcomingEvents.intro', 'title') || $t('studentLife.upcomingEvents.intro.title') }}
            </h2>
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ singleField('studentLife.upcomingEvents.intro', 'description') || $t('studentLife.upcomingEvents.intro.description') }}
            </p>
          </div>
          <div v-if="singleMeta('studentLife.upcomingEvents.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('studentLife.upcomingEvents.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('studentLife.upcomingEvents.intro', 'focalX') || 50}% ${singleMeta('studentLife.upcomingEvents.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Event Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-10">
          {{ $t('studentLife.upcomingEvents.featured.title') }}
        </h2>

        <div class="max-w-4xl mx-auto">
          <!-- Featured Event Card -->
          <div
            v-if="featuredEvent"
            class="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <!-- Event Image -->
            <div class="relative h-72 md:h-96 bg-gray-200">
              <img
                v-if="featuredEvent.image_url"
                :src="featuredEvent.image_url"
                :alt="featuredEvent.title"
                class="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
              >
                <img
                  src="/images/logo.png"
                  alt="CEE Logo"
                  class="h-32 w-auto opacity-50"
                  loading="lazy"
                />
              </div>
              <!-- Date Badge -->
              <div
                class="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg"
              >
                <div class="text-2xl font-bold">{{ formatDay(featuredEvent.date) }}</div>
                <div class="text-sm uppercase">{{ formatMonth(featuredEvent.date) }}</div>
              </div>
            </div>

            <!-- Event Details -->
            <div class="p-8">
              <div class="flex items-center gap-2 text-indigo-600 mb-3">
                <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                <span class="font-medium">{{ formatFullDate(featuredEvent.date) }}</span>
              </div>
              <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {{ featuredEvent.title }}
              </h3>
              <p
                v-if="featuredEvent.description"
                class="text-lg text-gray-600 leading-relaxed"
              >
                {{ featuredEvent.description }}
              </p>
              <div
                v-if="featuredEvent.location"
                class="mt-4 flex items-center gap-2 text-gray-500"
              >
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
                <span>{{ featuredEvent.location }}</span>
              </div>
            </div>
          </div>

          <!-- No Events Placeholder -->
          <div
            v-else
            class="bg-gray-50 rounded-2xl p-12 text-center"
          >
            <UIcon
              name="i-heroicons-calendar"
              class="w-16 h-16 text-gray-300 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold text-gray-500 mb-2">
              {{ $t('studentLife.upcomingEvents.featured.noEvent') }}
            </h3>
            <p class="text-gray-400">
              {{ $t('studentLife.upcomingEvents.featured.checkBack') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Carousel Section -->
    <section v-if="carouselEvents.length >= 2" class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-3xl font-bold text-gray-900">
            {{ $t('studentLife.upcomingEvents.carousel.title') }}
          </h2>
          <UButton
            :to="localePath('/academics/calendar')"
            variant="outline"
            class="hidden md:flex"
          >
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
            {{ $t('studentLife.upcomingEvents.carousel.viewCalendar') }}
          </UButton>
        </div>

        <!-- Carousel Container -->
        <div class="relative">
          <!-- Previous Button -->
          <button
            v-if="canScrollLeft"
            @click="scrollCarousel('left')"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 text-gray-600" />
          </button>

          <!-- Events Grid/Carousel -->
          <div
            ref="carouselRef"
            class="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            @scroll="updateScrollButtons"
          >
            <div
              v-for="(event, index) in carouselEvents"
              :key="index"
              class="flex-shrink-0 w-80 md:w-96"
            >
              <div
                class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
              >
                <!-- Event Image -->
                <div class="relative h-56 bg-gray-200">
                  <img
                    v-if="event.image_url"
                    :src="event.image_url"
                    :alt="event.title"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                    :class="getEventBgColor(index)"
                  >
                    <img
                      src="/images/logo.png"
                      alt="CEE Logo"
                      class="h-16 w-auto opacity-30"
                      loading="lazy"
                    />
                  </div>
                  <!-- Date Badge -->
                  <div
                    class="absolute top-3 left-3 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md"
                  >
                    <div class="text-lg font-bold">{{ formatDay(event.date) }}</div>
                    <div class="text-xs uppercase text-gray-500">{{ formatMonth(event.date) }}</div>
                  </div>
                </div>

                <!-- Event Info -->
                <div class="p-5">
                  <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {{ event.title }}
                  </h3>
                  <div class="flex items-center gap-2 text-sm text-gray-500">
                    <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                    <span>{{ event.date ? formatFullDate(event.date) : $t('studentLife.upcomingEvents.carousel.noDate') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button
            v-if="canScrollRight"
            @click="scrollCarousel('right')"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <!-- Mobile: View Calendar Button -->
        <div class="mt-8 text-center md:hidden">
          <UButton
            :to="localePath('/academics/calendar')"
            variant="outline"
          >
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
            {{ $t('studentLife.upcomingEvents.carousel.viewCalendar') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Stay Informed -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-3xl mx-auto text-center bg-indigo-50 rounded-2xl p-10">
          <UIcon
            name="i-heroicons-bell-alert"
            class="w-16 h-16 text-indigo-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ singleField('studentLife.upcomingEvents.stayInformed', 'title') || $t('studentLife.upcomingEvents.stayInformed.title') }}
          </h2>
          <p class="text-lg text-gray-700 mb-6">
            {{ singleField('studentLife.upcomingEvents.stayInformed', 'description') || $t('studentLife.upcomingEvents.stayInformed.description') }}
          </p>
          <UButton
            :to="localePath('/academics/calendar')"
            size="lg"
            class="bg-indigo-600 hover:bg-indigo-700 justify-center"
          >
            <UIcon name="i-heroicons-calendar" class="w-5 h-5 mr-2" />
            {{ $t('studentLife.upcomingEvents.carousel.viewCalendar') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Annual Events -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.upcomingEvents.annualEvents.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.upcomingEvents.annualEvents.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(event, index) in annualEvents"
            :key="index"
            class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]"
          >
            <!-- Event Image -->
            <div class="relative h-64 bg-gray-200">
              <img
                v-if="event.image_url"
                :src="event.image_url"
                :alt="event.title"
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${event.focalX ?? 50}% ${event.focalY ?? 50}%` }"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
                :class="getAnnualEventBgColor(index)"
              >
                <UIcon :name="annualEventIcons[index]" class="w-16 h-16 text-white/50" />
              </div>
            </div>

            <!-- Event Info -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ event.title }}
              </h3>
              <p class="text-gray-600 mb-3">
                {{ event.description }}
              </p>
              <div class="flex items-center gap-2 text-sm text-indigo-600">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <span class="font-medium">{{ event.timing }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('studentLife.upcomingEvents.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.upcomingEvents.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-indigo-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('studentLife.upcomingEvents.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-indigo-700 justify-center"
            >
              {{ $t('studentLife.upcomingEvents.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { locale, t, tm, rt: $rt } = useI18n();
  const { events: calendarEvents, loadEvents } = useCalendarAdmin();
  const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta } = usePublicContent();

  const carouselRef = ref<HTMLElement | null>(null);
  const canScrollLeft = ref(false);
  const canScrollRight = ref(true);

  // Icons for annual events
  const annualEventIcons = [
    'i-heroicons-trophy',
    'i-heroicons-beaker',
    'i-heroicons-gift',
    'i-heroicons-musical-note',
    'i-heroicons-academic-cap',
    'i-heroicons-globe-americas',
  ];

  // Load data from DB
  onMounted(async () => {
    await Promise.all([
      loadEvents(),
      loadContent([
        'studentLife.upcomingEvents.intro',
        'studentLife.upcomingEvents.stayInformed',
        'studentLife.upcomingEvents.annualEvents',
      ]),
    ]);
    updateScrollButtons();
  });

  // Localized calendar events — future events sorted by date
  const allEvents = computed(() =>
    calendarEvents.value
      .map(e => ({
        ...e,
        title: locale.value === 'en' ? e.title_en : e.title_es,
        description: locale.value === 'en' ? (e.description_en || '') : (e.description_es || ''),
        date: e.start_date,
      }))
      .filter(e => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  );

  // Format month key (e.g. "april") to localized name (e.g. "Abril")
  const monthKeyToName = (key: string) => {
    const monthKey = `admin.editors.generic.months.${key}`;
    const translated = t(monthKey);
    return translated !== monthKey ? translated : key;
  };

  // Annual events: prefer DB, fall back to i18n
  const annualEventsFromDb = computed(() => {
    const items = getItems('studentLife.upcomingEvents.annualEvents');
    if (items.length === 0) return null;
    return items.map(item => {
      const timingKey = getMeta(item, 'timing') || field(item, 'timing');
      return {
        title: field(item, 'title'),
        description: field(item, 'description'),
        timing: timingKey ? monthKeyToName(timingKey) : '',
        image_url: item.metadata?.imageUrl || null,
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      };
    });
  });

  const annualEvents = computed(() => {
    if (annualEventsFromDb.value) return annualEventsFromDb.value;
    const items = tm('studentLife.upcomingEvents.annualEvents.events') as any[];
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      const rawTiming = typeof item.timing === 'string' ? item.timing : $rt(item.timing);
      return {
        title: typeof item.title === 'string' ? item.title : $rt(item.title),
        description: typeof item.description === 'string' ? item.description : $rt(item.description),
        timing: monthKeyToName(rawTiming),
        image_url: null as string | null,
      };
    });
  });

  // Color helper for annual events
  const getAnnualEventBgColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-green-400 to-emerald-500',
      'bg-gradient-to-br from-blue-400 to-indigo-500',
      'bg-gradient-to-br from-red-400 to-rose-500',
      'bg-gradient-to-br from-purple-400 to-violet-500',
      'bg-gradient-to-br from-amber-400 to-orange-500',
      'bg-gradient-to-br from-teal-400 to-cyan-500',
    ];
    return colors[index % colors.length];
  };

  // Featured event (first upcoming)
  const featuredEvent = computed(() => allEvents.value[0] || null);

  // Carousel events (excluding featured, min 2, max 10)
  const carouselEvents = computed(() => {
    const remaining = allEvents.value.slice(1);
    if (remaining.length < 2) {
      return allEvents.value.slice(0, 10);
    }
    return remaining.slice(0, 10);
  });

  // Format date helpers
  const formatDay = (dateStr: string) => {
    if (!dateStr) return '--';
    const date = new Date(dateStr);
    return date.getDate();
  };

  const formatMonth = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const months = locale.value === 'es'
      ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()];
  };

  const formatFullDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString(locale.value === 'es' ? 'es-HN' : 'en-US', options);
  };

  const getEventBgColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-100 to-indigo-100',
      'bg-gradient-to-br from-green-100 to-teal-100',
      'bg-gradient-to-br from-purple-100 to-pink-100',
      'bg-gradient-to-br from-orange-100 to-amber-100',
      'bg-gradient-to-br from-cyan-100 to-blue-100',
    ];
    return colors[index % colors.length];
  };

  // Carousel scroll functionality
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.value) return;
    const scrollAmount = 320;
    const currentScroll = carouselRef.value.scrollLeft;
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;
    carouselRef.value.scrollTo({ left: newScroll, behavior: 'smooth' });
  };

  const updateScrollButtons = () => {
    if (!carouselRef.value) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value;
    canScrollLeft.value = scrollLeft > 0;
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10;
  };

  useHead({
    title: 'Upcoming Events - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Stay updated on upcoming events at CEE including Back to School Night, Science Fair, Sports Day, and more.',
      },
    ],
  });
</script>

<style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
