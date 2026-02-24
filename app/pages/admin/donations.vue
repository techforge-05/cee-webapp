<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('admin.editors.donations.title') }}
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ $t('admin.editors.donations.subtitle') }}
        </p>
      </div>
      <UButton
        icon="i-heroicons-arrow-down-tray"
        @click="openDownloadModal"
      >
        {{ $t('admin.editors.donations.download.button') }}
      </UButton>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UFormField :label="$t('admin.editors.donations.filters.purpose')">
          <USelect
            v-model="filterPurpose"
            :items="purposeOptions"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('admin.editors.donations.filters.dateFrom')">
          <UInput
            v-model="filterDateFrom"
            type="date"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('admin.editors.donations.filters.dateTo')">
          <UInput
            v-model="filterDateTo"
            type="date"
            class="w-full"
          />
        </UFormField>
        <UFormField :label="$t('admin.editors.donations.table.donorName')">
          <UInput
            v-model="filterDonorName"
            :placeholder="$t('admin.editors.donations.filters.donorName')"
            icon="i-heroicons-magnifying-glass"
            class="w-full"
          />
        </UFormField>
      </div>
    </div>

    <!-- Totals -->
    <div
      v-if="!loading && donations.length > 0"
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap items-center gap-4"
    >
      <span class="text-sm text-gray-500">
        {{ $t('admin.editors.donations.totals.count', { count: donations.length }, donations.length) }}
      </span>
      <div class="flex items-center gap-4 ml-auto">
        <span
          v-for="(amount, currency) in totals"
          :key="currency"
          class="text-lg font-bold text-gray-900 dark:text-white"
        >
          {{ $t('admin.editors.donations.totals.label') }}:
          {{ formatAmount(amount, currency as string) }}
        </span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-400 mx-auto" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="donations.length === 0"
      class="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <UIcon name="i-heroicons-banknotes" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500">{{ $t('admin.editors.donations.noDonations') }}</p>
    </div>

    <!-- Table -->
    <div
      v-else
      class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.donorName') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.email') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.amount') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.purpose') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.paymentMethod') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ $t('admin.editors.donations.table.date') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="donation in donations"
            :key="donation.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/30"
          >
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
              {{ donation.donor_name || '—' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {{ donation.donor_email || '—' }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 dark:text-white text-right font-medium whitespace-nowrap">
              {{ formatAmount(donation.amount, donation.currency) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ purposeLabel(donation.purpose) }}
              </UBadge>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <UBadge
                :color="donation.payment_method === 'paypal' ? 'info' : 'success'"
                variant="subtle"
                size="sm"
              >
                {{ $t(`admin.editors.donations.paymentMethods.${donation.payment_method}`) }}
              </UBadge>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {{ formatDate(donation.created_at) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Download Modal -->
    <UModal v-model:open="showDownloadModal">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ $t('admin.editors.donations.download.title') }}
        </h3>
      </template>

      <template #body>
      <div class="space-y-6">
        <!-- Date range -->
        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="$t('admin.editors.donations.download.dateFrom')">
            <UInput v-model="downloadDateFrom" type="date" class="w-full" />
          </UFormField>
          <UFormField :label="$t('admin.editors.donations.download.dateTo')">
            <UInput v-model="downloadDateTo" type="date" class="w-full" />
          </UFormField>
        </div>

        <!-- Preview totals -->
        <div v-if="!loadingPreview && previewDonations.length > 0" class="flex items-center gap-4 text-sm">
          <span class="text-gray-500">{{ previewDonations.length }} {{ previewDonations.length === 1 ? 'donación' : 'donaciones' }}</span>
          <span
            v-for="(amount, currency) in previewTotals"
            :key="currency"
            class="font-bold text-gray-900 dark:text-white"
          >
            {{ $t('admin.editors.donations.totals.label') }}: {{ formatAmount(amount, currency as string) }}
          </span>
        </div>

        <!-- Preview table -->
        <div v-if="loadingPreview" class="text-center py-8">
          <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-gray-400 mx-auto" />
        </div>
        <div
          v-else-if="previewDonations.length === 0"
          class="text-center py-8 text-gray-500 text-sm"
        >
          {{ $t('admin.editors.donations.download.noData') }}
        </div>
        <div v-else class="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ $t('admin.editors.donations.table.donorName') }}
                </th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  {{ $t('admin.editors.donations.table.amount') }}
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ $t('admin.editors.donations.table.purpose') }}
                </th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  {{ $t('admin.editors.donations.table.date') }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="d in previewDonations" :key="d.id">
                <td class="px-4 py-2 text-gray-900 dark:text-white">{{ d.donor_name || '—' }}</td>
                <td class="px-4 py-2 text-right font-medium text-gray-900 dark:text-white">{{ formatAmount(d.amount, d.currency) }}</td>
                <td class="px-4 py-2 text-gray-500">{{ purposeLabel(d.purpose) }}</td>
                <td class="px-4 py-2 text-gray-500">{{ formatDate(d.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton variant="outline" @click="showDownloadModal = false">
            {{ $t('admin.editors.donations.download.cancel') }}
          </UButton>
          <UButton
            icon="i-heroicons-arrow-down-tray"
            :loading="generatingPdf"
            :disabled="previewDonations.length === 0"
            @click="generatePdf"
          >
            {{ $t('admin.editors.donations.download.downloadPdf') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Donation } from '~/composables/useDonationsAdmin'

definePageMeta({
  layout: 'admin',
  middleware: ['admin-auth'],
})

const adminStore = useAdminStore()
const localePath = useLocalePath()
const supabase = useSupabaseClient()
const { t, locale } = useI18n()
const { donations, loading, purposes, loadDonations, loadPurposes } = useDonationsAdmin()

// Filters
const currentYear = new Date().getFullYear()
const filterPurpose = ref('all')
const filterDateFrom = ref(`${currentYear}-01-01`)
const filterDateTo = ref(`${currentYear}-12-31`)
const filterDonorName = ref('')

// Download modal
const showDownloadModal = ref(false)
const downloadDateFrom = ref(`${currentYear}-01-01`)
const downloadDateTo = ref(`${currentYear}-12-31`)
const previewDonations = ref<Donation[]>([])
const loadingPreview = ref(false)
const generatingPdf = ref(false)

// Debounce timer for donor name search
let donorNameTimeout: ReturnType<typeof setTimeout> | null = null

// Purpose filter options
const purposeOptions = computed(() => {
  const all = { label: t('admin.editors.donations.filters.allPurposes'), value: 'all' }
  const items = purposes.value.map((p) => ({
    label: purposeLabel(p),
    value: p,
  }))
  return [all, ...items]
})

// Totals grouped by currency
const totals = computed(() => {
  const result: Record<string, number> = {}
  for (const d of donations.value) {
    result[d.currency] = (result[d.currency] || 0) + Number(d.amount)
  }
  return result
})

const previewTotals = computed(() => {
  const result: Record<string, number> = {}
  for (const d of previewDonations.value) {
    result[d.currency] = (result[d.currency] || 0) + Number(d.amount)
  }
  return result
})

// Helpers
function formatAmount(amount: number, currency: string): string {
  if (currency === 'HNL') {
    return `L ${new Intl.NumberFormat('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`
  }
  return `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`
}

function formatDate(dateStr: string): string {
  const localeStr = locale.value === 'es' ? 'es-HN' : 'en-US'
  return new Date(dateStr).toLocaleDateString(localeStr, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function purposeLabel(purpose: string): string {
  const key = `admin.editors.donations.purposes.${purpose}`
  const translated = t(key)
  // If the key doesn't exist, i18n returns the key itself — show raw value capitalized instead
  if (translated === key) {
    return purpose.charAt(0).toUpperCase() + purpose.slice(1)
  }
  return translated
}

// Load data
async function refreshDonations() {
  await loadDonations({
    purpose: filterPurpose.value,
    dateFrom: filterDateFrom.value,
    dateTo: filterDateTo.value,
    donorName: filterDonorName.value || undefined,
  })
}

async function loadPreview() {
  loadingPreview.value = true
  try {
    const { data } = await supabase
      .from('donations')
      .select('id, order_number, amount, currency, donor_name, donor_email, donor_phone, purpose, payment_method, created_at')
      .eq('status', 'completed')
      .gte('created_at', downloadDateFrom.value)
      .lte('created_at', downloadDateTo.value + 'T23:59:59')
      .order('created_at', { ascending: false })

    previewDonations.value = (data || []) as Donation[]
  } catch (_e) {
    previewDonations.value = []
  } finally {
    loadingPreview.value = false
  }
}

function openDownloadModal() {
  downloadDateFrom.value = `${currentYear}-01-01`
  downloadDateTo.value = `${currentYear}-12-31`
  showDownloadModal.value = true
  loadPreview()
}

// Watchers
watch(filterPurpose, () => refreshDonations())
watch(filterDateFrom, () => refreshDonations())
watch(filterDateTo, () => refreshDonations())
watch(filterDonorName, () => {
  if (donorNameTimeout) clearTimeout(donorNameTimeout)
  donorNameTimeout = setTimeout(() => refreshDonations(), 400)
})
watch(downloadDateFrom, () => loadPreview())
watch(downloadDateTo, () => loadPreview())

// Super admin guard + initial load
onMounted(async () => {
  if (!adminStore.isProfileLoaded) {
    await adminStore.loadProfile()
  }
  if (!adminStore.isSuperAdmin) {
    navigateTo(localePath('/admin'))
    return
  }
  await Promise.all([refreshDonations(), loadPurposes()])
})

// PDF Generation
function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')!.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = url
  })
}

async function generatePdf() {
  generatingPdf.value = true

  try {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - margin * 2
    const localeStr = locale.value === 'es' ? 'es-HN' : 'en-US'

    // Logo
    try {
      const logoData = await loadImage('/images/logo.png')
      const logoSize = 25
      doc.addImage(logoData, 'PNG', (pageWidth - logoSize) / 2, 12, logoSize, logoSize)
    } catch {
      // Logo failed to load, continue without it
    }

    // Title
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text(t('admin.editors.donations.download.pdfTitle'), pageWidth / 2, 46, { align: 'center' })

    // Period
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    const fromFormatted = new Date(downloadDateFrom.value).toLocaleDateString(localeStr, { year: 'numeric', month: 'long', day: 'numeric' })
    const toFormatted = new Date(downloadDateTo.value).toLocaleDateString(localeStr, { year: 'numeric', month: 'long', day: 'numeric' })
    doc.text(
      `${t('admin.editors.donations.download.period')}: ${fromFormatted} — ${toFormatted}`,
      pageWidth / 2, 54, { align: 'center' },
    )

    // Generated date
    const generatedDate = new Date().toLocaleDateString(localeStr, { year: 'numeric', month: 'long', day: 'numeric' })
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(
      `${t('admin.editors.donations.download.generatedOn')}: ${generatedDate}`,
      pageWidth / 2, 61, { align: 'center' },
    )

    // Totals
    const totalParts: string[] = []
    for (const [currency, amount] of Object.entries(previewTotals.value)) {
      totalParts.push(formatAmount(amount, currency))
    }
    if (totalParts.length > 0) {
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(30, 30, 30)
      doc.text(
        `${t('admin.editors.donations.totals.label')}: ${totalParts.join('  |  ')}`,
        pageWidth / 2, 69, { align: 'center' },
      )
    }

    // Divider
    doc.setDrawColor(180, 180, 180)
    doc.line(margin, 74, pageWidth - margin, 74)

    let y = 82

    if (previewDonations.value.length === 0) {
      doc.setFontSize(14)
      doc.setTextColor(120, 120, 120)
      doc.setFont('helvetica', 'italic')
      doc.text(t('admin.editors.donations.download.noData'), pageWidth / 2, y + 20, { align: 'center' })
    } else {
      // Table columns
      const colDonor = margin
      const colAmount = margin + 55
      const colPurpose = margin + 90
      const colMethod = margin + 125
      const colDate = margin + 145
      const donorW = 53
      const amountW = 33
      const purposeW = 33
      const methodW = 18
      const dateW = contentWidth - donorW - amountW - purposeW - methodW

      // Table header
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(60, 60, 60)
      doc.setFillColor(240, 240, 245)
      doc.rect(margin, y - 5, contentWidth, 8, 'F')
      doc.text(t('admin.editors.donations.table.donorName'), colDonor + 2, y)
      doc.text(t('admin.editors.donations.table.amount'), colAmount + 2, y)
      doc.text(t('admin.editors.donations.table.purpose'), colPurpose + 2, y)
      doc.text(t('admin.editors.donations.table.paymentMethod'), colMethod + 2, y)
      doc.text(t('admin.editors.donations.table.date'), colDate + 2, y)

      y += 8

      // Table rows
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)

      for (let i = 0; i < previewDonations.value.length; i++) {
        const d = previewDonations.value[i]
        const donorText = d.donor_name || '—'
        const amountText = formatAmount(d.amount, d.currency)
        const purposeText = purposeLabel(d.purpose)
        const methodText = t(`admin.editors.donations.paymentMethods.${d.payment_method}`)
        const dateText = formatDate(d.created_at)

        const donorLines = doc.splitTextToSize(donorText, donorW - 4)
        const rowHeight = Math.max(donorLines.length, 1) * 4.5 + 3

        // Page break
        if (y + rowHeight > pageHeight - 20) {
          doc.addPage()
          y = 20
        }

        // Alternate row background
        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 252)
          doc.rect(margin, y - 3.5, contentWidth, rowHeight, 'F')
        }

        doc.setTextColor(50, 50, 50)
        doc.text(donorLines, colDonor + 2, y)
        doc.text(amountText, colAmount + 2, y)
        doc.text(purposeText, colPurpose + 2, y)
        doc.text(methodText, colMethod + 2, y)
        doc.text(dateText, colDate + 2, y)

        y += rowHeight
      }
    }

    doc.save(`cee-donations-report-${downloadDateFrom.value}-${downloadDateTo.value}.pdf`)
    showDownloadModal.value = false
  } catch (e) {
    console.error('PDF generation failed:', e)
  } finally {
    generatingPdf.value = false
  }
}

useHead({
  title: `${t('admin.editors.donations.title')} - Admin - CEE`,
})
</script>
