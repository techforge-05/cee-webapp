<template>
  <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex gap-10">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink :to="localePath('/')" class="block py-2">
              <div class="flex items-center gap-1">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  class="h-20 md:h-25 w-auto object-contain mt-6 z-300"
                />
                <div
                  class="text-black font-bold text-xs md:text-base leading-tight"
                >
                  <p>COMUNIDAD EDUCATIVA</p>
                  <p>EVANGÉLICA</p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Navigation Buttons - Hidden on mobile -->
          <div
            class="hidden lg:flex items-center space-x-6"
            @mouseleave="scheduleClose"
          >
            <button
              v-for="navItem in navigationItems"
              :key="navItem.key"
              @mouseenter="handleDropdownChange(navItem.key)"
              class="relative text-green-700 hover:text-gray-900 font-medium transition-colors duration-200 pb-2 cursor-pointer"
            >
              {{ $t(`nav.${navItem.key}`) }}
              <Transition name="indicator">
                <div
                  v-if="activeDropdown === navItem.key"
                  class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-600 rounded-full"
                ></div>
              </Transition>
            </button>
          </div>
        </div>
        <!-- Right Side Actions -->
        <div class="flex items-center space-x-3">
          <!-- Special Badge Buttons - Hidden on mobile -->
          <div class="hidden md:flex items-center space-x-2">
            <UBadge
              color="primary"
              variant="solid"
              size="lg"
              class="rounded-full"
            >
              <NuxtLink :to="localePath('/admissions')" class="px-2 py-1">
                {{ $t('nav.admissions') }}
              </NuxtLink>
            </UBadge>
            <UBadge
              color="secondary"
              variant="solid"
              size="lg"
              class="rounded-full text-black font-bold"
            >
              <NuxtLink :to="localePath('/get-involved')" class="px-2 py-1">
                {{ $t('nav.getInvolved') }}
              </NuxtLink>
            </UBadge>
          </div>

          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Auth Buttons -->
          <template v-if="user">
            <span class="hidden md:inline text-gray-700">{{ user.email }}</span>
            <UButton @click="handleSignOut" variant="outline" size="sm">
              {{ $t('nav.signOut') }}
            </UButton>
          </template>
          <template v-else>
            <UButton
              @click="navigateTo(localePath('/auth/login'))"
              variant="outline"
              size="sm"
              class="hidden md:inline-flex"
            >
              {{ $t('nav.signIn') }}
            </UButton>
          </template>

          <!-- Mobile Menu Button -->
          <UButton
            @click="mobileMenuOpen = !mobileMenuOpen"
            variant="ghost"
            icon="i-heroicons-bars-3"
            class="lg:hidden"
          />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden py-4 space-y-6">
        <!-- About Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('nav.about') }}
          </h3>
          <div class="pl-4 space-y-2">
            <NuxtLink
              :to="localePath('/about/mission')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Mission & Vision
            </NuxtLink>
            <NuxtLink
              :to="localePath('/about/history')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              History
            </NuxtLink>
            <NuxtLink
              :to="localePath('/about/staff')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Staff
            </NuxtLink>
          </div>
        </div>

        <!-- Academics Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('nav.academics') }}
          </h3>
          <div class="pl-4 space-y-2">
            <NuxtLink
              :to="localePath('/academics/curriculum')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Curriculum
            </NuxtLink>
            <NuxtLink
              :to="localePath('/academics/programs')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Programs
            </NuxtLink>
          </div>
        </div>

        <!-- Student Life Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('nav.studentLife') }}
          </h3>
          <div class="pl-4 space-y-2">
            <NuxtLink
              :to="localePath('/student-life/activities')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Activities
            </NuxtLink>
            <NuxtLink
              :to="localePath('/student-life/clubs')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Clubs
            </NuxtLink>
          </div>
        </div>

        <!-- Parents Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('nav.parents') }}
          </h3>
          <div class="pl-4 space-y-2">
            <NuxtLink
              :to="localePath('/parents/resources')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Resources
            </NuxtLink>
            <NuxtLink
              :to="localePath('/parents/calendar')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Calendar
            </NuxtLink>
          </div>
        </div>

        <!-- Contact Section -->
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            {{ $t('nav.contact') }}
          </h3>
          <div class="pl-4 space-y-2">
            <NuxtLink
              :to="localePath('/contact/info')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Contact Info
            </NuxtLink>
            <NuxtLink
              :to="localePath('/contact/directions')"
              class="block text-gray-700 hover:text-gray-900 py-1"
              @click="mobileMenuOpen = false"
            >
              Directions
            </NuxtLink>
          </div>
        </div>

        <div class="pt-3 border-t border-gray-200 space-y-3">
          <NuxtLink
            :to="localePath('/admissions')"
            class="block text-blue-600 font-bold py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.admissions') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/get-involved')"
            class="block text-green-600 font-bold py-2"
            @click="mobileMenuOpen = false"
          >
            {{ $t('nav.getInvolved') }}
          </NuxtLink>
        </div>
        <template v-if="!user">
          <div class="pt-3 border-t border-gray-200">
            <UButton
              @click="
                navigateTo(localePath('/auth/login'));
                mobileMenuOpen = false;
              "
              variant="outline"
              block
            >
              {{ $t('nav.signIn') }}
            </UButton>
          </div>
        </template>
      </div>
    </div>

    <!-- Full-Width Desktop Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="activeDropdown && !mobileMenuOpen"
        @mouseenter="clearCloseTimeout"
        @mouseleave="scheduleClose"
        class="hidden lg:block absolute left-0 right-0 shadow-lg overflow-hidden"
        :class="[backgroundColor]"
        style="height: 60vh; top: 64px"
      >
        <div class="grid grid-cols-12 h-full">
          <!-- Left: Title (3 columns) -->
          <div class="col-span-3 flex justify-center p-8 pt-15">
            <h2 class="text-5xl font-bold text-green-600">
              {{ $t(`nav.${activeDropdown}`).toUpperCase() }}
            </h2>
          </div>

          <!-- Middle: Links (6 columns) -->
          <div class="col-span-5 p-8 pt-20">
            <ul class="space-y-4">
              <li
                v-for="item in dropdownItems[activeDropdown]"
                :key="item.path"
              >
                <NuxtLink
                  :to="localePath(item.path)"
                  class="text-2xl text-gray-700 hover:text-gray-900 hover:font-semibold font-medium block transition-colors duration-200"
                  @click="activeDropdown = null"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Right: Image (3 columns) -->
          <div class="col-span-4 flex items-center justify-center p-10">
            <div
              class="bg-gray-200 flex justify-center items-center w-full h-full"
            >
              <p class="text-gray-400 text-xl">Image</p>
              <!-- Replace with actual image:
            <img
              :src="`/images/${activeDropdown}.jpg`"
              :alt="$t(`nav.${activeDropdown}`)"
              class="w-full h-full object-cover"
            />
            --></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay to close dropdown -->
    <Transition name="fade">
      <div
        v-if="activeDropdown"
        class="fixed inset-0 bg-transparent z-40"
        style="top: calc(64px + 60vh)"
        @mouseenter="scheduleClose"
      ></div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const localePath = useLocalePath();
  const mobileMenuOpen = ref(false);
  const activeDropdown = ref<string | null>(null);
  let closeTimeout: NodeJS.Timeout | null = null;
  let switchTimeout: NodeJS.Timeout | null = null;

  // Navigation items
  const navigationItems = [
    { key: 'about' },
    { key: 'academics' },
    { key: 'studentLife' },
    { key: 'parents' },
    { key: 'contact' },
  ];

  // Dropdown menu items for each section
  const dropdownItems: Record<string, { path: string; label: string }[]> = {
    about: [
      { path: '/about/mission', label: 'Mission & Vision' },
      { path: '/about/history', label: 'History' },
      { path: '/about/staff', label: 'Staff' },
      { path: '/about/facilities', label: 'Facilities' },
    ],
    academics: [
      { path: '/academics/curriculum', label: 'Curriculum' },
      { path: '/academics/programs', label: 'Programs' },
      { path: '/academics/calendar', label: 'Academic Calendar' },
      { path: '/academics/grades', label: 'Grades & Levels' },
    ],
    studentLife: [
      { path: '/student-life/activities', label: 'Activities' },
      { path: '/student-life/clubs', label: 'Clubs & Organizations' },
      { path: '/student-life/sports', label: 'Sports' },
      { path: '/student-life/events', label: 'Events' },
    ],
    parents: [
      { path: '/parents/resources', label: 'Resources' },
      { path: '/parents/calendar', label: 'Calendar' },
      { path: '/parents/handbook', label: 'Parent Handbook' },
      { path: '/parents/involvement', label: 'Get Involved' },
    ],
    contact: [
      { path: '/contact/info', label: 'Contact Information' },
      { path: '/contact/directions', label: 'Directions' },
      { path: '/contact/form', label: 'Contact Form' },
      { path: '/contact/faq', label: 'FAQ' },
    ],
  };

  const backgroundColor = computed(() => {
    switch (activeDropdown.value) {
      case 'about':
        return 'bg-yellow-50';
      case 'academics':
        return 'bg-blue-50';
      case 'studentLife':
        return 'bg-green-50';
      case 'parents':
        return 'bg-purple-50';
      case 'contact':
        return 'bg-pink-50';
      default:
        return 'bg-white';
    }
  });

  const handleDropdownChange = (section: string) => {
    clearCloseTimeout();

    // If switching from one dropdown to another, briefly close to show transition
    if (activeDropdown.value && activeDropdown.value !== section) {
      activeDropdown.value = null;

      // Clear any pending switch timeout
      if (switchTimeout) {
        clearTimeout(switchTimeout);
      }

      // After a brief delay, open the new dropdown
      switchTimeout = setTimeout(() => {
        activeDropdown.value = section;
      }, 200); // 200ms delay to show the close/open transition
    } else {
      // If no dropdown is open, open immediately
      activeDropdown.value = section;
    }
  };

  const scheduleClose = () => {
    closeTimeout = setTimeout(() => {
      activeDropdown.value = null;
    }, 300); // Increased to 300ms delay before closing
  };

  const clearCloseTimeout = () => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await navigateTo(localePath('/auth/login'));
  };
</script>

<style scoped>
  /* Dropdown slide down animation - slower */
  .dropdown-enter-active {
    transition: all 0.5s ease-out;
  }

  .dropdown-leave-active {
    transition: all 0.4s ease-in;
  }

  .dropdown-enter-from {
    transform: translateY(-30px);
    opacity: 0;
  }

  .dropdown-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }

  /* Fade animation for overlay - slower */
  .fade-enter-active {
    transition: opacity 0.5s ease-out;
  }

  .fade-leave-active {
    transition: opacity 0.4s ease-in;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  /* Indicator ball animation - slower and slides up from bottom */
  .indicator-enter-active {
    transition: all 0.4s ease-out;
  }

  .indicator-leave-active {
    transition: all 0.3s ease-in;
  }

  .indicator-enter-from {
    transform: translate(-50%, 15px);
    opacity: 0;
  }

  .indicator-leave-to {
    transform: translate(-50%, 15px);
    opacity: 0;
  }
</style>
