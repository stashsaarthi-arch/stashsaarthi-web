# Baseline Spec: StashSaarthi V2 Production

## 1. Overview
StashSaarthi V2 relies strictly on React, Vite, Tailwind CSS, TanStack Router, and native Supabase clients.

## 2. Core Architecture Rules
- **Stack Purity**: No external state bloat. Zero unrequested dependencies.
- **Ponytail Architecture**: Always favor 1-liners, native DOM/Browser APIs, and direct `supabase-js`.
- **Security Enforced**: `kyc-documents` and sensitive listings reside in private Supabase buckets securely. Access relies on signed URLs. RLS is mandatory for tables like `crowdsourced_room_listings`.
- **Quality Gate**: Zero code enters production without passing `tsc --noEmit` and building under 1000ms.
