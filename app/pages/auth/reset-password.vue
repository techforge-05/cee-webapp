<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-center text-2xl font-bold text-gray-900">
        {{ $t('auth.resetPassword.title') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-500">
        {{ $t('auth.resetPassword.description') }}
      </p>
    </div>

    <UCard>
      <!-- Success state -->
      <div v-if="success" class="text-center py-4">
        <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ $t('auth.resetPassword.successTitle') }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ $t('auth.resetPassword.successMessage') }}
        </p>
        <UButton :to="localePath('/auth/login')">
          {{ $t('auth.resetPassword.goToLogin') }}
        </UButton>
      </div>

      <!-- Form -->
      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :label="$t('auth.resetPassword.newPassword')" name="password" required>
          <UInput
            v-model="password"
            type="password"
            :placeholder="$t('auth.resetPassword.passwordPlaceholder')"
            required
            icon="i-heroicons-lock-closed"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('auth.resetPassword.confirmPassword')" name="confirmPassword" required>
          <UInput
            v-model="confirmPassword"
            type="password"
            :placeholder="$t('auth.resetPassword.confirmPlaceholder')"
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
          :loading="loading"
        >
          {{ loading ? $t('auth.resetPassword.resetting') : $t('auth.resetPassword.resetButton') }}
        </UButton>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const supabase = useSupabaseClient()
const localePath = useLocalePath()
const { t } = useI18n()

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSubmit() {
  error.value = ''

  if (password.value.length < 6) {
    error.value = t('auth.errors.passwordTooShort')
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.errors.passwordMismatch')
    return
  }

  loading.value = true

  try {
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (updateError) throw updateError

    success.value = true
  } catch (e: any) {
    error.value = e.message || t('auth.errors.resetPasswordError')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Reset Password - CEE',
})
</script>
