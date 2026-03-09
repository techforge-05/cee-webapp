-- Add missing nav_visibility rows that were omitted from the initial seed
INSERT INTO nav_visibility (section, page, is_visible) VALUES
  ('studentLife', 'alumni', true),
  ('academics', 'guidance-wellbeing', true)
ON CONFLICT (section, page) DO NOTHING;
