<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20"
    >
      <div class="px-6 sm:px-10 lg:px-16">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('academics.guidance.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-blue-100">
          {{ $t('academics.guidance.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Hero Image -->
    <div v-if="singleMeta('academics.guidance.intro', 'imageUrl')" class="w-full h-72 md:h-96 lg:h-112 overflow-hidden">
      <img
        :src="singleMeta('academics.guidance.intro', 'imageUrl')"
        alt=""
        class="w-full h-full object-cover"
        :style="{ objectPosition: `${singleMeta('academics.guidance.intro', 'focalX') || 50}% ${singleMeta('academics.guidance.intro', 'focalY') || 50}%` }"
      />
    </div>

    <!-- Introduction Section -->
    <section class="py-8 sm:py-16 bg-gray-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <h2 class="text-3xl lg:text-5xl font-bold text-blue-800 mb-4">
          {{
            singleField('academics.guidance.intro', 'title') ||
            $t('academics.guidance.intro.title')
          }}
        </h2>
        <p class="text-xl md:text-2xl text-gray-700 leading-relaxed lg:max-w-[50%]">
          {{
            singleField('academics.guidance.intro', 'description') ||
            $t('academics.guidance.intro.description')
          }}
        </p>
      </div>
    </section>

    <!-- Staff Directory Section -->
    <section class="py-16">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-5xl font-bold text-purple-800 mb-4">
            {{ $t('academics.guidance.staff.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('academics.guidance.staff.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8" v-if="staff.length > 0">
          <div
            v-for="(member, index) in staff"
            :key="index"
            class="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <div class="mb-4 flex justify-center">
              <div
                class="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center"
              >
                <img
                  v-if="member.photoUrl"
                  :src="member.photoUrl"
                  :alt="member.name"
                  class="w-full h-full object-cover"
                  :style="{ objectPosition: `${member.focalX}% ${member.focalY}%` }"
                />
                <UIcon
                  v-else
                  name="i-heroicons-user-circle"
                  class="w-24 h-24 text-purple-600"
                />
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">
              {{ member.name }}
            </h3>
            <p v-if="member.position" class="text-sm text-purple-600 font-medium mb-2">
              {{ member.position }}
            </p>
            <a
              v-if="member.email"
              :href="`mailto:${member.email}`"
              class="text-purple-700 hover:text-purple-900 text-sm"
            >
              {{ member.email }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-5xl font-bold text-teal-800 mb-4">
            {{ $t('academics.guidance.services.title') }}
          </h2>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="bg-white rounded-lg p-8 shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition-shadow w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <div class="flex justify-center mb-6">
              <div
                class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center"
              >
                <UIcon
                  :name="service.icon"
                  class="w-8 h-8 text-purple-600"
                />
              </div>
            </div>
            <h3 class="text-xl font-bold text-gray-900 text-center mb-3">
              {{ service.title }}
            </h3>
            <p class="text-gray-700 text-center leading-relaxed">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section class="py-16" v-if="images.length > 0">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-5xl font-bold text-rose-800 mb-4">
            {{ $t('academics.guidance.gallery.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('academics.guidance.gallery.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-6">
          <div
            v-for="(image, index) in images"
            :key="index"
            class="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full md:w-[calc(33.333%-1rem)]"
          >
            <img
              :src="image.url"
              :alt="image.alt"
              class="w-full h-80 md:h-96 object-cover"
              :style="{ objectPosition: `${image.focalX}% ${image.focalY}%` }"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="px-6 sm:px-10 lg:px-16">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4">
            {{ $t('academics.guidance.cta.title') }}
          </h2>
          <p class="text-xl text-blue-100 mb-8">
            {{ $t('academics.guidance.cta.description') }}
          </p>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="solid"
            class="bg-white text-purple-600 hover:bg-gray-100 justify-center"
            icon="i-heroicons-envelope"
          >
            {{ $t('academics.guidance.cta.contactButton') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default',
  });

  const localePath = useLocalePath();
  const { tm, rt } = useI18n();
  const { loadContent, getItems, singleField, singleMeta, field, loading: contentLoading } = usePublicContent();

  // Load all content sections
  onMounted(() =>
    loadContent([
      'academics.guidance.intro',
      'academics.guidance.services',
      'academics.guidance.staff',
      'academics.guidance.images',
    ]),
  );

  // Service icons for visual variety
  const serviceIcons = [
    'i-heroicons-academic-cap',
    'i-heroicons-chat-bubble-left-right',
    'i-heroicons-heart',
    'i-heroicons-user-group',
    'i-heroicons-book-open',
    'i-heroicons-light-bulb',
  ];

  // Services computed property
  const services = computed(() => {
    const dbItems = getItems('academics.guidance.services');
    if (dbItems.length > 0)
      return dbItems.map((item, index) => ({
        title: field(item, 'title'),
        description: field(item, 'description'),
        icon: field(item, 'icon') || serviceIcons[index % serviceIcons.length],
      }));

    // Fallback to i18n
    const items = tm('academics.guidance.services.items') as any[];
    if (!Array.isArray(items)) return [];
    return items.map((item: any, index: number) => ({
      title: typeof item.title === 'string' ? item.title : rt(item.title),
      description: typeof item.description === 'string' ? item.description : rt(item.description),
      icon: serviceIcons[index % serviceIcons.length],
    }));
  });

  // Staff directory computed property
  const staff = computed(() => {
    const dbItems = getItems('academics.guidance.staff');
    if (dbItems.length > 0)
      return dbItems.map((item) => ({
        name: field(item, 'name'),
        position: field(item, 'position'),
        email: field(item, 'email'),
        photoUrl: item.metadata?.imageUrl || '',
        focalX: item.metadata?.focalX ?? 50,
        focalY: item.metadata?.focalY ?? 50,
      }));
    return [];
  });

  // Gallery images computed property
  const images = computed(() => {
    const dbItems = getItems('academics.guidance.images');
    return dbItems.map((item) => ({
      url: item.metadata?.imageUrl || '',
      alt: field(item, 'alt'),
      focalX: item.metadata?.focalX ?? 50,
      focalY: item.metadata?.focalY ?? 50,
    }));
  });

</script>
