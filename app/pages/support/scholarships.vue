<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.scholarships.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.scholarships.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('support.scholarships.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('support.scholarships.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('support.scholarships.intro', 'focalX') || 50}% ${singleMeta('support.scholarships.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction Section -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('support.scholarships.intro', 'text') || $t('support.scholarships.intro') }}
        </p>
      </div>
    </section>

    <!-- Purpose Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="bg-red-50 rounded-2xl p-8 md:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-3xl lg:text-5xl font-bold text-red-900 mb-4">
                {{ singleField('support.scholarships.purpose', 'title') || $t('support.scholarships.purpose.title') }}
              </h2>
              <p class="text-xl text-gray-800 leading-relaxed">
                {{ singleField('support.scholarships.purpose', 'description') || $t('support.scholarships.purpose.description') }}
              </p>
            </div>
            <div v-if="singleMeta('support.scholarships.purpose', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
              <img :src="singleMeta('support.scholarships.purpose', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('support.scholarships.purpose', 'focalX') || 50}% ${singleMeta('support.scholarships.purpose', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Section -->
    <section class="py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div v-if="singleMeta('support.scholarships.impact', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
            <img :src="singleMeta('support.scholarships.impact', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('support.scholarships.impact', 'focalX') || 50}% ${singleMeta('support.scholarships.impact', 'focalY') || 50}%` }" alt="" />
          </div>
          <div>
            <h2 class="text-3xl lg:text-5xl font-bold text-blue-800 mb-4">
              {{ singleField('support.scholarships.impact', 'title') || $t('support.scholarships.impact.title') }}
            </h2>
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ singleField('support.scholarships.impact', 'description') || $t('support.scholarships.impact.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
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
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('support.scholarships.cta.donate') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
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
const { loadContent, singleField, singleMeta } = usePublicContent();

onMounted(() => loadContent([
  'support.scholarships.intro',
  'support.scholarships.purpose',
  'support.scholarships.impact',
]));

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
