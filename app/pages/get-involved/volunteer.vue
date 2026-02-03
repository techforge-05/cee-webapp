<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('getInvolved.volunteer.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-amber-100">
          {{ $t('getInvolved.volunteer.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 lg:py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <UIcon
              name="i-heroicons-heart"
              class="w-16 h-16 text-amber-500 mx-auto mb-4"
            />
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ $t('getInvolved.volunteer.intro') }}
            </p>
          </div>

          <!-- Short-term Opportunities -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 mb-8 border border-amber-200">
            <div class="flex items-start gap-4">
              <UIcon
                name="i-heroicons-clock"
                class="w-10 h-10 text-amber-600 shrink-0"
              />
              <div>
                <h2 class="text-2xl font-bold text-amber-800 mb-3">
                  {{ $t('getInvolved.volunteer.shortTerm.title') }}
                </h2>
                <p class="text-gray-700 leading-relaxed">
                  {{ $t('getInvolved.volunteer.shortTerm.description') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Opportunities -->
          <div class="bg-amber-50 rounded-xl p-8 mb-8">
            <h2 class="text-2xl font-bold text-amber-800 mb-4">
              {{ $t('getInvolved.volunteer.opportunities.title') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in opportunities"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-hand-raised"
                  class="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(item) }}</span>
              </li>
            </ul>
          </div>

          <!-- How to Get Started -->
          <div class="bg-gray-50 rounded-xl p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              {{ $t('getInvolved.volunteer.howTo.title') }}
            </h2>
            <p class="text-gray-700">
              {{ $t('getInvolved.volunteer.howTo.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-12 bg-amber-500 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t('getInvolved.volunteer.contact.title') }}
        </h2>
        <p class="text-lg text-amber-100 mb-6">
          {{ $t('getInvolved.volunteer.contact.description') }}
        </p>
        <a
          href="mailto:volunteer@ceehonduras.org"
          class="inline-flex items-center gap-2 bg-white text-amber-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          volunteer@ceehonduras.org
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { tm } = useI18n();

const opportunities = computed(() => tm('getInvolved.volunteer.opportunities.items') as any[]);

useHead({
  title: 'Volunteer Opportunities - Get Involved - CEE',
});
</script>
