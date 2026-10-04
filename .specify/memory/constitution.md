# StashSaarthi V2 Constitution

## Article I (Stack Purity)
React + Vite + Tailwind CSS + TanStack Router + `@supabase/supabase-js` ONLY. Zero Firebase, zero external state bloat, zero unrequested npm packages. The frontend uses Zustand for lean global state where necessary, but relies heavily on native derived state.

## Article II (Ponytail YAGNI Enforcement)
Every `/speckit.plan` and `/speckit.implement` step must pass the Ponytail 6-step ladder:
1. Reuse existing
2. Native Browser/DOM API
3. Direct Supabase client
4. Minimal 1-liner
Avoid over-engineered abstractions, custom simulation engines, or mock data arrays where a native Supabase call works.

## Article III (Security & RLS First)
All sensitive documents (KYC IDs, Aadhaar cards) must use private Supabase Storage buckets with signed URLs or raw paths—never `getPublicUrl`. All database tables must enforce Row-Level Security (RLS) policies based on `auth.uid()` or admin claims.

## Article IV (Mobile GPU & 60FPS Budget)
Maintain hardware-accelerated UI and ensure 60FPS minimum. Zero heavy client-side simulation loops (e.g. infinite `requestAnimationFrame` for logic). Desktop-only guards must be used for heavy scroll/cursor effects to preserve mobile scroll fidelity.

## Article V (Zero-Regression Gate)
No task in `/speckit.implement` is complete until `npx tsc --noEmit` returns Exit Code 0 and `npm run build` succeeds cleanly. Do not leave empty stubs or broken UI paths.
