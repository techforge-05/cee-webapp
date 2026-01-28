<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.history.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.history.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-clock"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('about.history.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('about.history.timeline.title') }}
        </h2>
        <div class="space-y-12">
          <!-- Late 1980s -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
                >
                  <UIcon name="i-heroicons-light-bulb" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex-1 bg-blue-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-blue-900 mb-4">
                  {{ $t('about.history.timeline.late1980s.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed mb-4">
                  {{ $t('about.history.timeline.late1980s.content') }}
                </p>
                <div class="bg-white rounded-lg p-4 mt-4">
                  <h4 class="font-bold text-blue-900 mb-2">
                    {{ $t('about.history.timeline.late1980s.founders') }}
                  </h4>
                  <ul class="list-disc list-inside text-gray-700 space-y-1">
                    <li
                      v-for="(founder, index) in founders"
                      :key="index"
                      class="ml-4"
                    >
                      {{ $rt(founder) }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Early 1990 -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold"
                >
                  <UIcon name="i-heroicons-users" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex-1 bg-purple-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-purple-900 mb-4">
                  {{ $t('about.history.timeline.early1990.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed">
                  {{ $t('about.history.timeline.early1990.content') }}
                </p>
              </div>
            </div>
          </div>

          <!-- August 1990 -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg"
                >
                  1990
                </div>
              </div>
              <div class="flex-1 bg-indigo-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-indigo-900 mb-4">
                  {{ $t('about.history.timeline.august1990.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed">
                  {{ $t('about.history.timeline.august1990.content') }}
                </p>
              </div>
            </div>
          </div>

          <!-- First Years -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold"
                >
                  <UIcon name="i-heroicons-academic-cap" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex-1 bg-violet-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-violet-900 mb-4">
                  {{ $t('about.history.timeline.firstYears.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed">
                  {{ $t('about.history.timeline.firstYears.content') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Mid 1992 -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-fuchsia-500 flex items-center justify-center text-white font-bold text-lg"
                >
                  1992
                </div>
              </div>
              <div class="flex-1 bg-fuchsia-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-fuchsia-900 mb-4">
                  {{ $t('about.history.timeline.mid1992.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed">
                  {{ $t('about.history.timeline.mid1992.content') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Present Day -->
          <div class="relative">
            <div class="flex items-start gap-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold"
                >
                  <UIcon name="i-heroicons-building-office-2" class="w-8 h-8" />
                </div>
              </div>
              <div class="flex-1 bg-green-50 rounded-lg p-6 md:p-8">
                <h3 class="text-2xl font-bold text-green-900 mb-4">
                  {{ $t('about.history.timeline.present.title') }}
                </h3>
                <p class="text-lg text-gray-800 leading-relaxed">
                  {{ $t('about.history.timeline.present.content') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Legacy Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-heart"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            {{ $t('about.history.legacy.title') }}
          </h2>
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('about.history.legacy.content') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('about.history.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('about.history.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100"
            >
              {{ $t('about.history.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700"
            >
              {{ $t('about.history.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm } = useI18n();

  const founders = computed(() => {
    return tm('about.history.timeline.late1980s.foundersList') as string[];
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
