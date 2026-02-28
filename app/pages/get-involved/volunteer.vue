<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 lg:py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('getInvolved.volunteer.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('getInvolved.volunteer.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('getInvolved.volunteer.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('getInvolved.volunteer.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('getInvolved.volunteer.intro', 'focalX') || 50}% ${singleMeta('getInvolved.volunteer.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('getInvolved.volunteer.intro', 'text') || $t('getInvolved.volunteer.intro') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16 space-y-12">

        <!-- Short-term Opportunities -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 border border-amber-200">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-amber-800 mb-6">
                {{ singleField('getInvolved.volunteer.shortTerm', 'title') || $t('getInvolved.volunteer.shortTerm.title') }}
              </h2>
              <p class="text-lg text-gray-700 leading-relaxed">
                {{ singleField('getInvolved.volunteer.shortTerm', 'description') || $t('getInvolved.volunteer.shortTerm.description') }}
              </p>
            </div>
            <div v-if="singleMeta('getInvolved.volunteer.shortTerm', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
              <img :src="singleMeta('getInvolved.volunteer.shortTerm', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.volunteer.shortTerm', 'focalX') || 50}% ${singleMeta('getInvolved.volunteer.shortTerm', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>

        <!-- Opportunities -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-200">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div v-if="singleMeta('getInvolved.volunteer.opportunitiesImage', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96 order-1 lg:order-0">
              <img :src="singleMeta('getInvolved.volunteer.opportunitiesImage', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.volunteer.opportunitiesImage', 'focalX') || 50}% ${singleMeta('getInvolved.volunteer.opportunitiesImage', 'focalY') || 50}%` }" alt="" />
            </div>
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-blue-800 mb-6">
                {{ $t('getInvolved.volunteer.opportunities.title') }}
              </h2>
              <ul class="space-y-4">
                <li
                  v-for="(item, index) in opportunities"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-heroicons-hand-raised"
                    class="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
                  />
                  <span class="text-lg text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- How to Get Started -->
        <div class="bg-gray-100 rounded-2xl p-8 md:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-emerald-800 mb-6">
                {{ singleField('getInvolved.volunteer.howTo', 'title') || $t('getInvolved.volunteer.howTo.title') }}
              </h2>
              <p class="text-lg text-gray-700 leading-relaxed">
                {{ singleField('getInvolved.volunteer.howTo', 'description') || $t('getInvolved.volunteer.howTo.description') }}
              </p>
            </div>
            <div v-if="singleMeta('getInvolved.volunteer.howTo', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
              <img :src="singleMeta('getInvolved.volunteer.howTo', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.volunteer.howTo', 'focalX') || 50}% ${singleMeta('getInvolved.volunteer.howTo', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-2xl lg:text-4xl font-bold mb-4">
          {{ singleField('getInvolved.volunteer.contact', 'title') || $t('getInvolved.volunteer.contact.title') }}
        </h2>
        <p class="text-lg text-blue-100 mb-6">
          {{ singleField('getInvolved.volunteer.contact', 'description') || $t('getInvolved.volunteer.contact.description') }}
        </p>
        <a
          :href="`mailto:${singleMeta('getInvolved.volunteer.contact', 'email') || 'volunteer@ceehonduras.org'}`"
          class="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          {{ singleMeta('getInvolved.volunteer.contact', 'email') || 'volunteer@ceehonduras.org' }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent([
  'getInvolved.volunteer.intro',
  'getInvolved.volunteer.shortTerm',
  'getInvolved.volunteer.opportunities',
  'getInvolved.volunteer.opportunitiesImage',
  'getInvolved.volunteer.howTo',
  'getInvolved.volunteer.contact',
]));

const opportunities = computed(() => {
  const dbItems = getItems('getInvolved.volunteer.opportunities');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('getInvolved.volunteer.opportunities.items') as any[];
  return Array.isArray(items) ? items.map((o: any) => typeof o === 'string' ? o : rt(o)) : [];
});

useHead({
  title: 'Volunteer Opportunities - Get Involved - CEE',
});
</script>
