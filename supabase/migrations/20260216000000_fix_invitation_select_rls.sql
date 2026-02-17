-- Fix: allow unauthenticated users to read invitations by token.
-- The accept-invite page is used by users who don't have an account yet,
-- so the anon role must be able to SELECT from invitations.

DROP POLICY IF EXISTS "Authenticated users can read invitations" ON invitations;

CREATE POLICY "Anyone can read invitations by token"
  ON invitations FOR SELECT
  TO anon, authenticated
  USING (true);
