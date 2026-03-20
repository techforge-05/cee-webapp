import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verify authenticated caller
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = serverSupabaseServiceRole(event) as any
  const callerId = user.id ?? (user as any).sub

  // Verify caller is super_admin
  const { data: callerProfile } = await adminSupabase
    .from('user_profiles')
    .select('role')
    .eq('id', callerId)
    .single()

  if (!callerProfile || callerProfile.role !== 'super_admin') {
    throw createError({ statusCode: 403, message: 'Only super admins can delete users' })
  }

  const { userId: targetUserId } = await readBody(event)

  if (!targetUserId) {
    throw createError({ statusCode: 400, message: 'Missing userId' })
  }

  if (targetUserId === callerId) {
    throw createError({ statusCode: 400, message: 'Cannot delete your own account' })
  }

  // Delete permissions and profile first, then the auth user
  await adminSupabase.from('user_permissions').delete().eq('user_id', targetUserId)

  const { error: profileError } = await adminSupabase
    .from('user_profiles')
    .delete()
    .eq('id', targetUserId)

  if (profileError) {
    throw createError({ statusCode: 500, message: profileError.message })
  }

  const { error: authError } = await adminSupabase.auth.admin.deleteUser(targetUserId)

  if (authError) {
    throw createError({ statusCode: 500, message: authError.message })
  }

  return { success: true }
})
