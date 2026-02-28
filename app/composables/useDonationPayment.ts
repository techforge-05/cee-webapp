export type PaymentStep = 'form' | 'processing' | 'ddc' | 'authorizing' | 'challenge' | 'paying' | 'success' | 'error'

export interface DonorInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export interface CardInfo {
  number: string
  expMonth: string
  expYear: string
  holderName: string
  cvc: string
}

export const useDonationPayment = () => {
  const { t, locale } = useI18n()

  // State
  const step = ref<PaymentStep>('form')
  const amount = ref(0)
  const currency = ref<'USD' | 'HNL'>('USD')
  const customAmount = ref('')

  // Exchange rate (USD → HNL)
  const exchangeRate = ref<number | null>(null)
  const exchangeRateLoading = ref(false)

  async function fetchExchangeRate() {
    if (exchangeRate.value !== null) return // already fetched
    exchangeRateLoading.value = true
    try {
      const data = await $fetch<{ rates: Record<string, number> }>('https://open.er-api.com/v6/latest/USD')
      exchangeRate.value = data.rates?.HNL ?? null
    } catch {
      exchangeRate.value = null
    } finally {
      exchangeRateLoading.value = false
    }
  }

  const amountInHNL = computed(() => {
    if (currency.value !== 'USD' || !amount.value || !exchangeRate.value) return null
    return Math.round(amount.value * exchangeRate.value * 100) / 100
  })
  const donor = ref<DonorInfo>({ firstName: '', lastName: '', email: '', phone: '' })
  const card = ref<CardInfo>({ number: '', expMonth: '', expYear: '', holderName: '', cvc: '' })

  const purpose = ref('')
  const loading = ref(false)
  const statusMessage = ref('')
  const errorMessage = ref('')
  const transactionId = ref('')
  const orderNumber = ref('')

  // Internal session state
  const sessionData = ref<{
    idTransaccionTodoMovil: string
    publicIp: string
    ddcSessionId: string
  }>({ idTransaccionTodoMovil: '', publicIp: '', ddcSessionId: '' })

  // Validation
  const formErrors = ref<Record<string, string>>({})

  function validateForm(): boolean {
    const errors: Record<string, string> = {}

    if (!amount.value || amount.value <= 0) {
      errors.amount = t('support.donate.payment.validation.amountRequired')
    } else if (amount.value < 1) {
      errors.amount = t('support.donate.payment.validation.amountMin')
    }

    if (!donor.value.firstName.trim()) {
      errors.firstName = t('support.donate.payment.validation.firstNameRequired')
    }
    if (!donor.value.lastName.trim()) {
      errors.lastName = t('support.donate.payment.validation.lastNameRequired')
    }
    if (!donor.value.email.trim()) {
      errors.email = t('support.donate.payment.validation.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(donor.value.email)) {
      errors.email = t('support.donate.payment.validation.emailInvalid')
    }

    const cardNum = card.value.number.replace(/\s/g, '')
    if (!cardNum) {
      errors.cardNumber = t('support.donate.payment.validation.cardNumberRequired')
    } else if (cardNum.length < 13 || cardNum.length > 19 || !/^\d+$/.test(cardNum)) {
      errors.cardNumber = t('support.donate.payment.validation.cardNumberInvalid')
    }

    if (!card.value.holderName.trim()) {
      errors.cardHolder = t('support.donate.payment.validation.cardHolderRequired')
    }

    if (!card.value.expMonth || !card.value.expYear) {
      errors.cardExpiry = t('support.donate.payment.validation.cardExpiryRequired')
    } else {
      const now = new Date()
      const expDate = new Date(parseInt(card.value.expYear), parseInt(card.value.expMonth), 0)
      if (expDate < now) {
        errors.cardExpiry = t('support.donate.payment.validation.cardExpired')
      }
    }

    if (!card.value.cvc.trim()) {
      errors.cvc = t('support.donate.payment.validation.cvcRequired')
    } else if (!/^\d{3,4}$/.test(card.value.cvc)) {
      errors.cvc = t('support.donate.payment.validation.cvcInvalid')
    }

    formErrors.value = errors
    return Object.keys(errors).length === 0
  }

  // Browser data for 3DS
  function collectBrowserData() {
    return {
      userAgent: navigator.userAgent,
      browserHeader: 'text/html',
      browserColorDepth: screen.colorDepth,
      browserScreenHeight: screen.height,
      browserScreenWidth: screen.width,
      browserTimeZone: new Date().getTimezoneOffset(),
    }
  }

  // DDC iframe (hidden, silent)
  function runDdcIframe(ddcJwt: string): Promise<string> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        cleanup()
        resolve('') // DDC timeout is non-fatal
      }, 10000)

      function onMessage(event: MessageEvent) {
        if (event.data && typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data)
            if (data.MessageType === 'profile.completed') {
              clearTimeout(timeout)
              cleanup()
              resolve(data.SessionId || '')
            }
          } catch {
            // Not JSON, ignore
          }
        }
      }

      function cleanup() {
        window.removeEventListener('message', onMessage)
        const container = document.getElementById('ddc-container')
        if (container) container.innerHTML = ''
      }

      window.addEventListener('message', onMessage)

      // Create hidden iframe + form
      const container = document.getElementById('ddc-container')
      if (!container) {
        resolve('')
        return
      }

      const iframe = document.createElement('iframe')
      iframe.name = 'ddc-iframe'
      iframe.style.display = 'none'
      container.appendChild(iframe)

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = 'https://centinelapistag.cardinalcommerce.com/V1/Cruise/Collect'
      form.target = 'ddc-iframe'

      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'JWT'
      input.value = ddcJwt
      form.appendChild(input)

      container.appendChild(form)
      form.submit()
    })
  }

  // Challenge iframe (visible)
  function runChallengeIframe(challengeJwt: string, stepUpUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error(t('support.donate.payment.error.timeout')))
      }, 300000) // 5 minutes

      function onMessage(event: MessageEvent) {
        if (event.data && typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data)
            if (data.MessageType === 'cca.complete' || data.MessageType === 'challenge.complete') {
              clearTimeout(timeout)
              cleanup()
              resolve()
            }
          } catch {
            // Not JSON, ignore
          }
        }
      }

      function cleanup() {
        window.removeEventListener('message', onMessage)
      }

      window.addEventListener('message', onMessage)

      // Build challenge iframe
      nextTick(() => {
        const container = document.getElementById('challenge-container')
        if (!container) {
          reject(new Error('Challenge container not found'))
          return
        }

        container.innerHTML = ''
        const iframe = document.createElement('iframe')
        iframe.name = 'challenge-iframe'
        iframe.style.width = '100%'
        iframe.style.height = '450px'
        iframe.style.border = 'none'
        container.appendChild(iframe)

        const form = document.createElement('form')
        form.method = 'POST'
        form.action = stepUpUrl
        form.target = 'challenge-iframe'

        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'JWT'
        input.value = challengeJwt
        form.appendChild(input)

        document.body.appendChild(form)
        form.submit()
        form.remove()
      })
    })
  }

  // Main payment flow
  async function submitDonation(): Promise<void> {
    if (!validateForm()) return

    step.value = 'processing'
    loading.value = true
    errorMessage.value = ''

    try {
      // Step 1: Initialize session
      // TodoPago always processes in HNL — convert USD amounts
      const payAmount = currency.value === 'USD' && amountInHNL.value
        ? amountInHNL.value
        : amount.value
      const payCurrency = 'HNL'

      statusMessage.value = t('support.donate.payment.processing.initializing')
      const initResult = await $fetch('/api/donate/init', {
        method: 'POST',
        body: { amount: payAmount, currency: payCurrency },
      })

      orderNumber.value = initResult.orderNumber
      sessionData.value.idTransaccionTodoMovil = initResult.idTransaccionTodoMovil || ''
      sessionData.value.publicIp = initResult.publicIp || ''

      // Step 2: Run DDC iframe
      step.value = 'ddc'
      statusMessage.value = t('support.donate.payment.processing.verifying')
      const ddcSessionId = await runDdcIframe(initResult.ddcJwt)
      sessionData.value.ddcSessionId = ddcSessionId

      // Step 3: Authorize (CmpiLookup)
      step.value = 'authorizing'
      statusMessage.value = t('support.donate.payment.processing.authorizing')
      const browserData = collectBrowserData()

      const authResult = await $fetch('/api/donate/authorize', {
        method: 'POST',
        body: {
          idTransaccionTodoMovil: sessionData.value.idTransaccionTodoMovil,
          orderNumber: orderNumber.value,
          cardNumber: card.value.number.replace(/\s/g, ''),
          cardExpMonth: card.value.expMonth,
          cardExpYear: card.value.expYear,
          billingFirstName: donor.value.firstName,
          billingLastName: donor.value.lastName,
          email: donor.value.email,
          mobilePhone: donor.value.phone.replace(/[^0-9]/g, '') || undefined,
          amount: payAmount,
          currency: payCurrency,
          ddcSessionId,
          ipAddress: sessionData.value.publicIp,
          ...browserData,
        },
      })

      let authFields: { tdsVer: string; cavvResp: string; cavvUcaf: string; directoryServerTranId: string }

      if (authResult.status === 'frictionless') {
        authFields = authResult.authFields!
      } else if (authResult.status === 'challenge') {
        // Step 3b: Show challenge
        step.value = 'challenge'
        statusMessage.value = t('support.donate.payment.processing.bankVerification')

        await runChallengeIframe(authResult.challengeJwt!, authResult.stepUpUrl!)

        // Complete authentication
        statusMessage.value = t('support.donate.payment.processing.authorizing')
        const authComplete = await $fetch('/api/donate/authenticate', {
          method: 'POST',
          body: {
            idTransaccionCardinal: authResult.transactionId,
            idTransaccionTodoMovil: sessionData.value.idTransaccionTodoMovil,
          },
        })

        if (authComplete.status !== 'authenticated') {
          throw new Error(t('support.donate.payment.error.cardDeclined'))
        }
        authFields = authComplete.authFields!
      } else {
        throw new Error(t('support.donate.payment.error.cardDeclined'))
      }

      // Step 4: Pay
      step.value = 'paying'
      statusMessage.value = t('support.donate.payment.processing.processingPayment')

      const payResult = await $fetch('/api/donate/pay', {
        method: 'POST',
        body: {
          orderNumber: orderNumber.value,
          cardNumber: card.value.number.replace(/\s/g, ''),
          cardExpMonth: card.value.expMonth,
          cardExpYear: card.value.expYear,
          cardHolderName: card.value.holderName,
          cvc: card.value.cvc,
          amount: payAmount,
          currency: payCurrency,
          authFields,
          donorName: `${donor.value.firstName} ${donor.value.lastName}`.trim(),
          donorEmail: donor.value.email,
          donorPhone: donor.value.phone || undefined,
          purpose: purpose.value || 'general',
          idTransaccionTodoMovil: sessionData.value.idTransaccionTodoMovil,
          locale: locale.value,
          // Original USD info for email receipt
          ...(currency.value === 'USD' && exchangeRate.value ? {
            originalAmountUSD: amount.value,
            exchangeRate: exchangeRate.value,
          } : {}),
        },
      })

      if (payResult.success) {
        transactionId.value = payResult.transactionId || ''
        step.value = 'success'
        // Clear card data from memory
        card.value = { number: '', expMonth: '', expYear: '', holderName: '', cvc: '' }
      } else {
        throw new Error(t('support.donate.payment.error.generic'))
      }
    } catch (e: any) {
      errorMessage.value = e.data?.message || e.message || t('support.donate.payment.error.generic')
      step.value = 'error'
    } finally {
      loading.value = false
    }
  }

  function resetForm(): void {
    step.value = 'form'
    amount.value = 0
    customAmount.value = ''
    donor.value = { firstName: '', lastName: '', email: '', phone: '' }
    card.value = { number: '', expMonth: '', expYear: '', holderName: '', cvc: '' }
    loading.value = false
    statusMessage.value = ''
    errorMessage.value = ''
    transactionId.value = ''
    orderNumber.value = ''
    formErrors.value = {}
    sessionData.value = { idTransaccionTodoMovil: '', publicIp: '', ddcSessionId: '' }
  }

  function reset(): void {
    resetForm()
    purpose.value = ''
  }

  function setPresetAmount(preset: number): void {
    amount.value = preset
    customAmount.value = ''
    formErrors.value = { ...formErrors.value, amount: '' }
  }

  function setCustomAmount(value: string): void {
    customAmount.value = value
    const parsed = parseFloat(value)
    amount.value = isNaN(parsed) || parsed <= 0 ? 0 : parsed
    if (amount.value > 0) {
      formErrors.value = { ...formErrors.value, amount: '' }
    }
  }

  function formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement
    let value = input.value.replace(/\D/g, '')
    if (value.length > 16) value = value.slice(0, 16)
    // Format with spaces every 4 digits
    const parts = value.match(/.{1,4}/g)
    card.value.number = parts ? parts.join(' ') : value
  }

  const formattedAmount = computed(() => {
    if (!amount.value) return ''
    const symbol = currency.value === 'USD' ? '$' : 'L'
    return `${symbol}${amount.value.toFixed(2)} ${currency.value}`
  })

  const monthOptions = computed(() => {
    return Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
  })

  const yearOptions = computed(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: 10 }, (_, i) => String(currentYear + i))
  })

  return {
    step,
    amount,
    currency,
    customAmount,
    donor,
    card,
    purpose,
    loading,
    statusMessage,
    errorMessage,
    transactionId,
    orderNumber,
    formErrors,
    formattedAmount,
    monthOptions,
    yearOptions,
    exchangeRate,
    exchangeRateLoading,
    amountInHNL,
    fetchExchangeRate,
    submitDonation,
    reset,
    resetForm,
    setPresetAmount,
    setCustomAmount,
    formatCardNumber,
    validateForm,
  }
}
