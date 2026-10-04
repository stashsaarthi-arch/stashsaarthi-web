# Implementation Plan: Compact Partition Layout

## Step 1: Upgrade Navbar (Pill Nav + Drawer)
- File: `src/routes/__root.tsx` or main Header component.
- Action: Wrap the main nav in a sticky pill. Add a framer-motion drawer/sheet for auxiliary links/modals.

## Step 2: Extract & Partition the Landing Page
- File: `src/routes/index.tsx`
- Action: Convert the vertical stacking into a state-driven `<PartitionSwitcher />`.
  - Tab 1: Explore Stashes & Rooms (Rooms/Stashes components)
  - Tab 2: Savings & AI Estimator (StashCalculator + PredictivePersonaWidget in Bento grid)
  - Tab 3: Campus Liquidation Deals (The StashVault / liquidation feed we built)
  - Tab 4: Host & Earn (HostInventoryGrid + Host verification tools)

## Step 3: Implement Mobile Horizontal Snap-Scroll & Bento Grids
- File: Deep sections inside `src/routes/index.tsx` (like "How It Works").
- Action: Apply Tailwind classes: `flex overflow-x-auto snap-x md:grid md:grid-cols-3`.

## Step 4: Quality Gate
- Run `npx tsc --noEmit` and `npm run build`.
