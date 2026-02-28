export interface TodopagoConfig {
  baseUrl: string
  username: string
  password: string
  merchantId: string
  terminalId: string
  payUser: string
  payPassword: string
}

// Token cache with TTL
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getTodopagoToken(config: TodopagoConfig): Promise<{ token: string; idTransaccion?: string }> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return { token: cachedToken.token }
  }

  const loginUrl = `${config.baseUrl}/3DS/api/v1/Auth/Security/Login`

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

    if (!response.token) {
      throw new Error('TodoMovil login failed: no token returned')
    }

    // Use actual expiration from response, with 1-minute buffer
    const expiresAt = response.expiration
      ? new Date(response.expiration).getTime() - 60 * 1000
      : Date.now() + 8 * 60 * 1000 // fallback: 8 minutes
    cachedToken = {
      token: response.token,
      expiresAt,
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
  try {
    return await $fetch<T>(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
      body,
    })
  } catch (e: any) {
    // If 401, clear cached token and retry with a fresh one
    if (e.statusCode === 401 || e.status === 401) {
      clearTokenCache()
      const { token: freshToken } = await getTodopagoToken(config)
      return $fetch<T>(`${config.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${freshToken}`,
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
        body,
      })
    }
    throw e
  }
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
    payUser: runtimeConfig.todopagoPayUser,
    payPassword: runtimeConfig.todopagoPayPassword,
  }
}
