<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('contact.directions.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('contact.directions.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div :class="singleMeta('contact.directions.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto text-center'">
          <div>
            <p class="text-2xl md:text-3xl font-semibold text-teal-800 leading-snug">
              {{ singleField('contact.directions.intro', 'text') || $t('contact.directions.intro') }}
            </p>
          </div>
          <div v-if="singleMeta('contact.directions.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('contact.directions.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('contact.directions.intro', 'focalX') || 50}% ${singleMeta('contact.directions.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <!-- Google Map Embed -->
          <div class="order-2 lg:order-1">
            <div class="bg-gray-200 rounded-2xl overflow-hidden shadow-lg h-72 md:h-80 lg:h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.1234567890123!2d-87.8333333!3d14.6166667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSiguatepeque%2C%20Honduras!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title="CEE Location Map"
              ></iframe>
            </div>
            <div class="mt-4 text-center">
              <a
                href="https://www.google.com/maps/search/Comunidad+Educativa+Evangelica+Siguatepeque+Honduras"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5" />
                {{ singleField('contact.directions.address', 'title') || $t('contact.directions.address.title') }} - Google Maps
              </a>
            </div>
          </div>

          <!-- Location Details -->
          <div class="order-1 lg:order-2 space-y-8">
            <!-- Address Card -->
            <div class="bg-red-50 rounded-xl p-6">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">
                    {{ singleField('contact.directions.address', 'title') || $t('contact.directions.address.title') }}
                  </h3>
                  <p class="text-gray-700 text-lg">
                    {{ singleField('contact.directions.address', 'text') || $t('contact.directions.address.full') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- From Tegucigalpa -->
            <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-arrow-right-circle" class="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">
                    {{ singleField('contact.directions.fromTegucigalpa', 'title') || $t('contact.directions.fromTegucigalpa.title') }}
                  </h3>
                  <p class="text-gray-700">
                    {{ singleField('contact.directions.fromTegucigalpa', 'description') || $t('contact.directions.fromTegucigalpa.description') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- From San Pedro Sula -->
            <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <UIcon name="i-heroicons-arrow-left-circle" class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900 mb-2">
                    {{ singleField('contact.directions.fromSanPedro', 'title') || $t('contact.directions.fromSanPedro.title') }}
                  </h3>
                  <p class="text-gray-700">
                    {{ singleField('contact.directions.fromSanPedro', 'description') || $t('contact.directions.fromSanPedro.description') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Landmarks & Parking Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Nearby Landmarks -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <UIcon name="i-heroicons-building-storefront" class="w-5 h-5 text-purple-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ $t('contact.directions.landmarks.title') }}
              </h3>
            </div>
            <ul class="space-y-3">
              <li
                v-for="(landmark, index) in landmarks"
                :key="index"
                class="flex items-start gap-3"
              >
                <UIcon
                  name="i-heroicons-check-circle"
                  class="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                />
                <span class="text-gray-700">{{ landmark }}</span>
              </li>
            </ul>
          </div>

          <!-- Parking Information -->
          <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <UIcon name="i-heroicons-truck" class="w-5 h-5 text-amber-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900">
                {{ singleField('contact.directions.parking', 'title') || $t('contact.directions.parking.title') }}
              </h3>
            </div>
            <p class="text-gray-700">
              {{ singleField('contact.directions.parking', 'description') || $t('contact.directions.parking.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl lg:text-5xl font-bold text-indigo-800 mb-4">
            {{ $t('contact.directions.cta.title') }}
          </h2>
          <p class="text-xl text-gray-700 mb-8">
            {{ $t('contact.directions.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              color="primary"
              class="bg-red-600 hover:bg-red-700 justify-center"
            >
              <UIcon name="i-heroicons-information-circle" class="w-5 h-5 mr-2" />
              {{ $t('contact.directions.cta.contactUs') }}
            </UButton>
            <UButton
              href="https://wa.me/50493268998"
              target="_blank"
              size="lg"
              variant="outline"
              class="border-2 border-red-600 text-red-600 hover:bg-red-50 justify-center"
            >
              <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
              {{ $t('contact.directions.cta.callUs') }}
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
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
          {{ $t('about.town.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('about.town.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/about/town')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('nav.dropdowns.about.town') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
          >
            {{ $t('nav.dropdowns.contact.form') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { tm, rt } = useI18n();
const { loadContent, getItems, field, singleField, singleMeta, loading: contentLoading } = usePublicContent();

onMounted(() => loadContent([
  'contact.directions.intro',
  'contact.directions.address',
  'contact.directions.fromTegucigalpa',
  'contact.directions.fromSanPedro',
  'contact.directions.parking',
  'contact.directions.landmarks',
]));

const landmarks = computed(() => {
  const dbItems = getItems('contact.directions.landmarks');
  if (dbItems.length > 0) return dbItems.map(item => field(item, 'text'));
  const items = tm('contact.directions.landmarks.items') as any[];
  return Array.isArray(items) ? items.map((l: any) => typeof l === 'string' ? l : rt(l)) : [];
});

useHead({
  title: 'Directions - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Find directions to CEE in Siguatepeque, Honduras. View our location on Google Maps and get driving directions from Tegucigalpa or San Pedro Sula.',
    },
  ],
});
</script>
