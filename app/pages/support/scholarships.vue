<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.scholarships.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.scholarships.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-academic-cap"
            class="w-16 h-16 text-red-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('support.scholarships.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Purpose Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-red-50 rounded-2xl p-8 md:p-12">
          <div class="flex items-start gap-4">
            <UIcon
              name="i-heroicons-light-bulb"
              class="w-12 h-12 text-red-600 shrink-0"
            />
            <div>
              <h2 class="text-3xl font-bold text-red-900 mb-4">
                {{ $t('support.scholarships.purpose.title') }}
              </h2>
              <p class="text-xl text-gray-800 leading-relaxed">
                {{ $t('support.scholarships.purpose.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Types of Financial Aid -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          {{ $t('support.scholarships.types.title') }}
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(item, index) in typesWithIcons"
            :key="index"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0"
              >
                <UIcon :name="item.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ $rt(item.title) }}
                </h3>
                <p class="text-gray-700">
                  {{ $rt(item.description) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">
          {{ $t('support.scholarships.impact.title') }}
        </h2>
        <p class="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          {{ $t('support.scholarships.impact.description') }}
        </p>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(stat, index) in impactStats"
            :key="index"
            class="text-center p-6"
          >
            <div
              class="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon :name="statIcons[index]" class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ $rt(stat.label) }}
            </h3>
            <p class="text-gray-600">
              {{ $rt(stat.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Success Stories Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-star"
            class="w-16 h-16 text-orange-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            {{ $t('support.scholarships.testimonial.title') }}
          </h2>
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('support.scholarships.testimonial.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">
          {{ $t('support.scholarships.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('support.scholarships.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/support/donate')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100"
          >
            {{ $t('support.scholarships.cta.donate') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600"
          >
            {{ $t('support.scholarships.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt: $rt } = useI18n();

const typeIcons = [
  'i-heroicons-trophy',
  'i-heroicons-heart',
  'i-heroicons-calculator',
  'i-heroicons-calendar-days',
];

const statIcons = [
  'i-heroicons-users',
  'i-heroicons-clock',
  'i-heroicons-briefcase',
];

const typesWithIcons = computed(() => {
  const items = tm('support.scholarships.types.items') as any[];
  return items.map((item: any, index: number) => ({
    ...item,
    icon: typeIcons[index],
  }));
});

const impactStats = computed(() => {
  return tm('support.scholarships.impact.stats') as any[];
});

useHead({
  title: 'Scholarships Impact - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Learn about the impact of scholarships at CEE and how you can help transform lives through educational opportunities.',
    },
  ],
});
</script>
