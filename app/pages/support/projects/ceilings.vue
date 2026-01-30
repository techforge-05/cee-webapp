<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <NuxtLink
          :to="localePath('/support/projects')"
          class="inline-flex items-center gap-2 text-teal-100 hover:text-white mb-4 transition-colors"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          {{ $t('support.projectDetails.backToProjects') }}
        </NuxtLink>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.projectDetails.ceilings.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-red-100">
          {{ $t('support.projectDetails.ceilings.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Project Image Placeholder -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl h-64 md:h-96 flex items-center justify-center">
          <UIcon
            name="i-heroicons-home-modern"
            class="w-32 h-32 text-amber-400"
          />
        </div>
      </div>
    </section>

    <!-- Project Details -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <p class="text-xl text-gray-700 leading-relaxed mb-8">
              {{ $t('support.projectDetails.ceilings.description') }}
            </p>

            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              {{ $t('support.projectDetails.whyNeeded') }}
            </h2>
            <ul class="space-y-4">
              <li
                v-for="(need, index) in needs"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-6 h-6 text-green-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ $rt(need) }}</span>
              </li>
            </ul>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-amber-50 rounded-xl p-6 sticky top-24">
              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">
                  {{ $t('support.projectDetails.currentStatus') }}
                </h3>
                <UBadge color="primary" variant="subtle" size="lg">
                  {{ $t('support.projectDetails.ceilings.status') }}
                </UBadge>
              </div>

              <div class="mb-6">
                <h3 class="text-sm font-semibold text-gray-500 uppercase mb-2">
                  {{ $t('support.projectDetails.projectGoal') }}
                </h3>
                <p class="text-gray-700">
                  {{ $t('support.projectDetails.ceilings.goal') }}
                </p>
              </div>

              <UButton
                :to="localePath('/support/donate')"
                size="lg"
                color="primary"
                class="w-full bg-red-600 hover:bg-red-700"
              >
                {{ $t('support.projectDetails.donateToProject') }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('support.projects.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('support.projects.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/support/donate')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100"
          >
            {{ $t('support.projects.cta.donate') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600"
          >
            {{ $t('support.projects.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt: $rt } = useI18n();

const needs = computed(() => {
  return tm('support.projectDetails.ceilings.needs') as any[];
});

useHead({
  title: 'Ceilings Project - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Learn about our Ceilings project to improve the learning environment in our classrooms.',
    },
  ],
});
</script>
