# Implementation Plan: 1-Click Liquidate (Stash-to-Sell)

## Step 1: Extend Lifecycle State Types
- File: `src/hooks/useBookingRealtimeStatus.ts`
- Action: Add `"listed_for_sale"` to `BookingLifecycleState` union type and `LIFECYCLE_STEPS` object.
- Ponytail Check: Just adding native type definitions, zero bloat.

## Step 2: Implement "1-Click Liquidate" Button in Dashboard
- File: `src/components/dashboard/StashVault.tsx` (or where bookings are rendered).
- Action: For bookings in `"in_secure_locker"` state, display a "Liquidate for 50% Off" button. 
- Action: On click, run `supabase.from('bookings').update({ lifecycle_state: 'listed_for_sale', amount: Math.floor(booking.amount / 2) }).eq('id', booking.id)`
- Ponytail Check: Direct Supabase client, 1-liner update.

## Step 3: Campus Liquidation Deals View
- File: `src/components/stash/Rooms.tsx` or `src/components/home/HomeSolutions.tsx` or create a new section in `src/pages/explore.tsx`. Wait, let's just add it to `Rooms.tsx` (Crowdsourced Room Listings) as a new tab, or just fetch `bookings` with `lifecycle_state = 'listed_for_sale'` and display them as "Campus Liquidation Deals". Let's add it cleanly to an existing listing view, maybe `src/components/dashboard/StashVault.tsx` can have a "Marketplace" tab, or we can add it to the `HomeSolutions` / `Rooms` component. Let's add a `LiquidationMarketplace` component and include it in `HomeSolutions` or `dashboard.tsx`.
- Ponytail Check: Reusing existing UI components (e.g. Card3D, badges).

## Step 4: Quality Gate
- Action: Run `npx tsc --noEmit` and `npm run build` to ensure 0 errors.
