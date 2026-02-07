<template>
  <div class="max-w-md w-full space-y-8">
    <!-- Loading state -->
    <div v-if="validating" class="text-center">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
      <p class="text-gray-500">Validating invitation...</p>
    </div>

    <!-- Invalid/expired token -->
    <div v-else-if="tokenError">
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">
        {{ $t('auth.acceptInvite.title') }}
      </h2>
      <UCard>
        <div class="text-center py-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p class="text-gray-700">{{ tokenError }}</p>
          <UButton
            variant="outline"
            class="mt-6"
            :to="localePath('/auth/login')"
          >
            {{ $t('auth.acceptInvite.goToLogin') }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Success state -->
    <div v-else-if="success">
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-4">
        {{ $t('auth.acceptInvite.successTitle') }}
      </h2>
      <UCard>
        <div class="text-center py-4">
          <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p class="text-gray-700 mb-6">{{ $t('auth.acceptInvite.successMessage') }}</p>
          <UButton :to="localePath('/auth/login')">
            {{ $t('auth.acceptInvite.goToLogin') }}
          </UButton>
        </div>
      </UCard>
    </div>

    <!-- Registration form -->
    <div v-else-if="invitation">
      <h2 class="text-center text-2xl font-bold text-gray-900 mb-2">
        {{ $t('auth.acceptInvite.title') }}
      </h2>
      <p class="text-center text-gray-500 mb-6">
        {{ $t('auth.acceptInvite.description') }}
      </p>

      <UCard>
        <form class="space-y-4" @submit.prevent="handleAccept">
          <UFormField :label="$t('auth.acceptInvite.email')" name="email">
            <UInput
              :model-value="invitation.email"
              disabled
              icon="i-heroicons-envelope"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('auth.acceptInvite.fullName')" name="fullName" required>
            <UInput
              v-model="form.fullName"
              :placeholder="$t('auth.acceptInvite.fullNamePlaceholder')"
              icon="i-heroicons-user"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('auth.acceptInvite.password')" name="password" required>
            <UInput
              v-model="form.password"
              type="password"
              :placeholder="$t('auth.acceptInvite.passwordPlaceholder')"
              required
              icon="i-heroicons-lock-closed"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('auth.acceptInvite.confirmPassword')" name="confirmPassword" required>
            <UInput
              v-model="form.confirmPassword"
              type="password"
              :placeholder="$t('auth.acceptInvite.confirmPlaceholder')"
              required
              icon="i-heroicons-lock-closed"
              class="w-full"
            />
          </UFormField>

          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <UButton
            type="submit"
            block
            size="lg"
            :loading="submitting"
          >
            {{ submitting ? $t('auth.acceptInvite.accepting') : $t('auth.acceptInvite.acceptButton') }}
          </UButton>
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const route = useRoute()
const supabase = useSupabaseClient()
const localePath = useLocalePath()
const { t } = useI18n()

const validating = ref(true)
const tokenError = ref('')
const success = ref(false)
const submitting = ref(false)
const error = ref('')
const invitation = ref<any>(null)

const form = reactive({
  fullName: '',
  password: '',
  confirmPassword: '',
})

const token = route.query.token as string

onMounted(async () => {
  if (!token) {
    tokenError.value = t('auth.acceptInvite.invalidToken')
    validating.value = false
    return
  }

  // Validate the token
  const { data, error: fetchError } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .single()

  if (fetchError || !data) {
    tokenError.value = t('auth.acceptInvite.invalidToken')
    validating.value = false
    return
  }

  if (data.accepted_at) {
    tokenError.value = t('auth.acceptInvite.alreadyAccepted')
    validating.value = false
    return
  }

  if (new Date(data.expires_at) < new Date()) {
    tokenError.value = t('auth.acceptInvite.expiredToken')
    validating.value = false
    return
  }

  invitation.value = data
  validating.value = false
})

async function handleAccept() {
  error.value = ''

  if (form.password.length < 6) {
    error.value = t('auth.errors.passwordTooShort')
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = t('auth.errors.passwordMismatch')
    return
  }

  submitting.value = true

  try {
    // 1. Create the auth user via Supabase signup
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: invitation.value.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
        },
      },
    })

    if (signupError) throw signupError
    if (!authData.user) throw new Error('Failed to create user')

    // 2. Create user_profiles record
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: invitation.value.email,
        full_name: form.fullName,
        role: invitation.value.role,
        status: 'active',
        invited_by: invitation.value.invited_by,
        invited_at: invitation.value.created_at,
      })

    if (profileError) throw profileError

    // 3. Create user_permissions from invitation
    const permissions = invitation.value.permissions || []
    if (permissions.length > 0) {
      const permRows = permissions.map((p: any) => ({
        user_id: authData.user!.id,
        section: p.section,
        page: p.page || null,
        can_calendar: invitation.value.can_calendar || false,
        can_announcements: invitation.value.can_announcements || false,
      }))

      const { error: permError } = await supabase
        .from('user_permissions')
        .insert(permRows)

      if (permError) throw permError
    }

    // 4. Mark invitation as accepted
    await supabase
      .from('invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invitation.value.id)

    // 5. Sign out (so user can log in fresh)
    await supabase.auth.signOut()

    success.value = true
  } catch (e: any) {
    error.value = e.message || t('auth.errors.acceptInviteError')
  } finally {
    submitting.value = false
  }
}

useHead({
  title: 'Accept Invitation - CEE',
})
</script>
