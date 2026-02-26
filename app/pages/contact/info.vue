<template>
  <div v-if="contentLoading" class="min-h-screen flex items-center justify-center"><div class="animate-spin w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full" /></div>
  <div v-else class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('contact.info.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('contact.info.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div :class="singleMeta('contact.info.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto text-center'">
          <div>
            <UIcon
              v-if="!singleMeta('contact.info.intro', 'imageUrl')"
              name="i-heroicons-chat-bubble-left-right"
              class="w-16 h-16 text-red-600 mx-auto mb-6"
            />
            <p class="text-2xl md:text-3xl font-semibold text-teal-800 leading-snug">
              {{ singleField('contact.info.intro', 'text') || $t('contact.info.intro') }}
            </p>
          </div>
          <div v-if="singleMeta('contact.info.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('contact.info.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('contact.info.intro', 'focalX') || 50}% ${singleMeta('contact.info.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information Cards -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Phone/WhatsApp Card -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon name="i-heroicons-phone" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ singleField('contact.info.phone', 'title') || $t('contact.info.phone.title') }}
            </h3>
            <a
              :href="`https://wa.me/${(singleMeta('contact.info.phone', 'number') || $t('contact.info.phone.number')).replace(/[^0-9]/g, '')}`"
              target="_blank"
              rel="noopener noreferrer"
              class="text-lg text-green-600 font-semibold hover:text-green-700 transition-colors"
            >
              {{ singleMeta('contact.info.phone', 'number') || $t('contact.info.phone.number') }}
            </a>
            <p class="text-gray-600 mt-2 text-sm">
              {{ singleField('contact.info.phone', 'description') || $t('contact.info.phone.description') }}
            </p>
          </div>

          <!-- Email Card -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon name="i-heroicons-envelope" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ singleField('contact.info.email', 'title') || $t('contact.info.email.title') }}
            </h3>
            <a
              :href="`mailto:${singleMeta('contact.info.email', 'address') || $t('contact.info.email.address')}`"
              class="text-sm text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              {{ singleMeta('contact.info.email', 'address') || $t('contact.info.email.address') }}
            </a>
            <p class="text-gray-600 mt-2 text-sm">
              {{ singleField('contact.info.email', 'description') || $t('contact.info.email.description') }}
            </p>
          </div>

          <!-- Office Hours Card -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon name="i-heroicons-clock" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ singleField('contact.info.hours', 'title') || $t('contact.info.hours.title') }}
            </h3>
            <p class="text-lg text-gray-800 font-semibold">
              {{ singleMeta('contact.info.hours', 'schedule') || $t('contact.info.hours.schedule') }}
            </p>
            <p class="text-lg text-blue-600 font-semibold">
              {{ singleMeta('contact.info.hours', 'time') || $t('contact.info.hours.time') }}
            </p>
            <p class="text-gray-600 mt-2 text-sm">
              {{ singleField('contact.info.hours', 'description') || $t('contact.info.hours.description') }}
            </p>
          </div>

          <!-- Address Card -->
          <div
            class="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mx-auto mb-4"
            >
              <UIcon name="i-heroicons-map-pin" class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ singleField('contact.info.address', 'title') || $t('contact.info.address.title') }}
            </h3>
            <p class="text-gray-800">{{ singleMeta('contact.info.address', 'line1') || $t('contact.info.address.line1') }}</p>
            <p class="text-gray-800">{{ singleMeta('contact.info.address', 'line2') || $t('contact.info.address.line2') }}</p>
            <p class="text-gray-800">{{ singleMeta('contact.info.address', 'line3') || $t('contact.info.address.line3') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('contact.info.cta.title') }}
          </h2>
          <p class="text-xl text-gray-700 mb-8">
            {{ $t('contact.info.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/contact/form')"
              size="lg"
              color="primary"
              class="bg-red-600 hover:bg-red-700 justify-center"
            >
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 mr-2" />
              {{ $t('contact.info.cta.contactForm') }}
            </UButton>
            <UButton
              :to="localePath('/contact/directions')"
              size="lg"
              variant="outline"
              class="border-2 border-red-600 text-red-600 hover:bg-red-50 justify-center"
            >
              <UIcon name="i-heroicons-map" class="w-5 h-5 mr-2" />
              {{ $t('contact.info.cta.directions') }}
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
          {{ $t('contact.faq.stillHaveQuestions.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('contact.faq.stillHaveQuestions.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/contact/faq')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('nav.dropdowns.contact.faq') }}
          </UButton>
          <UButton
            href="https://wa.me/50493268998"
            target="_blank"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
          >
            <UIcon name="i-heroicons-phone" class="w-5 h-5 mr-2" />
            {{ $t('contact.faq.stillHaveQuestions.callUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
  const { loadContent, singleField, singleMeta, loading: contentLoading } = usePublicContent();

  onMounted(() => loadContent([
    'contact.info.intro',
    'contact.info.phone',
    'contact.info.email',
    'contact.info.hours',
    'contact.info.address',
  ]));

  useHead({
    title: 'Contact Information - CEE',
    meta: [
      {
        name: 'description',
        content:
          'Contact CEE - Phone, email, office hours, and address information for Comunidad Educativa Evangélica in Siguatepeque, Honduras.',
      },
    ],
  });
</script>
