<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-amber-600 to-orange-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.library.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-amber-100">
          {{ $t('studentLife.library.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-book-open"
            class="w-16 h-16 text-amber-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('studentLife.library.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Purpose of the Library -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">
              {{ $t('studentLife.library.purpose.title') }}
            </h2>
            <p class="text-lg text-gray-700 leading-relaxed mb-6">
              {{ $t('studentLife.library.purpose.description') }}
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
                <span class="text-gray-700">{{ $rt(goal) }}</span>
              </li>
            </ul>
          </div>
          <div class="bg-amber-50 rounded-2xl p-8">
            <div
              class="bg-gray-200 rounded-lg h-64 flex items-center justify-center"
            >
              <p class="text-gray-400 text-lg">Library Image</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Library Hours -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
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
                <div
                  class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-clock"
                    class="w-5 h-5 text-amber-600"
                  />
                </div>
                <span class="font-semibold text-gray-900">{{
                  $rt(schedule.day)
                }}</span>
              </div>
              <span class="text-gray-600">{{ $rt(schedule.hours) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Grade-Level Reading Support -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.library.gradeSupport.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('studentLife.library.gradeSupport.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(level, index) in levels"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4"
            :class="getLevelBorderColor(index)"
          >
            <div
              class="w-14 h-14 rounded-full mb-6 flex items-center justify-center"
              :class="getLevelBgColor(index)"
            >
              <UIcon :name="levelIcons[index]" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ $rt(level.title) }}
            </h3>
            <p class="text-gray-700 leading-relaxed">
              {{ $rt(level.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Borrowing Rules -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
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
                <span class="text-gray-700 pt-1">{{ $rt(rule) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Person -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-2xl mx-auto text-center bg-amber-50 rounded-2xl p-10">
          <UIcon
            name="i-heroicons-user-circle"
            class="w-16 h-16 text-amber-600 mx-auto mb-4"
          />
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ $t('studentLife.library.contact.title') }}
          </h2>
          <p class="text-lg text-gray-700 mb-6">
            {{ $t('studentLife.library.contact.description') }}
          </p>
          <div class="space-y-3">
            <div class="flex items-center justify-center gap-3">
              <UIcon name="i-heroicons-user" class="w-5 h-5 text-amber-600" />
              <span class="text-gray-700">{{
                $t('studentLife.library.contact.librarian')
              }}</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <UIcon
                name="i-heroicons-envelope"
                class="w-5 h-5 text-amber-600"
              />
              <span class="text-gray-700">{{
                $t('studentLife.library.contact.email')
              }}</span>
            </div>
            <div class="flex items-center justify-center gap-3">
              <UIcon
                name="i-heroicons-map-pin"
                class="w-5 h-5 text-amber-600"
              />
              <span class="text-gray-700">{{
                $t('studentLife.library.contact.location')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('studentLife.library.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.library.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-amber-700 hover:bg-gray-100"
            >
              {{ $t('studentLife.library.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-amber-700"
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
  const { tm, rt: $rt } = useI18n();

  const levelIcons = [
    'i-heroicons-star',
    'i-heroicons-book-open',
    'i-heroicons-academic-cap',
  ];

  const goals = computed(() => {
    const items = tm('studentLife.library.purpose.goals') as string[];
    return Array.isArray(items) ? items : [];
  });

  const schedules = computed(() => {
    const items = tm('studentLife.library.hours.schedule') as any[];
    return Array.isArray(items) ? items : [];
  });

  const levels = computed(() => {
    const items = tm('studentLife.library.gradeSupport.levels') as any[];
    return Array.isArray(items) ? items : [];
  });

  const rules = computed(() => {
    const items = tm('studentLife.library.borrowing.rules') as string[];
    return Array.isArray(items) ? items : [];
  });

  const getLevelBorderColor = (index: number) => {
    const colors = ['border-pink-500', 'border-amber-500', 'border-blue-500'];
    return colors[index % colors.length];
  };

  const getLevelBgColor = (index: number) => {
    const colors = ['bg-pink-500', 'bg-amber-500', 'bg-blue-500'];
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
