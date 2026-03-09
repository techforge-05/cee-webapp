<template>
  <div v-if="pageLoading" class="min-h-screen flex items-center justify-center">
    <div
      class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
    />
  </div>
  <div v-else class="bg-white">
    <!-- Section 1: Hero (Video or Image Carousel) -->
    <section
      class="relative min-h-[500px] h-screen max-h-[800px] lg:max-h-none bg-gray-400"
    >
      <!-- Video embed (takes priority if set) -->
      <iframe
        v-if="heroEmbedUrl"
        :src="heroEmbedUrl"
        class="absolute inset-0 w-full h-full"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      />

      <!-- Image carousel (fade, no arrows) -->
      <div v-else-if="heroCarouselItems.length > 0" class="absolute inset-0">
        <img
          v-for="(item, i) in heroCarouselItems"
          :key="i"
          :src="item.url"
          alt=""
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          :class="currentSlide === i ? 'opacity-100' : 'opacity-0'"
          :style="{ objectPosition: `${item.focalX}% ${item.focalY}%` }"
        />
      </div>

      <!-- Overlay with title text -->
      <div
        class="absolute inset-0 flex items-center justify-center"
        :class="heroEmbedUrl ? '' : 'bg-black/10'"
      >
        <div
          v-if="!heroEmbedUrl && (heroTitle || heroSubtitle)"
          class="text-center text-white px-4"
        >
          <h1 v-if="heroTitle" class="text-5xl md:text-6xl font-bold mb-4">
            {{ heroTitle }}
          </h1>
          <p v-if="heroSubtitle" class="text-xl md:text-2xl">
            {{ heroSubtitle }}
          </p>
        </div>
      </div>
    </section>

    <!-- Section 2: Welcome -->
    <section
      class="relative py-10 md:py-20 overflow-hidden bg-[url('/images/main-g.png')] bg-center bg-repeat bg-size-[100%] md:bg-size-[50%]"
    >
      <!-- Dark overlay for better text readability -->
      <div class="absolute inset-0 bg-green-400/30 backdrop-blur-[1.7px]"></div>

      <div class="px-6 sm:px-10 lg:px-16 md:ml-[15%] md:mr-0 relative z-10">
        <div class="text-center md:text-left">
          <h2
            class="text-2xl md:text-5xl font-black text-white mb-1 uppercase tracking-tight"
          >
            {{
              singleField('home.welcome', 'titlePartOne') ||
              $t('home.welcome.titlePartOne')
            }}
          </h2>
          <h1
            class="text-5xl md:text-7xl font-black text-white mb-5 uppercase tracking-tight"
          >
            {{
              singleField('home.welcome', 'titlePartTwo') ||
              $t('home.welcome.titlePartTwo')
            }}
          </h1>
          <h3
            class="text-xl md:text-3xl font-black text-white mb-8 tracking-tight"
          >
            "Jardín, Escuela e Instituto Bilingüe Siguatepeque"
          </h3>
          <p
            class="text-xl md:text-xl font-bold text-white leading-relaxed max-w-3xl mx-auto md:mx-0"
          >
            {{
              singleField('home.welcome', 'description') ||
              $t('home.welcome.description')
            }}
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
              {{
                singleField('home.enrollment', 'title') ||
                $t('home.enrollment.title')
              }}
            </h2>
            <p
              class="text-center md:text-left text-xl md:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed"
            >
              {{
                singleField('home.enrollment', 'description') ||
                $t('home.enrollment.description')
              }}
            </p>
            <ul class="space-y-4 md:space-y-5 mb-8 md:mb-10">
              <li
                v-for="(feature, index) in enrollmentFeatures"
                :key="index"
                class="flex items-center text-teal-600 text-lg md:text-xl uppercase font-semibold"
              >
                <UIcon
                  name="i-heroicons-check-circle-20-solid"
                  class="w-7 h-7 md:w-8 md:h-8 text-teal-600 mr-3 md:mr-4 flex-shrink-0"
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
              :style="{
                objectPosition: `${singleMeta('home.enrollment', 'focalX') || 50}% ${singleMeta('home.enrollment', 'focalY') || 50}%`,
              }"
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
    <section class="grid md:grid-cols-2 items-stretch">
      <!-- Left: Full Image -->
      <div
        class="hidden md:flex relative items-center justify-center overflow-hidden"
      >
        <img
          v-if="valuesImageUrl"
          :src="valuesImageUrl"
          alt="Values"
          class="w-full h-full object-cover"
          :style="{
            objectPosition: `${singleMeta('home.values.image', 'focalX') || 50}% ${singleMeta('home.values.image', 'focalY') || 50}%`,
          }"
        />
        <div
          v-else
          class="bg-gray-300 w-full h-full min-h-80 flex items-center justify-center"
        >
          <p class="text-gray-400 text-xl md:text-2xl">Values Image</p>
        </div>
      </div>

      <!-- Right: Values -->
      <div
        class="py-10 md:py-14 lg:py-20 px-8 sm:px-10 lg:px-14 flex flex-col justify-center"
      >
        <div>
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-700 mb-3"
          >
            {{ $t('home.values.title') }}
          </h2>
          <p class="text-lg text-black mb-6">
            {{ $t('home.values.subtitle') }}
          </p>
          <div class="h-1 bg-amber-700 mb-8" />
          <div class="grid grid-cols-2 gap-x-8 gap-y-5">
            <div
              v-for="(value, index) in valuesWithIcons"
              :key="index"
              class="flex items-center gap-3"
            >
              <UIcon
                :name="value.icon"
                class="w-7 h-7 text-amber-700 shrink-0"
              />
              <span
                class="text-amber-700 font-bold text-base lg:text-lg uppercase"
                >{{ value.title }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: School Activities -->
    <section class="py-10 md:py-14 lg:py-20 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-16">
          <h2
            class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-4"
          >
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
                  :style="{
                    objectPosition: `${activity.focalX}% ${activity.focalY}%`,
                  }"
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

    <!-- Section 6: News / Upcoming Events (hidden if neither exists) -->
    <section v-if="newsItems.length > 0" class="py-5 md:py-20">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-6xl font-bold text-teal-700 mb-4">
            {{
              newsIsEvents
                ? $t('studentLife.upcomingEvents.title')
                : $t('home.news.title')
            }}
          </h2>
          <p class="text-xl text-gray-600">
            {{
              newsIsEvents
                ? $t('studentLife.upcomingEvents.subtitle')
                : $t('home.news.subtitle')
            }}
          </p>
        </div>

        <!-- ANNOUNCEMENTS layout: featured + up to 3 smaller -->
        <template v-if="!newsIsEvents">
          <!-- Featured announcement -->
          <div class="max-w-4xl mx-auto mb-10">
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
              <!-- Image or teal placeholder -->
              <div class="relative h-64 sm:h-80 md:h-96">
                <img
                  v-if="newsItems[0]!.image_url"
                  :src="newsItems[0]!.image_url"
                  :alt="newsItems[0]!.image_alt || newsItems[0]!.title"
                  class="w-full h-full object-cover"
                  :style="{
                    objectPosition: `${newsItems[0]!.focal_x ?? 50}% ${newsItems[0]!.focal_y ?? 50}%`,
                  }"
                  loading="lazy"
                />
                <div
                  v-else
                  class="relative w-full h-full bg-linear-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center gap-4 p-8 sm:p-12 overflow-hidden text-center"
                >
                  <div
                    class="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/10"
                  />
                  <div
                    class="absolute bottom-6 right-4 w-32 h-32 rounded-full bg-white/5"
                  />
                  <p
                    class="relative z-10 text-white font-bold text-2xl sm:text-3xl md:text-4xl leading-snug"
                  >
                    {{ newsItems[0]!.title }}
                  </p>
                  <p
                    v-if="newsItems[0]!.excerpt"
                    class="relative z-10 text-white/90 text-base sm:text-lg leading-relaxed max-w-xl"
                  >
                    {{ newsItems[0]!.excerpt }}
                  </p>
                  <UIcon
                    name="i-heroicons-megaphone"
                    class="relative z-10 w-16 h-16 sm:w-20 sm:h-20 text-white/80 mt-2"
                  />
                </div>
              </div>
              <!-- White info area (only when image exists) -->
              <div v-if="newsItems[0]!.image_url" class="p-6 md:p-8">
                <div class="flex items-center gap-2 text-teal-600 mb-3">
                  <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
                  <span class="font-medium">{{
                    formatDate(newsItems[0]!.date)
                  }}</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {{ newsItems[0]!.title }}
                </h3>
                <p
                  v-if="newsItems[0]!.excerpt"
                  class="text-lg text-gray-600 leading-relaxed"
                >
                  {{ newsItems[0]!.excerpt }}
                </p>
              </div>
              <!-- Date only (no image) -->
              <div v-else class="px-6 py-4">
                <p class="text-xl font-semibold text-gray-700">
                  {{ formatDate(newsItems[0]!.date) }}
                </p>
              </div>
            </div>
          </div>

          <!-- More announcements (up to 3) -->
          <div
            v-if="newsItems.length > 1"
            class="flex flex-wrap justify-center gap-8"
          >
            <UCard
              v-for="(newsItem, index) in newsItems.slice(1)"
              :key="index"
              class="overflow-hidden w-full sm:w-72 md:w-80"
              :ui="
                !newsItem.image_url || !newsItem.excerpt
                  ? { body: 'hidden' }
                  : {}
              "
            >
              <template #header>
                <div class="aspect-4/3 overflow-hidden -mx-6 -mt-6 mb-3">
                  <img
                    v-if="newsItem.image_url"
                    :src="newsItem.image_url"
                    :alt="newsItem.image_alt || newsItem.title"
                    class="w-full h-full object-cover"
                    :style="{
                      objectPosition: `${newsItem.focal_x}% ${newsItem.focal_y}%`,
                    }"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="relative w-full h-full bg-linear-to-br from-teal-400 to-teal-600 flex flex-col items-center justify-center gap-3 p-6 overflow-hidden text-center"
                  >
                    <div
                      class="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/10"
                    />
                    <div
                      class="absolute bottom-4 right-2 w-20 h-20 rounded-full bg-white/5"
                    />
                    <p
                      class="relative z-10 text-white font-bold text-xl sm:text-2xl leading-snug"
                    >
                      {{ newsItem.title }}
                    </p>
                    <p
                      v-if="newsItem.excerpt"
                      class="relative z-10 text-white/90 text-sm sm:text-base leading-relaxed"
                    >
                      {{ newsItem.excerpt }}
                    </p>
                    <UIcon
                      name="i-heroicons-megaphone"
                      class="relative z-10 w-14 h-14 text-white/80 mt-1"
                    />
                  </div>
                </div>
                <h3
                  v-if="newsItem.image_url"
                  class="text-xl font-semibold text-gray-900"
                >
                  {{ newsItem.title }}
                </h3>
                <p
                  :class="
                    newsItem.image_url
                      ? 'text-sm text-gray-500 mt-1'
                      : 'text-xl font-semibold text-gray-700 px-6 py-4'
                  "
                >
                  {{ formatDate(newsItem.date) }}
                </p>
              </template>
              <p
                v-if="newsItem.image_url && newsItem.excerpt"
                class="text-gray-600"
              >
                {{ newsItem.excerpt }}
              </p>
            </UCard>
          </div>
        </template>

        <!-- EVENTS fallback layout (unchanged) + Go to Upcoming Events button -->
        <template v-else>
          <div class="flex flex-wrap justify-center gap-8">
            <UCard
              v-for="(newsItem, index) in newsItems"
              :key="index"
              class="overflow-hidden w-full md:w-[calc(33.333%-1.334rem)]"
              :ui="!newsItem.excerpt ? { body: 'hidden' } : {}"
            >
              <template #header>
                <div
                  class="relative aspect-4/3 overflow-hidden -mx-6 -mt-6 mb-3"
                >
                  <img
                    v-if="newsItem.image_url"
                    :src="newsItem.image_url"
                    :alt="newsItem.image_alt || newsItem.title"
                    class="w-full h-full object-cover"
                    :style="{
                      objectPosition: `${newsItem.focal_x}% ${newsItem.focal_y}%`,
                    }"
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
                  <div
                    class="absolute top-3 left-3 bg-white text-gray-900 px-3 py-1.5 rounded-lg shadow-md"
                  >
                    <div class="text-lg font-bold leading-none">
                      {{ formatDay(newsItem.date) }}
                    </div>
                    <div class="text-xs uppercase text-gray-500 mt-0.5">
                      {{ formatMonth(newsItem.date) }}
                    </div>
                  </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-900">
                  {{ newsItem.title }}
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ formatDate(newsItem.date) }}
                </p>
              </template>
              <p v-if="newsItem.excerpt" class="text-gray-600">
                {{ newsItem.excerpt }}
              </p>
            </UCard>
          </div>
          <!-- Go to Upcoming Events -->
          <div class="text-center mt-12">
            <UButton
              :to="localePath('/student-life/upcoming-events')"
              size="lg"
              variant="outline"
              color="neutral"
              trailing-icon="i-heroicons-arrow-right"
            >
              {{ $t('home.news.goToUpcomingEvents') }}
            </UButton>
          </div>
        </template>
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
  const {
    loadContent,
    getItems,
    field,
    singleField,
    singleMeta,
    loading: contentLoading,
  } = usePublicContent();
  const {
    announcements,
    loading: announcementsLoading,
    loadAnnouncements,
  } = useAnnouncements();
  const {
    events: calendarEvents,
    loading: eventsLoading,
    loadEvents,
  } = useCalendarAdmin();
  const heroMediaLoading = ref(true);
  const pageLoading = computed(
    () =>
      contentLoading.value ||
      announcementsLoading.value ||
      eventsLoading.value ||
      heroMediaLoading.value,
  );

  // Load DB content, then wait for hero media to be ready
  onMounted(async () => {
    heroMediaLoading.value = true;

    await Promise.all([
      loadContent([
        'home.hero',
        'home.hero.images',
        'home.welcome',
        'home.values',
        'home.values.image',
        'home.activities',
        'home.enrollment',
        'home.enrollment.features',
      ]),
      loadAnnouncements(),
      loadEvents(),
    ]);

    if (heroEmbedUrl.value) {
      // Video embed: give the iframe a 2s grace period to start loading
      setTimeout(() => {
        heroMediaLoading.value = false;
      }, 2000);
    } else if (heroCarouselItems.value.length > 0) {
      // Images: preload the first carousel image (5s safety timeout)
      const firstUrl = heroCarouselItems.value[0]!.url;
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(resolve, 5000);
        const img = new Image();
        img.onload = img.onerror = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.src = firstUrl;
      });
      heroMediaLoading.value = false;
    } else {
      // No hero media configured
      heroMediaLoading.value = false;
    }
  });

  // --- Hero ---
  function getEmbedUrl(url: string): string {
    if (!url) return '';
    // YouTube
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    );
    if (ytMatch)
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}`;
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch)
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&loop=1&muted=1`;
    // Loom
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch) return `https://www.loom.com/embed/${loomMatch[1]}`;
    // Google Drive
    const driveMatch = url.match(/\/file\/d\/([^/]+)\//);
    if (driveMatch)
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    return url;
  }

  const heroEmbedUrl = computed(() => {
    const url = singleMeta('home.hero', 'videoUrl') || '';
    return getEmbedUrl(url);
  });

  const heroTitle = computed(() => singleField('home.hero', 'title'));
  const heroSubtitle = computed(() => singleField('home.hero', 'subtitle'));

  const heroCarouselItems = computed(() =>
    getItems('home.hero.images')
      .filter((item) => item.metadata?.image_url)
      .map((item) => ({
        url: item.metadata!.image_url as string,
        focalX: Number(item.metadata?.focalX) || 50,
        focalY: Number(item.metadata?.focalY) || 50,
      })),
  );

  const heroCarouselIntervalMs = computed(() => {
    const secs = Number(singleMeta('home.hero', 'carouselInterval')) || 5;
    return Math.max(3, secs) * 1000;
  });

  // Carousel auto-rotation
  const currentSlide = ref(0);
  let carouselInterval: ReturnType<typeof setInterval> | null = null;

  watchEffect(() => {
    const imgs = heroCarouselItems.value;
    const ms = heroCarouselIntervalMs.value;
    if (carouselInterval) clearInterval(carouselInterval);
    if (imgs.length > 1) {
      carouselInterval = setInterval(() => {
        currentSlide.value = (currentSlide.value + 1) % imgs.length;
      }, ms);
    }
  });

  onUnmounted(() => {
    if (carouselInterval) clearInterval(carouselInterval);
  });

  // Icon mapping for each value
  const valueIcons = [
    'i-heroicons-heart-solid', // Passion for God
    'i-heroicons-shield-check-solid', // Integrity
    'i-heroicons-sparkles-solid', // Creativity
    'i-heroicons-users-solid', // Respect
    'i-heroicons-hand-raised-solid', // Service
    'i-heroicons-trophy-solid', // Excellence
    'i-heroicons-check-badge-solid', // Responsibility
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
          icon:
            field(item, 'icon') ||
            valueIcons[index] ||
            'i-heroicons-star-solid',
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
  const valuesImageUrl = computed(() =>
    singleMeta('home.values.image', 'image_url'),
  );

  // Enrollment image from DB
  const enrollmentImage = computed(() =>
    singleMeta('home.enrollment', 'image_url'),
  );

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

  // News: prefer announcements → upcoming events → hide section
  const newsIsEvents = ref(false);
  const newsItems = computed(() => {
    const todayStr = new Date().toISOString().split('T')[0]!;
    const active = announcements.value
      .filter((a) => a.is_active && (!a.expires_at || a.expires_at >= todayStr))
      .slice(0, 4);
    if (active.length > 0) {
      newsIsEvents.value = false;
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
        focal_x: a.focal_x ?? 50,
        focal_y: a.focal_y ?? 50,
      }));
    }
    // Fall back to the 3 closest upcoming calendar events
    const today = new Date().toISOString().split('T')[0]!;
    const upcoming = calendarEvents.value
      .filter((e) => e.start_date >= today)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))
      .slice(0, 3);
    if (upcoming.length > 0) {
      newsIsEvents.value = true;
      return upcoming.map((e) => ({
        title: locale.value === 'en' ? e.title_en : e.title_es,
        date: e.start_date,
        excerpt:
          locale.value === 'en'
            ? e.description_en || ''
            : e.description_es || '',
        image_url: e.image_url || '',
        image_alt:
          locale.value === 'en' ? e.image_alt_en || '' : e.image_alt_es || '',
        focal_x: e.focal_x ?? 50,
        focal_y: e.focal_y ?? 50,
      }));
    }
    newsIsEvents.value = false;
    return [];
  });

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + 'T00:00:00');
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

  const formatDay = (dateStr: string) => {
    if (!dateStr) return '--';
    return new Date(dateStr + 'T00:00:00').getDate();
  };

  const formatMonth = (dateStr: string) => {
    if (!dateStr) return '';
    const months =
      locale.value === 'es'
        ? [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
          ]
        : [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
    return months[new Date(dateStr + 'T00:00:00').getMonth()] ?? '';
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
</script>
