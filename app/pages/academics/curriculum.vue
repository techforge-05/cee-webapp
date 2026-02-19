<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.curriculum.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.curriculum.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto">
          <div class="flex items-start gap-6 mb-8">
            <UIcon
              name="i-heroicons-academic-cap"
              class="w-16 h-16 text-purple-600 shrink-0"
            />
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">
                {{ singleField('academics.curriculum.intro', 'title') || $t('academics.curriculum.intro.title') }}
              </h2>
              <p class="text-xl text-gray-700 leading-relaxed mb-4">
                {{ singleField('academics.curriculum.intro', 'paragraph1') || $t('academics.curriculum.intro.paragraph1') }}
              </p>
              <p class="text-xl text-gray-700 leading-relaxed">
                {{ singleField('academics.curriculum.intro', 'paragraph2') || $t('academics.curriculum.intro.paragraph2') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Programs Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.curriculum.programs.title') }}
        </h2>

        <div class="space-y-12">
          <!-- Kindergarten -->
          <div
            class="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8 md:p-12 border-l-4 border-pink-500"
          >
            <div class="flex items-start gap-6 mb-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-star" class="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ $t('academics.curriculum.programs.kindergarten.title') }}
                </h3>
                <p class="text-lg text-pink-700 font-semibold mb-4">
                  {{ singleField('academics.curriculum.kindergarten', 'name') || $t('academics.curriculum.programs.kindergarten.name') }}
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <p class="text-lg text-gray-800 leading-relaxed">
                {{
                  singleField('academics.curriculum.kindergarten', 'description') || $t('academics.curriculum.programs.kindergarten.description')
                }}
              </p>
              <p class="text-lg text-gray-800 leading-relaxed">
                {{ singleField('academics.curriculum.kindergarten', 'details') || $t('academics.curriculum.programs.kindergarten.details') }}
              </p>
            </div>
          </div>

          <!-- Elementary School -->
          <div
            class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 md:p-12 border-l-4 border-blue-500"
          >
            <div class="flex items-start gap-6 mb-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <UIcon
                    name="i-heroicons-book-open"
                    class="w-8 h-8 text-white"
                  />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ $t('academics.curriculum.programs.elementary.title') }}
                </h3>
                <p class="text-lg text-blue-700 font-semibold mb-4">
                  {{ singleField('academics.curriculum.elementary', 'name') || $t('academics.curriculum.programs.elementary.name') }}
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <p class="text-lg text-gray-800 leading-relaxed">
                {{ singleField('academics.curriculum.elementary', 'description') || $t('academics.curriculum.programs.elementary.description') }}
              </p>
              <div class="bg-white rounded-lg p-6 mt-4">
                <h4 class="font-bold text-blue-900 mb-3 text-lg">
                  {{
                    $t(
                      'academics.curriculum.programs.elementary.englishProgram',
                    )
                  }}
                </h4>
                <ul class="grid md:grid-cols-2 gap-3">
                  <li
                    v-for="(subject, index) in elementarySubjects"
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-5 h-5 text-blue-600 shrink-0"
                    />
                    <span class="text-gray-700">{{ subject }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Secondary School -->
          <div
            class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-8 md:p-12 border-l-4 border-purple-500"
          >
            <div class="flex items-start gap-6 mb-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center"
                >
                  <UIcon name="i-heroicons-beaker" class="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ $t('academics.curriculum.programs.secondary.title') }}
                </h3>
                <p class="text-lg text-purple-700 font-semibold mb-4">
                  {{ singleField('academics.curriculum.secondary', 'name') || $t('academics.curriculum.programs.secondary.name') }}
                </p>
              </div>
            </div>
            <div class="space-y-6">
              <p class="text-lg text-gray-800 leading-relaxed">
                {{ singleField('academics.curriculum.secondary', 'description') || $t('academics.curriculum.programs.secondary.description') }}
              </p>

              <!-- Grades 7-9 -->
              <div class="bg-white rounded-lg p-6">
                <h4 class="font-bold text-purple-900 mb-3 text-lg">
                  {{
                    $t('academics.curriculum.programs.secondary.grades79.title')
                  }}
                </h4>
                <ul class="grid md:grid-cols-2 gap-3">
                  <li
                    v-for="(subject, index) in grades79Subjects"
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-5 h-5 text-purple-600 shrink-0"
                    />
                    <span class="text-gray-700">{{ subject }}</span>
                  </li>
                </ul>
              </div>

              <!-- Grades 10-11 -->
              <div class="bg-white rounded-lg p-6">
                <h4 class="font-bold text-purple-900 mb-3 text-lg">
                  {{
                    $t(
                      'academics.curriculum.programs.secondary.grades1011.title',
                    )
                  }}
                </h4>
                <ul class="grid md:grid-cols-2 gap-3">
                  <li
                    v-for="(subject, index) in grades1011Subjects"
                    :key="index"
                    class="flex items-center gap-2"
                  >
                    <UIcon
                      name="i-heroicons-check-circle"
                      class="w-5 h-5 text-purple-600 shrink-0"
                    />
                    <span class="text-gray-700">{{ subject }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.curriculum.benefits.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(benefit, index) in benefits"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getBenefitBgColor(index)"
            >
              <UIcon :name="benefit.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ benefit.title }}
            </h3>
            <p class="text-gray-700">
              {{ benefit.description }}
            </p>
          </div>
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
            {{ $t('academics.curriculum.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('academics.curriculum.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100"
            >
              {{ $t('academics.curriculum.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700"
            >
              {{ $t('academics.curriculum.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm, rt } = useI18n();
  const { loadContent, getItems, field, singleField } = usePublicContent();

  onMounted(() => loadContent([
    'academics.curriculum.intro',
    'academics.curriculum.kindergarten',
    'academics.curriculum.elementary',
    'academics.curriculum.secondary',
    'academics.curriculum.elementarySubjects',
    'academics.curriculum.secondarySubjects79',
    'academics.curriculum.secondarySubjects1011',
    'academics.curriculum.benefits',
  ]));

  const elementarySubjects = computed(() => {
    const dbItems = getItems('academics.curriculum.elementarySubjects');
    if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
    const items = tm('academics.curriculum.programs.elementary.subjects') as any[];
    return Array.isArray(items) ? items.map((s: any) => typeof s === 'string' ? s : rt(s)) : [];
  });

  const grades79Subjects = computed(() => {
    const dbItems = getItems('academics.curriculum.secondarySubjects79');
    if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
    const items = tm('academics.curriculum.programs.secondary.grades79.subjects') as any[];
    return Array.isArray(items) ? items.map((s: any) => typeof s === 'string' ? s : rt(s)) : [];
  });

  const grades1011Subjects = computed(() => {
    const dbItems = getItems('academics.curriculum.secondarySubjects1011');
    if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
    const items = tm('academics.curriculum.programs.secondary.grades1011.subjects') as any[];
    return Array.isArray(items) ? items.map((s: any) => typeof s === 'string' ? s : rt(s)) : [];
  });

  const benefitIcons = [
    'i-heroicons-language',
    'i-heroicons-globe-americas',
    'i-heroicons-academic-cap',
  ];

  const benefits = computed(() => {
    const dbItems = getItems('academics.curriculum.benefits');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || benefitIcons[index % benefitIcons.length],
      }));
    }
    const items = tm('academics.curriculum.benefits.items') as any[];
    return items.map((benefit: any, index: number) => ({
      title: typeof benefit.title === 'string' ? benefit.title : rt(benefit.title),
      description: typeof benefit.description === 'string' ? benefit.description : rt(benefit.description),
      icon: benefitIcons[index],
    }));
  });

  const getBenefitBgColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Curriculum - CEE',
    meta: [
      {
        name: 'description',
        content:
          "Discover CEE's bilingual curriculum with early partial immersion in Spanish and English, from kindergarten through grade 11.",
      },
    ],
  });
</script>
