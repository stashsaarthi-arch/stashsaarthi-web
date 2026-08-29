# Pricing Engine — StashSaarthi Unit Economics (Kanpur Pilot)

> **Last Updated:** 2026-08-29
> **Owner:** Layer 1 Directive — Business Logic
> **Scope:** All pricing, margin calculations, and savings formulas for the three core service nodes.

---

## 1. Saarthi Stash (Micro-Storage)

| Metric | Value |
|---|---|
| **Student Price** | ₹300 / bag / month |
| **Host Payout** | ₹180 / bag / month |
| **Platform Gross** | ₹120 / bag / month |
| **Ops & Insurance Reserve** | ₹40 / bag / month |
| **Platform Net Margin** | ₹80 / bag / month (26.7%) |

### Dead-Rent Savings Formula

```
savings = (monthly_room_rent × months_away) − (bags × 300 × months_away)
```

- Default `monthly_room_rent` assumption: ₹4,000 (Kanpur average shared PG)
- Example: 2 bags × 3 months = ₹1,800 vs. ₹12,000 dead rent → **₹10,200 saved**

### Insurance & Seal Protocol
- Each bag receives a **laser tamper seal** with unique barcode
- ₹10,000 micro-insurance per bag (covers damage, theft, water)
- Claims processed within 48 hours via WhatsApp photo verification

---

## 2. Saarthi Spaces (Brokerage-Free Co-Living)

| Metric | Value |
|---|---|
| **Average Monthly Rent** | ₹5,500 |
| **Student Platform Fee** | 10% of rent (₹550) |
| **Host Platform Fee** | 5% of rent (₹275) |
| **Platform Gross per Booking** | ₹825 / month |
| **Ops & Verification** | ₹125 / month |
| **Platform Net Margin** | ₹700 / month |
| **Brokerage** | ₹0 (Zero Brokerage, Always) |

### Key Rules
- **Zero brokerage** — this is a non-negotiable brand promise
- 24-hour free relocation guarantee if the student is unsatisfied
- 100% digital escrow — host receives payment only after student confirms check-in
- All rooms must pass 3-tier verification before listing

---

## 3. Saarthi Kitchen (Neighbourhood Tiffins)

| Metric | Value |
|---|---|
| **Per Meal Price** | ₹90 |
| **Monthly Plan (1 meal/day)** | ₹2,400 / month |
| **Host Payout per Meal** | ₹55 |
| **Platform Gross per Meal** | ₹35 |
| **Delivery & Packaging** | ₹19 / meal |
| **Platform Net per Meal** | ₹16 |

### Host Chef Qualification
- Must be a local family/senior in the same neighbourhood cluster
- Kitchen must pass FSSAI-equivalent hygiene audit (StashSaarthi internal checklist)
- Zero palm oil policy — all home-style cooking with standard household oils
- Micro-batch only: max 15 tiffins per host per day to maintain quality

---

## Combined Host Earnings Potential

```
monthly_host_income =
  (bags_hosted × 180) +
  (rooms_hosted × avg_rent × 0.95) +
  (daily_meals × 55 × 30)
```

Example (typical Kanpur senior host):
- 8 bags + 1 room + 5 daily meals = ₹1,440 + ₹5,225 + ₹8,250 = **₹14,915 / month**

---

## Revision Log

| Date | Change | Author |
|---|---|---|
| 2026-08-29 | Initial directive created from AGENTS.md formulas | System |
