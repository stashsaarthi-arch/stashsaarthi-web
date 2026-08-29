# Autonomous Improvement Backlog (Auto-Pilot Queue)

## Execution Rules for AI Agent:
1. Always pick the top unchecked task `[ ]`.
2. Implement the full changes strictly following `agent.md`.
3. Run `npm run build` or `npm run check` to verify zero errors.
4. Mark the task as done `[x]` and log details in `progress.md`.
5. Immediately start the next unchecked task without asking for user permission.

---

## Active Queue:
- [x] 1. **Micro-Interactions & Hover Polish**: Add subtle haptic-like button click animations and glow pulses to all primary CTAs across Student and Host tabs.
- [x] 2. **Form Auto-Validation & UX Feedback**: Add instant inline regex validation (Indian 10-digit phone number, valid college email, clean PIN code) in the waitlist modal.
- [x] 3. **SEO & Social Meta Tags**: Inject rich OpenGraph (`og:image`, `og:title`, `og:description`) and Twitter cards tailored for StashSaarthi campus micro-storage in `index.html`.
- [x] 4. **Keyboard Accessibility & Focus Traps**: Ensure all modals (Investor lock modal, Waitlist modal) trap focus and close on `Esc` key press cleanly.
- [x] 5. **Lazy Loading & Image Optimization**: Implement native `loading="lazy"` and blur-up placeholder effects on all Reviewed Rooms images for instant loading.
- [x] 6. **Dynamic Toast Notifications**: Implement custom dark-glass toast notifications for actions like "Referral Code Copied", "StashPass Saved", or "Message Sent".
- [x] 7. **Lighthouse Audit & Performance Tuning**: Audit unused CSS classes, memoize heavy math recalculations in the savings slider, and ensure smooth 60fps scrolling.
- [x] 8. **Live Social Proof Activity Ticker**: Build a non-intrusive floating social activity widget (`ActivityTicker.tsx`) displaying real-time campus micro-storage bookings and host listings with dual-persona accents.
- [x] 9. **Interactive 1-Touch SOS Safety Simulator**: Build a live interactive emergency response simulator showing the 3-way safety cascade (Host → Student → 24×7 Concierge → Family Alert) in the Safety/Trust section.
- [x] 10. **Interactive Dead-Rent Savings Bar Comparison**: Elevate the Calculator with an interactive animated side-by-side comparative expense graph (Dead Rent vs StashSaarthi) with visual savings breakdown.
- [x] 11. **Senior Kitchen & Tiffin Earning Slider**: Add an interactive daily tiffin prep calculator in `HostSimulator.tsx` (₹90/meal, host keeps ₹55, calculating up to ₹13,200+/mo passive income) per `pricing_engine.md`.
- [x] 12. **Campus Gate Walking Proximity Tagging**: Enhance `CampusNodeChecker.tsx` with live hostel-gate walking distance metrics (e.g. Hall 13 Gate, 4-min walk) and 1-click route reservation prefill.
- [x] 13. **Native Web Share API & Dynamic StashPass Link**: Implement `navigator.share` with WhatsApp Web fallback in `StashPass.tsx` for 1-tap mobile boarding pass distribution.
- [x] 14. **Reviewed Rooms Quick Filters**: Add 1-tap category and budget filters ("All", "Within 500m", "Tiffin Included", "Under ₹6,000/mo") to `Rooms.tsx`.
- [x] 15. **Offline & Network Reconnection Resilience**: Add auto-sensing network connectivity toasts and offline grace banners.
- [x] 16. **Interactive FAQ Instant Search Filter**: Add real-time keyword search and query matching across student, host, and legal FAQs in `FAQ.tsx`.
- [x] 17. **Structured House Norms Matrix**: Enhance `HostRules.tsx` with interactive house rule tags (Gate Curfew, Study Hours, Guest Policy, Kitchen Sharing) and dual-persona compliance assurances.
- [x] 18. **Campus Node Captain Lead Generator**: Build a high-converting "Become a Campus Captain" modal & floating trigger for student community organizers.
- [x] 19. **PWA Installability & Web App Manifest Polish**: Refine `public/manifest.json` and web app icons with standalone display mode and theme color fidelity.
- [x] 20. **Scroll Progress Indicator**: Add a thin persona-adaptive gradient progress bar at the top of the viewport showing page scroll progress for spatial context.
- [x] 21. **Animated Counter Numbers**: Add count-up animation on scroll-into-view for all Hero stat values (₹300, 100%, 2-min, etc.) to boost perceived dynamism and trust.
- [x] 22. **Back-to-Top FAB Button**: Add a floating back-to-top button that appears after scrolling past the hero, with smooth scroll and persona-adaptive styling.
- [x] 23. **Visual Luggage Dimension & Bag Type Selector**: Add an interactive baggage size guide (Trolley 24", Duffle, Trunk, Heavy Carton) with volume indicators inside `BookingModal.tsx` for zero confusion.
- [x] 24. **Instant Kanpur PIN Code Coverage Checker**: Build an interactive PIN code search widget inside `CampusNodeChecker.tsx` (supporting 208016, 208024, 208025, 208002, etc.) returning live node radius and pickup SLA.
- [x] 25. **Interactive Audio Waveform Player Simulation**: Enhance `Stories.tsx` with Web Audio API micro-synth tone on play and interactive scrubbable waveform timeline.
- [x] 26. **Host Payout & Weekly Escrow Charter Modal**: Build `HostPayoutCharterModal.tsx` detailing weekly Tuesday NEFT/UPI disbursement, 0% platform hidden deduction, and ₹10,000 security holding protection.
- [x] 27. **Student Vacation Luggage Packing & Seal Checklist**: Build `PackingChecklistModal.tsx` with interactive check-off items (perishables, laser barcode seal, zipper lock) for pre-departure peace of mind.
- [x] 28. **1-Tap WhatsApp Batch Share Generator**: Enhance `ReferralPill.tsx` with pre-formatted WhatsApp hostel group invite generator with dynamic campus node link.
- [x] 29. **Campus Hub Locality Filter in Reviewed Rooms**: Add 1-tap campus locality pills (IITK Belt, CSJMU / Kalyanpur, Kakadeo, HBTI) in `Rooms.tsx` for hyper-targeted room discovery.
- [x] 30. **Dynamic Relative Timestamps in Social Ticker**: Enhance `ActivityTicker.tsx` with live relative timestamps ("2m ago", "Just now") and pulse indicators.
- [x] 31. **FAQ Category Question Counters & Micro-Transitions**: Add live badge counts to category chips in `FAQ.tsx` and smooth accordion content expansion.
- [x] 32. **Campus Transit & E-Rickshaw Cost Estimator**: Add live transit metrics (₹10 E-Rickshaw, 4-min ride, 650m walking) on every reviewed room card in `Rooms.tsx`.
- [x] 33. **Visual Floorplan & Luggage Grid Capacity Visualizer**: Build an interactive visual space occupancy simulator in `HostSimulator.tsx` rendering a live 2D grid of stored bags in spare wardrobe/verandah corners.
- [x] 34. **Senior Emergency SOS Live Geo-Coordinate Simulation**: Enhance `FamilyDashboard.tsx` with live simulated GPS coordinate logging and 1-tap WhatsApp emergency concierge broadcast.
- [x] 35. **Guided 3-Step Host Space Listing Wizard**: Enhance `RoomListingModal.tsx` with structured multi-step flow (Property Info → Amenities & House Norms → Concierge Home Audit Scheduling).
- [x] 36. **Dead-Rent Savings Proof Badge Generator**: Add a 1-tap copyable hostel group savings badge in `Calculator.tsx` with formatted student savings summary.
- [x] 37. **Campus Proximity Direct Map Route Dispatch**: Add dynamic Google Maps walking route launcher for every verified node in `CampusNodeChecker.tsx`.
- [x] 38. **Interactive 4-Step Storage Video Tour Simulator**: Build `StorageTourModal.tsx` showing the complete journey (Pickup → Tamper Seal → Pallet Node → Safe Return).
- [x] 39. **Host House Norms Printable Certificate Generator**: Add 1-tap formatted house norms certificate viewer in `HostRules.tsx` for senior host home entrance display.
- [x] 40. **Floating Dual-Persona Mode Switcher Pill**: Add a sleek persistent bottom-center persona toggle badge with micro-animations.