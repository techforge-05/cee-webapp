-- Add focal point columns to calendar_events table
ALTER TABLE calendar_events
  ADD COLUMN IF NOT EXISTS focal_x INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS focal_y INTEGER DEFAULT 50;
