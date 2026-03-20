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

  if (!session) {
    await navigateTo(localePath('/auth/login'))
    return
  }

  // Check if there's a pending invitation to complete (Google OAuth from accept-invite)
  const pendingToken = localStorage.getItem('pendingInviteToken')
  if (pendingToken) {
    localStorage.removeItem('pendingInviteToken')

    try {
      await $fetch('/api/complete-invite', {
        method: 'POST',
        body: {
          token: pendingToken,
          userId: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
        },
      })

      // Clear cached store state so the newly created profile is fetched fresh
      const adminStore = useAdminStore()
      adminStore.clearProfile()
      await adminStore.loadProfile(session.user.id)
      await navigateTo(localePath('/admin'))
      return
    } catch (e) {
      console.error('Failed to complete invitation acceptance:', e)
      // Sign out so the user doesn't appear logged in without a profile
      await supabase.auth.signOut()
      // Use object form so localePath doesn't corrupt the query string
      await navigateTo({ path: localePath('/auth/accept-invite'), query: { token: pendingToken } })
      return
    }
  }

  // Normal flow: check if user is an admin and redirect accordingly
  const adminStore = useAdminStore()
  await adminStore.loadProfile(session.user.id)

  if (adminStore.profile && adminStore.profile.status === 'active') {
    await navigateTo(localePath('/admin'))
  } else {
    // No profile — sign out and go to home (avoids race condition with login page's onMounted)
    await supabase.auth.signOut()
    await navigateTo(localePath('/'))
  }
})
</script>
