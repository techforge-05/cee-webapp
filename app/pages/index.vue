<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <nav class="bg-white dark:bg-gray-800 shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">{{ $t('app.name') }}</h1>
          </div>
          <div class="flex items-center space-x-4">
            <LanguageSwitcher />
            <template v-if="user">
              <span class="text-gray-700 dark:text-gray-300">{{ user.email }}</span>
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

    <main class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          {{ $t('home.welcome') }}
        </h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          <template v-if="user">
            {{ $t('home.signedInAs', { email: user.email }) }}
          </template>
          <template v-else>
            {{ $t('home.pleaseSignIn') }}
          </template>
        </p>
      </div>

      <div v-if="user" class="mt-12 max-w-2xl mx-auto">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ $t('home.userInfo.title') }}</h3>
          </template>
          <dl class="space-y-4">
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('home.userInfo.email') }}</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">{{ user.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('home.userInfo.userId') }}</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white font-mono">{{ user.id }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('home.userInfo.createdAt') }}</dt>
              <dd class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ new Date(user.created_at).toLocaleString() }}
              </dd>
            </div>
          </dl>
        </UCard>
      </div>
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
