<template>
  <UModal v-model:open="isOpen">
    <template #header>
      <div>
        <h2 class="text-lg font-semibold text-gray-900">{{ $t('admin.invite.title') }}</h2>
        <p class="text-sm text-gray-500 mt-1">{{ $t('admin.invite.description') }}</p>
      </div>
    </template>

    <template #body>
      <!-- Invite form fields -->
      <div v-if="!invitationCreated" class="space-y-5">
        <UFormField :label="$t('admin.invite.email')" name="email" required>
          <UInput
            v-model="form.email"
            type="email"
            :placeholder="$t('admin.invite.emailPlaceholder')"
            required
            icon="i-heroicons-envelope"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('admin.invite.role')" name="role" required>
          <USelect
            v-model="form.role"
            :items="roleOptions"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="$t('admin.invite.emailLanguage')" name="emailLocale" required>
          <USelect
            v-model="form.emailLocale"
            :items="localeOptions"
            class="w-full"
          />
        </UFormField>

        <div v-if="form.role === 'admin'">
          <UserPermissionsEditor v-model="permissionsModel" />
        </div>

        <UAlert
          v-if="error"
          color="error"
          icon="i-heroicons-exclamation-circle"
          :title="error"
        />
      </div>

      <!-- Post-submit: success/warning with copy link -->
      <div v-else class="space-y-5">
        <UAlert
          v-if="!emailSent"
          color="warning"
          icon="i-heroicons-exclamation-triangle"
          :title="$t('admin.invite.emailWarning')"
          :description="$t('admin.invite.emailWarningDescription')"
        />
        <UAlert
          v-else
          color="success"
          icon="i-heroicons-check-circle"
          :title="$t('admin.invite.success')"
        />

        <UFormField :label="$t('admin.invite.inviteLink')" :hint="$t('admin.invite.copyAndShare')">
          <div class="flex gap-2">
            <UInput
              :model-value="inviteUrl"
              readonly
              class="flex-1"
            />
            <UButton
              icon="i-heroicons-clipboard-document"
              @click="copyToClipboard"
            >
              {{ $t('admin.invite.copyLink') }}
            </UButton>
          </div>
        </UFormField>
      </div>
    </template>

    <template #footer>
      <div v-if="!invitationCreated" class="flex justify-end gap-3">
        <UButton
          variant="outline"
          @click="isOpen = false"
        >
          {{ $t('admin.invite.cancel') }}
        </UButton>
        <UButton
          :loading="loading"
          @click="handleSubmit"
        >
          {{ loading ? $t('admin.invite.sending') : $t('admin.invite.sendInvite') }}
        </UButton>
      </div>
      <div v-else class="flex justify-end">
        <UButton @click="handleClose">
          {{ $t('admin.invite.close') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { PermissionsModel } from './UserPermissionsEditor.vue'

const isOpen = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  invited: []
}>()

const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const error = ref('')
const invitationCreated = ref(false)
const inviteToken = ref('')
const emailSent = ref(true)

const form = reactive({
  email: '',
  role: 'admin' as 'super_admin' | 'admin',
  emailLocale: 'es' as 'es' | 'en',
})

const permissionsModel = ref<PermissionsModel>({
  permissions: [],
  canCalendar: false,
  canAnnouncements: false,
})

const roleOptions = computed(() => [
  { label: t('admin.users.roles.admin'), value: 'admin' },
  { label: t('admin.users.roles.super_admin'), value: 'super_admin' },
])

const localeOptions = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
]

const inviteUrl = computed(() => {
  if (!inviteToken.value) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/auth/accept-invite?token=${inviteToken.value}`
})

// Reset when role changes to super_admin (super admins get all permissions)
watch(() => form.role, (newRole) => {
  if (newRole === 'super_admin') {
    permissionsModel.value = {
      permissions: [],
      canCalendar: false,
      canAnnouncements: false,
    }
  }
})

async function copyToClipboard() {
  if (!inviteUrl.value) return

  try {
    await navigator.clipboard.writeText(inviteUrl.value)
    toast.add({
      title: t('admin.invite.linkCopied'),
      color: 'success',
    })
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = inviteUrl.value
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    toast.add({
      title: t('admin.invite.linkCopied'),
      color: 'success',
    })
  }
}

function resetForm() {
  form.email = ''
  form.role = 'admin'
  form.emailLocale = 'es'
  permissionsModel.value = {
    permissions: [],
    canCalendar: false,
    canAnnouncements: false,
  }
  invitationCreated.value = false
  inviteToken.value = ''
  emailSent.value = true
  error.value = ''
}

function handleClose() {
  if (invitationCreated.value) {
    emit('invited')
  }
  resetForm()
  isOpen.value = false
}

// Reset state when modal is closed externally
watch(isOpen, (newVal) => {
  if (!newVal && invitationCreated.value) {
    emit('invited')
    resetForm()
  }
})

async function handleSubmit() {
  if (!form.email) return

  loading.value = true
  error.value = ''

  try {
    const body: Record<string, unknown> = {
      email: form.email,
      role: form.role,
      locale: form.emailLocale,
    }

    if (form.role === 'admin') {
      body.permissions = permissionsModel.value.permissions
      body.canCalendar = permissionsModel.value.canCalendar
      body.canAnnouncements = permissionsModel.value.canAnnouncements
    }

    const response = await $fetch<{
      success: boolean
      emailSent: boolean
      invitation: { id: string; email: string; token: string }
    }>('/api/admin/invite', {
      method: 'POST',
      body,
    })

    invitationCreated.value = true
    inviteToken.value = response.invitation.token
    emailSent.value = response.emailSent

    if (response.emailSent) {
      toast.add({
        title: t('admin.invite.success'),
        color: 'success',
      })
    } else {
      toast.add({
        title: t('admin.invite.emailWarning'),
        description: t('admin.invite.emailWarningDescription'),
        color: 'warning',
      })
    }
  } catch (e: any) {
    error.value = e.data?.message || t('admin.invite.error')
  } finally {
    loading.value = false
  }
}
</script>
