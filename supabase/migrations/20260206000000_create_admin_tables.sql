-- =====================================================
-- CEE Admin Panel - Database Schema
-- Phase 1: Foundation tables for admin panel
-- =====================================================

-- 1. USER PROFILES (extends auth.users with admin role info)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'invited', 'expired', 'disabled')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- 2. USER PERMISSIONS (section/page access control)
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  page TEXT,
  can_calendar BOOLEAN DEFAULT false,
  can_announcements BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section, page)
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_section ON user_permissions(section);

-- 3. INVITATIONS (email invite with 30-day token)
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  permissions JSONB DEFAULT '[]',
  can_calendar BOOLEAN DEFAULT false,
  can_announcements BOOLEAN DEFAULT false,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);

-- 4. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT,
  description_en TEXT,
  image_url TEXT,
  image_alt_es TEXT,
  image_alt_en TEXT,
  display_date DATE NOT NULL,
  event_id UUID REFERENCES calendar_events(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_announcements_display_date ON announcements(display_date);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_event ON announcements(event_id);

-- 5. GALLERY PHOTOS
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('events', 'sports', 'academics', 'arts', 'community', 'celebrations')),
  url TEXT NOT NULL,
  alt_text_es TEXT,
  alt_text_en TEXT,
  sort_order INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_photos_year ON gallery_photos(year);
CREATE INDEX idx_gallery_photos_category ON gallery_photos(category);
CREATE INDEX idx_gallery_photos_sort ON gallery_photos(sort_order);

-- 6. PAGE CONTENT (data-driven lists replacing i18n JSON arrays)
CREATE TABLE IF NOT EXISTS page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  content_es JSONB NOT NULL,
  content_en JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_content_page_key ON page_content(page_key);
CREATE INDEX idx_page_content_sort ON page_content(sort_order);
CREATE INDEX idx_page_content_active ON page_content(is_active);

-- 7. NAV VISIBILITY (controls public navigation)
CREATE TABLE IF NOT EXISTS nav_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section TEXT NOT NULL,
  page TEXT,
  is_visible BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, page)
);

-- 8. ALTER calendar_events (add ownership + image fields)
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS image_alt_es TEXT;
ALTER TABLE calendar_events ADD COLUMN IF NOT EXISTS image_alt_en TEXT;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- USER PROFILES
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Super admins can read all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert profiles"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR id = auth.uid()
  );

CREATE POLICY "Super admins can update profiles"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
    OR id = auth.uid()
  );

CREATE POLICY "Super admins can delete profiles"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- USER PERMISSIONS
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can read all permissions"
  ON user_permissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage permissions"
  ON user_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- INVITATIONS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read invitations by token"
  ON invitations FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage invitations"
  ON invitations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- ANNOUNCEMENTS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to active announcements"
  ON announcements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can delete own announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- GALLERY PHOTOS
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to gallery photos"
  ON gallery_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage gallery photos"
  ON gallery_photos FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- PAGE CONTENT
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to active page content"
  ON page_content FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage page content"
  ON page_content FOR ALL
  TO authenticated
  USING (auth.role() = 'authenticated');

-- NAV VISIBILITY
ALTER TABLE nav_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to nav visibility"
  ON nav_visibility FOR SELECT
  USING (true);

CREATE POLICY "Super admins can manage nav visibility"
  ON nav_visibility FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- =====================================================
-- TRIGGERS (auto-update updated_at)
-- =====================================================

-- Reuse the existing update_updated_at_column() function from dynamic_content migration

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_photos_updated_at
  BEFORE UPDATE ON gallery_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED NAV VISIBILITY (all sections/pages visible by default)
-- =====================================================

INSERT INTO nav_visibility (section, page, is_visible) VALUES
  -- Sections
  ('about', NULL, true),
  ('about', 'mission-vision-values', true),
  ('about', 'statement-of-faith', true),
  ('about', 'philosophy', true),
  ('about', 'history', true),
  ('about', 'leadership', true),
  ('about', 'town', true),
  ('academics', NULL, true),
  ('academics', 'curriculum', true),
  ('academics', 'grades', true),
  ('academics', 'calendar', true),
  ('studentLife', NULL, true),
  ('studentLife', 'sports-clubs', true),
  ('studentLife', 'service-projects', true),
  ('studentLife', 'library', true),
  ('studentLife', 'upcoming-events', true),
  ('studentLife', 'gallery', true),
  ('support', NULL, true),
  ('support', 'why-support', true),
  ('support', 'scholarships', true),
  ('support', 'donate', true),
  ('support', 'projects', true),
  ('contact', NULL, true),
  ('contact', 'info', true),
  ('contact', 'directions', true),
  ('contact', 'form', true),
  ('contact', 'faq', true),
  ('admissions', NULL, true),
  ('admissions', 'who-can-apply', true),
  ('admissions', 'how-to-apply', true),
  ('admissions', 'calendar', true),
  ('getInvolved', NULL, true),
  ('getInvolved', 'teachers', true),
  ('getInvolved', 'volunteer', true),
  ('home', NULL, true)
ON CONFLICT (section, page) DO NOTHING;

-- =====================================================
-- UPDATE CALENDAR_EVENTS RLS (ownership-based for admins)
-- =====================================================

-- Drop existing permissive policies on calendar_events and replace with role-aware ones
DROP POLICY IF EXISTS "Authenticated users can insert calendar_events" ON calendar_events;
DROP POLICY IF EXISTS "Authenticated users can update calendar_events" ON calendar_events;
DROP POLICY IF EXISTS "Authenticated users can delete calendar_events" ON calendar_events;

CREATE POLICY "Authenticated users can insert calendar_events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own calendar events or super admins any"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR created_by IS NULL
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Users can delete own calendar events or super admins any"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid()
    OR created_by IS NULL
    OR EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
