<template>
  <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="block py-2">
            <div class="flex items-center gap-1">
              <img
                src="/images/logo.png"
                alt="Logo"
                class="h-20 md:h-25 w-auto object-contain mt-6"
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

        <!-- Navigation Links - Hidden on mobile -->
        <div class="hidden lg:flex items-center space-x-6">
          <NuxtLink
            :to="localePath('/about')"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('nav.about') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/academics')"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('nav.academics') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/student-life')"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('nav.studentLife') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/parents')"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('nav.parents') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/contact')"
            class="text-gray-700 hover:text-gray-900 font-medium"
          >
            {{ $t('nav.contact') }}
          </NuxtLink>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-3">
          <LanguageSwitcher />

          <!-- Special Badge Buttons - Hidden on mobile -->
          <div class="hidden md:flex items-center space-x-2">
            <UBadge color="primary" variant="solid" size="lg">
              <NuxtLink :to="localePath('/admissions')" class="px-2 py-1">
                {{ $t('nav.admissions') }}
              </NuxtLink>
            </UBadge>
            <UBadge color="green" variant="solid" size="lg">
              <NuxtLink :to="localePath('/get-involved')" class="px-2 py-1">
                {{ $t('nav.getInvolved') }}
              </NuxtLink>
            </UBadge>
          </div>

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
            <UButton
              @click="navigateTo(localePath('/auth/signup'))"
              size="sm"
              class="hidden md:inline-flex"
            >
              {{ $t('nav.signUp') }}
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
      <div v-if="mobileMenuOpen" class="lg:hidden py-4 space-y-3">
        <NuxtLink
          :to="localePath('/about')"
          class="block text-gray-700 hover:text-gray-900 font-medium py-2"
          @click="mobileMenuOpen = false"
        >
          {{ $t('nav.about') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/academics')"
          class="block text-gray-700 hover:text-gray-900 font-medium py-2"
          @click="mobileMenuOpen = false"
        >
          {{ $t('nav.academics') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/student-life')"
          class="block text-gray-700 hover:text-gray-900 font-medium py-2"
          @click="mobileMenuOpen = false"
        >
          {{ $t('nav.studentLife') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/parents')"
          class="block text-gray-700 hover:text-gray-900 font-medium py-2"
          @click="mobileMenuOpen = false"
        >
          {{ $t('nav.parents') }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/contact')"
          class="block text-gray-700 hover:text-gray-900 font-medium py-2"
          @click="mobileMenuOpen = false"
        >
          {{ $t('nav.contact') }}
        </NuxtLink>
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
          <div class="pt-3 border-t border-gray-200 space-y-2">
            <UButton
              @click="navigateTo(localePath('/auth/login')); mobileMenuOpen = false"
              variant="outline"
              block
            >
              {{ $t('nav.signIn') }}
            </UButton>
            <UButton
              @click="navigateTo(localePath('/auth/signup')); mobileMenuOpen = false"
              block
            >
              {{ $t('nav.signUp') }}
            </UButton>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const localePath = useLocalePath();
  const mobileMenuOpen = ref(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    await navigateTo(localePath('/auth/login'));
  };
</script>
