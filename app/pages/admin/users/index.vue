<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('admin.users.title') }}</h1>
        <p class="text-gray-500">{{ $t('admin.users.description') }}</p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        @click="showInviteModal = true"
      >
        {{ $t('admin.users.inviteUser') }}
      </UButton>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <UInput
        v-model="search"
        :placeholder="$t('admin.users.searchPlaceholder')"
        icon="i-heroicons-magnifying-glass"
        class="max-w-sm"
      />
    </div>

    <!-- Users table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.users.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.users.table.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.users.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ $t('admin.users.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="navigateTo(localePath(`/admin/users/${user.id}`))"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                    {{ getInitials(user) }}
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.full_name || '-' }}
                    </div>
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="user.role === 'super_admin' ? 'primary' : 'neutral'"
                  variant="subtle"
                >
                  {{ $t(`admin.users.roles.${user.role}`) }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="statusColor(user.status)"
                  variant="subtle"
                >
                  {{ $t(`admin.users.statuses.${user.status}`) }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right" @click.stop>
                <UDropdown :items="getActionItems(user)">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    variant="ghost"
                    color="neutral"
                    size="sm"
                  />
                </UDropdown>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-gray-500">
                {{ $t('admin.users.emptyState') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pending invitations section -->
      <div v-if="pendingInvitations.length > 0" class="border-t border-gray-200">
        <div class="px-6 py-3 bg-gray-50">
          <h3 class="text-sm font-medium text-gray-700">Pending Invitations</h3>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="inv in pendingInvitations"
              :key="inv.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-sm font-medium text-yellow-600 shrink-0">
                    <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ inv.email }}</div>
                    <div class="text-xs text-gray-500">
                      Expires {{ formatDate(inv.expires_at) }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="inv.role === 'super_admin' ? 'primary' : 'neutral'"
                  variant="subtle"
                >
                  {{ $t(`admin.users.roles.${inv.role}`) }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <UBadge
                  :color="isExpired(inv.expires_at) ? 'error' : 'warning'"
                  variant="subtle"
                >
                  {{ isExpired(inv.expires_at) ? $t('admin.users.statuses.expired') : $t('admin.users.statuses.invited') }}
                </UBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <UButton
                  v-if="isExpired(inv.expires_at)"
                  size="xs"
                  variant="outline"
                  @click="resendInvitation(inv)"
                >
                  {{ $t('admin.users.actions.reInvite') }}
                </UButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Invite Modal -->
    <InviteUserModal v-model:open="showInviteModal" @invited="loadData" />

    <!-- Delete confirmation -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.users.deleteConfirm.title') }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ $t('admin.users.deleteConfirm.message') }}</p>
          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showDeleteModal = false">
              {{ $t('admin.users.deleteConfirm.cancel') }}
            </UButton>
            <UButton color="error" :loading="actionLoading" @click="confirmDelete">
              {{ $t('admin.users.deleteConfirm.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Disable confirmation -->
    <UModal v-model:open="showDisableModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.users.disableConfirm.title') }}</h3>
          <p class="text-sm text-gray-500 mb-6">{{ $t('admin.users.disableConfirm.message') }}</p>
          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showDisableModal = false">
              {{ $t('admin.users.disableConfirm.cancel') }}
            </UButton>
            <UButton color="error" :loading="actionLoading" @click="confirmDisable">
              {{ $t('admin.users.disableConfirm.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { UserProfile } from '~/stores/admin'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

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

const search = ref('')
const users = ref<UserProfile[]>([])
const pendingInvitations = ref<any[]>([])
const showInviteModal = ref(false)
const showDeleteModal = ref(false)
const showDisableModal = ref(false)
const selectedUser = ref<UserProfile | null>(null)
const actionLoading = ref(false)

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const s = search.value.toLowerCase()
  return users.value.filter(
    u => u.full_name?.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
  )
})

function statusColor(status: string): string {
  switch (status) {
    case 'active': return 'success'
    case 'invited': return 'warning'
    case 'expired': return 'error'
    case 'disabled': return 'neutral'
    default: return 'neutral'
  }
}

function getInitials(user: UserProfile): string {
  const name = user.full_name || user.email
  const parts = name.split(/[\s@]/)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('')
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

type DropdownItem = {
  label: string
  icon: string
  click: () => void
  color?: string
}

function getActionItems(user: UserProfile): DropdownItem[][] {
  const items: DropdownItem[] = [
    {
      label: t('admin.users.actions.viewDetails'),
      icon: 'i-heroicons-eye',
      click: () => navigateTo(localePath(`/admin/users/${user.id}`)),
    },
  ]

  // Don't allow actions on yourself
  if (user.id !== adminStore.profile?.id) {
    if (user.status === 'active') {
      items.push({
        label: t('admin.users.actions.disable'),
        icon: 'i-heroicons-no-symbol',
        click: () => {
          selectedUser.value = user
          showDisableModal.value = true
        },
      })
    } else if (user.status === 'disabled') {
      items.push({
        label: t('admin.users.actions.enable'),
        icon: 'i-heroicons-check-circle',
        click: () => enableUser(user),
      })
    }

    items.push({
      label: t('admin.users.actions.delete'),
      icon: 'i-heroicons-trash',
      color: 'error',
      click: () => {
        selectedUser.value = user
        showDeleteModal.value = true
      },
    })
  }

  return [items]
}

async function loadData() {
  const [usersResult, invitationsResult] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('invitations')
      .select('*')
      .is('accepted_at', null)
      .order('created_at', { ascending: false }),
  ])

  if (usersResult.data) users.value = usersResult.data as UserProfile[]
  if (invitationsResult.data) pendingInvitations.value = invitationsResult.data
}

async function confirmDelete() {
  if (!selectedUser.value) return
  actionLoading.value = true

  try {
    // Delete permissions first, then profile
    await supabase
      .from('user_permissions')
      .delete()
      .eq('user_id', selectedUser.value.id)

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', selectedUser.value.id)

    if (error) throw error

    toast.add({ title: 'User deleted', color: 'success' })
    showDeleteModal.value = false
    selectedUser.value = null
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.message || 'Failed to delete user', color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function confirmDisable() {
  if (!selectedUser.value) return
  actionLoading.value = true

  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'disabled' })
      .eq('id', selectedUser.value.id)

    if (error) throw error

    toast.add({ title: 'User disabled', color: 'success' })
    showDisableModal.value = false
    selectedUser.value = null
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.message || 'Failed to disable user', color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function enableUser(user: UserProfile) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ status: 'active' })
      .eq('id', user.id)

    if (error) throw error

    toast.add({ title: 'User enabled', color: 'success' })
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.message || 'Failed to enable user', color: 'error' })
  }
}

async function resendInvitation(invitation: any) {
  try {
    await $fetch('/api/admin/resend-invite', {
      method: 'POST',
      body: { invitationId: invitation.id },
    })

    toast.add({ title: 'Invitation resent', color: 'success' })
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.data?.message || 'Failed to resend invitation', color: 'error' })
  }
}

onMounted(loadData)

useHead({
  title: 'Users - Admin - CEE',
})
</script>
