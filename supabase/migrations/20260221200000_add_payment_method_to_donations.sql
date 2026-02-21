-- Add payment_method column to distinguish card vs PayPal donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card';
