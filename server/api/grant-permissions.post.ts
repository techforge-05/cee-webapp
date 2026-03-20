import { serverSupabaseServiceRole } from '#supabase/server'

// Called after Google OAuth invite completion to insert user_permissions
// (requires service role since RLS only allows super_admins to insert permissions)
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, permissions, canCalendar, canAnnouncements } = body

  if (!userId || !permissions) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  if (!Array.isArray(permissions) || permissions.length === 0) {
    return { success: true }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adminSupabase = serverSupabaseServiceRole(event) as any

  const permRows = permissions.map((p: any) => ({
    user_id: userId,
    section: p.section,
    page: p.page || null,
    can_calendar: canCalendar || false,
    can_announcements: canAnnouncements || false,
  }))

  const { error: permError } = await adminSupabase
    .from('user_permissions')
    .insert(permRows)

  if (permError) {
    throw createError({ statusCode: 500, message: permError.message })
  }

  return { success: true }
})
