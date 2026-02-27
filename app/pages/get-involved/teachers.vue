<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 lg:py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('getInvolved.teachers.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('getInvolved.teachers.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('getInvolved.teachers.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('getInvolved.teachers.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('getInvolved.teachers.intro', 'focalX') || 50}% ${singleMeta('getInvolved.teachers.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{ singleField('getInvolved.teachers.intro', 'text') || $t('getInvolved.teachers.intro') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16 space-y-12">

        <!-- Requirements Box -->
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 md:p-12 border border-amber-200">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-amber-800 mb-6">
                {{ singleField('getInvolved.teachers.requirements', 'title') || $t('getInvolved.teachers.requirements.title') }}
              </h2>
              <p class="text-lg text-gray-700 leading-relaxed">
                {{ singleField('getInvolved.teachers.requirements', 'description') || $t('getInvolved.teachers.requirements.description') }}
              </p>
            </div>
            <div v-if="singleMeta('getInvolved.teachers.requirements', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
              <img :src="singleMeta('getInvolved.teachers.requirements', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.teachers.requirements', 'focalX') || 50}% ${singleMeta('getInvolved.teachers.requirements', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>

        <!-- What We Look For -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-200">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div v-if="singleMeta('getInvolved.teachers.qualificationsImage', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96 order-1 lg:order-0">
              <img :src="singleMeta('getInvolved.teachers.qualificationsImage', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.teachers.qualificationsImage', 'focalX') || 50}% ${singleMeta('getInvolved.teachers.qualificationsImage', 'focalY') || 50}%` }" alt="" />
            </div>
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-blue-800 mb-6">
                {{ $t('getInvolved.teachers.qualifications.title') }}
              </h2>
              <ul class="space-y-4">
                <li
                  v-for="(item, index) in qualifications"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
                  />
                  <span class="text-lg text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Benefits -->
        <div class="bg-gray-100 rounded-2xl p-8 md:p-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
                {{ $t('getInvolved.teachers.benefits.title') }}
              </h2>
              <ul class="space-y-4">
                <li
                  v-for="(item, index) in benefits"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-heroicons-star"
                    class="w-6 h-6 text-amber-500 shrink-0 mt-0.5"
                  />
                  <span class="text-lg text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
            <div v-if="singleMeta('getInvolved.teachers.benefitsImage', 'imageUrl')" class="rounded-lg overflow-hidden h-80 md:h-96">
              <img :src="singleMeta('getInvolved.teachers.benefitsImage', 'imageUrl')" class="w-full h-full object-cover" :style="{ objectPosition: `${singleMeta('getInvolved.teachers.benefitsImage', 'focalX') || 50}% ${singleMeta('getInvolved.teachers.benefitsImage', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
        </div>

        <!-- Application Forms -->
        <div class="bg-white rounded-xl p-8 shadow-lg">
            <h2 class="text-2xl font-bold text-amber-800 mb-6 text-center">
              {{ singleField('getInvolved.teachers.applicationForms', 'title') || $t('getInvolved.teachers.applicationForms.title') }}
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- International Teachers -->
              <a
                :href="singleMeta('getInvolved.teachers.applicationForms', 'internationalUrl') || 'https://docs.google.com/forms/d/e/1FAIpQLSd5FCf2MujHWiGfmuPuOukzb1xplNKG08pMvIl5ZES6Ol6iQA/viewform'"
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
                :href="singleMeta('getInvolved.teachers.applicationForms', 'honduranUrl') || 'https://docs.google.com/forms/d/e/1FAIpQLSfF2FG694ecpMNhbZIW3tPJ7u1EPaTIXrVE3tuagusuR33XZw/viewform'"
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
    </section>

    <!-- Contact Section -->
    <section class="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="px-6 sm:px-10 lg:px-16 text-center">
        <h2 class="text-2xl font-bold mb-4">
          {{ singleField('getInvolved.teachers.contact', 'title') || $t('getInvolved.teachers.contact.title') }}
        </h2>
        <p class="text-lg text-blue-100 mb-6">
          {{ singleField('getInvolved.teachers.contact', 'description') || $t('getInvolved.teachers.contact.description') }}
        </p>
        <a
          :href="`mailto:${singleMeta('getInvolved.teachers.contact', 'email') || 'teach@ceehonduras.org'}`"
          class="inline-flex items-center gap-2 bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
          {{ singleMeta('getInvolved.teachers.contact', 'email') || 'teach@ceehonduras.org' }}
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent([
  'getInvolved.teachers.intro',
  'getInvolved.teachers.requirements',
  'getInvolved.teachers.qualifications',
  'getInvolved.teachers.qualificationsImage',
  'getInvolved.teachers.benefits',
  'getInvolved.teachers.benefitsImage',
  'getInvolved.teachers.applicationForms',
  'getInvolved.teachers.contact',
]));

const qualifications = computed(() => {
  const dbItems = getItems('getInvolved.teachers.qualifications');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('getInvolved.teachers.qualifications.items') as any[];
  return Array.isArray(items) ? items.map((q: any) => typeof q === 'string' ? q : rt(q)) : [];
});

const benefits = computed(() => {
  const dbItems = getItems('getInvolved.teachers.benefits');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('getInvolved.teachers.benefits.items') as any[];
  return Array.isArray(items) ? items.map((b: any) => typeof b === 'string' ? b : rt(b)) : [];
});

useHead({
  title: 'Potential Teachers - Get Involved - CEE',
});
</script>
