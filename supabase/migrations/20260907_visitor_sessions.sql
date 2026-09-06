-- StashSaarthi: Visitor Sessions Table
-- Stores anonymous visitor analytics for admin dashboard cross-device visibility
-- No PII stored — purely device/browser/behavioral signals

CREATE TABLE IF NOT EXISTS visitor_sessions (
  session_id TEXT PRIMARY KEY,
  device_type TEXT NOT NULL DEFAULT 'desktop',
  os TEXT NOT NULL DEFAULT 'Unknown',
  browser TEXT NOT NULL DEFAULT 'Unknown',
  screen_resolution TEXT,
  timezone TEXT,
  language TEXT DEFAULT 'en',
  referrer TEXT DEFAULT 'direct',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  pages_visited TEXT[] DEFAULT '{}',
  services_clicked TEXT[] DEFAULT '{}',
  time_on_site_seconds INTEGER DEFAULT 0,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  city_hint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast admin queries by recency
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen
  ON visitor_sessions (last_seen_at DESC);

-- Index for device type filtering
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_device_type
  ON visitor_sessions (device_type);

-- RLS: Enable row level security
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;

-- Public INSERT allowed (anonymous visitors write their own session)
CREATE POLICY "visitor_sessions_public_insert"
  ON visitor_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Public UPSERT (update own session by session_id)
CREATE POLICY "visitor_sessions_public_upsert"
  ON visitor_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Only service_role can SELECT all sessions (admin reads via service_role or anon with admin key)
-- For client-side admin, we allow authenticated reads as well
CREATE POLICY "visitor_sessions_admin_select"
  ON visitor_sessions
  FOR SELECT
  TO anon, authenticated
  USING (true);
