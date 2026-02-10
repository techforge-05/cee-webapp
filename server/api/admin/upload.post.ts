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
    .select('role')
    .eq('id', userId)
    .single()

  if (!profile) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  // Read multipart form data
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const file = formData.find((f) => f.name === 'file')
  const folderField = formData.find((f) => f.name === 'folder')

  if (!file || !file.data) {
    throw createError({ statusCode: 400, message: 'No file found' })
  }

  // Validate file type
  if (!file.type?.startsWith('image/')) {
    throw createError({ statusCode: 400, message: 'Only image files are allowed' })
  }

  // Validate file size (10MB max)
  if (file.data.length > 10 * 1024 * 1024) {
    throw createError({ statusCode: 400, message: 'File size exceeds 10MB limit' })
  }

  const folder = folderField?.data?.toString() || 'cee-assets/general'

  // Configure Cloudinary
  const config = useRuntimeConfig()

  if (!config.cloudinaryCloudName || !config.cloudinaryApiKey || !config.cloudinaryApiSecret) {
    throw createError({ statusCode: 500, message: 'Cloudinary not configured' })
  }

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  // Upload to Cloudinary
  try {
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        },
      )
      uploadStream.end(file.data)
    })

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch (e: any) {
    throw createError({
      statusCode: 502,
      message: e.message || 'Image upload failed',
    })
  }
})
