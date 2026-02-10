import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createTransport } from 'nodemailer'

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
    throw createError({ statusCode: 403, message: 'Only super admins can invite users' })
  }

  // Parse body
  const body = await readBody(event)
  const { email, role, permissions, canCalendar, canAnnouncements } = body

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required' })
  }

  // Check if email is already registered
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    throw createError({ statusCode: 400, message: 'A user with this email already exists' })
  }

  // Check if there's already a pending invitation for this email
  const { data: existingInvite } = await supabase
    .from('invitations')
    .select('id')
    .eq('email', email)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (existingInvite) {
    throw createError({ statusCode: 400, message: 'There is already a pending invitation for this email' })
  }

  // Create invitation
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .insert({
      email,
      role: role || 'admin',
      permissions: permissions || [],
      can_calendar: canCalendar || false,
      can_announcements: canAnnouncements || false,
      invited_by: user.id,
    })
    .select()
    .single()

  if (inviteError) {
    throw createError({ statusCode: 500, message: inviteError.message })
  }

  // Send invitation email
  const config = useRuntimeConfig()
  const gmailUser = config.gmailUser
  const gmailAppPassword = config.gmailAppPassword

  if (gmailUser && gmailAppPassword) {
    try {
      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      })

      const baseUrl = getRequestURL(event).origin
      const inviteUrl = `${baseUrl}/auth/accept-invite?token=${invitation.token}`

      await transporter.sendMail({
        from: `"CEE Admin" <${gmailUser}>`,
        to: email,
        subject: 'You\'ve been invited to CEE Admin Panel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You've been invited!</h2>
            <p>You've been invited to join the CEE Admin Panel as a${role === 'super_admin' ? ' Super' : 'n'} Admin.</p>
            <p>Click the button below to create your account:</p>
            <div style="margin: 30px 0;">
              <a href="${inviteUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This invitation expires in 30 days.</p>
            <p style="color: #6b7280; font-size: 14px;">If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        `,
      })
    } catch (emailError: any) {
      console.error('Failed to send invitation email:', emailError)
      // Don't throw - the invitation was created, just email failed
    }
  } else {
    console.warn('Gmail credentials not configured. Invitation created but email not sent.')
  }

  return { success: true, invitation: { id: invitation.id, email: invitation.email, token: invitation.token } }
})
