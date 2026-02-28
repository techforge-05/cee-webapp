import { createHash } from 'crypto'
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

  const body = await readBody(event)
  const folder = body?.folder || 'cee-assets/general'

  const config = useRuntimeConfig()

  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw createError({ statusCode: 500, message: 'Cloudinary not configured' })
  }

  const timestamp = Math.round(Date.now() / 1000)

  // Sign only folder + timestamp (Cloudinary requires all signed params to match)
  const toSign = `folder=${folder}&timestamp=${timestamp}${config.cloudinaryApiSecret}`
  const signature = createHash('sha1').update(toSign).digest('hex')

  return {
    signature,
    timestamp,
    apiKey: config.cloudinaryApiKey,
    cloudName: config.cloudinaryCloudName,
    folder,
  }
})
