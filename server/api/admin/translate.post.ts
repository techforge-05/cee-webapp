import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verify authenticated user
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Verify admin role
  const userId = user.id ?? (user as any).sub
  const supabase = await serverSupabaseClient(event)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, status')
    .eq('id', userId)
    .single()

  if (!profile || !['super_admin', 'admin'].includes(profile.role) || profile.status !== 'active') {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  // Parse body
  const body = await readBody(event)
  const { text, from, to } = body

  if (!text || !from || !to) {
    throw createError({ statusCode: 400, message: 'Missing required fields: text, from, to' })
  }

  if (!['es', 'en'].includes(from) || !['es', 'en'].includes(to)) {
    throw createError({ statusCode: 400, message: 'Invalid language codes. Use "es" or "en"' })
  }

  // Call MyMemory Translation API (free, no API key needed)
  try {
    const langPair = `${from}|${to}`
    const response: any = await $fetch(
      `https://api.mymemory.translated.net/get`,
      {
        params: {
          q: text,
          langpair: langPair,
        },
      },
    )

    if (response.responseStatus !== 200) {
      throw new Error(response.responseDetails || 'Translation failed')
    }

    return {
      translatedText: response.responseData.translatedText,
    }
  } catch (e: any) {
    throw createError({
      statusCode: 502,
      message: e.message || 'Translation service error',
    })
  }
})
