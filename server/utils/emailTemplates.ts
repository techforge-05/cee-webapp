export type EmailLocale = 'en' | 'es'

interface InviteEmailData {
  inviteUrl: string
  role: 'super_admin' | 'admin'
  isResend: boolean
}

export function getInviteEmailSubject(locale: EmailLocale, isResend: boolean): string {
  const subjects = {
    en: {
      new: "You've been invited to CEE Admin Panel",
      resend: "Reminder: You've been invited to CEE Admin Panel",
    },
    es: {
      new: 'Has sido invitado al Panel de Administración de CEE',
      resend: 'Recordatorio: Has sido invitado al Panel de Administración de CEE',
    },
  }
  return subjects[locale][isResend ? 'resend' : 'new']
}

export function getInviteEmailHtml(locale: EmailLocale, data: InviteEmailData): string {
  const roleText = {
    en: data.role === 'super_admin' ? ' Super Admin' : 'n Admin',
    es: data.role === 'super_admin' ? ' Super Administrador' : ' Administrador',
  }

  const content = {
    en: {
      greeting: data.isResend ? 'Invitation Reminder' : "You've been invited!",
      message: data.isResend
        ? "This is a reminder that you've been invited to join the CEE Admin Panel."
        : `You've been invited to join the CEE Admin Panel as a${roleText.en}.`,
      cta: 'Click the button below to create your account:',
      button: 'Accept Invitation',
      expiry: 'This invitation expires in 30 days.',
      footer: "If you didn't expect this invitation, you can safely ignore this email.",
    },
    es: {
      greeting: data.isResend ? 'Recordatorio de Invitación' : '¡Has sido invitado!',
      message: data.isResend
        ? 'Este es un recordatorio de que has sido invitado a unirte al Panel de Administración de CEE.'
        : `Has sido invitado a unirte al Panel de Administración de CEE como${roleText.es}.`,
      cta: 'Haz clic en el botón a continuación para crear tu cuenta:',
      button: 'Aceptar Invitación',
      expiry: 'Esta invitación expira en 30 días.',
      footer: 'Si no esperabas esta invitación, puedes ignorar este correo de manera segura.',
    },
  }

  const t = content[locale]

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${t.greeting}</h2>
      <p>${t.message}</p>
      <p>${t.cta}</p>
      <div style="margin: 30px 0;">
        <a href="${data.inviteUrl}"
           style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          ${t.button}
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">${t.expiry}</p>
      <p style="color: #6b7280; font-size: 14px;">${t.footer}</p>
    </div>
  `
}

// --- Contact Form Email ---

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export function getContactEmailSubject(data: ContactFormData): string {
  return `[CEE Website] ${data.subject} — from ${data.name}`
}

export function getContactEmailHtml(data: ContactFormData): string {
  const phoneRow = data.phone
    ? `<tr><td style="padding:8px 12px;font-weight:bold;color:#374151;">Phone:</td><td style="padding:8px 12px;color:#4b5563;">${escapeHtml(data.phone)}</td></tr>`
    : ''

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0d9488; color: white; padding: 20px 24px;">
        <h2 style="margin: 0; font-size: 20px;">New Contact Form Submission</h2>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Name:</td>
            <td style="padding: 8px 12px; color: #4b5563;">${escapeHtml(data.name)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Email:</td>
            <td style="padding: 8px 12px;"><a href="mailto:${escapeHtml(data.email)}" style="color: #0d9488;">${escapeHtml(data.email)}</a></td>
          </tr>
          ${phoneRow}
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px; font-weight: bold; color: #374151;">Subject:</td>
            <td style="padding: 8px 12px; color: #4b5563;">${escapeHtml(data.subject)}</td>
          </tr>
        </table>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #374151;">Message:</h3>
          <p style="margin: 0; color: #4b5563; white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.message)}</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">You can reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
      </div>
    </div>
  `
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
