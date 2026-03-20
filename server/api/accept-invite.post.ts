import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, password, fullName } = body

  if (!token || !password || !fullName) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = serverSupabaseServiceRole(event) as any

  // 1. Validate the invitation token
  const { data: invitation, error: inviteError } = await adminSupabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .single()

  if (inviteError || !invitation) {
    throw createError({ statusCode: 400, message: 'Invalid or expired invitation' })
  }

  if (new Date(invitation.expires_at) < new Date()) {
    throw createError({ statusCode: 400, message: 'Invitation has expired' })
  }

  // 2. Create auth user via admin API (no email confirmation required)
  const { data: authData, error: createUserError } = await adminSupabase.auth.admin.createUser({
    email: invitation.email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (createUserError || !authData.user) {
    throw createError({ statusCode: 500, message: createUserError?.message || 'Failed to create user' })
  }

  const userId = authData.user.id

  // 3. Insert user_profiles record
  const { error: profileError } = await adminSupabase
    .from('user_profiles')
    .insert({
      id: userId,
      email: invitation.email,
      full_name: fullName,
      role: invitation.role,
      status: 'active',
      invited_by: invitation.invited_by,
      invited_at: invitation.created_at,
    })

  if (profileError) {
    await adminSupabase.auth.admin.deleteUser(userId)
    throw createError({ statusCode: 500, message: profileError.message })
  }

  // 4. Insert user_permissions
  const permissions = invitation.permissions || []
  if (permissions.length > 0) {
    const permRows = permissions.map((p: any) => ({
      user_id: userId,
      section: p.section,
      page: p.page || null,
      can_calendar: invitation.can_calendar || false,
      can_announcements: invitation.can_announcements || false,
    }))

    const { error: permError } = await adminSupabase
      .from('user_permissions')
      .insert(permRows)

    if (permError) {
      await adminSupabase.auth.admin.deleteUser(userId)
      throw createError({ statusCode: 500, message: permError.message })
    }
  }

  // 5. Mark invitation as accepted
  await adminSupabase
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invitation.id)

  return { success: true }
})
