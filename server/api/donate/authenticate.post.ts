import {
  getTodopagoToken,
  getTodopagoConfig,
  todopagoFetch,
} from '../../utils/todopago'

interface CmpiAuthenticateResponse {
  code: number
  message: string | null
  data: {
    cardinalMPI: {
      cardBin: string | null
      threeDSVersion: string | null
      signatureVerification: string | null
      errorDesc: string | null
      threeDSServerTransactionId: string | null
      cavv: string | null
      amount: number
      errorNo: string | null
      interactionCounter: string | null
      eciFlag: string | null
      transactionId: string | null
      currencyCode: string | null
      acsTransactionId: string | null
      dsTransactionId: string | null
      authenticationType: string | null
      cardBrand: string | null
      paResStatus: string | null
      challengeCancel: string | null
      warning: string | null
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { idTransaccionCardinal, idTransaccionTodoMovil } = body

  if (!idTransaccionCardinal || !idTransaccionTodoMovil) {
    throw createError({ statusCode: 400, message: 'Missing transaction IDs' })
  }

  const config = useRuntimeConfig()
  const tpConfig = getTodopagoConfig(config)

  try {
    const { token } = await getTodopagoToken(tpConfig)

    const response = await todopagoFetch<CmpiAuthenticateResponse>(
      tpConfig,
      '/3DS/api/v1/TodoMovil/GestorAutorizacion/EjecutarCmpiAuthenticate',
      token,
      {
        idMerchant: tpConfig.merchantId,
        idTransaccionCardinal,
        idTransaccionTodoMovil,
      },
    )

    const mpi = response.data?.cardinalMPI
    if (!mpi) {
      throw new Error(response.message || 'Authentication failed: no response data')
    }

    // Check if authentication was successful (cavv must be present)
    if (!mpi.cavv) {
      throw new Error(mpi.errorDesc || 'Authentication denied by issuer')
    }

    return {
      status: 'authenticated' as const,
      authFields: {
        tdsVer: mpi.threeDSVersion || '',
        cavvResp: mpi.eciFlag || '',
        cavvUcaf: mpi.cavv || '',
        directoryServerTranId: mpi.dsTransactionId || '',
      },
    }
  } catch (e: any) {
    console.error('Donation authenticate error:', e)
    throw createError({
      statusCode: e.statusCode || 502,
      message: e.message || 'Payment authentication failed',
    })
  }
})
