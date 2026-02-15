import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Verify authenticated user
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Verify super admin role
  const userId = user.id ?? (user as any).sub
  const supabase = await serverSupabaseClient(event)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .single()

  if (!profile || profile.role !== 'super_admin') {
    throw createError({ statusCode: 403, message: 'Only super admins can cancel invitations' })
  }

  const body = await readBody(event)
  const { invitationId } = body

  if (!invitationId) {
    throw createError({ statusCode: 400, message: 'Invitation ID is required' })
  }

  // Verify invitation exists and is not already accepted
  const { data: invitation } = await supabase
    .from('invitations')
    .select('id, accepted_at')
    .eq('id', invitationId)
    .single()

  if (!invitation) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  if (invitation.accepted_at) {
    throw createError({ statusCode: 400, message: 'Cannot cancel an accepted invitation' })
  }

  // Delete the invitation
  const { error: deleteError } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)

  if (deleteError) {
    throw createError({ statusCode: 500, message: deleteError.message })
  }

  return { success: true }
})
