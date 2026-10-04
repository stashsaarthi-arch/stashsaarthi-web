# Feature Specification: 1-Click Liquidate (Stash-to-Sell)

**Feature Branch**: `[002-stash-to-sell]`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "Add a 1-Click Liquidate (Stash-to-Sell) button inside the Student Dashboard on active stored bookings, allowing graduating seniors to list their stored cooler/mattress for resale to incoming freshers at a 50% discount directly from the Host's vault using a single Supabase update."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Liquidate Stored Item (Priority: P1)

Graduating seniors who have items stored in a Host's vault (e.g., coolers, mattresses) can click a single button on their Student Dashboard to liquidate their item for sale at a 50% discount to incoming freshers without having to retrieve the item first.

**Why this priority**: Core value proposition for seniors leaving campus who don't want to carry bulky items back home.

**Independent Test**: Can be fully tested by creating a dummy booking in the "in_secure_locker" state and clicking "Liquidate", verifying the Supabase `bookings` table updates its state to "listed_for_sale" and sets the sale price.

**Acceptance Scenarios**:

1. **Given** a student is viewing their active booking in the Student Dashboard, **When** they click "1-Click Liquidate", **Then** the system prompts for confirmation and updates the booking in Supabase to mark it as for sale.
2. **Given** a booking is successfully marked for liquidation, **Then** the UI reflects the item's new "Listed for Sale" status, and the student sees their expected payout.

---

### User Story 2 - Fresher Purchasing Liquidated Item (Priority: P2)

Incoming freshers browsing available rooms/items can view liquidated items stored at specific Host nodes and purchase them directly.

**Why this priority**: Completes the marketplace loop, although the listing creation (P1) must exist first.

**Independent Test**: Can be tested by displaying a "Marketplace" view querying items marked as "listed_for_sale" and simulating a purchase flow.

**Acceptance Scenarios**:

1. **Given** a fresher is browsing a Host's inventory, **When** they see a liquidated cooler, **Then** they can purchase it at the 50% discounted price.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a "1-Click Liquidate" button on active bookings (`in_secure_locker` state) within the `StashVault` or Student Dashboard.
- **FR-002**: System MUST use a single, direct Supabase update (`supabase.from('bookings').update(...)`) to change the booking state, adhering to Ponytail architecture (no custom complex engines).
- **FR-003**: System MUST automatically calculate the 50% discount resale price based on standard item valuation or allow the user to confirm the payout amount.
- **FR-004**: System MUST ensure that Row Level Security (RLS) allows students to only update their own bookings.

### Key Entities

- **Booking (`bookings` table)**: Needs a new column or status enum (e.g., `is_liquidated`, `resale_price`, or extending `lifecycle_state` to include `listed_for_sale`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Seniors can successfully list an item for liquidation in under 3 clicks.
- **SC-002**: Supabase updates complete in under 500ms with zero reliance on heavy server-side middleware.
- **SC-003**: The Student Dashboard UI instantly updates the booking badge using `useBookingRealtimeStatus.ts`.

## Assumptions

- The `bookings` table schema allows modifying the state or adding JSON metadata for the liquidation flag.
- Valuation of items (cooler/mattress) is standardized, or the user accepts a flat 50% discount off a base market price.
- We will modify `src/components/dashboard/StashVault.tsx` (or similar active dashboard view) to add the button.
- Follows Constitution Article II: Direct Supabase client, minimal 1-liner update.
