<template>
  <div class="min-h-screen bg-white w-full">
    <nav class="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink :to="localePath('/')" class="text-xl font-bold text-gray-900">
              {{ $t('app.name') }}
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <LanguageSwitcher />
            <template v-if="user">
              <span class="text-gray-700">{{ user.email }}</span>
              <UButton @click="handleSignOut" variant="outline">
                {{ $t('nav.signOut') }}
              </UButton>
            </template>
            <template v-else>
              <UButton @click="navigateTo(localePath('/auth/login'))" variant="outline">
                {{ $t('nav.signIn') }}
              </UButton>
              <UButton @click="navigateTo(localePath('/auth/signup'))">
                {{ $t('nav.signUp') }}
              </UButton>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main class="pt-16 w-full">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const localePath = useLocalePath()

const handleSignOut = async () => {
  await supabase.auth.signOut()
  await navigateTo(localePath('/auth/login'))
}
</script>
