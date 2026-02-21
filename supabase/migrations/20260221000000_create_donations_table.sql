-- Donations table for tracking online card donations via CRUISE 3DS / TodoPago
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'HNL')),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  donor_phone TEXT,
  transaction_id TEXT,
  authorization_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  todopago_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_donations_order_number ON donations(order_number);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);

-- RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public donation form)
CREATE POLICY "Anyone can create donations"
  ON donations FOR INSERT
  WITH CHECK (true);

-- Only admins can view donations
CREATE POLICY "Admins can view donations"
  ON donations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );

-- Only admins can update donations (e.g. mark as refunded)
CREATE POLICY "Admins can update donations"
  ON donations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('super_admin', 'admin')
      AND status = 'active'
    )
  );
