<template>
  <footer class="bg-gray-900 text-white">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Logo and School Info -->
        <div class="flex flex-col items-center md:items-start">
          <img
            src="/images/logo.png"
            alt="CEE Logo"
            class="h-24 w-auto object-contain mb-4"
          />
          <h3 class="text-lg font-bold mb-2">
            {{ $t('app.name') }}
          </h3>
          <p class="text-gray-400 text-sm text-center md:text-left">
            Siguatepeque Bilingual Christian School
          </p>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col items-center md:items-start">
          <h4 class="text-lg font-bold mb-4">{{ $t('footer.quickLinks') }}</h4>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                :to="localePath('/about/mission')"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ $t('nav.about') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/academics/curriculum')"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ $t('nav.academics') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/admissions')"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ $t('nav.admissions') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/contact/info')"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ $t('nav.contact') }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="flex flex-col items-center md:items-start">
          <h4 class="text-lg font-bold mb-4">{{ $t('footer.followUs') }}</h4>
          <div class="flex gap-4">
            <a
              href="https://www.facebook.com/p/Comunidad-Educativa-Evangelica-Siguatepeque-Bilingual-Christian-School-100024740330064/?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <UIcon name="i-simple-icons-facebook" class="w-6 h-6" />
            </a>
            <a
              href="https://www.youtube.com/@CEEHonduras"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="YouTube"
            >
              <UIcon name="i-simple-icons-youtube" class="w-6 h-6" />
            </a>
            <a
              href="https://x.com/ceehonduras"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors"
              aria-label="X (Twitter)"
            >
              <UIcon name="i-simple-icons-x" class="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}. {{ $t('footer.allRightsReserved') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>
