<template>
  <div class="space-y-8">
    <div>
      <h2 class="text-center text-2xl font-bold text-gray-900">
        {{ $t('auth.forgotPassword.title') }}
      </h2>
      <p class="mt-2 text-center text-sm text-gray-500">
        {{ $t('auth.forgotPassword.description') }}
      </p>
    </div>

    <UCard>
      <!-- Success state -->
      <div v-if="success" class="text-center py-4">
        <UIcon name="i-heroicons-envelope" class="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ $t('auth.forgotPassword.successTitle') }}
        </h3>
        <p class="text-gray-500 mb-6">
          {{ $t('auth.forgotPassword.successMessage') }}
        </p>
        <UButton variant="outline" :to="localePath('/auth/login')">
          {{ $t('auth.forgotPassword.backToLogin') }}
        </UButton>
      </div>

      <!-- Form -->
      <form v-else class="space-y-6" @submit.prevent="handleSubmit">
        <UFormField :label="$t('auth.forgotPassword.email')" name="email" required>
          <UInput
            v-model="email"
            type="email"
            :placeholder="$t('auth.forgotPassword.emailPlaceholder')"
            required
            icon="i-heroicons-envelope"
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
          {{ loading ? $t('auth.forgotPassword.sending') : $t('auth.forgotPassword.sendButton') }}
        </UButton>

        <div class="text-center">
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-sm text-primary-600 hover:text-primary-500"
          >
            {{ $t('auth.forgotPassword.backToLogin') }}
          </NuxtLink>
        </div>
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

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function handleSubmit() {
  if (!email.value) return

  loading.value = true
  error.value = ''

  try {
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: `${window.location.origin}${localePath('/auth/reset-password')}`,
      }
    )

    if (resetError) throw resetError

    success.value = true
  } catch (e: any) {
    error.value = e.message || t('auth.errors.resetPasswordError')
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Forgot Password - CEE',
})
</script>
