<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-linear-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.history.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.history.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('about.history.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('about.history.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('about.history.intro', 'focalX') || 50}% ${singleMeta('about.history.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <UIcon
          v-if="!singleMeta('about.history.intro', 'imageUrl')"
          name="i-heroicons-clock"
          class="w-16 h-16 text-purple-600 mb-6"
        />
        <p class="text-xl md:text-2xl text-amber-800 leading-relaxed lg:max-w-[50%]">
          {{ singleField('about.history.intro', 'text') || $t('about.history.intro') }}
        </p>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="pt-8 pb-0 sm:pt-16 md:py-16">
      <div class="px-2 sm:px-10 lg:px-16">
        <h2 class="text-3xl lg:text-5xl font-bold text-teal-800 text-center mb-12 px-4 sm:px-0">
          {{ $t('about.history.timeline.title') }}
        </h2>
        <div class="space-y-12">
          <div
            v-for="(item, index) in timelineItems"
            :key="index"
          >
            <div
              :class="[
                'rounded-none sm:rounded-lg p-0 sm:p-8 md:p-12',
                getStyle(index).bg,
              ]"
            >
              <div :class="item.imageUrl ? 'grid grid-cols-1 lg:grid-cols-2 gap-0 sm:gap-8 items-center' : ''">
                <!-- Image on left (odd index) -->
                <div v-if="item.imageUrl && index % 2 === 1" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112 order-1 lg:order-0">
                  <img :src="item.imageUrl" class="w-full h-full object-cover" :style="{ objectPosition: `${item.focalX || 50}% ${item.focalY || 50}%` }" alt="" />
                </div>
                <!-- Text content -->
                <div class="px-4 py-6 sm:px-0 sm:py-0">
                  <h3
                    :class="[
                      'text-2xl md:text-4xl font-bold mb-4',
                      getStyle(index).text,
                    ]"
                  >
                    {{ item.title }}
                  </h3>
                  <p class="text-lg text-gray-800 leading-relaxed">
                    {{ item.content }}
                  </p>
                  <!-- Founders sub-list (only for first i18n fallback entry) -->
                  <div
                    v-if="!item._fromDb && item.founders && item.founders.length > 0"
                    class="bg-white rounded-lg p-4 mt-4"
                  >
                    <h4
                      :class="[
                        'font-bold mb-2',
                        getStyle(index).text,
                      ]"
                    >
                      {{ $t('about.history.timeline.late1980s.founders') }}
                    </h4>
                    <ul class="list-disc list-inside text-gray-700 space-y-1">
                      <li
                        v-for="(founder, fIndex) in item.founders"
                        :key="fIndex"
                        class="ml-4"
                      >
                        {{ founder }}
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- Image on right (even index) -->
                <div v-if="item.imageUrl && index % 2 === 0" class="rounded-none sm:rounded-lg overflow-hidden h-96 lg:h-112">
                  <img :src="item.imageUrl" class="w-full h-full object-cover" :style="{ objectPosition: `${item.focalX || 50}% ${item.focalY || 50}%` }" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Legacy Section -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            :name="singleField('about.history.legacy', 'icon') || 'i-heroicons-heart'"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <h2 class="text-3xl lg:text-5xl font-bold text-purple-800 mb-6">
            {{ singleField('about.history.legacy', 'title') || $t('about.history.legacy.title') }}
          </h2>
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ singleField('about.history.legacy', 'content') || $t('about.history.legacy.content') }}
          </p>
          <div v-if="singleMeta('about.history.legacy', 'imageUrl')" class="mt-8 rounded-lg overflow-hidden max-w-2xl mx-auto">
            <img :src="singleMeta('about.history.legacy', 'imageUrl')" class="w-full h-64 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('about.history.legacy', 'focalX') || 50}% ${singleMeta('about.history.legacy', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-linear-to-r from-green-600 to-teal-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4">
          {{ $t('about.history.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('about.history.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/admissions/who-can-apply')"
            size="lg"
            variant="solid"
            class="bg-white text-green-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('about.history.cta.learnMore') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-green-700 justify-center"
          >
            {{ $t('about.history.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { t, tm, rt } = useI18n();
  const { loadContent, getItems, field, meta, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'about.history.intro',
    'about.history.timeline',
    'about.history.legacy',
  ]));

  // Color styles that cycle for timeline entries
  const timelineStyles = [
    { bg: 'bg-blue-50', text: 'text-blue-900' },
    { bg: 'bg-purple-50', text: 'text-purple-900' },
    { bg: 'bg-indigo-50', text: 'text-indigo-900' },
    { bg: 'bg-violet-50', text: 'text-violet-900' },
    { bg: 'bg-fuchsia-50', text: 'text-fuchsia-900' },
    { bg: 'bg-green-50', text: 'text-green-900' },
  ];

  const getStyle = (index: number) => timelineStyles[index % timelineStyles.length]!;

  // Timeline items: DB-first, fall back to i18n
  const timelineItems = computed(() => {
    const dbItems = getItems('about.history.timeline');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        title: field(item, 'title'),
        content: field(item, 'content'),
        imageUrl: meta(item, 'imageUrl'),
        focalX: meta(item, 'focalX'),
        focalY: meta(item, 'focalY'),
        _fromDb: true,
        founders: null,
      }));
    }

    // Fallback to i18n — construct the 6 hardcoded periods
    const foundersList = tm('about.history.timeline.late1980s.foundersList') as any[];
    const founders = Array.isArray(foundersList)
      ? foundersList.map((f: any) => (typeof f === 'string' ? f : rt(f)))
      : [];

    const periods = [
      { titleKey: 'about.history.timeline.late1980s.title', contentKey: 'about.history.timeline.late1980s.content', founders },
      { titleKey: 'about.history.timeline.early1990.title', contentKey: 'about.history.timeline.early1990.content' },
      { titleKey: 'about.history.timeline.august1990.title', contentKey: 'about.history.timeline.august1990.content' },
      { titleKey: 'about.history.timeline.firstYears.title', contentKey: 'about.history.timeline.firstYears.content' },
      { titleKey: 'about.history.timeline.mid1992.title', contentKey: 'about.history.timeline.mid1992.content' },
      { titleKey: 'about.history.timeline.present.title', contentKey: 'about.history.timeline.present.content' },
    ];

    return periods.map(p => ({
      title: t(p.titleKey),
      content: t(p.contentKey),
      imageUrl: '',
      focalX: '',
      focalY: '',
      _fromDb: false,
      founders: (p as any).founders || null,
    }));
  });

  // Set page metadata
  useHead({
    title: 'History of the School - CEE',
    meta: [
      {
        name: 'description',
        content:
          'The history of CEE, from our founding in 1990 to the present day, serving the community of Siguatepeque with quality Christian bilingual education.',
      },
    ],
  });
</script>
