<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.programs.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.programs.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-squares-2x2"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('academics.programs.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Academic Programs Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.programs.academic.title') }}
        </h2>

        <div class="grid md:grid-cols-2 gap-8">
          <div
            v-for="(program, index) in academicPrograms"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 border-t-4"
            :class="getProgramBorderColor(index)"
          >
            <div class="flex items-start gap-6 mb-6">
              <div class="shrink-0">
                <div
                  class="w-16 h-16 rounded-full flex items-center justify-center"
                  :class="getProgramBgColor(index)"
                >
                  <UIcon :name="program.icon" class="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ $rt(program.title) }}
                </h3>
                <p class="text-gray-600 font-semibold">
                  {{ $rt(program.grades) }}
                </p>
              </div>
            </div>
            <p class="text-lg text-gray-700 leading-relaxed mb-4">
              {{ $rt(program.description) }}
            </p>
            <div v-if="program.highlights" class="mt-4">
              <h4 class="font-bold text-gray-900 mb-3">
                {{ $t('academics.programs.academic.highlights') }}
              </h4>
              <ul class="space-y-2">
                <li
                  v-for="(highlight, hIndex) in program.highlights"
                  :key="hIndex"
                  class="flex items-start gap-2"
                >
                  <UIcon
                    name="i-heroicons-check-circle"
                    class="w-5 h-5 shrink-0 mt-1"
                    :class="getProgramIconColor(index)"
                  />
                  <span class="text-gray-700">{{ $rt(highlight) }}</span>
                </li>
              </ul>
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
              {{ $rt(program.title) }}
            </h3>
            <p class="text-gray-700">
              {{ $rt(program.description) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Extracurricular Programs Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">
          {{ $t('academics.programs.extracurricular.title') }}
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(program, index) in extracurricularPrograms"
            :key="index"
            class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div
              class="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center"
              :class="getExtraBgColor(index)"
            >
              <UIcon :name="program.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">
              {{ $rt(program.title) }}
            </h3>
            <p class="text-sm text-gray-600">
              {{ $rt(program.description) }}
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
            {{ $t('academics.programs.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('academics.programs.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-blue-700 hover:bg-gray-100"
            >
              {{ $t('academics.programs.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-blue-700"
            >
              {{ $t('academics.programs.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { tm, rt: $rt } = useI18n();

  const academicProgramIcons = [
    'i-heroicons-star',
    'i-heroicons-book-open',
    'i-heroicons-academic-cap',
    'i-heroicons-beaker',
  ];

  const academicPrograms = computed(() => {
    const items = tm('academics.programs.academic.items') as any[];
    return items.map((program: any, index: number) => ({
      ...program,
      icon: academicProgramIcons[index % academicProgramIcons.length],
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
    const items = tm('academics.programs.special.items') as any[];
    return items.map((program: any, index: number) => ({
      title: program.title,
      description: program.description,
      icon: specialProgramIcons[index % specialProgramIcons.length],
    }));
  });

  const extracurricularProgramIcons = [
    'i-heroicons-trophy',
    'i-heroicons-musical-note',
    'i-heroicons-camera',
    'i-heroicons-beaker',
    'i-heroicons-pencil',
    'i-heroicons-globe-americas',
    'i-heroicons-puzzle-piece',
    'i-heroicons-megaphone',
  ];

  const extracurricularPrograms = computed(() => {
    const items = tm('academics.programs.extracurricular.items') as any[];
    return items.map((program: any, index: number) => ({
      title: program.title,
      description: program.description,
      icon: extracurricularProgramIcons[index % extracurricularProgramIcons.length],
    }));
  });

  const getProgramBorderColor = (index: number) => {
    const colors = [
      'border-pink-500',
      'border-blue-500',
      'border-purple-500',
      'border-indigo-500',
    ];
    return colors[index % colors.length];
  };

  const getProgramBgColor = (index: number) => {
    const colors = [
      'bg-pink-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-indigo-500',
    ];
    return colors[index % colors.length];
  };

  const getProgramIconColor = (index: number) => {
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

  const getExtraBgColor = (index: number) => {
    const colors = [
      'bg-orange-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
    ];
    return colors[index % colors.length];
  };

  // Set page metadata
  useHead({
    title: 'Programs - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Explore the diverse academic, special, and extracurricular programs offered at CEE to develop well-rounded students.',
      },
    ],
  });
</script>
