import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import { createTransport } from 'nodemailer'

export default defineEventHandler(async (event) => {
  // Verify authenticated user
  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  // Verify super admin role
  const supabase = await serverSupabaseClient(event)
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'super_admin') {
    throw createError({ statusCode: 403, message: 'Only super admins can resend invitations' })
  }

  const body = await readBody(event)
  const { invitationId } = body

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

  // Update the invitation with a new token and expiry
  const { data: updatedInvite, error: updateError } = await supabase
    .from('invitations')
    .update({
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq('id', invitationId)
    .select()
    .single()

  if (updateError) {
    throw createError({ statusCode: 500, message: updateError.message })
  }

  // Send the new invitation email
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
        subject: 'Reminder: You\'ve been invited to CEE Admin Panel',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Invitation Reminder</h2>
            <p>This is a reminder that you've been invited to join the CEE Admin Panel.</p>
            <p>Click the button below to create your account:</p>
            <div style="margin: 30px 0;">
              <a href="${inviteUrl}"
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This invitation expires in 30 days.</p>
          </div>
        `,
      })
    } catch (emailError: any) {
      console.error('Failed to send invitation email:', emailError)
    }
  }

  return { success: true }
})
