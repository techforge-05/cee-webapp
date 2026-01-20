<template>
  <UCard>
    <div class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4" />
      <p class="text-gray-600 dark:text-gray-400">{{ $t('auth.callback.completing') }}</p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

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
