<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('contact.faq.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('contact.faq.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-question-mark-circle"
            class="w-16 h-16 text-red-600 mx-auto mb-6"
          />
          <p class="text-2xl md:text-3xl font-semibold text-red-800 leading-snug">
            {{ $t('contact.faq.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="py-8 bg-white border-b border-gray-200">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-wrap justify-center gap-3">
          <UButton
            v-for="category in categories"
            :key="category.value"
            :variant="selectedCategory === category.value ? 'solid' : 'outline'"
            :class="selectedCategory === category.value
              ? 'bg-red-600 hover:bg-red-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            size="md"
            @click="selectedCategory = category.value"
          >
            {{ category.label }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="space-y-4">
          <div
            v-for="(faq, index) in filteredQuestions"
            :key="index"
            class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
          >
            <button
              class="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              @click="toggleQuestion(index)"
            >
              <div class="flex items-center gap-3">
                <UBadge
                  :color="getCategoryColor(faq._fromDb ? faq.category : $rt(faq.category))"
                  variant="subtle"
                  size="sm"
                >
                  {{ getCategoryLabel(faq._fromDb ? faq.category : $rt(faq.category)) }}
                </UBadge>
                <span class="font-semibold text-gray-900">
                  {{ faq._fromDb ? faq.question : $rt(faq.question) }}
                </span>
              </div>
              <UIcon
                :name="openQuestions.includes(index) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="w-5 h-5 text-gray-500 shrink-0"
              />
            </button>
            <div
              v-show="openQuestions.includes(index)"
              class="px-6 pb-5 text-gray-700 border-t border-gray-100 pt-4"
            >
              {{ faq._fromDb ? faq.answer : $rt(faq.answer) }}
              <NuxtLink
                v-if="faq._fromDb ? faq.linkPath : faq.link"
                :to="localePath(faq._fromDb ? faq.linkPath : $rt(faq.link.path))"
                class="inline-flex items-center gap-1 text-teal-600 hover:text-teal-800 font-medium ml-1"
              >
                {{ faq._fromDb ? faq.linkText : $rt(faq.link.text) }}
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div
          v-if="filteredQuestions.length === 0"
          class="text-center py-12"
        >
          <UIcon
            name="i-heroicons-magnifying-glass"
            class="w-16 h-16 text-gray-400 mx-auto mb-4"
          />
          <p class="text-gray-600 text-lg">
            No questions found in this category.
          </p>
        </div>
      </div>
    </section>

    <!-- Still Have Questions Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('contact.faq.stillHaveQuestions.title') }}
          </h2>
          <p class="text-xl text-gray-700 mb-8">
            {{ $t('contact.faq.stillHaveQuestions.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              color="primary"
              class="bg-red-600 hover:bg-red-700 justify-center"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 mr-2" />
              {{ $t('contact.faq.stillHaveQuestions.contactUs') }}
            </UButton>
            <UButton
              href="https://wa.me/50493268998"
              target="_blank"
              size="lg"
              variant="outline"
              class="border-2 border-red-600 text-red-600 hover:bg-red-50 justify-center"
            >
              <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
              {{ $t('contact.faq.stillHaveQuestions.callUs') }}
            </UButton>
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
          {{ $t('about.missionVisionValues.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('about.missionVisionValues.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('nav.dropdowns.contact.info') }}
          </UButton>
          <UButton
            :to="localePath('/contact/directions')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
          >
            {{ $t('nav.dropdowns.contact.directions') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t, tm, rt: $rt } = useI18n();
const { loadContent, getItems, field, meta: getMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent(['contact.faq']));

const selectedCategory = ref('all');
const openQuestions = ref<number[]>([]);

const questions = computed(() => {
  // DB-first: if items exist in DB, use them
  const dbItems = getItems('contact.faq');
  if (dbItems.length > 0) {
    return dbItems.map(item => ({
      question: field(item, 'question'),
      answer: field(item, 'answer'),
      category: getMeta(item, 'category') || 'general',
      linkText: field(item, 'linkText') || '',
      linkPath: getMeta(item, 'linkPath') || '',
      _fromDb: true,
    }));
  }
  // Fallback to i18n
  return (tm('contact.faq.questions') as any[]).map((q: any) => ({
    ...q,
    _fromDb: false,
  }));
});

const categories = computed(() => {
  return [
    { value: 'all', label: t('contact.faq.categories.all') },
    { value: 'admissions', label: t('contact.faq.categories.admissions') },
    { value: 'academics', label: t('contact.faq.categories.academics') },
    { value: 'financialAid', label: t('contact.faq.categories.financialAid') },
    { value: 'general', label: t('contact.faq.categories.general') },
  ];
});

const filteredQuestions = computed(() => {
  if (selectedCategory.value === 'all') {
    return questions.value;
  }
  return questions.value.filter((q: any) => {
    const cat = q._fromDb ? q.category : $rt(q.category);
    return cat === selectedCategory.value;
  });
});

const toggleQuestion = (index: number) => {
  const questionIndex = openQuestions.value.indexOf(index);
  if (questionIndex > -1) {
    openQuestions.value.splice(questionIndex, 1);
  } else {
    openQuestions.value.push(index);
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, 'primary' | 'info' | 'warning' | 'success'> = {
    admissions: 'primary',
    academics: 'info',
    financialAid: 'warning',
    general: 'success',
  };
  return colors[category] || 'primary';
};

const getCategoryLabel = (category: string) => {
  const key = `contact.faq.categories.${category}`;
  return t(key);
};

useHead({
  title: 'FAQ - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Frequently asked questions about CEE. Find answers about admissions, academics, financial aid, and more.',
    },
  ],
});
</script>
