import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { v2 as cloudinary } from 'cloudinary'

function extractCloudinaryPublicId(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (!parsed.hostname.endsWith('cloudinary.com')) {
      return null
    }

    const path = parsed.pathname
    const uploadIndex = path.indexOf('/upload/')
    if (uploadIndex === -1) return null

    const afterUpload = path.substring(uploadIndex + '/upload/'.length)
    const segments = afterUpload.split('/')

    // Filter out version segments (v1234567890) and transformation segments (contain commas or match transform pattern)
    const filtered = segments.filter((seg) => {
      if (/^v\d+$/.test(seg)) return false
      if (seg.includes(',')) return false
      if (/^[a-z]_[a-z0-9:.]+$/i.test(seg)) return false
      return true
    })

    if (filtered.length === 0) return null

    // Rejoin and strip file extension from last segment
    const fullPath = filtered.join('/')
    const lastDotIndex = fullPath.lastIndexOf('.')
    if (lastDotIndex === -1) return fullPath
    return fullPath.substring(0, lastDotIndex)
  }
  catch {
    return null
  }
}

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
  const { url } = await readBody<{ url: string }>(event)
  if (!url) {
    return { success: true }
  }

  // Extract public_id
  const publicId = extractCloudinaryPublicId(url)
  if (!publicId) {
    return { success: true }
  }

  // Configure Cloudinary
  const config = useRuntimeConfig()

  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    console.warn('[Cloudinary] Not configured, skipping delete for:', publicId)
    return { success: true }
  }

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  // Delete from Cloudinary (fire-and-forget — never fail the request)
  try {
    await cloudinary.uploader.destroy(publicId, { invalidate: true })
  }
  catch (e: any) {
    console.warn('[Cloudinary] Failed to delete image:', publicId, e.message)
  }

  return { success: true }
})
