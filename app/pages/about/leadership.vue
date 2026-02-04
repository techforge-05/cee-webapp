<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('about.leadership.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('about.leadership.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-user-group"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <p class="text-xl text-gray-700 leading-relaxed">
            {{ $t('about.leadership.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Board of Directors Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <UIcon
            name="i-heroicons-briefcase"
            class="w-16 h-16 text-blue-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('about.leadership.board.title') }}
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            {{ $t('about.leadership.board.description') }}
          </p>
        </div>

        <!-- Board Group Photo -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="/images/boardOfDirectors.jpg"
              :alt="$t('about.leadership.board.title')"
              class="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- School Directors Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <UIcon
            name="i-heroicons-academic-cap"
            class="w-16 h-16 text-purple-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('about.leadership.directors.title') }}
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            {{ $t('about.leadership.directors.description') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Yasmín Guevara -->
          <div
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex flex-col items-center text-center">
              <img
                src="/images/Yasmin.jpg"
                alt="Yasmín Guevara"
                class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover mb-4"
              />
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                Yasmín Guevara
              </h3>
              <p class="text-purple-600 font-semibold mb-1">
                {{ $t('about.leadership.directors.preschoolElementary') }}
              </p>
              <p class="text-gray-500 text-sm mb-3">(Kindergarten - Grade 6)</p>
              <a
                href="mailto:yasmin@ceehonduras.org"
                class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                yasmin@ceehonduras.org
              </a>
            </div>
          </div>

          <!-- Osiris Murillo -->
          <div
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex flex-col items-center text-center">
              <img
                src="/images/Osiris.jpg"
                alt="Osiris Murillo"
                class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover mb-4"
              />
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                Osiris Murillo
              </h3>
              <p class="text-purple-600 font-semibold mb-1">
                {{ $t('about.leadership.directors.highSchool') }}
              </p>
              <p class="text-gray-500 text-sm mb-3">(Grades 7 - 11)</p>
              <a
                href="mailto:osiris@ceehonduras.org"
                class="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                osiris@ceehonduras.org
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-blue-50 rounded-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div class="text-center">
            <UIcon
              name="i-heroicons-envelope"
              class="w-12 h-12 text-blue-600 mx-auto mb-6"
            />
            <h2 class="text-3xl font-bold text-blue-900 mb-4">
              {{ $t('about.leadership.contact.title') }}
            </h2>
            <p class="text-xl text-gray-800 mb-6">
              {{ $t('about.leadership.contact.description') }}
            </p>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="solid"
              class="bg-blue-600 text-white hover:bg-blue-700"
            >
              {{ $t('about.leadership.contact.button') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('about.leadership.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('about.leadership.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions')"
              size="lg"
              variant="solid"
              class="bg-white text-green-700 hover:bg-gray-100"
            >
              {{ $t('about.leadership.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/about/mission-vision-values')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-green-700"
            >
              {{ $t('about.leadership.cta.ourMission') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();

  // Set page metadata
  useHead({
    title: 'Leadership & Board - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Meet the dedicated leadership and board of directors guiding CEE in providing quality Christian education in Siguatepeque, Honduras.',
      },
    ],
  });
</script>
