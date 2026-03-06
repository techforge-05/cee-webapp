-- Add optional expiry date to announcements
-- Announcements with expires_at set will stop showing automatically after that date

ALTER TABLE announcements ADD COLUMN IF NOT EXISTS expires_at DATE;

CREATE INDEX IF NOT EXISTS idx_announcements_expires_at ON announcements(expires_at);
