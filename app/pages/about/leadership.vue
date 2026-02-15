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
              v-if="boardPhotoUrl"
              :src="boardPhotoUrl"
              :alt="boardPhotoAlt"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
            <img
              v-else
              src="/images/boardOfDirectors.jpg"
              :alt="$t('about.leadership.board.title')"
              class="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
          <!-- Board Member Names -->
          <div v-if="boardMemberNames.length > 0" class="mt-6 text-center">
            <p class="text-gray-600 text-sm mb-2">{{ $t('about.leadership.board.membersLabel') }}</p>
            <p class="text-gray-800 text-sm lg:text-base">
              <template v-for="(member, index) in boardMemberNames" :key="index">
                <span class="font-medium">{{ member }}</span>
                <span v-if="index < boardMemberNames.length - 1" class="text-gray-400 mx-2">&bull;</span>
              </template>
            </p>
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
          <div
            v-for="(director, index) in directorsList"
            :key="index"
            class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
          >
            <div class="flex flex-col items-center text-center">
              <img
                v-if="director.photoUrl"
                :src="director.photoUrl"
                :alt="director.name"
                class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full object-cover mb-4"
                loading="lazy"
              />
              <div
                v-else
                class="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gray-200 flex items-center justify-center mb-4"
              >
                <UIcon name="i-heroicons-user" class="w-16 h-16 text-gray-400" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                {{ director.name }}
              </h3>
              <p class="text-purple-600 font-semibold mb-1">
                {{ director.title }}
              </p>
              <a
                v-if="director.email"
                :href="`mailto:${director.email}`"
                class="text-blue-600 hover:text-blue-800 flex items-center gap-2 mt-2"
              >
                <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                {{ director.email }}
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
  const { locale } = useI18n();
  const { loadContent, getItems, field, meta: getMeta } = usePublicContent();

  onMounted(() => loadContent([
    'about.leadership.boardPhoto',
    'about.leadership.board',
    'about.leadership.directors',
  ]));

  // Board photo: DB-first, fallback to static image handled in template
  const boardPhotoUrl = computed(() => {
    const dbItems = getItems('about.leadership.boardPhoto');
    if (dbItems.length > 0) {
      return field(dbItems[0], 'url') || '';
    }
    return '';
  });

  const boardPhotoAlt = computed(() => {
    const dbItems = getItems('about.leadership.boardPhoto');
    if (dbItems.length > 0) {
      return field(dbItems[0], 'alt') || '';
    }
    return '';
  });

  // Board member names from DB
  const boardMemberNames = computed(() => {
    const dbItems = getItems('about.leadership.board');
    if (dbItems.length > 0) {
      return dbItems.map(item => field(item, 'name')).filter(Boolean);
    }
    // Fallback: hardcoded names
    return [
      'Sergio Portillo',
      'Héctor Estrada',
      'Edith Aguilar',
      'Iris Martínez',
      'Enrique Martínez',
      'Peter Simpson',
    ];
  });

  // Directors from DB
  const directorsList = computed(() => {
    const dbItems = getItems('about.leadership.directors');
    if (dbItems.length > 0) {
      return dbItems.map(item => ({
        name: field(item, 'name'),
        title: field(item, 'title'),
        email: getMeta(item, 'email') || '',
        photoUrl: getMeta(item, 'photoUrl') || '',
      }));
    }
    // Fallback: hardcoded directors
    return [
      {
        name: 'Yasmín Guevara',
        title: locale.value === 'en' ? 'Preschool & Elementary Director' : 'Directora de Preescolar y Primaria',
        email: 'yasmin@ceehonduras.org',
        photoUrl: '/images/Osiris.jpg',
      },
      {
        name: 'Osiris Murillo',
        title: locale.value === 'en' ? 'High School Director' : 'Director de Secundaria',
        email: 'osiris@ceehonduras.org',
        photoUrl: '/images/Yasmin.jpg',
      },
    ];
  });

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
