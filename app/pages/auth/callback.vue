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
      // Look up the invitation
      const { data: invite } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', pendingToken)
        .is('accepted_at', null)
        .single()

      if (invite && new Date(invite.expires_at) >= new Date()) {
        // Create user_profiles record
        await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            email: invite.email,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
            role: invite.role,
            status: 'active',
            invited_by: invite.invited_by,
            invited_at: invite.created_at,
          })

        // Create user_permissions from invitation
        const permissions = invite.permissions || []
        if (permissions.length > 0) {
          const permRows = permissions.map((p: any) => ({
            user_id: session.user.id,
            section: p.section,
            page: p.page || null,
            can_calendar: invite.can_calendar || false,
            can_announcements: invite.can_announcements || false,
          }))

          await supabase
            .from('user_permissions')
            .insert(permRows)
        }

        // Mark invitation as accepted
        await supabase
          .from('invitations')
          .update({ accepted_at: new Date().toISOString() })
          .eq('id', invite.id)

        // Load admin profile and redirect to admin
        const adminStore = useAdminStore()
        await adminStore.loadProfile(session.user.id)
        await navigateTo(localePath('/admin'))
        return
      }
    } catch (e) {
      console.error('Failed to complete invitation acceptance:', e)
    }
  }

  // Normal flow: check if user is an admin and redirect accordingly
  const adminStore = useAdminStore()
  await adminStore.loadProfile(session.user.id)

  if (adminStore.profile && adminStore.profile.status === 'active') {
    await navigateTo(localePath('/admin'))
  } else {
    await navigateTo(localePath('/'))
  }
})
</script>
