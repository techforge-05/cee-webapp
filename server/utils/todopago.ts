export interface TodopagoConfig {
  baseUrl: string
  username: string
  password: string
  merchantId: string
  terminalId: string
}

// Token cache with TTL
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getTodopagoToken(config: TodopagoConfig): Promise<{ token: string; idTransaccion?: string }> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return { token: cachedToken.token }
  }

  const loginUrl = `${config.baseUrl}/3DS/api/v1/Auth/Security/Login`
  console.log('[TodoPago] Login attempt:', loginUrl, 'user:', config.username)

  try {
    const response = await $fetch<{
      estado: string
      usuario: string
      token: string
      expiration: string
    }>(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        userName: config.username,
        password: config.password,
      },
    })

    console.log('[TodoPago] Login response:', JSON.stringify(response))

    if (!response.token) {
      throw new Error('TodoMovil login failed: no token returned')
    }

    // Cache for 50 minutes (tokens typically valid ~60 min)
    cachedToken = {
      token: response.token,
      expiresAt: Date.now() + 50 * 60 * 1000,
    }

    return { token: response.token }
  } catch (e: any) {
    // Log the full error details for debugging
    console.error('[TodoPago] Login failed:', {
      url: loginUrl,
      status: e.statusCode || e.status,
      message: e.message,
      data: e.data,
      response: e.response?._data,
    })
    throw e
  }
}

export function clearTokenCache(): void {
  cachedToken = null
}

export async function todopagoFetch<T = any>(
  config: TodopagoConfig,
  path: string,
  token: string,
  body: Record<string, any>,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  return $fetch<T>(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body,
  })
}

/** Convert float amount to integer (100.00 → 10000) for 3DS APIs */
export function formatAmountInt(amount: number): number {
  return Math.round(amount * 100)
}

/** Map currency code to 3DS numeric code */
export function currencyToCode(currency: string): string {
  return currency === 'USD' ? '840' : '340'
}

/** Generate unique order number */
export function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CEE-DON-${date}-${random}`
}

/** Get TodoPago config from runtime config */
export function getTodopagoConfig(runtimeConfig: any): TodopagoConfig {
  return {
    baseUrl: runtimeConfig.todopagoBaseUrl,
    username: runtimeConfig.todopagoUsername,
    password: runtimeConfig.todopagoPassword,
    merchantId: runtimeConfig.todopagoMerchantId,
    terminalId: runtimeConfig.todopagoTerminalId,
  }
}
