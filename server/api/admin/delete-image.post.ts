import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { v2 as cloudinary } from 'cloudinary'

// Known Cloudinary single-value transformation prefixes
const TRANSFORM_PREFIXES = new Set([
  'a', 'ac', 'af', 'ar', 'b', 'bo', 'c', 'co', 'cs', 'cu', 'd', 'dl',
  'dn', 'dpr', 'du', 'e', 'eo', 'f', 'fl', 'fn', 'fps', 'g', 'h', 'if',
  'ki', 'l', 'o', 'p', 'pg', 'q', 'r', 'so', 'sp', 't', 'u', 'vc', 'vs',
  'w', 'x', 'y', 'z', 'ac', 'br', 'sp',
])

function isTransformSegment(seg: string): boolean {
  // Comma-joined transforms: q_auto,f_auto,w_2000
  if (seg.includes(',')) return true
  // Single transform: q_auto, f_auto, c_limit, w_2000, etc.
  const underscoreIdx = seg.indexOf('_')
  if (underscoreIdx > 0) {
    const prefix = seg.substring(0, underscoreIdx).toLowerCase()
    return TRANSFORM_PREFIXES.has(prefix)
  }
  return false
}

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

    // Filter out version segments and transformation segments
    const filtered = segments.filter((seg) => {
      if (/^v\d+$/.test(seg)) return false
      if (isTransformSegment(seg)) return false
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
  console.log('[Cloudinary] Delete request — url:', url, '→ publicId:', publicId)
  if (!publicId) {
    console.warn('[Cloudinary] Could not extract public_id from URL:', url)
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

  // Delete from Cloudinary
  try {
    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true })
    console.log('[Cloudinary] Destroy result for', publicId, ':', JSON.stringify(result))
  }
  catch (e: any) {
    console.error('[Cloudinary] Failed to delete image:', publicId, e.message)
  }

  return { success: true }
})
