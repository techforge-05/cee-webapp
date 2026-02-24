import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createTransport } from 'nodemailer'
import { randomUUID } from 'crypto'
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
    throw createError({ statusCode: 403, message: 'Only super admins can resend invitations' })
  }

  const body = await readBody(event)
  const { invitationId, locale } = body
  const emailLocale = locale === 'en' ? 'en' as const : 'es' as const

  if (!invitationId) {
    throw createError({ statusCode: 400, message: 'Invitation ID is required' })
  }

  // Get the existing invitation
  const { data: oldInvite, error: fetchError } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', invitationId)
    .single()

  if (fetchError || !oldInvite) {
    throw createError({ statusCode: 404, message: 'Invitation not found' })
  }

  if (oldInvite.accepted_at) {
    throw createError({ statusCode: 400, message: 'This invitation has already been accepted' })
  }

  // Generate new token (64 chars, no dashes — matches DB default format)
  const newToken = (randomUUID() + randomUUID()).replace(/-/g, '')

  // Update the invitation with new token and expiry
  const { data: updatedInvite, error: updateError } = await supabase
    .from('invitations')
    .update({
      token: newToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', invitationId)
    .select()
    .single()

  if (updateError) {
    throw createError({ statusCode: 500, message: updateError.message })
  }

  // Send the invitation email
  let emailSent = false
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
      const inviteUrl = `${baseUrl}/auth/accept-invite?token=${updatedInvite.token}`

      await transporter.sendMail({
        from: `"CEE Admin" <${gmailUser}>`,
        to: oldInvite.email,
        subject: getInviteEmailSubject(emailLocale, true),
        html: getInviteEmailHtml(emailLocale, {
          inviteUrl,
          role: oldInvite.role,
          isResend: true,
          baseUrl,
        }),
      })

      emailSent = true
    } catch (emailError: any) {
      console.error('Failed to send invitation email:', emailError)
    }
  }

  return { success: true, emailSent }
})
