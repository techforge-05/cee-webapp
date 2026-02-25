<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('support.donate.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('support.donate.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div :class="singleMeta('support.donate.intro', 'imageUrl') ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center' : 'max-w-4xl mx-auto text-center'">
          <div>
            <UIcon
              name="i-heroicons-gift"
              class="w-16 h-16 text-red-600 mb-6"
              :class="{ 'mx-auto': !singleMeta('support.donate.intro', 'imageUrl') }"
            />
            <p class="text-xl text-gray-700 leading-relaxed">
              {{ singleField('support.donate.intro', 'text') || $t('support.donate.intro') }}
            </p>
          </div>
          <div v-if="singleMeta('support.donate.intro', 'imageUrl')" class="rounded-lg overflow-hidden">
            <img :src="singleMeta('support.donate.intro', 'imageUrl')" class="w-full h-80 object-cover rounded-lg" :style="{ objectPosition: `${singleMeta('support.donate.intro', 'focalX') || 50}% ${singleMeta('support.donate.intro', 'focalY') || 50}%` }" alt="" />
          </div>
        </div>
      </div>
    </section>

    <!-- Ways to Donate Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          {{ $t('support.donate.ways.title') }}
        </h2>

        <div class="flex flex-wrap justify-center gap-8">
          <div
            v-for="(item, index) in waysWithIcons"
            :key="index"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-100 w-full md:w-[calc(50%-1rem)]"
          >
            <div class="flex items-start gap-4">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0"
              >
                <UIcon :name="item.icon" class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">
                  {{ item.title }}
                </h3>
                <p class="text-gray-700">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Donation Methods Section -->
    <section id="donate-online" class="py-16 bg-teal-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="text-center mb-10">
          <UIcon
            name="i-heroicons-heart"
            class="w-16 h-16 text-teal-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('support.donate.payment.sectionTitle') }}
          </h2>
          <p class="text-xl text-gray-700">
            {{ $t('support.donate.payment.sectionDescription') }}
          </p>
        </div>

        <!-- Purpose Dropdown -->
        <div class="max-w-xl mx-auto mb-8">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            {{ $t('support.donate.payment.purpose.label') }}
          </label>

          <!-- Custom text mode -->
          <div v-if="selectedPurpose === 'custom'" class="flex gap-2">
            <UInput
              v-model="customPurposeText"
              :placeholder="$t('support.donate.payment.purpose.customPlaceholder')"
              size="lg"
              class="flex-1"
            />
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              size="lg"
              @click="clearCustomPurpose"
            />
          </div>

          <!-- Dropdown mode -->
          <USelect
            v-else
            v-model="selectedPurpose"
            :items="purposeOptions"
            size="lg"
            class="w-full"
          />

          <!-- Purpose description -->
          <p
            v-if="purposeDescription"
            class="mt-3 text-sm text-teal-700 bg-teal-100 rounded-lg px-4 py-3"
          >
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1 -mt-0.5" />
            {{ purposeDescription }}
          </p>
        </div>

        <!-- Payment Method Cards -->
        <div class="grid gap-6 max-w-2xl mx-auto" :class="cardPaymentEnabled ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md'">
          <!-- Credit/Debit Card -->
          <button
            v-if="cardPaymentEnabled"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-left cursor-pointer"
            @click="showDonationModal = true"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-4 overflow-hidden"
              >
                <img src="/images/bancoOccidente.png" alt="Banco de Occidente" class="w-11 h-11 object-contain" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('support.donate.payment.methodCard.title') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('support.donate.payment.methodCard.description') }}
              </p>
            </div>
          </button>

          <!-- PayPal -->
          <button
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-left cursor-pointer"
            @click="showPayPalModal = true"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-br from-[#003087] to-[#009cde] flex items-center justify-center mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 20 20" class="w-8 h-8">
                  <path fill="#ffffff" d="M7.914 10.677h1.659c3.604 0 5.649-1.623 6.3-4.96q.032-.164.056-.322c.036-.226.054-.429.062-.624c.006-.134.01-.213.009-.287a2.6 2.6 0 0 0-.216-1.039c-.129-.296-.324-.587-.613-.918C14.318 1.557 12.832 1 11.057 1H5.404a.81.81 0 0 0-.799.683l-1.02 6.571l-1.269 8.185a.486.486 0 0 0 .48.561h2.772l.849-5.043a1.51 1.51 0 0 1 1.497-1.28m9.103-4.587c-.792 3.771-3.357 5.772-7.445 5.772H7.914a.33.33 0 0 0-.328.282L6.481 19h2.907a.71.71 0 0 0 .699-.597l.029-.15l.555-3.514l.036-.194a.71.71 0 0 1 .699-.597h.44c2.85 0 5.081-1.158 5.733-4.506c.268-1.38.132-2.534-.562-3.352"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ $t('support.donate.payment.methodPaypal.title') }}
              </h3>
              <p class="text-gray-600">
                {{ $t('support.donate.payment.methodPaypal.description') }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Donation Modal (Card) -->
    <DonationModal
      v-model="showDonationModal"
      :purpose="purposeLabel"
      :purpose-value="purposeValueForApi"
    />

    <!-- PayPal Donation Modal -->
    <PayPalDonationModal
      v-model="showPayPalModal"
      :purpose="purposeLabel"
      :purpose-value="purposeValueForApi"
    />

    <!-- Amazon Wish Lists Section -->
    <section class="py-16 bg-orange-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="text-center mb-12">
          <UIcon
            name="i-heroicons-shopping-cart"
            class="w-16 h-16 text-orange-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ $t('support.donate.wishLists.title') }}
          </h2>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            {{ $t('support.donate.wishLists.description') }}
          </p>
        </div>

        <div class="flex flex-wrap justify-center gap-8">
          <a
            v-for="(wishList, index) in wishLists"
            :key="index"
            :href="wishList.url"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block w-full md:w-[calc(33.333%-1.334rem)]"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4"
              >
                <UIcon :name="wishList.icon" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {{ wishList.title }}
              </h3>
              <p class="text-gray-600 mb-4">
                {{ wishList.description }}
              </p>
              <span
                class="inline-flex items-center gap-2 text-orange-600 font-semibold"
              >
                <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5" />
                Amazon
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Donate Books Section -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="bg-red-50 rounded-2xl p-8 md:p-12">
          <div class="flex flex-col md:flex-row items-start gap-6">
            <div
              class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-heroicons-book-open" class="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 class="text-2xl font-bold text-red-900 mb-4">
                {{ singleField('support.donate.donateBooks', 'title') || $t('support.donate.donateBooks.title') }}
              </h2>
              <p class="text-lg text-gray-800 leading-relaxed">
                {{ singleField('support.donate.donateBooks', 'description') || $t('support.donate.donateBooks.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information Section -->
    <section class="py-16 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-2xl mx-auto text-center">
          <UIcon
            name="i-heroicons-envelope"
            class="w-16 h-16 text-red-600 mx-auto mb-6"
          />
          <h2 class="text-3xl font-bold text-gray-900 mb-4">
            {{ singleField('support.donate.contact', 'title') || $t('support.donate.contact.title') }}
          </h2>
          <p class="text-lg text-gray-700 mb-8">
            {{ singleField('support.donate.contact', 'description') || $t('support.donate.contact.description') }}
          </p>
          <div class="space-y-4">
            <div
              v-for="(email, index) in contactEmails"
              :key="index"
              class="flex items-center justify-center gap-3"
            >
              <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-red-600" />
              <a
                :href="`mailto:${email}`"
                class="text-lg text-gray-800 hover:text-red-600 transition-colors"
              >
                {{ email }}
              </a>
            </div>
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
          {{ $t('support.donate.cta.title') }}
        </h2>
        <p class="text-xl mb-8 max-w-3xl mx-auto">
          {{ $t('support.donate.cta.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/support/projects')"
            size="lg"
            variant="solid"
            class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
          >
            {{ $t('support.donate.cta.viewProjects') }}
          </UButton>
          <UButton
            :to="localePath('/contact/info')"
            size="lg"
            variant="outline"
            class="border-2 border-white text-white hover:bg-white hover:text-teal-600 justify-center"
          >
            {{ $t('support.donate.cta.contactUs') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const localePath = useLocalePath();
const { t, tm, rt } = useI18n();
const { loadContent, getItems, field, meta: getMeta, singleField, singleMeta } = usePublicContent();

// Payment settings
const cardPaymentEnabled = computed(() => singleMeta('support.donate.settings', 'cardPaymentEnabled') !== 'false');

// Purpose state
const selectedPurpose = ref('general');
const customPurposeText = ref('');
const showDonationModal = ref(false);
const showPayPalModal = ref(false);

onMounted(async () => {
  await loadContent([
    'support.donate.settings',
    'support.donate.intro',
    'support.donate.ways',
    'support.donate.wishLists',
    'support.donate.donateBooks',
    'support.donate.contact',
    'support.donate.emails',
    'support.projects.items',
  ]);

  // Prepopulate purpose from query param (e.g., ?purpose=water-cistern)
  const purposeQuery = route.query.purpose as string | undefined;
  if (purposeQuery) {
    const projectSlugs = projectItems.value.map(p => p.slug);
    if (projectSlugs.includes(purposeQuery)) {
      selectedPurpose.value = purposeQuery;
    }
  }
});

// Load projects for purpose dropdown
const projectItems = computed(() => {
  const items = getItems('support.projects.items');
  return items
    .filter(item => getMeta(item, 'status') !== 'completed')
    .map(item => ({
      title: field(item, 'title'),
      slug: getMeta(item, 'slug'),
    }))
    .filter(p => p.slug && p.title);
});

// Build purpose options for USelect
const purposeOptions = computed(() => {
  const options = [
    { label: t('support.donate.payment.purpose.custom'), value: 'custom' },
    { label: t('support.donate.payment.purpose.general'), value: 'general' },
    { label: t('support.donate.payment.purpose.scholarships'), value: 'scholarships' },
  ];

  for (const project of projectItems.value) {
    options.push({ label: project.title, value: project.slug });
  }

  return options;
});

// Purpose description text
const purposeDescription = computed(() => {
  const val = selectedPurpose.value;
  if (val === 'custom') {
    return customPurposeText.value
      ? t('support.donate.payment.purpose.descriptionCustom')
      : '';
  }
  if (val === 'general') {
    return t('support.donate.payment.purpose.descriptionGeneral');
  }
  if (val === 'scholarships') {
    return t('support.donate.payment.purpose.descriptionScholarships');
  }
  // It's a project slug
  const project = projectItems.value.find(p => p.slug === val);
  if (project) {
    return t('support.donate.payment.purpose.descriptionProject', { name: project.title });
  }
  return '';
});

// The display label for the purpose (shown in modal)
const purposeLabel = computed(() => {
  const val = selectedPurpose.value;
  if (val === 'custom') {
    return customPurposeText.value || '';
  }
  const option = purposeOptions.value.find(o => o.value === val);
  return option?.label || '';
});

// The value to send to the API
const purposeValueForApi = computed(() => {
  if (selectedPurpose.value === 'custom') {
    return customPurposeText.value || 'general';
  }
  return selectedPurpose.value;
});

function clearCustomPurpose() {
  selectedPurpose.value = 'general';
  customPurposeText.value = '';
}

const waysIcons = [
  'i-heroicons-currency-dollar',
  'i-heroicons-cube',
  'i-heroicons-user-plus',
  'i-heroicons-wrench-screwdriver',
];

const wishListIcons = [
  'i-heroicons-book-open',
  'i-heroicons-academic-cap',
  'i-heroicons-building-library',
];

const waysWithIcons = computed(() => {
  const dbItems = getItems('support.donate.ways');
  if (dbItems.length > 0) {
    return dbItems.map((item, index) => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
      icon: field(item, 'icon') || waysIcons[index] || 'i-heroicons-star',
    }));
  }
  const items = tm('support.donate.ways.items') as any[];
  return items.map((item: any, index: number) => ({
    title: typeof item.title === 'string' ? item.title : rt(item.title),
    description: typeof item.description === 'string' ? item.description : rt(item.description),
    icon: waysIcons[index],
  }));
});

const wishLists = computed(() => {
  const dbItems = getItems('support.donate.wishLists');
  if (dbItems.length > 0) {
    return dbItems.map((item, index) => ({
      title: field(item, 'title'),
      description: field(item, 'description'),
      url: getMeta(item, 'url'),
      icon: field(item, 'icon') || wishListIcons[index] || 'i-heroicons-star',
    }));
  }
  const items = tm('support.donate.wishLists.items') as any[];
  if (!Array.isArray(items)) return [];
  return items.map((w: any, index: number) => ({
    title: typeof w.title === 'string' ? w.title : rt(w.title),
    description: typeof w.description === 'string' ? w.description : rt(w.description),
    url: typeof w.url === 'string' ? w.url : rt(w.url),
    icon: wishListIcons[index],
  }));
});

const contactEmails = computed(() => {
  const dbItems = getItems('support.donate.emails');
  if (dbItems.length > 0) {
    return dbItems.map(item => getMeta(item, 'email')).filter(Boolean);
  }
  return ['administracion@ceehonduras.org', 'english@ceehonduras.org', 'library@ceehonduras.org'];
});

useHead({
  title: 'Donate - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Support CEE through donations. Learn about different ways to give, including Amazon wish lists, monetary donations, and in-kind contributions.',
    },
  ],
});
</script>
