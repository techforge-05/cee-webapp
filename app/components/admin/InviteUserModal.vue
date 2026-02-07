<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <div class="p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-gray-900">{{ $t('admin.invite.title') }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ $t('admin.invite.description') }}</p>
        </div>

        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Email -->
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

          <!-- Role -->
          <UFormField :label="$t('admin.invite.role')" name="role" required>
            <USelect
              v-model="form.role"
              :items="roleOptions"
              class="w-full"
            />
          </UFormField>

          <!-- Permissions (only for admin role) -->
          <div v-if="form.role === 'admin'">
            <UserPermissionsEditor v-model="permissionsModel" />
          </div>

          <!-- Error message -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              variant="outline"
              @click="isOpen = false"
            >
              {{ $t('admin.invite.cancel') }}
            </UButton>
            <UButton
              type="submit"
              :loading="loading"
            >
              {{ loading ? $t('admin.invite.sending') : $t('admin.invite.sendInvite') }}
            </UButton>
          </div>
        </form>
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

const form = reactive({
  email: '',
  role: 'admin' as 'super_admin' | 'admin',
})

const permissionsModel = ref<PermissionsModel>({
  permissions: [],
  canCalendar: false,
  canAnnouncements: false,
})

const roleOptions = [
  { label: t('admin.users.roles.admin'), value: 'admin' },
  { label: t('admin.users.roles.super_admin'), value: 'super_admin' },
]

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

async function handleSubmit() {
  if (!form.email) return

  loading.value = true
  error.value = ''

  try {
    const body: Record<string, unknown> = {
      email: form.email,
      role: form.role,
    }

    if (form.role === 'admin') {
      body.permissions = permissionsModel.value.permissions
      body.canCalendar = permissionsModel.value.canCalendar
      body.canAnnouncements = permissionsModel.value.canAnnouncements
    }

    await $fetch('/api/admin/invite', {
      method: 'POST',
      body,
    })

    toast.add({
      title: t('admin.invite.success'),
      color: 'success',
    })

    // Reset form
    form.email = ''
    form.role = 'admin'
    permissionsModel.value = {
      permissions: [],
      canCalendar: false,
      canAnnouncements: false,
    }

    isOpen.value = false
    emit('invited')
  } catch (e: any) {
    error.value = e.data?.message || t('admin.invite.error')
  } finally {
    loading.value = false
  }
}
</script>
