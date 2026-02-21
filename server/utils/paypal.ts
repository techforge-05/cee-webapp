// Token cache with TTL
let cachedToken: { token: string; expiresAt: number } | null = null

export function getPayPalBaseUrl(): string {
  const config = useRuntimeConfig()
  return config.paypalMode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const config = useRuntimeConfig()
  const clientId = config.public.paypalClientId
  const clientSecret = config.paypalClientSecret

  if (!clientId || !clientSecret) {
    throw createError({ statusCode: 500, message: 'PayPal credentials not configured' })
  }

  const baseUrl = getPayPalBaseUrl()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await $fetch<{ access_token: string; expires_in: number }>(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.access_token) {
    throw createError({ statusCode: 500, message: 'Failed to get PayPal access token' })
  }

  // Cache token, expire 5 minutes early
  cachedToken = {
    token: response.access_token,
    expiresAt: Date.now() + (response.expires_in - 300) * 1000,
  }

  return response.access_token
}

/** Generate unique order number for PayPal donations */
export function generatePayPalOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `CEE-PP-${date}-${random}`
}
