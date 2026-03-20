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
      // 1. Look up the invitation client-side (user is authenticated so RLS read works)
      const { data: invitation, error: inviteError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', pendingToken)
        .is('accepted_at', null)
        .single()

      if (inviteError || !invitation) {
        throw new Error('Invalid or expired invitation')
      }

      if (new Date(invitation.expires_at) < new Date()) {
        throw new Error('Invitation has expired')
      }

      const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || ''

      // 2. Upsert user_profiles client-side — RLS allows: id = auth.uid()
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          email: invitation.email,
          full_name: fullName,
          role: invitation.role,
          status: 'active',
          invited_by: invitation.invited_by,
          invited_at: invitation.created_at,
        })

      if (profileError) {
        throw new Error(profileError.message)
      }

      // 3. Grant permissions via server (requires service role — RLS blocks client insert)
      const permissions = invitation.permissions || []
      if (permissions.length > 0) {
        await $fetch('/api/grant-permissions', {
          method: 'POST',
          body: {
            userId: session.user.id,
            permissions,
            canCalendar: invitation.can_calendar || false,
            canAnnouncements: invitation.can_announcements || false,
          },
        })
      }

      // 4. Mark invitation accepted client-side — RLS UPDATE allows: email = auth.jwt()->>'email'
      await supabase
        .from('invitations')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', invitation.id)

      // 5. Load the newly created profile and navigate to admin
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
