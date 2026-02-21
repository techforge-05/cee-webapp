<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ $t('admin.users.title') }}</h1>
        <p class="text-gray-500">{{ $t('admin.users.description') }}</p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        class="whitespace-nowrap"
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
                <UDropdownMenu :items="getActionItems(user)">
                  <UButton
                    icon="i-heroicons-ellipsis-vertical"
                    variant="ghost"
                    color="neutral"
                    size="sm"
                  />
                </UDropdownMenu>
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
          <h3 class="text-sm font-medium text-gray-700">{{ $t('admin.users.pendingInvitations') }}</h3>
        </div>
        <div class="overflow-x-auto">
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
                <div class="flex items-center justify-end gap-2">
                  <UButton
                    size="xs"
                    variant="outline"
                    icon="i-heroicons-clipboard-document"
                    @click="copyInviteLink(inv)"
                  >
                    {{ $t('admin.users.actions.copyLink') }}
                  </UButton>
                  <UButton
                    size="xs"
                    variant="outline"
                    @click="openResendModal(inv)"
                  >
                    {{ $t('admin.users.actions.reInvite') }}
                  </UButton>
                  <UDropdownMenu :items="getInvitationActionItems(inv)">
                    <UButton
                      icon="i-heroicons-ellipsis-vertical"
                      variant="ghost"
                      color="neutral"
                      size="xs"
                    />
                  </UDropdownMenu>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
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

    <!-- Cancel invitation confirmation -->
    <ConfirmDialog
      v-model="showCancelConfirm"
      :title="$t('admin.users.cancelConfirm.title')"
      :message="$t('admin.users.cancelConfirm.message')"
      :confirm-label="$t('admin.users.cancelConfirm.confirm')"
      :cancel-label="$t('admin.users.cancelConfirm.cancel')"
      :loading="actionLoading"
      confirm-color="error"
      @confirm="cancelInvitation"
    />

    <!-- Resend invitation language picker -->
    <UModal v-model:open="showResendModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ $t('admin.users.resendConfirm.title') }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ $t('admin.users.resendConfirm.message') }}</p>
          <UFormField :label="$t('admin.invite.emailLanguage')" class="mb-6">
            <USelect
              v-model="resendLocale"
              :items="localeOptions"
              class="w-full"
            />
          </UFormField>
          <div class="flex justify-end gap-3">
            <UButton variant="outline" @click="showResendModal = false">
              {{ $t('admin.invite.cancel') }}
            </UButton>
            <UButton :loading="actionLoading" @click="resendInvitation">
              {{ $t('admin.users.actions.reInvite') }}
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
const showCancelConfirm = ref(false)
const showResendModal = ref(false)
const selectedUser = ref<UserProfile | null>(null)
const selectedInvitation = ref<any>(null)
const resendLocale = ref<'es' | 'en'>('es')
const actionLoading = ref(false)

const localeOptions = [
  { label: 'Español', value: 'es' },
  { label: 'English', value: 'en' },
]

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
  onClick: () => void
  color?: string
}

function getActionItems(user: UserProfile): DropdownItem[][] {
  const items: DropdownItem[] = [
    {
      label: t('admin.users.actions.viewDetails'),
      icon: 'i-heroicons-eye',
      onClick: () => navigateTo(localePath(`/admin/users/${user.id}`)),
    },
  ]

  // Don't allow actions on yourself
  if (user.id !== adminStore.profile?.id) {
    if (user.status === 'active') {
      items.push({
        label: t('admin.users.actions.disable'),
        icon: 'i-heroicons-no-symbol',
        onClick: () => {
          selectedUser.value = user
          showDisableModal.value = true
        },
      })
    } else if (user.status === 'disabled') {
      items.push({
        label: t('admin.users.actions.enable'),
        icon: 'i-heroicons-check-circle',
        onClick: () => enableUser(user),
      })
    }

    items.push({
      label: t('admin.users.actions.delete'),
      icon: 'i-heroicons-trash',
      color: 'error',
      onClick: () => {
        selectedUser.value = user
        showDeleteModal.value = true
      },
    })
  }

  return [items]
}

function getInvitationActionItems(inv: any): DropdownItem[][] {
  return [[
    {
      label: t('admin.users.actions.cancel'),
      icon: 'i-heroicons-x-circle',
      color: 'error',
      onClick: () => {
        selectedInvitation.value = inv
        showCancelConfirm.value = true
      },
    },
  ]]
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

async function copyInviteLink(invitation: any) {
  const baseUrl = window.location.origin
  const inviteUrl = `${baseUrl}/auth/accept-invite?token=${invitation.token}`

  try {
    await navigator.clipboard.writeText(inviteUrl)
    toast.add({
      title: t('admin.invite.linkCopied'),
      color: 'success',
    })
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = inviteUrl
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

function openResendModal(invitation: any) {
  selectedInvitation.value = invitation
  resendLocale.value = 'es'
  showResendModal.value = true
}

async function resendInvitation() {
  if (!selectedInvitation.value) return
  actionLoading.value = true

  try {
    const response = await $fetch<{ success: boolean; emailSent: boolean }>('/api/admin/resend-invite', {
      method: 'POST',
      body: {
        invitationId: selectedInvitation.value.id,
        locale: resendLocale.value,
      },
    })

    if (response.emailSent) {
      toast.add({ title: t('admin.users.invitationResent'), color: 'success' })
    } else {
      toast.add({
        title: t('admin.invite.emailWarning'),
        description: t('admin.invite.emailWarningDescription'),
        color: 'warning',
      })
    }

    showResendModal.value = false
    selectedInvitation.value = null
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.data?.message || t('admin.users.failedToResend'), color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

async function cancelInvitation() {
  if (!selectedInvitation.value) return
  actionLoading.value = true

  try {
    await $fetch('/api/admin/cancel-invite', {
      method: 'POST',
      body: { invitationId: selectedInvitation.value.id },
    })

    toast.add({ title: t('admin.users.invitationCanceled'), color: 'success' })
    showCancelConfirm.value = false
    selectedInvitation.value = null
    await loadData()
  } catch (e: any) {
    toast.add({ title: e.data?.message || t('admin.users.failedToCancel'), color: 'error' })
  } finally {
    actionLoading.value = false
  }
}

onMounted(loadData)

useHead({
  title: 'Users - Admin - CEE',
})
</script>
