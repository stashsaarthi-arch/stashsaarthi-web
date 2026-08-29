# Safety Protocol — 4-Tier Host Verification & Legal Waiver Specs

> **Last Updated:** 2026-08-29
> **Owner:** Layer 1 Directive — Trust & Safety
> **Scope:** All verification, insurance, SOS protocols, and legal waivers across StashSaarthi services.

---

## 1. 4-Tier Host Verification System

Every host must clear **all four tiers** before any student interaction is enabled.

### Tier 1 — Digital Identity (Aadhaar + Live Biometric)
- **What:** Aadhaar card scan + live selfie biometric match
- **How:** DigiLocker API verification OR manual upload with liveness check
- **Fail condition:** Mismatch > 15% facial similarity score → rejected
- **Timeline:** Instant (automated) or 2 hours (manual review)

### Tier 2 — Police Verification
- **What:** Police station verification certificate for the host's address
- **How:** Host submits existing PV certificate OR StashSaarthi facilitates through local police
- **Fail condition:** Any active FIR / criminal record → permanently rejected
- **Timeline:** 3–7 business days

### Tier 3 — University / Community Verification
- **What:** Cross-verification with local university / RWA / municipal records
- **How:** Phone call to provided references + address match
- **Fail condition:** Inconsistent address or fabricated references → rejected
- **Timeline:** 1–3 business days

### Tier 4 — Physical Home Audit
- **What:** In-person visit by StashSaarthi field team to verify:
  - Room condition and cleanliness
  - Storage space dimensions and dryness (for Stash nodes)
  - Kitchen hygiene (for Kitchen nodes)
  - Entry/exit safety (lock quality, well-lit access)
  - Neighbourhood safety assessment
- **How:** Scheduled home visit with photo/video documentation
- **Fail condition:** Any critical safety deficiency → remediation required before approval
- **Timeline:** Scheduled within 48 hours of Tier 3 clearance

---

## 2. Zero-Damage Guarantee (₹10,000)

| Parameter | Detail |
|---|---|
| **Coverage** | Theft, water damage, pest damage, physical tampering |
| **Per-bag limit** | ₹10,000 |
| **Claim process** | WhatsApp photo evidence → 48-hour resolution |
| **Exclusions** | Prohibited items (see §4), items with pre-existing damage not disclosed at intake |
| **Payout method** | Direct bank transfer to student within 5 business days |

---

## 3. SOS Protocol

### Student SOS Button
- Available in every active stay / stash booking
- **Trigger:** Single-tap SOS in the app or WhatsApp keyword `SOS`
- **Response chain:**
  1. Instant WhatsApp alert to Founder/Operator (`+91 9369454350`)
  2. Auto-notification to host
  3. Local emergency services info provided
  4. Follow-up call within 15 minutes

### Host SOS Button
- For situations involving student misconduct or emergency
- Same response chain, with student contacted for explanation

---

## 4. Safety Charter — Prohibited Items

The following items **must not** be stored under Saarthi Stash:

- Flammable liquids, gases, or explosives
- Illegal substances or narcotics
- Weapons (including knives > 6 inches)
- Perishable food items
- Live animals or biological specimens
- Hazardous chemicals or radioactive materials
- Items exceeding ₹50,000 declared value (requires separate high-value insurance)

### Student Waiver
Every student must digitally sign the Safety Charter waiver before booking:
> "I agree that stored luggage contains no prohibited/hazardous items as per StashSaarthi Safety Charter."

---

## 5. Host House Norms

- Host retains **100% control** over house rules (curfew, guests, noise)
- Students must agree to house norms before booking confirmation
- Any violation → 1 warning → removal with no refund on second offence
- Host can request student removal at any time with 24-hour notice (refund prorated)

---

## 6. Legal Framework

- **Liability waiver:** Both parties sign digital agreement limiting StashSaarthi liability to the insurance amount
- **Data privacy:** All Aadhaar and personal data encrypted at rest (Supabase RLS + AES-256)
- **Dispute resolution:** Mediation first → local consumer court jurisdiction (Kanpur)

---

## Revision Log

| Date | Change | Author |
|---|---|---|
| 2026-08-29 | Initial directive created from AGENTS.md safety specs | System |
