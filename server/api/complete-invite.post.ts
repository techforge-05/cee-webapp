import { createClient } from '@supabase/supabase-js'

// Called after Google OAuth to complete an invitation (create profile + permissions)
// The user is already authenticated; we use the service role key to bypass RLS.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, userId, email, fullName } = body

  if (!token || !userId || !email) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const config = useRuntimeConfig()
  const supabaseUrl = process.env.SUPABASE_URL!
  const serviceKey = config.supabaseServiceKey

  if (!serviceKey) {
    throw createError({ statusCode: 500, message: 'Server configuration error' })
  }

  const adminSupabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

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

  // 2. Upsert user_profiles record (user already exists in auth.users via Google)
  const { error: profileError } = await adminSupabase
    .from('user_profiles')
    .upsert({
      id: userId,
      email: invitation.email,
      full_name: fullName || '',
      role: invitation.role,
      status: 'active',
      invited_by: invitation.invited_by,
      invited_at: invitation.created_at,
    })

  if (profileError) {
    throw createError({ statusCode: 500, message: profileError.message })
  }

  // 3. Insert user_permissions
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
      throw createError({ statusCode: 500, message: permError.message })
    }
  }

  // 4. Mark invitation as accepted
  await adminSupabase
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invitation.id)

  return { success: true }
})
