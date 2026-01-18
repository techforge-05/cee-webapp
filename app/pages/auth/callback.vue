<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <UCard>
      <div class="text-center py-8">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
        <p class="text-gray-600 dark:text-gray-400">{{ $t('auth.callback.completing') }}</p>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const localePath = useLocalePath()

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await navigateTo(localePath('/'))
  } else {
    await navigateTo(localePath('/auth/login'))
  }
})
</script>
