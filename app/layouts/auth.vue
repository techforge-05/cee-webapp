<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="absolute top-4 right-4">
      <LanguageSwitcher />
    </div>
    <div class="w-full max-w-md">
      <div class="flex justify-center mb-6">
        <NuxtLink :to="localePath('/')">
          <img src="/images/logo.png" alt="CEE Logo" class="h-36 w-auto" />
        </NuxtLink>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>
