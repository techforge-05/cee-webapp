<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section
      class="relative bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-20"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          {{ $t('studentLife.gallery.title') }}
        </h1>
        <p class="text-xl md:text-2xl text-teal-100">
          {{ $t('studentLife.gallery.subtitle') }}
        </p>
      </div>
    </section>

    <!-- Introduction -->
    <section class="py-12 bg-gray-50">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <UIcon
            name="i-heroicons-photo"
            class="w-16 h-16 text-teal-600 mx-auto mb-6"
          />
          <p class="text-2xl md:text-3xl font-semibold text-teal-800 leading-snug">
            {{ $t('studentLife.gallery.intro') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="w-10 h-10 text-teal-400 animate-spin" />
    </div>

    <template v-else>
    <!-- Filters Section -->
    <section class="py-8 border-b sticky top-0 bg-white z-20 shadow-sm">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Year Selector -->
          <div class="flex items-center gap-3">
            <span class="text-gray-700 font-medium">
              {{ $t('studentLife.gallery.selectYear') }}:
            </span>
            <div class="flex flex-wrap gap-2">
              <button
                @click="selectedYear = null"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedYear === null
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ $t('studentLife.gallery.allYears') }}
              </button>
              <button
                v-for="year in availableYears"
                :key="year"
                @click="selectedYear = year"
                :class="[
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  selectedYear === year
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                ]"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="(label, key) in categories"
              :key="key"
              @click="selectedCategory = key"
              :class="[
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedCategory === key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Photo Gallery -->
    <section class="py-16">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <!-- Results Count -->
        <div class="mb-8 flex items-center justify-between">
          <p class="text-gray-600">
            {{ $t('studentLife.gallery.showing', { shown: filteredPhotos.length, total: totalCount }) }}
            <span v-if="selectedYear"> from {{ selectedYear }}</span>
            <span v-if="selectedCategory !== 'all'"> in {{ categories[selectedCategory] }}</span>
          </p>
        </div>

        <!-- Photo Grid -->
        <div
          v-if="filteredPhotos.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            v-for="(photo, index) in filteredPhotos"
            :key="index"
            class="group relative bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            @click="openLightbox(index)"
          >
            <!-- Photo -->
            <div class="aspect-square">
              <img
                v-if="photo.url"
                :src="photo.url"
                :alt="photo.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                :style="{ objectPosition: `${photo.focal_x ?? 50}% ${photo.focal_y ?? 50}%` }"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50"
              >
                <img
                  src="/images/logo.png"
                  alt="CEE Logo"
                  class="h-16 w-auto opacity-30"
                  loading="lazy"
                />
              </div>
            </div>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3 class="text-white font-semibold text-sm mb-1">{{ photo.title }}</h3>
                <div class="flex items-center gap-2 text-white/80 text-xs">
                  <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                  <span>{{ photo.year }}</span>
                  <span class="mx-1">•</span>
                  <span>{{ categories[photo.category] }}</span>
                </div>
              </div>
            </div>

            <!-- Year Badge -->
            <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
              {{ photo.year }}
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && filteredPhotos.length > 0" class="text-center mt-10">
          <UButton
            size="lg"
            variant="outline"
            :loading="loading"
            @click="handleLoadMore"
          >
            {{ $t('studentLife.gallery.loadMore') }}
          </UButton>
        </div>

        <!-- No Photos Message -->
        <div
          v-if="filteredPhotos.length === 0"
          class="text-center py-16"
        >
          <UIcon
            name="i-heroicons-photo"
            class="w-16 h-16 text-gray-300 mx-auto mb-4"
          />
          <h3 class="text-xl font-semibold text-gray-500 mb-2">
            {{ $t('studentLife.gallery.noPhotos') }}
          </h3>
          <p class="text-gray-400">
            Try selecting a different year or category
          </p>
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightboxOpen"
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          @click.self="closeLightbox"
        >
          <!-- Close Button -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 text-white/80 hover:text-white p-2 z-50"
          >
            <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
          </button>

          <!-- Previous Button -->
          <button
            v-if="currentPhotoIndex > 0"
            @click="previousPhoto"
            class="absolute left-4 text-white/80 hover:text-white p-2"
          >
            <UIcon name="i-heroicons-chevron-left" class="w-10 h-10" />
          </button>

          <!-- Photo Container -->
          <div class="max-w-5xl mx-4" style="max-height: min(85vh, 700px)">
            <img
              v-if="currentPhoto?.url"
              :src="currentPhoto.url"
              :alt="currentPhoto.title"
              class="max-w-full object-contain rounded-lg"
              style="max-height: min(75vh, 600px)"
              loading="lazy"
            />
            <div
              v-else
              class="w-96 h-96 flex items-center justify-center bg-gradient-to-br from-teal-900 to-cyan-900 rounded-lg"
            >
              <img
                src="/images/logo.png"
                alt="CEE Logo"
                class="h-32 w-auto opacity-50"
                loading="lazy"
              />
            </div>

            <!-- Photo Info -->
            <div class="mt-4 text-center text-white">
              <h3 class="text-xl font-semibold mb-1">{{ currentPhoto?.title }}</h3>
              <p class="text-white/70">
                {{ currentPhoto?.year }} • {{ currentPhoto ? categories[currentPhoto.category] : '' }}
              </p>
            </div>
          </div>

          <!-- Next Button -->
          <button
            v-if="currentPhotoIndex < filteredPhotos.length - 1"
            @click="nextPhoto"
            class="absolute right-4 text-white/80 hover:text-white p-2"
          >
            <UIcon name="i-heroicons-chevron-right" class="w-10 h-10" />
          </button>

          <!-- Photo Counter -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Call to Action -->
    <section
      class="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white"
    >
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4">
            {{ $t('studentLife.gallery.cta.title') }}
          </h2>
          <p class="text-xl mb-8">
            {{ $t('studentLife.gallery.cta.description') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              :to="localePath('/admissions/who-can-apply')"
              size="lg"
              variant="solid"
              class="bg-white text-teal-700 hover:bg-gray-100 justify-center"
            >
              {{ $t('studentLife.gallery.cta.learnMore') }}
            </UButton>
            <UButton
              :to="localePath('/contact/info')"
              size="lg"
              variant="outline"
              class="border-2 border-white text-white hover:bg-white hover:text-teal-700 justify-center"
            >
              {{ $t('studentLife.gallery.cta.contactUs') }}
            </UButton>
          </div>
        </div>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
const { t, locale } = useI18n();
const { photos, loadPhotos, loadMore, hasMore, totalCount, loading } = useGallery();

// State
const selectedYear = ref<number | null>(null);
const selectedCategory = ref<string>('all');
const lightboxOpen = ref(false);
const currentPhotoIndex = ref(0);

// Categories
const categories = computed(() => ({
  all: t('studentLife.gallery.categories.all'),
  events: t('studentLife.gallery.categories.events'),
  sports: t('studentLife.gallery.categories.sports'),
  academics: t('studentLife.gallery.categories.academics'),
  arts: t('studentLife.gallery.categories.arts'),
  community: t('studentLife.gallery.categories.community'),
}));

// Load photos from DB with current filters
function reloadPhotos() {
  const year = selectedYear.value ?? undefined;
  const cat = selectedCategory.value === 'all' ? undefined : selectedCategory.value;
  loadPhotos(year, cat, 1, 24);
}

function handleLoadMore() {
  const year = selectedYear.value ?? undefined;
  const cat = selectedCategory.value === 'all' ? undefined : selectedCategory.value;
  loadMore(year, cat);
}

onMounted(() => reloadPhotos());

// Reload when filters change
watch([selectedYear, selectedCategory], () => reloadPhotos());

// Localized photos from DB
const filteredPhotos = computed(() =>
  photos.value.map(p => ({
    ...p,
    title: locale.value === 'en' ? p.title_en : p.title_es,
    altText: locale.value === 'en' ? (p.alt_text_en || p.title_en) : (p.alt_text_es || p.title_es),
  }))
);

// Available years — we need all unique years regardless of current filter
// This is a simple list since gallery_photos table has a year column
const availableYears = computed(() => {
  const years = [...new Set(photos.value.map(p => p.year))];
  return years.sort((a, b) => b - a);
});

// Current photo for lightbox
const currentPhoto = computed(() => {
  return filteredPhotos.value[currentPhotoIndex.value] || null;
});

// Lightbox functions
const openLightbox = (index: number) => {
  currentPhotoIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = '';
};

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
  }
};

const nextPhoto = () => {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++;
  }
};

// Keyboard navigation for lightbox
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') previousPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  };

  window.addEventListener('keydown', handleKeydown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
});

useHead({
  title: 'Yearly Pictures Gallery - CEE',
  meta: [
    {
      name: 'description',
      content:
        'Browse through years of memories at CEE - school events, sports, academics, arts, and community activities.',
    },
  ],
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
