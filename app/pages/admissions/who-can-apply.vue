<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 lg:py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('admissions.whoCanApply.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-emerald-100">
          {{ $t('admissions.whoCanApply.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Content Section -->
    <section class="py-12 lg:py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div :class="singleMeta('admissions.whoCanApply.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8' : 'max-w-4xl mx-auto text-center mb-8'">
            <div>
              <p class="text-xl text-gray-700 leading-relaxed">
                {{ singleField('admissions.whoCanApply.intro', 'text') || $t('admissions.whoCanApply.intro') }}
              </p>
            </div>
            <div v-if="singleMeta('admissions.whoCanApply.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
              <img :src="singleMeta('admissions.whoCanApply.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('admissions.whoCanApply.intro', 'focalX') || 50}% ${singleMeta('admissions.whoCanApply.intro', 'focalY') || 50}%` }" alt="" />
            </div>
          </div>
          <div class="prose prose-lg max-w-none">

            <!-- Grades Section -->
            <div class="bg-emerald-50 rounded-xl p-8 mb-8">
              <h2 class="text-2xl font-bold text-emerald-800 mb-4">
                {{ $t('admissions.whoCanApply.grades.title') }}
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="(grade, index) in grades"
                  :key="index"
                  class="flex items-center gap-3"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-6 h-6 text-emerald-600 shrink-0"
                  />
                  <span class="text-gray-700">{{ grade }}</span>
                </li>
              </ul>
            </div>

            <!-- Requirements Section -->
            <div class="bg-gray-50 rounded-xl p-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">
                {{ $t('admissions.whoCanApply.requirements.title') }}
              </h2>
              <ul class="space-y-3">
                <li
                  v-for="(req, index) in requirements"
                  :key="index"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-heroicons-document-check"
                    class="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
                  />
                  <span class="text-gray-700">{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-emerald-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ $t('admissions.whoCanApply.cta.title') }}
        </h2>
        <p class="text-lg text-gray-700 mb-6">
          {{ $t('admissions.whoCanApply.cta.description') }}
        </p>
        <UButton
          :to="localePath('/admissions/how-to-apply')"
          size="lg"
          color="primary"
          class="bg-emerald-600 hover:bg-emerald-700 justify-center"
        >
          {{ $t('admissions.whoCanApply.cta.button') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent([
  'admissions.whoCanApply.intro',
  'admissions.whoCanApply.grades',
  'admissions.whoCanApply.requirements',
]));

const grades = computed(() => {
  const dbItems = getItems('admissions.whoCanApply.grades');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('admissions.whoCanApply.grades.items') as any[];
  return Array.isArray(items) ? items.map((g: any) => typeof g === 'string' ? g : rt(g)) : [];
});

const requirements = computed(() => {
  const dbItems = getItems('admissions.whoCanApply.requirements');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('admissions.whoCanApply.requirements.items') as any[];
  return Array.isArray(items) ? items.map((r: any) => typeof r === 'string' ? r : rt(r)) : [];
});

useHead({
  title: 'Who Can Apply - Admissions - CEE',
});
</script>
