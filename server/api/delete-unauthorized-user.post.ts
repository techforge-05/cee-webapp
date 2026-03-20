import { serverSupabaseServiceRole } from '#supabase/server'

// Deletes the given user from auth.users only if they have no user_profiles record
// (i.e. they signed in with Google but were never invited).
// Safety: refuses to delete any user that already has a profile.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId } = body

  if (!userId) {
    throw createError({ statusCode: 400, message: 'Missing userId' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = serverSupabaseServiceRole(event) as any

  // Safety check: only delete users with no profile
  const { data: profile } = await adminSupabase
    .from('user_profiles')
    .select('id')
    .eq('id', userId)
    .single()

  if (profile) {
    throw createError({ statusCode: 403, message: 'User has a profile and cannot be deleted this way' })
  }

  const { error } = await adminSupabase.auth.admin.deleteUser(userId)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
