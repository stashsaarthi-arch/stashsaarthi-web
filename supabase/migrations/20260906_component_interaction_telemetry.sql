-- ============================================================================
-- StashSaarthi Component Interaction Telemetry & Hover-Dwell Analytics Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.component_interaction_telemetry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  component_id TEXT NOT NULL,
  component_category TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('hover', 'click', 'dwell', 'view', 'drag')),
  dwell_time_ms INTEGER NOT NULL DEFAULT 0,
  persona TEXT DEFAULT 'student',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for rapid analytics aggregation by component, category, and session
CREATE INDEX IF NOT EXISTS idx_telemetry_component_id ON public.component_interaction_telemetry (component_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_category ON public.component_interaction_telemetry (component_category);
CREATE INDEX IF NOT EXISTS idx_telemetry_session_id ON public.component_interaction_telemetry (session_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_created_at ON public.component_interaction_telemetry (created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.component_interaction_telemetry ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated users to record interaction telemetry
CREATE POLICY "Allow public telemetry insert"
  ON public.component_interaction_telemetry
  FOR INSERT
  WITH CHECK (true);

-- Allow public read of aggregated telemetry metrics
CREATE POLICY "Allow public telemetry view"
  ON public.component_interaction_telemetry
  FOR SELECT
  USING (true);
