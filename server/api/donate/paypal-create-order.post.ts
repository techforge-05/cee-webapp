import { getPayPalAccessToken, getPayPalBaseUrl } from '../../utils/paypal'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { amount, currency } = body

  if (!amount || !currency) {
    throw createError({ statusCode: 400, message: 'Amount and currency are required' })
  }

  const parsedAmount = parseFloat(amount)
  if (isNaN(parsedAmount) || parsedAmount < 1) {
    throw createError({ statusCode: 400, message: 'Invalid amount' })
  }

  const accessToken = await getPayPalAccessToken()
  const baseUrl = getPayPalBaseUrl()

  const orderResponse = await $fetch<{ id: string; status: string }>(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: parsedAmount.toFixed(2),
        },
      }],
    },
  })

  if (!orderResponse.id) {
    throw createError({ statusCode: 500, message: 'Failed to create PayPal order' })
  }

  return { orderId: orderResponse.id }
})
