import {
  getTodopagoToken,
  getTodopagoConfig,
  todopagoFetch,
  formatAmountInt,
  currencyToCode,
} from '../../utils/todopago'

interface CmpiLookupResponse {
  code: number
  message: string | null
  data: {
    cardinalMPI: {
      acsOperatorID: string | null
      errorNo: string | null
      payload: string | null
      errorDesc: string | null
      cavv: string | null
      paResStatus: string | null
      authorizationPayload: string | null
      enrolled: string | null
      acsTransactionId: string | null
      eciFlag: string | null
      acsUrl: string | null
      threeDSServerTransactionId: string | null
      cardBin: string | null
      cardBrand: string | null
      amount: number
      dsTransactionId: string | null
      threeDSVersion: string | null
      currencyCode: string | null
      orderId: string | null
      challengeRequired: string | null
      signatureVerification: string | null
      warning: string | null
      transactionId: string | null
      stepUpUrl: string | null
    }
  }
}

interface ChallengeJwtResponse {
  code: number
  message: string | null
  data: {
    jwtCardinal: string | null
    idTransaccion: string | null
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    idTransaccionTodoMovil,
    orderNumber,
    cardNumber,
    cardExpMonth,
    cardExpYear,
    billingFirstName,
    billingLastName,
    email,
    mobilePhone,
    amount,
    currency,
    ddcSessionId,
    userAgent,
    browserHeader,
    browserColorDepth,
    browserScreenHeight,
    browserScreenWidth,
    browserTimeZone,
    ipAddress,
  } = body

  // Validate required fields
  if (!cardNumber || !cardExpMonth || !cardExpYear || !billingFirstName || !email || !amount || !orderNumber) {
    throw createError({ statusCode: 400, message: 'Missing required payment fields' })
  }

  const config = useRuntimeConfig()
  const tpConfig = getTodopagoConfig(config)

  try {
    const { token } = await getTodopagoToken(tpConfig)

    // Execute CmpiLookup
    const lookupResponse = await todopagoFetch<CmpiLookupResponse>(
      tpConfig,
      '/3DS/api/v1/TodoMovil/GestorAutorizacion/EjecutarCmpilookup',
      token,
      {
        idMerchant: tpConfig.merchantId,
        idTransaccionTodoMovil,
        mobilePhone: mobilePhone || 'N/A',
        orderNumber,
        cardNumber: cardNumber.replace(/\s/g, ''),
        cardExpMonth,
        cardExpYear,
        billingAddress: 'N/A',
        billingFirstName,
        billingLastName: billingLastName || billingFirstName,
        userAgent: userAgent || 'Mozilla/5.0',
        dfReferenceId: ddcSessionId || 'N/A',
        browserHeader: browserHeader || 'text/html',
        browserColorDepth: browserColorDepth || 24,
        browserScreenHeight: browserScreenHeight || 1080,
        browserScreenWidth: browserScreenWidth || 1920,
        browserTimeZone: browserTimeZone || new Date().getTimezoneOffset(),
        currencyCode: currencyToCode(currency),
        amount: formatAmountInt(amount),
        deviceChannel: '02',
        email,
        ipAddress: ipAddress || '0.0.0.0',
        transactionMode: 'S',
        acsWindowSize: '05',
      },
    )

    const mpi = lookupResponse.data?.cardinalMPI
    if (!mpi) {
      throw new Error(lookupResponse.message || 'Authorization failed: no response data')
    }

    // Check if frictionless (no challenge needed)
    if (mpi.challengeRequired !== 'Y' && mpi.cavv) {
      return {
        status: 'frictionless' as const,
        authFields: {
          tdsVer: mpi.threeDSVersion || '',
          cavvResp: mpi.eciFlag || '',
          cavvUcaf: mpi.cavv || '',
          directoryServerTranId: mpi.dsTransactionId || '',
        },
        idTransaccionTodoMovil,
      }
    }

    // Challenge required
    if (mpi.challengeRequired === 'Y' || mpi.stepUpUrl) {
      // Get challenge JWT
      const challengeResponse = await todopagoFetch<ChallengeJwtResponse>(
        tpConfig,
        '/3DS/api/v1/TodoMovil/GestorAutorizacion/ObtenerJwtTokenChallenge',
        token,
        {
          referenceId: ddcSessionId || 'N/A',
          idMerchant: tpConfig.merchantId,
          acsUrl: mpi.acsUrl || '',
          payload: mpi.payload || '',
          idTransaccionCardinal: mpi.transactionId || '',
          idTransaccionTodoMovil,
        },
      )

      if (!challengeResponse.data?.jwtCardinal) {
        throw new Error('Failed to obtain challenge JWT')
      }

      return {
        status: 'challenge' as const,
        challengeJwt: challengeResponse.data.jwtCardinal,
        stepUpUrl: mpi.stepUpUrl || mpi.acsUrl || '',
        transactionId: mpi.transactionId || '',
        idTransaccionTodoMovil,
      }
    }

    // Authorization failed (no cavv, no challenge)
    throw new Error(mpi.errorDesc || 'Authorization denied by issuer')
  } catch (e: any) {
    console.error('Donation authorize error:', e)
    throw createError({
      statusCode: e.statusCode || 502,
      message: e.message || 'Payment authorization failed',
    })
  }
})
