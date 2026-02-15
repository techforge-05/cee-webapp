import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createTransport } from 'nodemailer'
import { getInviteEmailSubject, getInviteEmailHtml } from '../../utils/emailTemplates'

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
  const { email, role, permissions, canCalendar, canAnnouncements, locale, skipEmail } = body
  const emailLocale = locale === 'en' ? 'en' as const : 'es' as const

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
  let emailSent = false
  const config = useRuntimeConfig()
  const gmailUser = config.gmailUser
  const gmailAppPassword = config.gmailAppPassword

  if (!skipEmail && gmailUser && gmailAppPassword) {
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
        subject: getInviteEmailSubject(emailLocale, false),
        html: getInviteEmailHtml(emailLocale, {
          inviteUrl,
          role: role || 'admin',
          isResend: false,
        }),
      })

      emailSent = true
    } catch (emailError: any) {
      console.error('Failed to send invitation email:', emailError)
    }
  } else {
    console.warn('Gmail credentials not configured. Invitation created but email not sent.')
  }

  return { success: true, emailSent, invitation: { id: invitation.id, email: invitation.email, token: invitation.token } }
})
