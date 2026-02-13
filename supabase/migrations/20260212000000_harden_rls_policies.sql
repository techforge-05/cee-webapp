-- =====================================================
-- Phase 8 Step 1: Harden RLS Policies
-- Fix overly permissive write policies on 6 tables.
-- Create is_admin_user() helper for admin+super_admin.
-- =====================================================

-- Helper: checks if the current user is an active admin or super_admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
  );
$$;

-- =====================================================
-- 1. page_content — restrict write to admins only
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can manage page content" ON page_content;

CREATE POLICY "Admins can manage page content"
  ON page_content FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- =====================================================
-- 2. gallery_photos — restrict write to admins only
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can manage gallery photos" ON gallery_photos;

CREATE POLICY "Admins can manage gallery photos"
  ON gallery_photos FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- =====================================================
-- 3. dynamic_content — restrict write to admins only
-- =====================================================
DROP POLICY IF EXISTS "Allow authenticated users to manage dynamic_content" ON dynamic_content;

CREATE POLICY "Admins can manage dynamic content"
  ON dynamic_content FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- =====================================================
-- 4. media — restrict write to admins only
-- =====================================================
DROP POLICY IF EXISTS "Allow authenticated users to manage media" ON media;

CREATE POLICY "Admins can manage media"
  ON media FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- =====================================================
-- 5. announcements INSERT — restrict to admins only
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON announcements;

CREATE POLICY "Admins can insert announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_user());

-- =====================================================
-- 6. invitations SELECT — restrict to authenticated only
--    (the accept-invite flow uses authenticated client)
-- =====================================================
DROP POLICY IF EXISTS "Public can read invitations by token" ON invitations;

CREATE POLICY "Authenticated users can read invitations"
  ON invitations FOR SELECT
  TO authenticated
  USING (true);
