import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { v2 as cloudinary } from 'cloudinary'

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

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  const timestamp = Math.round(Date.now() / 1000)
  const params = {
    timestamp,
    folder,
    transformation: 'q_auto,f_auto',
    eager: 'q_auto:good,f_auto,w_2000,c_limit',
    eager_async: 'false',
  }

  const signature = cloudinary.utils.api_sign_request(params, config.cloudinaryApiSecret)

  return {
    signature,
    timestamp,
    apiKey: config.cloudinaryApiKey,
    cloudName: config.cloudinaryCloudName,
    folder,
  }
})
