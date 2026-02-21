-- Add purpose column to donations table for tracking donation intent
ALTER TABLE donations ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT 'general';
