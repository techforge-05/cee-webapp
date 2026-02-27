<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.library.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-amber-100">
          {{ $t('studentLife.library.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('studentLife.library.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('studentLife.library.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('studentLife.library.intro', 'focalX') || 50}% ${singleMeta('studentLife.library.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-3xl lg:text-4xl font-bold text-amber-700 mb-4">
          Beulah B. Burgess Library
        </h2>
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('studentLife.library.intro', 'text') || $t('studentLife.library.intro') }}
        </p>
      </div>
    </section>

    <!-- Purpose of the Library -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="order-2 lg:order-1">
            <h2 class="text-3xl lg:text-4xl font-bold text-teal-800 mb-6">
              {{ singleField('studentLife.library.purpose', 'title') || $t('studentLife.library.purpose.title') }}
            </h2>
            <p class="text-lg lg:text-xl text-gray-600 leading-relaxed mb-6">
              {{ singleField('studentLife.library.purpose', 'description') || $t('studentLife.library.purpose.description') }}
            </p>
            <ul class="space-y-3">
              <li
                v-for="(goal, index) in goals"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ goal }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-amber-50 rounded-2xl p-8 order-1 lg:order-2">
            <div v-if="singleMeta('studentLife.library.purpose', 'imageUrl')" class="rounded-lg h-96 overflow-hidden">
              <img
                :src="singleMeta('studentLife.library.purpose', 'imageUrl')"
                alt=""
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${singleMeta('studentLife.library.purpose', 'focalX') || 50}% ${singleMeta('studentLife.library.purpose', 'focalY') || 50}%` }"
              />
            </div>
            <div v-else class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <UIcon name="i-heroicons-book-open" class="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reading Corner Image Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="bg-amber-50 rounded-2xl p-8">
            <div v-if="singleMeta('studentLife.library.readingCorner', 'imageUrl')" class="rounded-lg h-96 overflow-hidden">
              <img
                :src="singleMeta('studentLife.library.readingCorner', 'imageUrl')"
                alt=""
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${singleMeta('studentLife.library.readingCorner', 'focalX') || 50}% ${singleMeta('studentLife.library.readingCorner', 'focalY') || 50}%` }"
              />
            </div>
            <div v-else class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <UIcon name="i-heroicons-book-open" class="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-orange-800 mb-6">
              {{ singleField('studentLife.library.readingCorner', 'title') || $t('studentLife.library.readingCorner.title') }}
            </h2>
            <p class="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {{ singleField('studentLife.library.readingCorner', 'description') || $t('studentLife.library.readingCorner.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Library Hours -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.library.hours.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.library.hours.description') }}
          </p>
        </div>

        <div class="max-w-2xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div
              v-for="(schedule, index) in schedules"
              :key="index"
              class="flex items-center justify-between p-6 border-b last:border-b-0"
            >
              <div class="flex items-center gap-4">
                <span class="font-semibold text-gray-900">{{
                  schedule.day
                }}</span>
              </div>
              <span class="text-gray-600">{{ schedule.hours }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grade-Level Reading Support -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.library.gradeSupport.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.library.gradeSupport.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(level, index) in levels"
            :key="index"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border-t-4 w-full md:w-[calc(33.333%-1.334rem)]"
            :class="getLevelBorderColor(index)"
          >
            <div
              class="h-64 flex items-center justify-center"
              :class="getLevelLightBgColor(index)"
            >
              <img
                v-if="level.imageUrl"
                :src="level.imageUrl"
                :alt="level.title"
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${level.focalX}% ${level.focalY}%` }"
              />
              <UIcon v-else :name="levelIcons[index]" class="w-16 h-16" :class="getLevelIconColor(index)" />
            </div>
            <div class="p-8">
              <h3 class="text-xl font-bold text-gray-900 mb-3">
                {{ level.title }}
              </h3>
              <p class="text-gray-700 leading-relaxed">
                {{ level.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Borrowing Rules -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {{ $t('studentLife.library.borrowing.title') }}
            </h2>
            <p class="text-lg text-gray-600">
              {{ $t('studentLife.library.borrowing.description') }}
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8">
            <ul class="space-y-4">
              <li
                v-for="(rule, index) in rules"
                :key="index"
                class="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0"
              >
                <div
                  class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0"
                >
                  <span class="text-amber-700 font-bold text-sm">{{
                    index + 1
                  }}</span>
                </div>
                <span class="text-gray-700 pt-1">{{ rule }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Bilingual Collection Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl lg:text-4xl font-bold text-blue-800 mb-6">
              {{ singleField('studentLife.library.bilingualCollection', 'title') || $t('studentLife.library.bilingualCollection.title') }}
            </h2>
            <p class="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {{ singleField('studentLife.library.bilingualCollection', 'description') || $t('studentLife.library.bilingualCollection.description') }}
            </p>
          </div>
          <div class="bg-blue-50 rounded-2xl p-8">
            <div v-if="singleMeta('studentLife.library.bilingualCollection', 'imageUrl')" class="rounded-lg h-96 overflow-hidden">
              <img
                :src="singleMeta('studentLife.library.bilingualCollection', 'imageUrl')"
                alt=""
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${singleMeta('studentLife.library.bilingualCollection', 'focalX') || 50}% ${singleMeta('studentLife.library.bilingualCollection', 'focalY') || 50}%` }"
              />
            </div>
            <div v-else class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <UIcon name="i-heroicons-language" class="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Study Space Section -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="bg-green-50 rounded-2xl p-8 order-2 lg:order-1">
            <div v-if="singleMeta('studentLife.library.studySpace', 'imageUrl')" class="rounded-lg h-96 overflow-hidden">
              <img
                :src="singleMeta('studentLife.library.studySpace', 'imageUrl')"
                alt=""
                class="w-full h-full object-cover"
                :style="{ objectPosition: `${singleMeta('studentLife.library.studySpace', 'focalX') || 50}% ${singleMeta('studentLife.library.studySpace', 'focalY') || 50}%` }"
              />
            </div>
            <div v-else class="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <UIcon name="i-heroicons-users" class="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <h2 class="text-3xl lg:text-4xl font-bold text-green-800 mb-6">
              {{ singleField('studentLife.library.studySpace', 'title') || $t('studentLife.library.studySpace.title') }}
            </h2>
            <p class="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {{ singleField('studentLife.library.studySpace', 'description') || $t('studentLife.library.studySpace.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Support the Library -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-2xl mx-auto text-center bg-green-50 rounded-2xl p-10">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {{ singleField('studentLife.library.donate', 'title') || $t('studentLife.library.donate.title') }}
          </h2>
          <p class="text-lg text-gray-700 mb-6">
            {{ singleField('studentLife.library.donate', 'description') || $t('studentLife.library.donate.description') }}
          </p>
          <UButton
            :to="localePath('/support/donate')"
            size="lg"
            variant="solid"
            class="bg-green-600 text-white hover:bg-green-700"
          >
            {{ $t('studentLife.library.donate.button') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Contact the Library -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-2xl mx-auto text-center bg-amber-50 rounded-2xl p-10">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
            {{ singleField('studentLife.library.contact', 'title') || $t('studentLife.library.contact.title') }}
          </h2>
          <p class="text-lg text-gray-700 mb-6">
            {{ singleField('studentLife.library.contact', 'description') || $t('studentLife.library.contact.description') }}
          </p>
          <a
            :href="`mailto:${singleField('studentLife.library.contact', 'email') || 'library@ceehonduras.org'}`"
            class="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold text-lg"
          >
            <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
            {{ singleField('studentLife.library.contact', 'email') || 'library@ceehonduras.org' }}
          </a>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4">
            {{ $t('studentLife.library.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.library.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-amber-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('studentLife.library.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-amber-700 justify-center"
            >
              {{ $t('studentLife.library.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'studentLife.library.intro',
    'studentLife.library.purpose',
    'studentLife.library.goals',
    'studentLife.library.readingCorner',
    'studentLife.library.hours',
    'studentLife.library.gradeSupport',
    'studentLife.library.rules',
    'studentLife.library.bilingualCollection',
    'studentLife.library.studySpace',
    'studentLife.library.donate',
    'studentLife.library.contact',
  ]));

  const levelIcons = [
    'i-heroicons-star',
    'i-heroicons-book-open',
    'i-heroicons-academic-cap',
  ];

  const goals = computed(() => {
    const dbItems = getItems('studentLife.library.goals');
    if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
    const items = tm('studentLife.library.purpose.goals') as any[];
    return Array.isArray(items) ? items.map((g: any) => typeof g === 'string' ? g : rt(g)) : [];
  });

  const schedules = computed(() => {
    const dbItems = getItems('studentLife.library.hours');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        day: field(item, 'day') || getMeta(item, 'day'),
        hours: field(item, 'hours') || getMeta(item, 'hours'),
      }));
    }
    const items = tm('studentLife.library.hours.schedule') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((s: any) => ({
      day: typeof s.day === 'string' ? s.day : rt(s.day),
      hours: typeof s.hours === 'string' ? s.hours : rt(s.hours),
    }));
  });

  const levels = computed(() => {
    const dbItems = getItems('studentLife.library.gradeSupport');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        imageUrl: item.metadata?.imageUrl || '',
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      }));
    }
    const items = tm('studentLife.library.gradeSupport.levels') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((l: any) => ({
      title: typeof l.title === 'string' ? l.title : rt(l.title),
      description: typeof l.description === 'string' ? l.description : rt(l.description),
    }));
  });

  const rules = computed(() => {
    const dbItems = getItems('studentLife.library.rules');
    if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
    const items = tm('studentLife.library.borrowing.rules') as any[];
    return Array.isArray(items) ? items.map((r: any) => typeof r === 'string' ? r : rt(r)) : [];
  });

  const getLevelBorderColor = (index: number) => {
    const colors = ['border-pink-500', 'border-amber-500', 'border-blue-500'];
    return colors[index % colors.length];
  };

  const getLevelLightBgColor = (index: number) => {
    const colors = ['bg-pink-100', 'bg-amber-100', 'bg-blue-100'];
    return colors[index % colors.length];
  };

  const getLevelIconColor = (index: number) => {
    const colors = ['text-pink-500', 'text-amber-500', 'text-blue-500'];
    return colors[index % colors.length];
  };

  useHead({
    title: 'Library - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Discover the CEE school library with bilingual resources, reading programs, and support for all grade levels.',
      },
    ],
  });
</script>
