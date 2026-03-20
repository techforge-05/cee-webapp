import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

// Deletes the currently authenticated user from auth.users when they have no
// user_profiles record (i.e. they signed in with Google but were never invited).
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = serverSupabaseServiceRole(event) as any
  const { error } = await adminSupabase.auth.admin.deleteUser(user.id)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return { success: true }
})
