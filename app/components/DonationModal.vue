<template>
  <UModal v-model:open="isOpen">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-xl font-bold text-gray-900">
          {{ $t('support.donate.payment.modalTitle') }}
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
              @click="currency = curr.value as 'USD' | 'HNL'"
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
              :color="formErrors.amount ? 'error' : 'primary'"
              @input="setCustomAmount(($event.target as HTMLInputElement).value)"
            />
            <p v-if="formErrors.amount" class="mt-1 text-sm text-red-600">
              {{ formErrors.amount }}
            </p>
          </div>
        </div>

        <!-- Donor Information -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ $t('support.donate.payment.donor.title') }}
          </h3>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.firstName') }} *
              </label>
              <UInput
                v-model="donor.firstName"
                size="lg"
                class="w-full"
                :color="formErrors.firstName ? 'error' : 'primary'"
              />
              <p v-if="formErrors.firstName" class="mt-1 text-sm text-red-600">
                {{ formErrors.firstName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.lastName') }} *
              </label>
              <UInput
                v-model="donor.lastName"
                size="lg"
                class="w-full"
                :color="formErrors.lastName ? 'error' : 'primary'"
              />
              <p v-if="formErrors.lastName" class="mt-1 text-sm text-red-600">
                {{ formErrors.lastName }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.email') }} *
              </label>
              <UInput
                v-model="donor.email"
                type="email"
                size="lg"
                class="w-full"
                :color="formErrors.email ? 'error' : 'primary'"
              />
              <p v-if="formErrors.email" class="mt-1 text-sm text-red-600">
                {{ formErrors.email }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.donor.phone') }}
              </label>
              <UInput
                v-model="donor.phone"
                type="tel"
                size="lg"
                class="w-full"
                placeholder="50412345678"
              />
            </div>
          </div>
        </div>

        <!-- Card Information -->
        <div class="mb-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ $t('support.donate.payment.card.title') }}
          </h3>
          <div class="space-y-4">
            <!-- Card Number -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.card.number') }} *
              </label>
              <UInput
                :model-value="card.number"
                maxlength="19"
                placeholder="1234 5678 9012 3456"
                size="lg"
                class="w-full"
                :color="formErrors.cardNumber ? 'error' : 'primary'"
                @input="formatCardNumber"
              />
              <p v-if="formErrors.cardNumber" class="mt-1 text-sm text-red-600">
                {{ formErrors.cardNumber }}
              </p>
            </div>

            <!-- Name on Card -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                {{ $t('support.donate.payment.card.holderName') }} *
              </label>
              <UInput
                v-model="card.holderName"
                size="lg"
                class="w-full"
                :color="formErrors.cardHolder ? 'error' : 'primary'"
              />
              <p v-if="formErrors.cardHolder" class="mt-1 text-sm text-red-600">
                {{ formErrors.cardHolder }}
              </p>
            </div>

            <!-- Expiry + CVC row -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ $t('support.donate.payment.card.expMonth') }} *
                </label>
                <USelect
                  v-model="card.expMonth"
                  :items="monthOptions"
                  placeholder="MM"
                  size="lg"
                  class="w-full"
                  :color="formErrors.cardExpiry ? 'error' : 'primary'"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ $t('support.donate.payment.card.expYear') }} *
                </label>
                <USelect
                  v-model="card.expYear"
                  :items="yearOptions"
                  placeholder="YYYY"
                  size="lg"
                  class="w-full"
                  :color="formErrors.cardExpiry ? 'error' : 'primary'"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ $t('support.donate.payment.card.cvc') }} *
                </label>
                <UInput
                  v-model="card.cvc"
                  maxlength="4"
                  placeholder="123"
                  size="lg"
                  class="w-full"
                  :color="formErrors.cvc ? 'error' : 'primary'"
                />
                <p v-if="formErrors.cvc" class="mt-1 text-sm text-red-600">
                  {{ formErrors.cvc }}
                </p>
              </div>
            </div>
            <p v-if="formErrors.cardExpiry" class="text-sm text-red-600">
              {{ formErrors.cardExpiry }}
            </p>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <UIcon name="i-heroicons-lock-closed" class="w-6 h-6 text-blue-600 shrink-0" />
          <div class="flex-1">
            <p class="font-semibold text-blue-900 text-sm">{{ $t('support.donate.payment.security.title') }}</p>
            <p class="text-blue-700 text-xs">{{ $t('support.donate.payment.security.description') }}</p>
          </div>
          <img src="/images/bancoOccidente.png" alt="Banco de Occidente" class="h-10 w-auto shrink-0" />
        </div>
      </div>

      <!-- PROCESSING STATE -->
      <div
        v-else-if="step === 'processing' || step === 'ddc' || step === 'authorizing' || step === 'paying'"
        class="text-center py-12"
      >
        <div
          class="animate-spin w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">
          {{ $t('support.donate.payment.processing.title') }}
        </h3>
        <p class="text-gray-600">{{ statusMessage }}</p>
        <p class="text-sm text-gray-400 mt-4">
          {{ $t('support.donate.payment.processing.doNotClose') }}
        </p>
      </div>

      <!-- CHALLENGE STATE -->
      <div v-else-if="step === 'challenge'">
        <div class="text-center mb-4">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ $t('support.donate.payment.challenge.title') }}
          </h3>
          <p class="text-gray-600">
            {{ $t('support.donate.payment.challenge.description') }}
          </p>
        </div>
        <div
          id="challenge-container"
          class="w-full min-h-[450px] border border-gray-200 rounded-lg overflow-hidden"
        />
      </div>

      <!-- SUCCESS STATE -->
      <div v-else-if="step === 'success'" class="text-center py-12">
        <div
          class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <UIcon name="i-heroicons-check-circle" class="w-12 h-12 text-green-600" />
        </div>
        <h3 class="text-2xl font-bold text-green-800 mb-2">
          {{ $t('support.donate.payment.success.title') }}
        </h3>
        <p class="text-gray-700 mb-4">
          {{ $t('support.donate.payment.success.message', { amount: formattedAmount }) }}
        </p>
        <p class="text-sm text-gray-500 mb-2">
          {{ $t('support.donate.payment.success.orderNumber') }}: <strong>{{ orderNumber }}</strong>
        </p>
        <p class="text-sm text-gray-500 mb-6">
          {{ $t('support.donate.payment.success.emailConfirmation') }}
        </p>
        <div class="flex gap-3 justify-center">
          <UButton variant="outline" @click="handleNewDonation">
            {{ $t('support.donate.payment.success.newDonation') }}
          </UButton>
          <UButton @click="isOpen = false">
            {{ $t('support.donate.payment.close') }}
          </UButton>
        </div>
      </div>

      <!-- ERROR STATE -->
      <div v-else-if="step === 'error'" class="text-center py-12">
        <div
          class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <UIcon name="i-heroicons-x-circle" class="w-12 h-12 text-red-600" />
        </div>
        <h3 class="text-2xl font-bold text-red-800 mb-2">
          {{ $t('support.donate.payment.error.title') }}
        </h3>
        <p class="text-gray-700 mb-6">{{ errorMessage }}</p>
        <UButton @click="handleNewDonation">
          {{ $t('support.donate.payment.error.tryAgain') }}
        </UButton>
      </div>

      <!-- Hidden DDC iframe container -->
      <div id="ddc-container" class="hidden" />
    </template>

    <template v-if="step === 'form'" #footer>
      <UButton
        size="lg"
        block
        :disabled="!amount || loading"
        class="justify-center"
        @click="submitDonation"
      >
        <UIcon name="i-heroicons-credit-card" class="w-5 h-5 mr-2" />
        {{ $t('support.donate.payment.submit', { amount: formattedAmount }) }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const props = defineProps<{
  purpose?: string
  purposeValue?: string
}>()

const isOpen = defineModel<boolean>({ default: false })

const {
  step,
  amount,
  currency,
  customAmount,
  donor,
  card,
  purpose: composablePurpose,
  loading,
  statusMessage,
  errorMessage,
  orderNumber,
  formErrors,
  formattedAmount,
  monthOptions,
  yearOptions,
  submitDonation,
  resetForm,
  setPresetAmount,
  setCustomAmount,
  formatCardNumber,
} = useDonationPayment()

// Sync purpose from prop to composable
watch(() => props.purposeValue, (val) => {
  if (val) composablePurpose.value = val
}, { immediate: true })

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

function handleNewDonation() {
  resetForm()
}

// Reset form when modal closes
watch(isOpen, (open) => {
  if (!open) {
    resetForm()
  }
})
</script>
