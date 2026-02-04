<template>
  <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
          <!-- Logo -->
          <div class="flex items-center">
            <NuxtLink :to="localePath('/')" class="block py-2">
              <div class="flex items-center gap-1">
                <img
                  src="/images/logo.png"
                  alt="Logo"
                  class="h-20 lg:h-24 2xl:h-26 w-auto object-contain mt-4 lg:mt-5 2xl:mt-6 z-300 fixed left-1 lg:left-4 2xl:left-6"
                />
                <div
                  class="text-black hidden lg:flex flex-col font-bold text-[10px] xl:text-xs 2xl:text-sm leading-tight pl-16 lg:pl-18 xl:pl-20 2xl:pl-24"
                >
                  <p>COMUNIDAD EDUCATIVA</p>
                  <p>EVANGÉLICA</p>
                </div>
                <div
                  class="text-green-800 font-bold text-4xl lg:hidden leading-tight pl-14"
                >
                  <p>CEE</p>
                </div>
              </div>
            </NuxtLink>
          </div>

          <!-- Navigation Buttons - Hidden on mobile -->
          <div
            class="hidden lg:flex items-center space-x-1.5 xl:space-x-2.5 2xl:space-x-5"
            @mouseleave="scheduleClose"
          >
            <button
              v-for="navItem in navigationItems"
              :key="navItem.key"
              @mouseenter="handleDropdownChange(navItem.key)"
              class="relative text-green-700 hover:text-gray-900 font-medium transition-colors duration-200 pb-2 cursor-pointer text-xs xl:text-sm 2xl:text-base whitespace-nowrap"
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
        <div class="flex items-center space-x-2 xl:space-x-3 2xl:space-x-4">
          <!-- Special Badge Buttons - Hidden on mobile, compact on medium desktops -->
          <div
            :key="locale"
            class="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3"
            @mouseleave="scheduleClose"
          >
            <span
              class="rounded-full cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium px-2 lg:px-3 py-1 text-xs xl:text-sm 2xl:text-base hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm"
              @mouseenter="handleDropdownChange('admissions')"
            >
              {{ $t('nav.admissions') }}
            </span>
            <span
              class="rounded-full cursor-pointer bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-2 lg:px-3 py-1 text-xs xl:text-sm 2xl:text-base hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-sm"
              @mouseenter="handleDropdownChange('getInvolved')"
            >
              {{ $t('nav.getInvolved') }}
            </span>
          </div>

          <!-- Language Switcher -->
          <LanguageSwitcher />

          <!-- Auth Buttons -->
          <template v-if="user">
            <span
              class="hidden 2xl:inline text-gray-700 text-sm truncate max-w-32"
              >{{ user.email }}</span
            >
            <UButton
              @click="handleSignOut"
              variant="outline"
              size="xs"
              color="error"
              class="text-xs"
            >
              {{ $t('nav.signOut') }}
            </UButton>
          </template>
          <template v-else>
            <UButton
              @click="navigateTo(localePath('/auth/login'))"
              variant="outline"
              size="xs"
              color="secondary"
              class="hidden lg:inline-flex cursor-pointer text-xs"
            >
              {{ $t('nav.signIn') }}
            </UButton>
          </template>

          <!-- Mobile Menu Button -->
          <UButton
            @click="mobileMenuOpen = !mobileMenuOpen"
            variant="outline"
            size="lg"
            icon="i-heroicons-bars-3"
            class="lg:hidden text-lime-600 outline-black ring-lime-700 ring-2"
          />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden fixed top-16 left-0 right-0 bottom-0 bg-white flex flex-col z-50"
      >
        <!-- Scrollable Content Area -->
        <div class="flex-1 overflow-y-auto py-6 pr-4 pl-10 space-y-6">
          <!-- About Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-pink-300"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.about') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <NuxtLink
                :to="localePath('/about/mission-vision-values')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-star"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.missionVisionValues') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about/statement-of-faith')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-book-open"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.statementOfFaith') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about/philosophy')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-light-bulb"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.philosophy') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about/history')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-clock"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.history') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about/town')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-map"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.town') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/about/leadership')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-user-group"
                  class="w-5 h-5 text-pink-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.about.leadership') }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Academics Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-yellow-200"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.academics') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <NuxtLink
                :to="localePath('/academics/curriculum')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-5 h-5 text-yellow-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.academics.curriculum') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/academics/grades')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-chart-bar"
                  class="w-5 h-5 text-yellow-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.academics.grades') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/academics/calendar')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="w-5 h-5 text-yellow-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.academics.calendar') }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Student Life Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-green-300"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.studentLife') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <NuxtLink
                :to="localePath('/student-life/sports-clubs')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-trophy"
                  class="w-5 h-5 text-green-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.studentLife.sportsClubs') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/student-life/service-projects')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-heart"
                  class="w-5 h-5 text-green-600 shrink-0"
                />
                <span>{{
                  $t('nav.dropdowns.studentLife.serviceProjects')
                }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/student-life/library')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-book-open"
                  class="w-5 h-5 text-green-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.studentLife.library') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/student-life/upcoming-events')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-calendar"
                  class="w-5 h-5 text-green-600 shrink-0"
                />
                <span>{{
                  $t('nav.dropdowns.studentLife.upcomingEvents')
                }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/student-life/gallery')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-photo"
                  class="w-5 h-5 text-green-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.studentLife.gallery') }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Parents Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-blue-300"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.parents') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <!-- Resources link - temporarily hidden
              <NuxtLink
                :to="localePath('/parents/resources')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-folder-open"
                  class="w-5 h-5 text-blue-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.parents.resources') }}</span>
              </NuxtLink>
              -->
              <NuxtLink
                :to="localePath('/parents/calendar')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-calendar-days"
                  class="w-5 h-5 text-blue-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.parents.calendar') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/parents/handbook')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-book-open"
                  class="w-5 h-5 text-blue-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.parents.handbook') }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Support Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-red-300"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.support') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <NuxtLink
                :to="localePath('/support/why-support')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-heart"
                  class="w-5 h-5 text-red-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.support.whySupport') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/support/scholarships')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-academic-cap"
                  class="w-5 h-5 text-red-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.support.scholarships') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/support/donate')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-currency-dollar"
                  class="w-5 h-5 text-red-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.support.donate') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/support/projects')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-wrench-screwdriver"
                  class="w-5 h-5 text-red-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.support.projects') }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Contact Section -->
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center shrink-0"
              >
                <div class="w-4 h-4 rounded-full bg-orange-300"></div>
              </div>
              <h3 class="text-lg font-bold text-purple-900">
                {{ $t('nav.contact') }}
              </h3>
            </div>
            <div class="pl-14 space-y-2">
              <NuxtLink
                :to="localePath('/contact/info')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-phone"
                  class="w-5 h-5 text-orange-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.contact.info') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact/directions')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-5 text-orange-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.contact.directions') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact/form')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-envelope"
                  class="w-5 h-5 text-orange-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.contact.form') }}</span>
              </NuxtLink>
              <NuxtLink
                :to="localePath('/contact/faq')"
                class="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-1"
                @click="mobileMenuOpen = false"
              >
                <UIcon
                  name="i-heroicons-question-mark-circle"
                  class="w-5 h-5 text-orange-600 shrink-0"
                />
                <span>{{ $t('nav.dropdowns.contact.faq') }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Fixed Bottom Buttons -->
        <div
          class="border-t border-gray-200 bg-white p-4 pt-6 space-y-3 flex flex-col items-center"
        >
          <!-- Admissions Accordion -->
          <div class="w-[70%]">
            <UButton
              @click="mobileAdmissionsOpen = !mobileAdmissionsOpen"
              class="rounded-full font-semibold w-full justify-center text-green-700"
              variant="subtle"
            >
              {{ $t('nav.admissions') }}
              <UIcon
                :name="
                  mobileAdmissionsOpen
                    ? 'i-heroicons-chevron-up'
                    : 'i-heroicons-chevron-down'
                "
                class="w-4 h-4 ml-2"
              />
            </UButton>
            <Transition name="accordion">
              <div v-if="mobileAdmissionsOpen" class="mt-2 space-y-2 pl-4">
                <NuxtLink
                  :to="localePath('/admissions/who-can-apply')"
                  class="block text-gray-700 hover:text-green-700 py-1"
                  @click="mobileMenuOpen = false"
                >
                  {{ $t('nav.dropdowns.admissions.whoCanApply') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/admissions/how-to-apply')"
                  class="block text-gray-700 hover:text-green-700 py-1"
                  @click="mobileMenuOpen = false"
                >
                  {{ $t('nav.dropdowns.admissions.howToApply') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/admissions/calendar')"
                  class="block text-gray-700 hover:text-green-700 py-1"
                  @click="mobileMenuOpen = false"
                >
                  {{ $t('nav.dropdowns.admissions.calendar') }}
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- Get Involved Accordion -->
          <div class="w-[70%]">
            <UButton
              @click="mobileGetInvolvedOpen = !mobileGetInvolvedOpen"
              color="warning"
              class="rounded-full font-semibold w-full justify-center"
            >
              {{ $t('nav.getInvolved') }}
              <UIcon
                :name="
                  mobileGetInvolvedOpen
                    ? 'i-heroicons-chevron-up'
                    : 'i-heroicons-chevron-down'
                "
                class="w-4 h-4 ml-2"
              />
            </UButton>
            <Transition name="accordion">
              <div v-if="mobileGetInvolvedOpen" class="mt-2 space-y-2 pl-4">
                <NuxtLink
                  :to="localePath('/get-involved/teachers')"
                  class="block text-gray-700 hover:text-amber-700 py-1"
                  @click="mobileMenuOpen = false"
                >
                  {{ $t('nav.dropdowns.getInvolved.teachers') }}
                </NuxtLink>
                <NuxtLink
                  :to="localePath('/get-involved/volunteer')"
                  class="block text-gray-700 hover:text-amber-700 py-1"
                  @click="mobileMenuOpen = false"
                >
                  {{ $t('nav.dropdowns.getInvolved.volunteer') }}
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <template v-if="!user">
            <UButton
              @click="
                navigateTo(localePath('/auth/login'));
                mobileMenuOpen = false;
              "
              variant="solid"
              block
              color="error"
              class="text-white bg-blue-500/70"
            >
              {{ $t('nav.signIn') }}
            </UButton>
          </template>
          <template v-else>
            <div class="space-y-2">
              <span class="block text-gray-700 text-center">{{
                user.email
              }}</span>
              <UButton
                @click="handleSignOut"
                variant="outline"
                block
                class="text-white bg-red-500/60"
              >
                {{ $t('nav.signOut') }}
              </UButton>
            </div>
          </template>
        </div>
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
        style="height: min(60vh, 450px); top: 64px"
      >
        <div class="grid grid-cols-12 h-full">
          <!-- Left: Title (3 columns) -->
          <div
            class="col-span-3 flex justify-center p-4 lg:p-6 xl:p-8 pt-8 lg:pt-10 xl:pt-15"
          >
            <h2
              class="text-3xl lg:text-4xl xl:text-5xl font-bold"
              :class="[titleColor]"
            >
              {{ $t(`nav.${activeDropdown}`).toUpperCase() }}
            </h2>
          </div>

          <!-- Middle: Links (6 columns) -->
          <div class="col-span-5 p-4 lg:p-6 xl:p-8 pt-10 lg:pt-14 xl:pt-20">
            <ul class="space-y-2 lg:space-y-3 xl:space-y-4">
              <li
                v-for="item in dropdownItems[
                  activeDropdown as keyof typeof dropdownItems
                ]"
                :key="item.path"
              >
                <NuxtLink
                  :to="localePath(item.path)"
                  class="text-lg lg:text-xl xl:text-2xl text-gray-700 hover:text-gray-900 hover:font-semibold font-medium block transition-colors duration-200"
                  @click="activeDropdown = null"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Right: Image (3 columns) -->
          <div
            class="col-span-4 flex items-center justify-center p-4 lg:p-6 xl:p-10"
          >
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
        style="top: calc(64px + min(60vh, 450px))"
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
  const mobileAdmissionsOpen = ref(false);
  const mobileGetInvolvedOpen = ref(false);
  let closeTimeout: NodeJS.Timeout | null = null;
  let switchTimeout: NodeJS.Timeout | null = null;

  // Navigation items
  const navigationItems = [
    { key: 'about' },
    { key: 'academics' },
    { key: 'studentLife' },
    { key: 'parents' },
    { key: 'support' },
    { key: 'contact' },
  ];

  const { t, locale } = useI18n();

  // Dropdown menu items for each section
  const dropdownItems = computed(() => ({
    about: [
      {
        path: '/about/mission-vision-values',
        label: t('nav.dropdowns.about.missionVisionValues'),
      },
      {
        path: '/about/statement-of-faith',
        label: t('nav.dropdowns.about.statementOfFaith'),
      },
      { path: '/about/philosophy', label: t('nav.dropdowns.about.philosophy') },
      { path: '/about/history', label: t('nav.dropdowns.about.history') },
      { path: '/about/town', label: t('nav.dropdowns.about.town') },
      { path: '/about/leadership', label: t('nav.dropdowns.about.leadership') },
    ],
    academics: [
      {
        path: '/academics/curriculum',
        label: t('nav.dropdowns.academics.curriculum'),
      },
      { path: '/academics/grades', label: t('nav.dropdowns.academics.grades') },
      {
        path: '/academics/calendar',
        label: t('nav.dropdowns.academics.calendar'),
      },
    ],
    studentLife: [
      {
        path: '/student-life/sports-clubs',
        label: t('nav.dropdowns.studentLife.sportsClubs'),
      },
      {
        path: '/student-life/service-projects',
        label: t('nav.dropdowns.studentLife.serviceProjects'),
      },
      {
        path: '/student-life/library',
        label: t('nav.dropdowns.studentLife.library'),
      },
      {
        path: '/student-life/upcoming-events',
        label: t('nav.dropdowns.studentLife.upcomingEvents'),
      },
      {
        path: '/student-life/gallery',
        label: t('nav.dropdowns.studentLife.gallery'),
      },
    ],
    parents: [
      // Resources - temporarily hidden
      // {
      //   path: '/parents/resources',
      //   label: t('nav.dropdowns.parents.resources'),
      // },
      { path: '/parents/calendar', label: t('nav.dropdowns.parents.calendar') },
      { path: '/parents/handbook', label: t('nav.dropdowns.parents.handbook') },
    ],
    support: [
      {
        path: '/support/why-support',
        label: t('nav.dropdowns.support.whySupport'),
      },
      {
        path: '/support/scholarships',
        label: t('nav.dropdowns.support.scholarships'),
      },
      { path: '/support/donate', label: t('nav.dropdowns.support.donate') },
      { path: '/support/projects', label: t('nav.dropdowns.support.projects') },
    ],
    contact: [
      { path: '/contact/info', label: t('nav.dropdowns.contact.info') },
      {
        path: '/contact/directions',
        label: t('nav.dropdowns.contact.directions'),
      },
      { path: '/contact/form', label: t('nav.dropdowns.contact.form') },
      { path: '/contact/faq', label: t('nav.dropdowns.contact.faq') },
    ],
    admissions: [
      {
        path: '/admissions/who-can-apply',
        label: t('nav.dropdowns.admissions.whoCanApply'),
      },
      {
        path: '/admissions/how-to-apply',
        label: t('nav.dropdowns.admissions.howToApply'),
      },
      {
        path: '/admissions/calendar',
        label: t('nav.dropdowns.admissions.calendar'),
      },
    ],
    getInvolved: [
      {
        path: '/get-involved/teachers',
        label: t('nav.dropdowns.getInvolved.teachers'),
      },
      {
        path: '/get-involved/volunteer',
        label: t('nav.dropdowns.getInvolved.volunteer'),
      },
    ],
  }));

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
      case 'support':
        return 'bg-orange-50';
      case 'contact':
        return 'bg-pink-50';
      case 'admissions':
        return 'bg-gradient-to-br from-emerald-100 via-green-50 to-teal-100';
      case 'getInvolved':
        return 'bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100';
      default:
        return 'bg-white';
    }
  });

  const titleColor = computed(() => {
    switch (activeDropdown.value) {
      case 'admissions':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700';
      case 'getInvolved':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700';
      default:
        return 'text-green-600';
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

  /* Accordion animation for mobile menu */
  .accordion-enter-active {
    transition: all 0.3s ease-out;
  }

  .accordion-leave-active {
    transition: all 0.2s ease-in;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
  }

  .accordion-enter-to,
  .accordion-leave-from {
    opacity: 1;
    max-height: 100px;
    transform: translateY(0);
  }
</style>
