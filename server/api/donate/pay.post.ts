import { serverSupabaseClient } from '#supabase/server'
import { createTransport } from 'nodemailer'
import {
  getTodopagoToken,
  getTodopagoConfig,
} from '../../utils/todopago'
import { getDonationConfirmationSubject, getDonationConfirmationHtml } from '../../utils/emailTemplates'
import type { EmailLocale } from '../../utils/emailTemplates'

interface DirectPaymentResponse {
  status: number
  message: string | null
  ok: boolean
  data: {
    transaccionID: number
    processorCode: string | null
    voucher: Array<{ name: string | null; value: string | null }>
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    orderNumber,
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardHolderName,
    cvc,
    amount,
    currency,
    authFields,
    donorName,
    donorEmail,
    donorPhone,
    purpose,
    idTransaccionTodoMovil,
    locale,
    originalAmountUSD,
    exchangeRate: exRate,
  } = body

  // Validate required fields
  if (!orderNumber || !cardNumber || !cardExpMonth || !cardExpYear || !cvc || !amount || !authFields) {
    throw createError({ statusCode: 400, message: 'Missing required payment fields' })
  }

  if (!authFields.tdsVer || !authFields.cavvUcaf || !authFields.directoryServerTranId) {
    throw createError({ statusCode: 400, message: 'Missing 3DS authorization fields' })
  }

  const config = useRuntimeConfig()
  const tpConfig = getTodopagoConfig(config)
  const supabase = await serverSupabaseClient(event)

  // Insert pending donation record
  const { error: insertError } = await supabase
    .from('donations')
    .insert({
      order_number: orderNumber,
      amount,
      currency,
      donor_name: donorName || 'Anonymous',
      donor_email: donorEmail || '',
      donor_phone: donorPhone || null,
      purpose: purpose || 'general',
      payment_method: 'card',
      status: 'pending',
    })

  if (insertError) {
    console.error('Failed to insert donation record:', insertError)
  }

  try {
    const { token } = await getTodopagoToken(tpConfig)

    const payBody = {
      user: tpConfig.payUser || tpConfig.username,
      password: tpConfig.payPassword || tpConfig.password,
      accountNumber: cardNumber.replace(/\s/g, ''),
      amount: parseFloat(Number(amount).toFixed(2)),
      taxes: 0,
      cardHolderName: cardHolderName || donorName || 'N/A',
      comment: `Donation to CEE - ${orderNumber} - Purpose: ${purpose || 'general'}`,
      customerName: donorName || 'Donor',
      cvc: String(cvc),
      expirationMonth: String(cardExpMonth),
      expirationYear: String(cardExpYear).slice(-2),
      externalReference: orderNumber,
      customerEmail: donorEmail || 'noreply@cee.edu.hn',
      terminalNbr: tpConfig.terminalId,
      currency: currency === 'USD' ? 'USD' : 'HNL',
      tdsVer: authFields.tdsVer,
      cavvResp: authFields.cavvResp,
      cavvUcaf: authFields.cavvUcaf,
      directoryServerTranId: authFields.directoryServerTranId,
      ...(idTransaccionTodoMovil ? { idTransaccion: idTransaccionTodoMovil } : {}),
    }

    const payResponse = await $fetch<DirectPaymentResponse>(
      `${tpConfig.baseUrl}/api/v1/Todopago/GestorPagos/DirectPayment`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Tenant': 'HNTP',
          'X-Content': 'json',
        },
        body: payBody,
      },
    )

    if (!payResponse.ok) {
      // Update donation as failed
      await supabase
        .from('donations')
        .update({
          status: 'failed',
          todopago_response: payResponse as any,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', orderNumber)

      throw new Error(payResponse.message || 'Payment was declined')
    }

    // Update donation as completed
    await supabase
      .from('donations')
      .update({
        status: 'completed',
        transaction_id: String(payResponse.data?.transaccionID || ''),
        authorization_code: payResponse.data?.processorCode || null,
        todopago_response: payResponse as any,
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', orderNumber)

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

        const baseUrl = getRequestURL(event).origin
        await transporter.sendMail({
          from: `"CEE Honduras" <${config.gmailUser}>`,
          to: donorEmail,
          subject: getDonationConfirmationSubject(emailLocale),
          html: getDonationConfirmationHtml(emailLocale, {
            donorName: donorName || 'Donor',
            amount: `L${Number(amount).toFixed(2)} HNL`,
            orderNumber,
            transactionId: String(payResponse.data?.transaccionID || ''),
            purpose: purpose || undefined,
            baseUrl,
            ...(originalAmountUSD && exRate ? {
              originalAmountUSD: Number(originalAmountUSD),
              exchangeRate: Number(exRate),
            } : {}),
          }),
        })
      } catch (emailErr) {
        console.error('Failed to send donation confirmation email:', emailErr)
        // Don't throw - payment was successful, email failure is non-critical
      }
    }

    return {
      success: true,
      transactionId: String(payResponse.data?.transaccionID || ''),
      processorCode: payResponse.data?.processorCode || '',
    }
  } catch (e: any) {
    // Update donation as failed if not already updated
    await supabase
      .from('donations')
      .update({
        status: 'failed',
        todopago_response: { error: e.message } as any,
        updated_at: new Date().toISOString(),
      })
      .eq('order_number', orderNumber)
      .eq('status', 'pending')

    console.error('Donation payment error:', e.message, 'status:', e.statusCode || e.status, 'response:', JSON.stringify(e.data || e.response?._data))
    throw createError({
      statusCode: e.statusCode || 502,
      message: e.message || 'Payment processing failed',
    })
  }
})
