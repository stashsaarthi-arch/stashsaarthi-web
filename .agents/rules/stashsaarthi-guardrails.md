# StashSaarthi Permanent Guardrails

These rules are strict, deterministic constraints for all StashSaarthi development and must be enforced by all agents:

## 1. Zero Blank Partition Rule (/zero-blank-state)
- None of the 4 `<WorkspacePartitions>` tabs (`Explore`, `Savings`, `Liquidation`, `Host`) or Bento widgets (`PredictivePersonaWidget`, `StashVault`, `HostInventoryGrid`) may ever return `null` or render an empty black grid.
- ALWAYS provide rich fallback/seed data or a visually compelling empty state if DB rows are empty. 
- Example: Never use `if (!data) return null;`. Instead, use `if (!data) return <FallbackDemoData />;`.

## 2. INR Typography Rule
- NEVER wrap the Indian Rupee symbol (`₹`) in `font-mono`.
- Due to font-mapping errors, `font-mono` turns `₹60` into `T60` mojibake.
- ALWAYS use `font-sans` for any text containing the `₹` symbol across the entire UI.

## 3. Supabase Public Auth Rule (/supabase-rls-guard)
- NEVER use unconfigured SMS gateways (e.g., `signInWithOtp({ phone })`) or silent fake demo sessions.
- ALWAYS use real Supabase sessions (`signInWithPassword` / `signUp` / Google OAuth).
- Ensure all Auth flows have clean UI fallbacks that properly handle Edge Function timeouts and missing configurations.
