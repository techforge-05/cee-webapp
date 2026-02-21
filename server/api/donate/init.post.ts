import {
  getTodopagoToken,
  getTodopagoConfig,
  formatAmountInt,
  currencyToCode,
  generateOrderNumber,
  todopagoFetch,
} from '../../utils/todopago'

interface DdcResponse {
  code: number
  message: string | null
  data: {
    jwtCardinal: string | null
    idTransaccionTodoMovil: string | null
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { amount, currency } = body

  if (!amount || amount <= 0) {
    throw createError({ statusCode: 400, message: 'Invalid amount' })
  }

  if (!['USD', 'HNL'].includes(currency)) {
    throw createError({ statusCode: 400, message: 'Invalid currency. Must be USD or HNL' })
  }

  const config = useRuntimeConfig()
  const tpConfig = getTodopagoConfig(config)

  if (!tpConfig.username || !tpConfig.password) {
    throw createError({ statusCode: 500, message: 'Payment service not configured' })
  }

  try {
    // Step 1: Get public IP
    const ipResponse = await $fetch<{ ip: string }>('https://api.ipify.org/?format=json')
    const publicIp = ipResponse.ip

    // Step 2: Login to TodoMovil (uses cache)
    const { token } = await getTodopagoToken(tpConfig)

    // Step 3: Generate order number
    const orderNumber = generateOrderNumber()

    // Step 4: Get DDC JWT
    const ddcResponse = await todopagoFetch<DdcResponse>(
      tpConfig,
      '/3DS/api/v1/TodoMovil/GestorAutorizacion/ObtenerJwtTokenDdc',
      token,
      {
        orderNumber,
        amount: formatAmountInt(amount),
        currencyCode: currencyToCode(currency),
        idMerchant: tpConfig.merchantId,
      },
    )

    if (!ddcResponse.data?.jwtCardinal) {
      throw new Error(ddcResponse.message || 'Failed to obtain DDC JWT')
    }

    return {
      ddcJwt: ddcResponse.data.jwtCardinal,
      idTransaccionTodoMovil: ddcResponse.data.idTransaccionTodoMovil,
      orderNumber,
      publicIp,
    }
  } catch (e: any) {
    console.error('Donation init error:', e)
    throw createError({
      statusCode: e.statusCode || 502,
      message: e.message || 'Payment initialization failed',
    })
  }
})
