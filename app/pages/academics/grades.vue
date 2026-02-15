<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.grades.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.grades.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-academic-cap"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ singleField('academics.grades.intro', 'text') || $t('academics.grades.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Grade Levels Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="space-y-8">
          <div
            v-for="(level, index) in gradeLevels"
            :key="index"
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="p-6 md:p-8"
              :class="getGradeLevelBg(index)"
            >
              <div class="flex items-start gap-6">
                <div class="shrink-0">
                  <div
                    class="w-16 h-16 rounded-full flex items-center justify-center"
                    :class="getGradeLevelIconBg(index)"
                  >
                    <UIcon :name="level.icon" class="w-8 h-8 text-white" />
                  </div>
                </div>
                <div class="flex-1">
                  <h2 class="text-3xl font-bold mb-2" :class="getGradeLevelTextColor(index)">
                    {{ level._fromDb ? level.title : rt(level.title) }}
                  </h2>
                  <p class="text-lg font-semibold mb-4" :class="getGradeLevelSubtextColor(index)">
                    {{ level._fromDb ? level.grades : rt(level.grades) }}
                  </p>
                  <p class="text-lg text-gray-800 leading-relaxed mb-4">
                    {{ level._fromDb ? level.description : rt(level.description) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Grade Details -->
            <div class="p-6 md:p-8 bg-white border-t border-gray-200">
              <h3 class="text-xl font-bold text-gray-900 mb-4">
                {{ $t('academics.grades.keyFocus') }}
              </h3>
              <div class="grid md:grid-cols-2 gap-4">
                <div
                  v-for="(focus, fIndex) in level.focus"
                  :key="fIndex"
                  class="flex items-start gap-3"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-6 h-6 shrink-0 mt-1"
                    :class="getGradeLevelIconColor(index)"
                  />
                  <span class="text-gray-700">{{ typeof focus === 'string' ? focus : rt(focus) }}</span>
                </div>
              </div>

              <!-- Age Range if available -->
              <div v-if="level.ageRange" class="mt-6 p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-user-circle"
                    class="w-6 h-6"
                    :class="getGradeLevelIconColor(index)"
                  />
                  <div>
                    <span class="font-semibold text-gray-900">{{ $t('academics.grades.typicalAge') }}: </span>
                    <span class="text-gray-700">{{ level._fromDb ? level.ageRange : rt(level.ageRange) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Special Programs Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.programs.special.title') }}
        </h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(program, index) in specialPrograms"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getSpecialProgramBgColor(index)"
            >
              <UIcon :name="program.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ program.title }}
            </h3>
            <p class="text-gray-700">
              {{ program.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Educational Approach Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.grades.approach.title') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(approach, index) in approaches"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div
              class="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              :class="getApproachBgColor(index)"
            >
              <UIcon :name="approach.icon" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">
              {{ approach.title }}
            </h3>
            <p class="text-gray-700">
              {{ approach.description }}
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
            {{ $t('academics.grades.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('academics.grades.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100"
            >
              {{ $t('academics.grades.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700"
            >
              {{ $t('academics.grades.cta.contactUs') }}
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
    'academics.grades.intro',
    'academics.grades.levels',
    'academics.grades.specialPrograms',
    'academics.grades.approach',
  ]));

  const gradeLevelIcons = [
    'i-heroicons-star',
    'i-heroicons-book-open',
    'i-heroicons-rocket-launch',
    'i-heroicons-academic-cap',
  ];

  const gradeLevels = computed(() => {
    const dbItems = getItems('academics.grades.levels');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        grades: field(item, 'grades') || (item.metadata?.grades || ''),
        description: field(item, 'description'),
        focus: [],
        ageRange: '',
        icon: gradeLevelIcons[index % gradeLevelIcons.length],
        _fromDb: true,
      }));
    }
    const items = tm('academics.grades.levels') as any[];
    return items.map((level: any, index: number) => ({
      ...level,
      icon: gradeLevelIcons[index % gradeLevelIcons.length],
      _fromDb: false,
    }));
  });

  const specialProgramIcons = [
    'i-heroicons-language',
    'i-heroicons-computer-desktop',
    'i-heroicons-heart',
    'i-heroicons-paint-brush',
    'i-heroicons-musical-note',
    'i-heroicons-trophy',
  ];

  const specialPrograms = computed(() => {
    const dbItems = getItems('academics.grades.specialPrograms');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: specialProgramIcons[index % specialProgramIcons.length],
      }));
    }
    const items = tm('academics.programs.special.items') as any[];
    return items.map((program: any, index: number) => ({
      title: typeof program.title === 'string' ? program.title : rt(program.title),
      description: typeof program.description === 'string' ? program.description : rt(program.description),
      icon: specialProgramIcons[index % specialProgramIcons.length],
    }));
  });

  const approachIcons = [
    'i-heroicons-language',
    'i-heroicons-heart',
    'i-heroicons-user-group',
  ];

  const approaches = computed(() => {
    const dbItems = getItems('academics.grades.approach');
    if (dbItems.length > 0) {
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: approachIcons[index % approachIcons.length],
      }));
    }
    const items = tm('academics.grades.approach.items') as any[];
    return items.map((approach: any, index: number) => ({
      title: typeof approach.title === 'string' ? approach.title : rt(approach.title),
      description: typeof approach.description === 'string' ? approach.description : rt(approach.description),
      icon: approachIcons[index % approachIcons.length],
    }));
  });

  const getGradeLevelBg = (index: number) => {
    const colors = [
      'bg-pink-50',
      'bg-blue-50',
      'bg-purple-50',
      'bg-indigo-50',
    ];
    return colors[index % colors.length];
  };

  const getGradeLevelIconBg = (index: number) => {
    const colors = [
      'bg-pink-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-indigo-500',
    ];
    return colors[index % colors.length];
  };

  const getGradeLevelTextColor = (index: number) => {
    const colors = [
      'text-pink-900',
      'text-blue-900',
      'text-purple-900',
      'text-indigo-900',
    ];
    return colors[index % colors.length];
  };

  const getGradeLevelSubtextColor = (index: number) => {
    const colors = [
      'text-pink-700',
      'text-blue-700',
      'text-purple-700',
      'text-indigo-700',
    ];
    return colors[index % colors.length];
  };

  const getGradeLevelIconColor = (index: number) => {
    const colors = [
      'text-pink-600',
      'text-blue-600',
      'text-purple-600',
      'text-indigo-600',
    ];
    return colors[index % colors.length];
  };

  const getSpecialProgramBgColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-fuchsia-500',
      'bg-pink-500',
    ];
    return colors[index % colors.length];
  };

  const getApproachBgColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500'];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Grades & Levels - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Explore the grade levels offered at CEE, from kindergarten through 11th grade, with bilingual education and Christian values.',
      },
    ],
  });
</script>
