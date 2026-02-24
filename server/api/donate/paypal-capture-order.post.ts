import { serverSupabaseClient } from '#supabase/server'
import { createTransport } from 'nodemailer'
import { getDonationConfirmationSubject, getDonationConfirmationHtml } from '../../utils/emailTemplates'
import type { EmailLocale } from '../../utils/emailTemplates'
import { getPayPalAccessToken, getPayPalBaseUrl, generatePayPalOrderNumber } from '../../utils/paypal'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { orderId, donorName, donorEmail, purpose, locale } = body

  if (!orderId) {
    throw createError({ statusCode: 400, message: 'PayPal order ID is required' })
  }

  const accessToken = await getPayPalAccessToken()
  const baseUrl = getPayPalBaseUrl()

  // Capture the payment
  const captureResponse = await $fetch<{
    id: string
    status: string
    purchase_units: Array<{
      payments: {
        captures: Array<{
          id: string
          amount: { currency_code: string; value: string }
          status: string
        }>
      }
    }>
  }>(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (captureResponse.status !== 'COMPLETED') {
    throw createError({ statusCode: 400, message: 'Payment was not completed' })
  }

  const capture = captureResponse.purchase_units?.[0]?.payments?.captures?.[0]
  if (!capture) {
    throw createError({ statusCode: 500, message: 'Could not find capture details' })
  }

  const config = useRuntimeConfig()
  const supabase = await serverSupabaseClient(event)

  const orderNumber = generatePayPalOrderNumber()
  const amount = parseFloat(capture.amount.value)
  const currency = capture.amount.currency_code

  // Insert donation record
  const { error: insertError } = await supabase
    .from('donations')
    .insert({
      order_number: orderNumber,
      amount,
      currency,
      donor_name: donorName || 'PayPal Donor',
      donor_email: donorEmail || '',
      purpose: purpose || 'general',
      payment_method: 'paypal',
      transaction_id: capture.id,
      status: 'completed',
    })

  if (insertError) {
    console.error('Failed to insert PayPal donation record:', insertError)
    throw createError({ statusCode: 500, message: 'Failed to record donation' })
  }

  // Send confirmation email
  if (donorEmail && config.gmailUser && config.gmailAppPassword) {
    try {
      const emailLocale: EmailLocale = locale === 'en' ? 'en' : 'es'
      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: config.gmailUser,
          pass: config.gmailAppPassword,
        },
      })

      const currencySymbol = currency === 'USD' ? '$' : 'L'
      const baseUrl = getRequestURL(event).origin
      await transporter.sendMail({
        from: `"CEE Honduras" <${config.gmailUser}>`,
        to: donorEmail,
        subject: getDonationConfirmationSubject(emailLocale),
        html: getDonationConfirmationHtml(emailLocale, {
          donorName: donorName || 'Donor',
          amount: `${currencySymbol}${amount.toFixed(2)} ${currency}`,
          orderNumber,
          transactionId: capture.id,
          purpose: purpose || undefined,
          baseUrl,
        }),
      })
    } catch (emailErr) {
      console.error('Failed to send PayPal donation confirmation email:', emailErr)
    }
  }

  return {
    success: true,
    orderNumber,
    transactionId: capture.id,
  }
})
