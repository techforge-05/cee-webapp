type EmailLocale = 'en' | 'es'

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
