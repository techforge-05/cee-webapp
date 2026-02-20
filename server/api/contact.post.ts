import { createTransport } from 'nodemailer'
import { getContactEmailSubject, getContactEmailHtml } from '../utils/emailTemplates'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, email, phone, subject, message } = body

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, message: 'Invalid email format' })
  }

  const config = useRuntimeConfig()
  const gmailUser = config.gmailUser
  const gmailAppPassword = config.gmailAppPassword

  if (!gmailUser || !gmailAppPassword) {
    throw createError({ statusCode: 500, message: 'Email service not configured' })
  }

  const contactData = { name: name.trim(), email: email.trim(), phone: phone?.trim() || '', subject: subject.trim(), message: message.trim() }

  try {
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    await transporter.sendMail({
      from: `"CEE Website" <${gmailUser}>`,
      to: gmailUser,
      replyTo: contactData.email,
      subject: getContactEmailSubject(contactData),
      html: getContactEmailHtml(contactData),
    })

    return { success: true }
  } catch (err: any) {
    console.error('Failed to send contact form email:', err)
    throw createError({ statusCode: 500, message: 'Failed to send message' })
  }
})
