# Baseline Spec: StashSaarthi V2 Core

## 1. Overview
StashSaarthi V2 is a 2-sided hyper-local student storage marketplace targeting campus environments (e.g., IIT Kanpur, CSJMU). It connects students needing affordable micro-storage with verified local hosts (PG owners, seniors) who have spare room capacity.

## 2. Core Flows

### 2.1 Student Booking Flow
- **Savings Calculator**: High-converting interactive module (`StashCalculator.tsx`) that computes dynamic savings vs dead rent.
- **Location Pricing**: Campus-based dynamic rates (e.g. Kakadeo vs Nankari).
- **Cart & Checkout**: Captures number of bags, months, and total amount.

### 2.2 Host Onboarding & KYC Vault
- **Aadhaar Verification**: Government ID upload via `AadhaarKycModal.tsx`.
- **Security**: KYC documents are strictly stored in private Supabase buckets (`kyc-documents`) and accessed only via signed URLs or authenticated policies. `getPublicUrl` is strictly banned for sensitive IDs.
- **Inventory Grid**: Simulated isometric mapping (`HostInventoryGrid.tsx`) for hosts to visually allocate physical space.

### 2.3 Delivery Handoff & Damage Claims
- **QR / Barcode Handoff**: `DeliveryFleetScannerModal.tsx` provides native HTML5 camera scanning for booking status transitions.
- **Lifecycle Tracking**: `useBookingRealtimeStatus.ts` listens to Supabase Realtime channels for instant status updates (Received -> Locker -> Ready -> Completed).

### 2.4 Admin God-Eye
- Global metrics, overrides, and dispute resolution.

## 3. Technical Constraints
- **Frontend**: React + Vite + Tailwind CSS + TanStack Router.
- **Backend & Auth**: Native `@supabase/supabase-js`. Zero wrappers.
- **State**: Zustand for global, native derived state for component-level.
- **Build Quality**: Must pass `npx tsc --noEmit` and `npm run build` with 0 errors (Zero-Regression Gate).
