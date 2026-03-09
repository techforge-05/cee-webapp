-- Add focal point columns to announcements table
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS focal_x INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS focal_y INTEGER DEFAULT 50;
