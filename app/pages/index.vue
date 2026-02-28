<template>
  <div v-if="pageLoading" class="min-h-screen flex items-center justify-center">
    <div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" />
  </div>
  <div v-else class="bg-white">
    <!-- Section 1: Hero Video (Full viewport) -->
    <section
      class="relative min-h-[500px] h-screen max-h-[800px] lg:max-h-none bg-linear-to-br from-blue-600 to-blue-800"
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
    <!-- background-size: cover; -->
    <section
      class="relative py-10 md:py-20 overflow-hidden"
      style="
        background-image: url('/images/main-bg.jpg');
        background-position: center;
        background-repeat: repeat;
        background-size: cover;
      "
    >
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-green-400/30"></div>

      <div class="px-6 sm:px-10 lg:px-16 md:ml-[15%] md:mr-0 relative z-10">
        <div class="text-center md:text-left">
          <h2
            class="text-2xl md:text-5xl font-black text-white mb-1 uppercase tracking-tight"
          >
            {{ singleField('home.welcome', 'titlePartOne') || $t('home.welcome.titlePartOne') }}
          </h2>
          <h1
            class="text-5xl md:text-7xl font-black text-white mb-5 uppercase tracking-tight"
          >
            {{ singleField('home.welcome', 'titlePartTwo') || $t('home.welcome.titlePartTwo') }}
          </h1>
          <h3
            class="text-xl md:text-3xl font-black text-white mb-8 tracking-tight"
          >
            "Jardín, Escuela e Instituto Bilingüe Siguatepeque"
          </h3>
          <p
            class="text-xl md:text-xl font-bold text-white leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            {{ singleField('home.welcome', 'description') || $t('home.welcome.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 3: Offered Grades and Programs -->
    <section class="py-10 md:py-16 lg:py-28">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <h2
              class="text-center md:text-left text-4xl md:text-5xl lg:text-6xl font-bold text-teal-600 mb-5 md:mb-6"
            >
              {{ singleField('home.enrollment', 'title') || $t('home.enrollment.title') }}
            </h2>
            <p
              class="text-center md:text-left text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
            >
              {{ singleField('home.enrollment', 'description') || $t('home.enrollment.description') }}
            </p>
            <ul class="space-y-4 md:space-y-5 mb-8 md:mb-10">
              <li
                v-for="(feature, index) in enrollmentFeatures"
                :key="index"
                class="flex items-center text-gray-700 text-lg md:text-xl"
              >
                <UIcon
                  name="i-heroicons-check-circle-20-solid"
                  class="w-7 h-7 md:w-8 md:h-8 text-green-500 mr-3 md:mr-4 flex-shrink-0"
                />
                {{ feature }}
              </li>
            </ul>
            <div class="text-center md:text-left">
              <UButton
                :to="localePath('/academics/grades')"
                size="lg"
                class="text-lg md:text-xl px-6 md:px-8 py-3 md:py-4"
              >
                {{ $t('home.enrollment.cta') }}
              </UButton>
            </div>
          </div>
          <div>
            <img
              v-if="enrollmentImage"
              :src="enrollmentImage"
              alt=""
              class="rounded-lg shadow-2xl w-full h-64 md:h-80 lg:h-96 xl:h-112.5 object-cover"
              :style="{ objectPosition: `${singleMeta('home.enrollment', 'focalX') || 50}% ${singleMeta('home.enrollment', 'focalY') || 50}%` }"
            />
            <div
              v-else
              class="bg-gray-200 rounded-lg shadow-2xl w-full h-64 md:h-80 lg:h-96 xl:h-112.5 flex items-center justify-center"
            >
              <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 4: Values and Principles -->
    <section class="grid md:grid-cols-12 items-center bg-gray-50">
      <!-- Left: Full Image -->
      <div
        class="hidden md:flex md:col-span-7 relative items-center justify-center overflow-hidden p-6 lg:p-10"
      >
        <img
          v-if="valuesImageUrl"
          :src="valuesImageUrl"
          alt="Values"
          class="w-full h-full object-cover rounded-2xl"
          :style="{ objectPosition: `${singleMeta('home.values.image', 'focalX') || 50}% ${singleMeta('home.values.image', 'focalY') || 50}%` }"
        />
        <div
          v-else
          class="bg-gray-300 w-full h-full min-h-80 flex items-center justify-center"
        >
          <p class="text-gray-400 text-xl md:text-2xl">Values Image</p>
        </div>
      </div>

      <!-- Right: Colorful Value Cards -->
      <div class="md:col-span-5 bg-gray-50 py-10 md:py-14 lg:py-20 px-6 sm:px-8">
        <div class="text-center mb-10">
          <h2 class="text-4xl md:text-5xl font-bold text-purple-900 mb-4">
            {{ $t('home.values.title') }}
          </h2>
          <p class="text-xl text-gray-700 font-semibold">
            {{ $t('home.values.subtitle') }}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <template v-for="(value, index) in valuesWithIcons" :key="index">
            <div
              :class="[
                cardColors[index % cardColors.length],
                'rounded-2xl p-5 shadow-lg text-white',
                index % 2 === 1 ? 'sm:mt-8' : '',
              ]"
            >
              <UIcon :name="value.icon" class="w-8 h-8 mb-2 text-white/90" />
              <h3 class="text-lg font-bold mb-1">{{ value.title }}</h3>
              <p class="text-sm text-white/90 leading-snug">
                {{ value.description }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Section 5: School Activities -->
    <section class="py-10 md:py-14 lg:py-20 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            {{ $t('home.activities.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.activities.subtitle') }}
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-6">
          <UCard
            v-for="(activity, index) in activities"
            :key="index"
            class="overflow-hidden w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <template #header>
              <div
                v-if="activity.image_url"
                class="aspect-4/3 overflow-hidden -mx-6 -mt-6 mb-3"
              >
                <img
                  :src="activity.image_url"
                  :alt="activity.image_alt || activity.title"
                  class="w-full h-full object-cover"
                  :style="{ objectPosition: `${activity.focalX}% ${activity.focalY}%` }"
                  loading="lazy"
                />
              </div>
              <div
                v-else
                class="aspect-4/3 bg-gray-100 -mx-6 -mt-6 mb-3 flex items-center justify-center"
              >
                <UIcon
                  :name="activityIcons[index] || 'i-heroicons-academic-cap'"
                  class="w-12 h-12 text-gray-300"
                />
              </div>
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
    <section class="py-5 md:py-20">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-6xl font-bold text-teal-700 mb-4">
            {{ $t('home.news.title') }}
          </h2>
          <p class="text-xl text-gray-600">
            {{ $t('home.news.subtitle') }}
          </p>
        </div>
        <div class="flex flex-wrap justify-center gap-8">
          <UCard
            v-for="(newsItem, index) in newsItems"
            :key="index"
            class="overflow-hidden w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <template #header>
              <div
                v-if="newsItem.image_url"
                class="aspect-4/3 overflow-hidden -mx-6 -mt-6 mb-3"
              >
                <img
                  :src="newsItem.image_url"
                  :alt="newsItem.image_alt || newsItem.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 class="text-xl font-semibold text-gray-900">
                {{ newsItem.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ formatDate(newsItem.date) }}
              </p>
            </template>
            <p class="text-gray-600">
              {{ newsItem.excerpt }}
            </p>
          </UCard>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
  });

  const { locale, tm, rt } = useI18n();
  const localePath = useLocalePath();
  const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();
  const { announcements, loading: announcementsLoading, loadAnnouncements } = useAnnouncements();
  const pageLoading = computed(() => contentLoading.value || announcementsLoading.value);

  // Load DB content
  onMounted(() =>
    Promise.all([
      loadContent([
        'home.welcome',
        'home.values',
        'home.values.image',
        'home.activities',
        'home.enrollment',
        'home.enrollment.features',
      ]),
      loadAnnouncements(),
    ]),
  );

  // Color gradients for value cards
  const cardColors = [
    'bg-gradient-to-br from-rose-500 to-pink-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-amber-400 to-yellow-500',
    'bg-gradient-to-br from-emerald-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-violet-600',
    'bg-gradient-to-br from-orange-500 to-amber-600',
    'bg-gradient-to-br from-teal-500 to-cyan-600',
  ];

  // Icon mapping for each value
  const valueIcons = [
    'i-heroicons-heart-solid',           // Passion for God
    'i-heroicons-shield-check-solid',    // Integrity
    'i-heroicons-sparkles-solid',        // Creativity
    'i-heroicons-users-solid',           // Respect
    'i-heroicons-hand-raised-solid',     // Service
    'i-heroicons-trophy-solid',          // Excellence
    'i-heroicons-check-badge-solid',     // Responsibility
  ];

  // Values: prefer DB, fall back to i18n
  const valuesWithIcons = computed(() => {
    const dbItems = getItems('home.values');
    if (dbItems.length > 0) {
      return dbItems
        .filter((item) => field(item, 'title') && field(item, 'description'))
        .map((item, index) => ({
          title: field(item, 'title'),
          description: field(item, 'description'),
          icon: valueIcons[index] || 'i-heroicons-star-solid',
        }));
    }
    const values = tm('home.values.items') as any[];
    return values.map((v: any, i: number) => ({
      title: typeof v.title === 'string' ? v.title : rt(v.title),
      description:
        typeof v.description === 'string' ? v.description : rt(v.description),
      icon: valueIcons[i],
    }));
  });

  // Values image from DB
  const valuesImageUrl = computed(() => singleMeta('home.values.image', 'image_url'));

  // Enrollment image from DB
  const enrollmentImage = computed(() => singleMeta('home.enrollment', 'image_url'));

  // Enrollment features: prefer DB, fall back to i18n
  const enrollmentFeatures = computed(() => {
    const dbItems = getItems('home.enrollment.features');
    if (dbItems.length > 0) {
      return dbItems.map((item) => field(item, 'text'));
    }
    const items = tm('home.enrollment.features') as any[];
    return Array.isArray(items)
      ? items.map((f: any) => (typeof f === 'string' ? f : rt(f)))
      : [];
  });

  // Activity icons fallback when no image
  const activityIcons = [
    'i-heroicons-academic-cap',
    'i-heroicons-musical-note',
    'i-heroicons-trophy',
    'i-heroicons-paint-brush',
    'i-heroicons-globe-americas',
    'i-heroicons-beaker',
    'i-heroicons-book-open',
    'i-heroicons-puzzle-piece',
  ];

  // Activities: prefer DB, fall back to i18n
  const activities = computed(() => {
    const dbItems = getItems('home.activities');
    if (dbItems.length > 0) {
      return dbItems.map((item) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        image_url: item.metadata?.image_url || '',
        image_alt: item.metadata?.[`image_alt_${locale.value}`] || '',
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      }));
    }
    const items = tm('home.activities.items') as any[];
    return Array.isArray(items)
      ? items.map((a: any) => ({
          title: typeof a.title === 'string' ? a.title : rt(a.title),
          description:
            typeof a.description === 'string'
              ? a.description
              : rt(a.description),
          image_url: '',
          image_alt: '',
        }))
      : [];
  });

  // News: prefer announcements, fall back to i18n
  const newsItems = computed(() => {
    const active = announcements.value.filter((a) => a.is_active).slice(0, 3);
    if (active.length > 0) {
      return active.map((a) => ({
        title: locale.value === 'en' ? a.title_en : a.title_es,
        date: a.display_date,
        excerpt:
          locale.value === 'en'
            ? a.description_en || ''
            : a.description_es || '',
        image_url: a.image_url || '',
        image_alt:
          locale.value === 'en' ? a.image_alt_en || '' : a.image_alt_es || '',
      }));
    }
    // Fallback to i18n when no announcements exist yet
    const items = tm('home.news.items') as any[];
    return Array.isArray(items)
      ? items.map((n: any) => ({
          title: typeof n.title === 'string' ? n.title : rt(n.title),
          date: typeof n.date === 'string' ? n.date : rt(n.date),
          excerpt: typeof n.excerpt === 'string' ? n.excerpt : rt(n.excerpt),
          image_url: '',
          image_alt: '',
        }))
      : [];
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(
        locale.value === 'es' ? 'es-HN' : 'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
      );
    } catch {
      return dateStr;
    }
  };
</script>
