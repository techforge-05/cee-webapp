<template>
  <footer class="bg-gray-900 text-white">
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Contact Information -->
        <div class="flex flex-col items-center md:items-start">
          <h4 class="text-lg font-bold mb-4">{{ $t('footer.contactInfo') }}</h4>
          <ul
            class="space-y-3 text-gray-400 text-sm flex flex-col items-center md:items-start"
          >
            <li>
              <div class="text-center md:text-left">
                <UIcon
                  name="i-heroicons-map-pin"
                  class="w-5 h-7 shrink-0 align-middle"
                />
                <span class="ml-1"
                  >B. El Carmen, Siguatepeque, Comayagua, Honduras</span
                >
              </div>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-phone" class="w-5 h-5 shrink-0" />
              <a
                href="tel:+50427730140"
                class="hover:text-white transition-colors"
              >
                +504 2773 0140
              </a>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-envelope" class="w-5 h-5 shrink-0" />
              <a
                href="mailto:contact@ceehonduras.org"
                class="hover:text-white transition-colors"
              >
                contact@ceehonduras.org
              </a>
            </li>
          </ul>
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
                :to="localePath('/support/donate')"
                class="text-gray-400 hover:text-white transition-colors"
              >
                {{ $t('footer.donate') }}
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

        <!-- Logo and Social Media -->
        <div class="flex flex-col md:flex-row justify-between md:items-start">
          <div>
            <h3 class="text-lg font-bold mb-4 text-center">
              {{ $t('footer.followUs') }}
            </h3>
            <div class="flex gap-4 justify-center">
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
          <div class="flex flex-col items-center mt-5 md:mt-0">
            <img
              src="/images/logo.png"
              alt="CEE Logo"
              class="h-24 md:h-30 w-auto object-contain"
            />
            <h3 class="text-lg font-bold mb-4 text-center">
              <p>CEE</p>
              <p class="text-xs">{{ $t('footer.bibleVerse') }}</p>
            </h3>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center">
        <p class="text-gray-400 text-sm">
          &copy; {{ new Date().getFullYear() }} {{ $t('app.name') }}.
          {{ $t('footer.allRightsReserved') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
  const localePath = useLocalePath();
</script>
