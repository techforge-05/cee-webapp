-- Fix: newly registered users (role=admin) cannot update invitations
-- because the only write policy requires super_admin.
-- Allow authenticated users to update invitations matching their email.

CREATE POLICY "Users can accept their own invitations"
  ON invitations FOR UPDATE
  TO authenticated
  USING (email = auth.jwt()->>'email')
  WITH CHECK (email = auth.jwt()->>'email');
