-- =====================================================
-- Fix infinite recursion in user_profiles RLS policies
-- The issue: policies on user_profiles query user_profiles
-- to check super_admin role, causing infinite recursion.
-- Fix: use a SECURITY DEFINER function that bypasses RLS.
-- =====================================================

-- Create a function that checks super admin status without RLS
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Drop the recursive policies on user_profiles
DROP POLICY IF EXISTS "Super admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can update profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON user_profiles;

-- Recreate policies using the function instead of subquery
CREATE POLICY "Super admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (is_super_admin());

CREATE POLICY "Super admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (is_super_admin() OR id = auth.uid());

CREATE POLICY "Super admins can update profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (is_super_admin() OR id = auth.uid());

CREATE POLICY "Super admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (is_super_admin());

-- Also update user_permissions policies to use the function (not recursive, but cleaner)
DROP POLICY IF EXISTS "Super admins can read all permissions" ON user_permissions;
DROP POLICY IF EXISTS "Super admins can manage permissions" ON user_permissions;

CREATE POLICY "Super admins can read all permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (is_super_admin());

CREATE POLICY "Super admins can manage permissions"
  ON user_permissions FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Update invitations policies
DROP POLICY IF EXISTS "Super admins can manage invitations" ON invitations;

CREATE POLICY "Super admins can manage invitations"
  ON invitations FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Update nav_visibility policies
DROP POLICY IF EXISTS "Super admins can manage nav visibility" ON nav_visibility;

CREATE POLICY "Super admins can manage nav visibility"
  ON nav_visibility FOR ALL
  TO authenticated
  USING (is_super_admin());

-- Update announcements policies
DROP POLICY IF EXISTS "Users can update own announcements" ON announcements;
DROP POLICY IF EXISTS "Users can delete own announcements" ON announcements;

CREATE POLICY "Users can update own announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR is_super_admin());

CREATE POLICY "Users can delete own announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR is_super_admin());

-- Update calendar_events policies
DROP POLICY IF EXISTS "Users can update own calendar events or super admins any" ON calendar_events;
DROP POLICY IF EXISTS "Users can delete own calendar events or super admins any" ON calendar_events;

CREATE POLICY "Users can update own calendar events or super admins any"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR created_by IS NULL OR is_super_admin());

CREATE POLICY "Users can delete own calendar events or super admins any"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (created_by = auth.uid() OR created_by IS NULL OR is_super_admin());
