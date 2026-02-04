<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('getInvolved.teachers.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('getInvolved.teachers.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 lg:py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-16 h-16 text-amber-500 mx-auto mb-4"
            />
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ $t('getInvolved.teachers.intro') }}
            </p>
          </div>

          <!-- Requirements Box -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 mb-8 border border-amber-200">
            <h2 class="text-2xl font-bold text-amber-800 mb-4">
              {{ $t('getInvolved.teachers.requirements.title') }}
            </h2>
            <p class="text-gray-700 leading-relaxed">
              {{ $t('getInvolved.teachers.requirements.description') }}
            </p>
          </div>

          <!-- What We Look For -->
          <div class="bg-amber-50 rounded-xl p-8 mb-8">
            <h2 class="text-2xl font-bold text-amber-800 mb-4">
              {{ $t('getInvolved.teachers.qualifications.title') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in qualifications"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-amber-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(item) }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div class="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">
              {{ $t('getInvolved.teachers.benefits.title') }}
            </h2>
            <ul class="space-y-3">
              <li
                v-for="(item, index) in benefits"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-star"
                  class="w-6 h-6 text-amber-500 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(item) }}</span>
              </li>
            </ul>
          </div>

          <!-- Application Forms -->
          <div class="bg-white rounded-xl p-8 mb-8 border-2 border-amber-300 shadow-lg">
            <h2 class="text-2xl font-bold text-amber-800 mb-6 text-center">
              {{ $t('getInvolved.teachers.applicationForms.title') }}
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- International Teachers -->
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd5FCf2MujHWiGfmuPuOukzb1xplNKG08pMvIl5ZES6Ol6iQA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-col items-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow border border-blue-200"
              >
                <UIcon
                  name="i-heroicons-globe-alt"
                  class="w-12 h-12 text-blue-600 mb-3"
                />
                <h3 class="text-lg font-semibold text-blue-800 mb-2">
                  {{ $t('getInvolved.teachers.applicationForms.international') }}
                </h3>
                <span class="text-blue-600 text-sm flex items-center gap-1">
                  {{ $t('getInvolved.teachers.applicationForms.applyNow') }}
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                </span>
              </a>

              <!-- Honduran Teachers -->
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSfF2FG694ecpMNhbZIW3tPJ7u1EPaTIXrVE3tuagusuR33XZw/viewform"
                target="_blank"
                rel="noopener noreferrer"
                class="flex flex-col items-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow border border-green-200"
              >
                <UIcon
                  name="i-heroicons-home-modern"
                  class="w-12 h-12 text-green-600 mb-3"
                />
                <h3 class="text-lg font-semibold text-green-800 mb-2">
                  {{ $t('getInvolved.teachers.applicationForms.honduran') }}
                </h3>
                <span class="text-green-600 text-sm flex items-center gap-1">
                  {{ $t('getInvolved.teachers.applicationForms.applyNow') }}
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ $t('getInvolved.teachers.contact.title') }}
        </h2>
        <p class="text-lg text-blue-100 mb-6">
          {{ $t('getInvolved.teachers.contact.description') }}
        </p>
        <a
          href="mailto:teach@ceehonduras.org"
          class="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          teach@ceehonduras.org
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { tm } = useI18n();

const qualifications = computed(() => tm('getInvolved.teachers.qualifications.items') as any[]);
const benefits = computed(() => tm('getInvolved.teachers.benefits.items') as any[]);

useHead({
  title: 'Potential Teachers - Get Involved - CEE',
});
</script>
