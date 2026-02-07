<template>
  <div>
    <!-- Back button -->
    <div class="mb-6">
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left"
        :to="localePath('/admin/users')"
      >
        {{ $t('admin.userDetail.backToUsers') }}
      </UButton>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 text-gray-400 animate-spin" />
    </div>

    <!-- User not found -->
    <div v-else-if="!userProfile" class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <UIcon name="i-heroicons-user" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-500">User not found</h2>
    </div>

    <!-- User detail -->
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ $t('admin.userDetail.title') }}</h1>
          <p class="text-gray-500">{{ userProfile.email }}</p>
        </div>
        <UBadge
          :color="statusColor(userProfile.status)"
          variant="subtle"
          size="lg"
        >
          {{ $t(`admin.users.statuses.${userProfile.status}`) }}
        </UBadge>
      </div>

      <!-- Profile section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('admin.userDetail.profile') }}</h2>

        <div class="grid md:grid-cols-2 gap-4">
          <UFormField :label="$t('admin.userDetail.fullName')" name="fullName">
            <UInput
              v-model="form.full_name"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.userDetail.email')" name="email">
            <UInput
              :model-value="userProfile.email"
              disabled
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.userDetail.role')" name="role">
            <USelect
              v-model="form.role"
              :items="roleOptions"
              :disabled="userProfile.id === adminStore.profile?.id"
              class="w-full"
            />
          </UFormField>

          <UFormField :label="$t('admin.userDetail.status')" name="status">
            <USelect
              v-model="form.status"
              :items="statusOptions"
              :disabled="userProfile.id === adminStore.profile?.id"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="mt-4 text-sm text-gray-500 space-y-1">
          <p v-if="userProfile.created_at">
            {{ $t('admin.userDetail.createdAt') }}: {{ formatDate(userProfile.created_at) }}
          </p>
          <p v-if="userProfile.invited_at">
            {{ $t('admin.userDetail.invitedAt') }}: {{ formatDate(userProfile.invited_at) }}
          </p>
        </div>
      </div>

      <!-- Permissions section (only for admin role) -->
      <div v-if="form.role === 'admin'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('admin.userDetail.permissions') }}</h2>
        <UserPermissionsEditor v-model="permissionsModel" />
      </div>

      <!-- Save button -->
      <div class="flex justify-end gap-3">
        <UButton
          :loading="saving"
          size="lg"
          @click="saveChanges"
        >
          {{ saving ? $t('admin.userDetail.saving') : $t('admin.userDetail.save') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/stores/admin'
import type { PermissionsModel, PermissionEntry } from '~/components/admin/UserPermissionsEditor.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const route = useRoute()
const adminStore = useAdminStore()
const supabase = useSupabaseClient()
const localePath = useLocalePath()
const { t } = useI18n()
const toast = useToast()

// Only super admins can access this page
onMounted(() => {
  if (!adminStore.isSuperAdmin) {
    navigateTo(localePath('/admin'))
  }
})

const userId = route.params.id as string
const loading = ref(true)
const saving = ref(false)
const userProfile = ref<UserProfile | null>(null)

const form = reactive({
  full_name: '',
  role: 'admin' as 'super_admin' | 'admin',
  status: 'active' as 'active' | 'invited' | 'expired' | 'disabled',
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

const statusOptions = [
  { label: t('admin.users.statuses.active'), value: 'active' },
  { label: t('admin.users.statuses.disabled'), value: 'disabled' },
]

function statusColor(status: string): string {
  switch (status) {
    case 'active': return 'success'
    case 'invited': return 'warning'
    case 'expired': return 'error'
    case 'disabled': return 'neutral'
    default: return 'neutral'
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

async function loadUser() {
  loading.value = true

  try {
    // Load profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    userProfile.value = profile as UserProfile
    form.full_name = profile.full_name || ''
    form.role = profile.role
    form.status = profile.status

    // Load permissions
    const { data: permissions } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId)

    if (permissions) {
      const permEntries: PermissionEntry[] = permissions.map(p => ({
        section: p.section,
        page: p.page,
      }))

      const hasCalendar = permissions.some(p => p.can_calendar)
      const hasAnnouncements = permissions.some(p => p.can_announcements)

      permissionsModel.value = {
        permissions: permEntries,
        canCalendar: hasCalendar,
        canAnnouncements: hasAnnouncements,
      }
    }
  } catch (e: any) {
    console.error('Error loading user:', e)
  } finally {
    loading.value = false
  }
}

async function saveChanges() {
  if (!userProfile.value) return
  saving.value = true

  try {
    // Update profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({
        full_name: form.full_name || null,
        role: form.role,
        status: form.status,
      })
      .eq('id', userId)

    if (profileError) throw profileError

    // Update permissions (delete all, then re-insert)
    await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', userId)

    if (form.role === 'admin' && permissionsModel.value.permissions.length > 0) {
      const permRows = permissionsModel.value.permissions.map(p => ({
        user_id: userId,
        section: p.section,
        page: p.page,
        can_calendar: permissionsModel.value.canCalendar,
        can_announcements: permissionsModel.value.canAnnouncements,
      }))

      const { error: permError } = await supabase
        .from('user_permissions')
        .insert(permRows)

      if (permError) throw permError
    }

    toast.add({
      title: t('admin.userDetail.saved'),
      color: 'success',
    })

    // Reload to get fresh data
    await loadUser()
  } catch (e: any) {
    toast.add({
      title: t('admin.userDetail.saveError'),
      description: e.message,
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

onMounted(loadUser)

useHead({
  title: computed(() =>
    userProfile.value
      ? `${userProfile.value.full_name || userProfile.value.email} - Users - Admin - CEE`
      : 'User - Admin - CEE'
  ),
})
</script>
