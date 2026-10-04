# Feature Specification: Compact Partition Layout (Bento Grid & Drawer)

**Feature Branch**: `[003-compact-partition-layout]`
**Created**: 2026-10-04
**Status**: Draft

**Input**: User description: "ELIMINATE EXCESSIVE VERTICAL SCROLL VIA PREMIUM PARTITION TABS, BENTO GRIDS & A 3-LINE COMMAND DRAWER..."

## User Scenarios & Testing

### User Story 1 - 3-Line Quick Action Drawer (P1)
Users can open a sleek hamburger drawer in the Navbar to access secondary actions and modals (KYC, Damage Claims, etc.), keeping the top nav clean as a floating pill.
**Why**: Reduces cognitive load and top-heavy navigation clutter.
**Independent Test**: Click hamburger menu -> Drawer slides out -> Secondary modals accessible.

### User Story 2 - Workspace Partitions (Segmented Tab Bar) (P1)
Below the Hero section, users switch between 4 functional tabs (Explore, Savings, Liquidation, Host). 
**Why**: Eliminates extreme vertical scrolling. Groups domain-specific tools into focused "workspaces".
**Independent Test**: Click Tab 2 -> View transitions from Explore to Savings calculator smoothly.

### User Story 3 - Mobile Bento & Snap-Scroll (P2)
On mobile, multi-card lists behave as horizontal snap carousels; on desktop, they form clean 3-column Bento grids.
**Why**: Improves mobile UX exponentially.

## Requirements
- **FR-001**: Add floating pill Navbar and 3-line hamburger menu for auxiliary modals.
- **FR-002**: Create `<WorkspacePartitions />` component with 4 distinct tabs.
- **FR-003**: Move existing sections (Rooms, Stash Calculator, Liquidation Feed, Host Grid) into these tabs without deleting any logic.
- **FR-004**: Apply horizontal snap scrolling for mobile card lists.

## Success Criteria
- Vertical scroll height reduced significantly.
- `tsc --noEmit` and `build` succeed with 0 errors (Zero-Regression Gate).
