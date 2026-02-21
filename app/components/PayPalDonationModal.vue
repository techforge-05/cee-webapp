<template>
  <UModal v-model:open="isOpen">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900">
          {{ $t('support.donate.payment.methodPaypal.modalTitle') }}
        </h2>
        <UButton
          variant="ghost"
          icon="i-heroicons-x-mark"
          size="sm"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <!-- Purpose banner -->
      <div
        v-if="purpose"
        class="bg-teal-50 border border-teal-200 rounded-lg px-4 py-3 mb-6"
      >
        <p class="text-sm font-medium text-teal-800">
          {{ $t('support.donate.payment.donatingFor', { purpose }) }}
        </p>
      </div>

      <!-- FORM STATE -->
      <div v-if="step === 'form'">
        <!-- Amount Selection -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ $t('support.donate.payment.amount.title') }}
          </h3>

          <!-- Currency toggle -->
          <div class="flex gap-2 mb-4">
            <UButton
              v-for="curr in currencies"
              :key="curr.value"
              :variant="currency === curr.value ? 'solid' : 'outline'"
              size="sm"
              @click="setCurrency(curr.value)"
            >
              {{ curr.label }}
            </UButton>
          </div>

          <!-- Preset amounts -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <UButton
              v-for="preset in presetAmounts"
              :key="preset"
              :variant="amount === preset && !customAmount ? 'solid' : 'outline'"
              size="lg"
              color="primary"
              class="justify-center"
              @click="setPresetAmount(preset)"
            >
              {{ currencySymbol }}{{ preset }}
            </UButton>
          </div>

          <!-- Custom amount -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              {{ $t('support.donate.payment.amount.custom') }}
            </label>
            <UInput
              :model-value="customAmount"
              type="number"
              min="1"
              step="0.01"
              :placeholder="$t('support.donate.payment.amount.customPlaceholder')"
              size="lg"
              class="w-full"
              :color="errors.amount ? 'error' : 'primary'"
              @input="setCustomAmount(($event.target as HTMLInputElement).value)"
            />
            <p v-if="errors.amount" class="mt-1 text-sm text-red-600">
              {{ errors.amount }}
            </p>
          </div>
        </div>

        <!-- Donor Information -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ $t('support.donate.payment.donor.title') }}
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.firstName') }} *
              </label>
              <UInput
                v-model="donorFirstName"
                size="lg"
                class="w-full"
                :color="errors.firstName ? 'error' : 'primary'"
              />
              <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
                {{ errors.firstName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.lastName') }} *
              </label>
              <UInput
                v-model="donorLastName"
                size="lg"
                class="w-full"
                :color="errors.lastName ? 'error' : 'primary'"
              />
              <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
                {{ errors.lastName }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.email') }} *
              </label>
              <UInput
                v-model="donorEmail"
                type="email"
                size="lg"
                class="w-full"
                :color="errors.email ? 'error' : 'primary'"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
          <p class="text-sm text-blue-800">
            <UIcon name="i-heroicons-information-circle" class="w-4 h-4 inline mr-1 -mt-0.5" />
            {{ $t('support.donate.payment.methodPaypal.instructions') }}
          </p>
        </div>

        <!-- PayPal Button Container -->
        <div class="flex justify-center py-2">
          <div id="paypal-button-container" />
        </div>

        <!-- SDK loading message -->
        <p v-if="sdkLoading" class="text-center text-sm text-gray-500 py-4">
          {{ $t('support.donate.payment.methodPaypal.loadingSdk') }}
        </p>
      </div>

      <!-- PROCESSING STATE -->
      <div v-else-if="step === 'processing'" class="text-center py-12">
        <div class="animate-spin w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-6" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ $t('support.donate.payment.processing.title') }}
        </h3>
        <p class="text-gray-600">
          {{ $t('support.donate.payment.methodPaypal.recording') }}
        </p>
      </div>

      <!-- SUCCESS STATE -->
      <div v-else-if="step === 'success'" class="text-center py-12">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-2xl font-bold text-green-800 mb-2">
          {{ $t('support.donate.payment.methodPaypal.success.title') }}
        </h3>
        <p class="text-gray-700 mb-4">
          {{ $t('support.donate.payment.methodPaypal.success.message') }}
        </p>
        <p v-if="resultOrderNumber" class="text-sm text-gray-500 mb-2">
          {{ $t('support.donate.payment.success.orderNumber') }}: <strong>{{ resultOrderNumber }}</strong>
        </p>
        <p class="text-sm text-gray-500 mb-6">
          {{ $t('support.donate.payment.success.emailConfirmation') }}
        </p>
        <UButton @click="isOpen = false">
          {{ $t('support.donate.payment.close') }}
        </UButton>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="step === 'error'" class="text-center py-12">
        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UIcon name="i-heroicons-x-circle" class="w-12 h-12 text-red-600" />
        </div>
        <h3 class="text-2xl font-bold text-red-800 mb-2">
          {{ $t('support.donate.payment.error.title') }}
        </h3>
        <p class="text-gray-700 mb-6">
          {{ errorMessage }}
        </p>
        <UButton @click="resetToForm">
          {{ $t('support.donate.payment.error.tryAgain') }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  purpose?: string
  purposeValue?: string
}>()

const isOpen = defineModel<boolean>({ default: false })

const { t, locale } = useI18n()
const config = useRuntimeConfig()

// State
type PayPalStep = 'form' | 'processing' | 'success' | 'error'
const step = ref<PayPalStep>('form')
const donorFirstName = ref('')
const donorLastName = ref('')
const donorEmail = ref('')
const errorMessage = ref('')
const resultOrderNumber = ref('')
const errors = ref<Record<string, string>>({})
const sdkLoading = ref(false)
const sdkLoaded = ref(false)
const buttonsRendered = ref(false)

// Amount state
const amount = ref(0)
const currency = ref<'USD' | 'HNL'>('USD')
const customAmount = ref('')

const currencies = [
  { value: 'USD', label: '$ USD' },
  { value: 'HNL', label: 'L HNL' },
]

const presetAmountsUSD = [25, 50, 100, 250]
const presetAmountsHNL = [500, 1000, 2500, 5000]

const presetAmounts = computed(() =>
  currency.value === 'USD' ? presetAmountsUSD : presetAmountsHNL,
)

const currencySymbol = computed(() =>
  currency.value === 'USD' ? '$' : 'L',
)

function setPresetAmount(preset: number) {
  amount.value = preset
  customAmount.value = ''
  errors.value = {}
}

function setCustomAmount(val: string) {
  customAmount.value = val
  const parsed = parseFloat(val)
  amount.value = isNaN(parsed) ? 0 : parsed
  errors.value = {}
}

function setCurrency(curr: string) {
  currency.value = curr as 'USD' | 'HNL'
  amount.value = 0
  customAmount.value = ''
  // Re-render buttons with new currency
  nextTick(() => renderPayPalButtons())
}

function validateForm(): boolean {
  errors.value = {}
  if (!amount.value || amount.value < 1) {
    errors.value.amount = t('support.donate.payment.validation.amountRequired')
  }
  if (!donorFirstName.value.trim()) {
    errors.value.firstName = t('support.donate.payment.validation.firstNameRequired')
  }
  if (!donorLastName.value.trim()) {
    errors.value.lastName = t('support.donate.payment.validation.lastNameRequired')
  }
  if (!donorEmail.value.trim()) {
    errors.value.email = t('support.donate.payment.validation.emailRequired')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donorEmail.value)) {
    errors.value.email = t('support.donate.payment.validation.emailInvalid')
  }
  return Object.keys(errors.value).length === 0
}

// Load PayPal JS SDK dynamically
function loadPayPalSdk(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).paypal) {
      resolve()
      return
    }

    // Remove any existing script (from previous currency)
    const existing = document.getElementById('paypal-js-sdk')
    if (existing) existing.remove()

    sdkLoading.value = true
    const script = document.createElement('script')
    script.id = 'paypal-js-sdk'
    script.src = `https://www.paypal.com/sdk/js?client-id=${config.public.paypalClientId}&currency=${currency.value}&components=buttons`
    script.onload = () => {
      sdkLoading.value = false
      sdkLoaded.value = true
      resolve()
    }
    script.onerror = () => {
      sdkLoading.value = false
      reject(new Error('Failed to load PayPal SDK'))
    }
    document.head.appendChild(script)
  })
}

function renderPayPalButtons() {
  const container = document.getElementById('paypal-button-container')
  if (!container) return

  // Clear previously rendered buttons
  container.innerHTML = ''
  buttonsRendered.value = false

  const paypal = (window as any).paypal
  if (!paypal?.Buttons) return

  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'paypal',
    },
    createOrder: async () => {
      if (!validateForm()) {
        throw new Error('validation_failed')
      }

      const response = await $fetch<{ orderId: string }>('/api/donate/paypal-create-order', {
        method: 'POST',
        body: {
          amount: amount.value,
          currency: currency.value,
        },
      })
      return response.orderId
    },
    onApprove: async (data: { orderID: string }) => {
      step.value = 'processing'
      try {
        const result = await $fetch<{ orderNumber: string; transactionId: string }>('/api/donate/paypal-capture-order', {
          method: 'POST',
          body: {
            orderId: data.orderID,
            donorName: `${donorFirstName.value} ${donorLastName.value}`.trim(),
            donorEmail: donorEmail.value,
            purpose: props.purposeValue || 'general',
            locale: locale.value,
          },
        })
        resultOrderNumber.value = result.orderNumber || ''
        step.value = 'success'
      } catch (e: any) {
        errorMessage.value = e.data?.message || t('support.donate.payment.methodPaypal.error.recordFailed')
        step.value = 'error'
      }
    },
    onError: (err: any) => {
      // Don't show error for validation failures (user just needs to fix the form)
      if (err?.message === 'validation_failed') return
      console.error('PayPal error:', err)
      errorMessage.value = t('support.donate.payment.error.generic')
      step.value = 'error'
    },
    onCancel: () => {
      // User closed PayPal popup, stay on form
    },
  }).render('#paypal-button-container').then(() => {
    buttonsRendered.value = true
  })
}

function resetToForm() {
  step.value = 'form'
  errorMessage.value = ''
  nextTick(() => renderPayPalButtons())
}

// Render buttons when modal opens
watch(isOpen, async (open) => {
  if (open) {
    step.value = 'form'
    errors.value = {}
    errorMessage.value = ''
    resultOrderNumber.value = ''

    await nextTick()
    try {
      await loadPayPalSdk()
      renderPayPalButtons()
    } catch (e) {
      console.error('Failed to load PayPal SDK:', e)
    }
  }
})

// Reset form when modal closes
watch(isOpen, (open) => {
  if (!open) {
    donorFirstName.value = ''
    donorLastName.value = ''
    donorEmail.value = ''
    amount.value = 0
    customAmount.value = ''
    currency.value = 'USD'
    errors.value = {}
    step.value = 'form'
  }
})
</script>
