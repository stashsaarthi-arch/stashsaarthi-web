# 📋 MASTER CONTINUOUS TASK QUEUE (200-TASK ROADMAP)

## Sprint 0: Foundation & Polish (Completed)
- [x] 1. **[CTO - Database]**: Audit Supabase telemetry and offline persistence queues for zero data drops.
- [x] 2. **[CPO - Navigation Polish]**: Reorganize website navigation, deep tab synchronization, and smart explore search directory.
- [x] 3. **[QA - Viewport Audit]**: Eliminate mobile overflow (<400px width) and enforce touch target safety.
- [x] 4. **[CTO - Motion]**: Implement Lenis/GSAP scroll physics with GPU-accelerated layer transforms across landing page.
- [x] 5. **[CMO - Messaging]**: Refactor hero section copy and value propositions for instant clarity.
- [x] 6. **[CPO - UI Polish]**: Standardize card padding, glassmorphism borders, and button hover states.
- [x] 7. **[CRO - Sticky Action]**: Add a floating, high-contrast CTA bar on mobile scroll.
- [x] 8. **[CSO - Trust & Compliance]**: Verify laser barcode seal simulation, ₹10k micro-insurance claim terms, and TPA Sec 105 legal protections.
- [x] 9. **[CPO - Web Audio Feedback]**: Add subtle, ultra-low-latency Web Audio API micro-haptics / clicks on interactive toggles and booking selections.
- [x] 10. **[CEO - Auto-Research]**: CEO will inspect the whole site, generate 5 next-generation features, and log all details in `EXECUTIVE_DASHBOARD.md`.
- [x] 11. **[QA - Performance]**: Run lighthouse audits and optimize any remaining LCP/CLS metrics to achieve 95+ score across mobile and desktop.

## Sprint 1: CTO (Performance & Backend)
- [x] 12. **[CTO]**: Audit all Supabase RPC calls for latency optimizations.
- [x] 13. **[CTO]**: Implement a Service Worker for offline-first capabilities and aggressive caching of static assets.
- [x] 14. **[CTO]**: Refactor any remaining large image assets to WEBP with automatic `srcset` generation.
- [x] 15. **[CTO]**: Implement Redis/Upstash caching layer for frequently accessed, non-user-specific data (if applicable).
- [x] 16. **[CTO]**: Setup automated nightly build scripts to check for dependency vulnerabilities.
- [x] 17. **[CTO]**: Implement comprehensive error boundaries on every distinct section of the landing page.
- [x] 18. **[CTO]**: Optimize React re-renders by enforcing strict `React.memo` and `useCallback` on heavy components.
- [x] 19. **[CTO]**: Setup end-to-end (E2E) testing stub with Playwright or Cypress for the core booking flow.

## Sprint 2: CPO (Product & UI Excellence)
- [x] 20. **[CPO]**: Implement dark mode toggle with smooth color-palette transition (if not strictly locked to current theme).
- [x] 21. **[CPO]**: Design and implement skeleton loaders for all data-fetching components.
- [x] 22. **[CPO]**: Polish the "Host" persona dashboard with charts for projected passive income.
- [x] 23. **[CPO]**: Refine the typography scaling across ultra-wide monitors (4k+).
- [x] 24. **[CPO]**: Add subtle parallax effects to background elements in the Solutions Hub.
- [x] 25. **[CPO]**: Improve keyboard navigation (tabbing) across all interactive elements for screen-reader compatibility.
- [x] 26. **[CPO]**: Create a unified `ToastProvider` for sleek, non-intrusive success/error notifications.
- [x] 27. **[CPO]**: Audit and fix any low-contrast text ratios for WCAG AA compliance.

## Sprint 3: CMO (Marketing & Storytelling)
- [x] 28. **[CMO]**: Create a dedicated "Student Success Stories" carousel component.
- [x] 29. **[CMO]**: Implement dynamic OpenGraph images that render based on the specific route/persona.
- [x] 30. **[CMO]**: Draft and integrate localized Hindi copy for the pricing calculator tool.
- [x] 31. **[CMO]**: Build an interactive "Timeline of a Stash" component (from pickup to secure storage).
- [x] 32. **[CMO]**: Design a referral leaderboard UI snippet to encourage viral growth.
- [x] 33. **[CMO]**: Optimize meta descriptions for all specific long-tail keyword pages.
- [x] 34. **[CMO]**: Add schema.org structured data for all "Co-living Spaces" to enhance rich snippets.
- [x] 35. **[CMO]**: Create a "Why StashSaarthi vs. Traditional PGs" comparison table.

## Sprint 4: CRO (Conversion Rate Optimization)
- [x] 36. **[CRO]**: Implement exit-intent popups offering a slight discount or priority support on the booking page.
- [x] 37. **[CRO]**: A/B test the primary Hero CTA button color (e.g., Mint vs. Emerald).
- [x] 38. **[CRO]**: Reduce the number of mandatory fields in the initial lead capture form.
- [x] 39. **[CRO]**: Add social proof notifications (e.g., "Rahul from IITK just booked a stash").
- [x] 40. **[CRO]**: Optimize the WhatsApp referral pre-filled text for higher click-through rates.
- [x] 41. **[CRO]**: Implement a progress bar in the multi-step booking modal to reduce drop-off.
- [x] 42. **[CRO]**: Add prominent "Zero Cancellation Fee" badges near pricing tables.
- [x] 43. **[CRO]**: Analyze scroll-depth and move the highest-converting module higher up the page.

## Sprint 5: QA & CSO (Quality, Safety, Compliance)
- [x] 44. **[QA]**: Conduct a full security audit of the Supabase Row Level Security (RLS) policies.
- [x] 45. **[QA]**: Test the UI on specific older Android devices (via emulation) to ensure no WebGL crashes.
- [x] 46. **[CSO]**: Draft a clear "Host Vetting Process" flow diagram and integrate it into the Trust section.
- [x] 47. **[QA]**: Implement rate-limiting on all form submissions to prevent spam.
- [x] 48. **[QA]**: Verify all external links open in a new tab with `rel="noopener noreferrer"`.
- [x] 49. **[CSO]**: Draft the formal Privacy Policy & Terms of Service page content and link it in the footer.
- [x] 50. **[CEO]**: Compile all Sprint Reports into a single Master Release Note (v2.0) and push to production.

- [x] 51. [CAO - Predictive AI]: Implement a light ML model (e.g., using TensorFlow.js) on the client side to predict user persona (Student/Host) based on scroll behavior and pre-load relevant assets.
- [x] 52. [CTO - Database]: Design Supabase schema for dynamic, location-based pricing tiers (e.g., higher storage rates near premium hostels).
- [x] 53. [CAO - Vision AI]: Set up a serverless edge function for Host Vetting: Auto-verify property photos for quality, safety, and "ghar jaisa" aesthetics using Google Cloud Vision API.
- [x] 54. [CTO - Audio]: Implement low-latency audio compression for Saarthi Connect, ensuring high quality on poor (2G/3G) networks common near CSJMU.
- [x] 55. [CTO - Network]: Add a "Low-Data Mode" toggle that disables GSAP/WebGL animations and uses static images for users on weak cellular data.
- [x] 56. [CAO - Chatbot]: Prototype a Retrieval-Augmented Generation (RAG) chatbot using the existing FAQ documentation to provide instant answers to students.
- [x] 57. [CTO - Analytics]: Implement custom Supabase telemetry to track specific component-level interaction time (e.g., how long do students hover on the ₹50 thali vs. ₹70 thali?).
- [x] 58. [CTO - Security]: Audit Supabase JWT token expiration and refresh token logic for enhanced session security.
- [x] 59. [CTO - Infrastructure]: Set up redundant Supabase edge function deployments across different geographical regions for maximum uptime.

Sprint 7: CPO & UI/UX (Hyperlocal Mobile Dominance)
- [x] 60. [CPO - Kitchen UI]: Add real-time "availability percentage" bars to each kitchen node (e.g., "75% of lunch tokens sold").
- [x] 61. [UX - Kitchen Flow]: Design and implement a 2-step "Re-order My Last Meal" shortcut on the dashboard.
- [x] 62. [UI - Spaces]: Integrate a lightweight, open-source 360° photo viewer for Saarthi Spaces room tours (using Pannellum or similar).
- [x] 63. [UX - Storage]: Redesign the luggage storage UI to support itemization and custom labeling (e.g., "Carton #1: Books", "Suitcase: Winter Clothes").
- [x] 64. [UI - Motion]: Implement a Micro-Interaction where the Peacock Feather "dusts off" the matki of butter when a student selects the Standard Thali.
- [x] 65. [UX - Local Navigation]: Implement "Find My Stash" directions that open natively in Google Maps or Apple Maps, specifically guiding students to the back-alley entrances often found in Kakadeo.
- [x] 66. [UI - Gamification]: Design a "Karma Points" UI badge for Saarthi Connect, rewarding active seniors for their participation.
- [x] 67. [CPO - Accessibility]: Conduct a full screen-reader audit and ensure all interactive components have appropriate ARIA labels and roles.
- [x] 68. [UX - Payment Flow]: Implement a "Partial UPI Payment" option allowing students to pay 50% in cash at pickup, reducing upfront friction.
Sprint 8: CMO & CLO (Hyperlocal Growth & Community Engagement)
- [x] 69. [CMO - SEO]: Create dedicated, crawlable pages for every distinct coaching hub: /tiffin-services-near-motion, /tiffin-services-near-physics-wallah.
- [x] 70. [CMO - Content]: Design a downloadable PDF guide: "The Complete Guide to Surviving Kakadeo as a New Student (powered by StashSaarthi)".
- [x] 71. [CMO - Community]: Launch an official "Kanpur Student Council" section, inviting student leaders to discuss platform features and local issues.
- [x] 72. [CMO - Social Proof]: Create an interactive widget that displays the "Top 3 Rated Kitchens of the Week" as voted by verified students.
- [x] 73. [CMO - Direct Marketing]: Add a customizable WhatsApp button allowing students to instantly share a menu with a specific hostel roommate.
- [x] 74. [CMO - Content]: Draft a dedicated legal overview section explaining TPA Sec 105 protections for hosts in simple, non-intimidating Hindi.
- [x] 75. [CMO - SEO]: Implement dynamic schema.org markup for Saarthi Kitchens, displaying average rating and standard price directly on Google search results.
- [x] 76. [CMO - Content]: Script and coordinate a series of "Student Testimonial" short-form videos focusing on Saarthi Spaces and Connect.

Sprint 9: CRO & CAO (Intelligent Conversion & Retention)
- [x] 77. [CAO - Intelligent Nudges]: Implement a backend system to trigger personalized WhatsApp messages to students who haven't ordered in 3 days, offering a 1-day free delivery token.
- [x] 78. [CRO - Tiffin Flow]: Implement "Meal Personalization" (e.g., "Skip Rice, Extra Roti" for ₹5 more) during the booking process.
- [x] 79. [CRO - Spaces Flow]: Add a high-contrast "Instant Booking" button alongside the existing "Find Broker-Free Rooms" button.
- [x] 80. [CRO - Payment Flow]: Implement "Zero-Fee Trial Token" for first-time students, instantly credited to their Stash Wallet upon verification.
- [x] 81. [CRO - Landing Page]: Analyze session recordings (e.g., using Hotjar) and test moving the "Saarthi Connect" module higher for the Host persona.
- [x] 82. [CRO - Storage Flow]: Implement an "Extended Break" upsell in the storage flow, offering a discount for commitments of 3+ months.
- [x] 83. [CRO - Tiffin Flow]: Add a persistent, countdown timer for the next delivery slot's cutoff time (e.g., "1 hour left to book Lunch!").
- [x] 84. [CRO - Tiffin Flow]: A/B test changing the Standard Thali price label from "₹50 (pickup) / ₹60 (delivery)" to "From ₹50, save more on pickup".

Sprint 10: QA, CSO & CEO (Total Assurance, Compliance & Strategic Direction)
- [x] 85. [QA - Kitchen Performance]: Stress-test the Service Worker's handling of multiple kitchen images loading simultaneously on a 2G connection emulator.
- [x] 86. [QA - Storage Logic]: E2E test the luggage storage booking flow, specifically verifying that QR codes generated match the unique booking ID and can be scanned across different user roles.
- [x] 87. [CSO - Data Privacy]: Conduct a comprehensive audit of all GDPR and India's DPDP Act compliance, ensuring all user data is stored and processed lawfully.
- [x] 88. [QA - Mobile UI]: Fix any remaining mobile safari rendering glitches where absolute positioned elements (like the Peacock Feather) cover interactive buttons.
- [x] 89. [CSO - Trust]: Implement a formalized, automated process for CSO to review and "seal" (using the simulated barcode) each new vetted kitchen node.
- [x] 90. [QA - Compliance]: Implement rate-limiting on all SMS and WhatsApp token requests to prevent spam.
- [x] 91. [CSO - Security]: Audit the entire Supabase database and ensure no tables with sensitive user information are publicly readable.
- [x] 92. [CEO - Compliance]: Finalize the "Host Vetting Process" as a formal company policy and integrate the agreement into the Host persona onboarding flow.
- [x] 93. [QA - Performance]: Audit all GSAP and Lenis scroll listeners to ensure they are properly cleaned up upon component unmount, preventing memory leaks.
- [x] 94. [CSO - Compliance]: Review and update the privacy policy and terms of service to reflect the newly implemented predictive AI and data collection features.
- [x] 95. [QA - Security]: Perform a comprehensive pen-test on all public-facing API endpoints.
- [x] 96. [QA - Mobile Performance]: Verify that all heavy animated and interactive components pass without crashing on low-end Android Go devices common in Kanpur.
- [x] 97. [CSO - Data Retention]: Define and implement a clear data retention policy, automatically deleting inactive student account data after 18 months.
- [x] 98. [CEO - Analytics]: Compile all Sprint data into a new executive dashboard showing core metrics: CAC (Customer Acquisition Cost), LTV (Lifetime Value), active token circulation.
- [x] 99. [QA - Performance]: Audit the final webpack bundle size and ensure it's minimal by using code splitting and lazy loading heavy components.
- [x] 100. [CTO]: add my bookings dashboard in user login profile.
## Sprint 11: Design System, Tokens & OKLCH Theme Architecture (impeccable extract, document, colorize)
- [x] 101. **[UI - Design Tokens / extract]**: Formalize unified OKLCH design tokens in `src/styles.css` for both Student (`--mint`, `--emerald`, `--cyan`, `--obsidian`) and Senior Host (`--amber`, `--gold`, `--obsidian`) personas.
- [x] 102. **[UI - Color Harmony / colorize]**: Implement automated contrast checking and color harmony scales for background-to-surface layers (`--surface-1`, `--surface-2`, `--surface-elevated`).
- [x] 103. **[UI - Glassmorphism Standards / polish]**: Refactor all glass card utilities (`.glass`, `.glass-hover`, `.glass-panel`) to use performant CSS backdrop-filter with hardware acceleration and clean borders.
- [x] 104. **[UI - Gradient Systems / colorize]**: Standardize dynamic radiant gradients across Hero and Featured cards, replacing ad-hoc inline gradients with reusable CSS token classes (`gradient-mint-emerald`, `gradient-amber-gold`).
- [x] 105. **[UI - Border & Ring Radii / layout]**: Unify border radius scale (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`) across all 40+ components for consistent visual rhythm.
- [x] 106. **[UI - Shadow & Depth Hierarchy / layout]**: Establish a 4-tier elevation shadow system (`--shadow-subtle`, `--shadow-card`, `--shadow-floating`, `--shadow-glow`) mapped to persona accent colors.
- [x] 107. **[UI - Component Primitives / extract]**: Extract reusable button primitives (`Button`, `IconButton`, `PillBadge`, `Chip`) into a dedicated `src/components/ui/` primitives folder.
- [x] 108. **[UI - Dark Obsidian Depth / bolder]**: Introduce subtle ambient noise and depth textures (`.bg-noise`, `.radial-mesh`) to eliminate flat, dead dark backgrounds on OLED/retina displays.
- [x] 109. **[UI - Status & Feedback Tokens / clarify]**: Harmonize warning, error, info, and success tokens across both personas so status indicators remain instantly recognizable.
- [x] 110. **[UI - Design System Documentation / document]**: Generate living UI token documentation in `DESIGN.md` cataloging colors, typography, elevations, spacing scales, and micro-interaction states.

## Sprint 12: Typography, Hierarchy & Global Layout Engine (impeccable typeset, layout)
- [x] 111. **[UI - Fluid Typography Scale / typeset]**: Implement clamp-based fluid typography (`clamp(1.5rem, 4vw, 3rem)`) ensuring smooth font scaling from 320px mobile to 4K displays.
- [x] 112. **[UI - Font Loading & FOUT / optimize]**: Optimize Plus Jakarta Sans and Inter Google Fonts loading with `font-display: swap`, preload hints, and zero Cumulative Layout Shift (CLS).
- [x] 113. **[UI - Hindi & English Dual Typography / typeset]**: Calibrate line-height, letter-spacing, and font-weight adjustments specifically for Devanagari Hindi text to prevent glyph clipping.
- [x] 114. **[UI - Visual Text Hierarchy / layout]**: Overhaul heading hierarchy (`h1`, `h2`, `h3`, `h4`, `overline`, `caption`) across all views, ensuring strict visual dominance and scanability.
- [x] 115. **[UI - Bento Grid Architecture / layout]**: Refactor feature showcases into modern, asymmetric Bento Grid layouts with dynamic aspect ratios and responsive auto-flow.
- [x] 116. **[UI - Spacing & Padding Rhythm / layout]**: Standardize section vertical rhythms (4rem / 6rem / 8rem) and container maximum widths (`max-w-7xl`, `max-w-6xl`) across the entire web app.
- [x] 117. **[UI - Content Containers & Gutters / adapt]**: Fix mobile gutter padding (`px-4 sm:px-6 lg:px-8`) ensuring zero text-to-edge crowding on iPhone SE and narrow Android viewports.
- [x] 118. **[UI - Micro-Copy Alignment / polish]**: Re-align badges, icons, price tags, and helper captions with strict baseline grid alignment.
- [ ] 119. **[UI - Truncation & Multi-line Clamping / harden]**: Apply responsive line-clamping (`line-clamp-1`, `line-clamp-2`, `line-clamp-3`) with tooltip fallbacks to prevent card layout breakage on verbose Hindi strings.
- [ ] 120. **[UI - Layout Isolation / optimize]**: Add CSS `contain: layout style` to heavy independent sections to eliminate unnecessary browser reflows during page interaction.

## Sprint 13: Hero Sections, Persuade Surfaces & Visual Impact (impeccable bolder, shape, delight)
- [ ] 121. **[UI - Student Hero Overhaul / bolder]**: Redesign Student Persona Hero with ultra-crisp neon emerald headline glow, floating 3D luggage mockups, and instant ₹300/mo value badge.
- [ ] 122. **[UI - Host Hero Overhaul / bolder]**: Redesign Senior Host Persona Hero with warm sunset gold illumination, dignified ₹11,500+/mo passive income badge, and trust seals.
- [ ] 123. **[UI - Interactive Value Switcher / delight]**: Design an interactive hero toggle demonstrating the immediate contrast between "Wasting ₹8,000 dead rent" vs "Saarthi Stash ₹300/mo".
- [ ] 124. **[UI - Hyperlocal Campus Radar Widget / shape]**: Rebuild the Hero Campus Node Radar with real-time pulsing beacons for Kakadeo, IIT Kanpur, HBTI, and CSJMU.
- [ ] 125. **[UI - Floating Social Proof Avatars / delight]**: Add an animated stack of verified student and senior host profile avatars with live "Joined today from Kakadeo" indicators.
- [ ] 126. **[UI - Hero CTA Button Glow & Shimmer / overdrive]**: Elevate primary hero CTA buttons with GPU-accelerated animated border glows, shimmer sweeps, and Web Audio click feedback.
- [ ] 127. **[UI - Hero Video & Interactive Visualizer / shape]**: Integrate an ambient, lightweight visualizer showcasing the seamless transition of items from hostel room to secured host vault.
- [ ] 128. **[UI - Trust Banner & Partner Strip / polish]**: Redesign the campus & institutional trust strip (IITK, HBTI, CSJMU, Regency, UP Police verification) with subtle monochrome-to-color hover effects.
- [ ] 129. **[UI - Quick-Action Floating Dock / adapt]**: Implement an intuitive floating bottom pill dock on mobile viewports for instant 1-tap switching between Stash, Spaces, Kitchen, and Connect.
- [ ] 130. **[UI - Hero Micro-Stats Counter / animate]**: Add smooth count-up animated statistics (e.g., "₹42,00,000+ Dead Rent Saved", "450+ Verified Senior Hosts") with IntersectionObserver triggers.

## Sprint 14: Dual-Persona Experience — Student Mint vs Host Amber (impeccable colorize, quieter, clarify)
- [ ] 131. **[UI - Persona Switcher Redesign / animate]**: Overhaul the global Student / Host toggle switch with smooth pill sliding animation, role-specific icons, and haptic audio cues.
- [ ] 132. **[UI - Senior Host Legibility Mode / adapt]**: Automatically enhance UI readability when Host mode is active (larger 18px+ base font, higher contrast borders, simplified action buttons).
- [ ] 133. **[UI - Student Dark Mode Aesthetics / colorize]**: Infuse Student persona cards with cyberpunk-inspired mint/cyan edge highlights and frosted glass depth.
- [ ] 134. **[UI - Host Warm Hearth Aesthetics / colorize]**: Infuse Senior Host persona surfaces with comforting amber, terracotta, and warm brass accents conveying dignity and warmth.
- [ ] 135. **[UI - Dynamic Persona Themed Navbar / polish]**: Synchronize Navbar brand glows, link underlines, and active indicator bars with active persona palette.
- [ ] 136. **[UI - Dual Persona Footer Transformation / shape]**: Redesign the footer to seamlessly morph between Student resources (hostel checklist, dead rent calculator) and Host resources (pension guide, TPA Sec 105 legal FAQ).
- [ ] 137. **[UI - Persona-Specific Empty States / delight]**: Design empathetic, persona-tailored empty states with charming illustrated SVGs for student search misses and host zero-booking states.
- [ ] 138. **[UI - Persona Transition Crossfade / animate]**: Smooth out the instantaneous persona switch using a gentle 250ms CSS color-interpolate fade to eliminate jarring flashes.
- [ ] 139. **[UI - Devanagari Type Tuning for Hosts / typeset]**: Apply generous letter-spacing and optimized Devanagari font fallbacks for senior citizens reading Hindi text.
- [ ] 140. **[UI - Persona Context Indicators / clarify]**: Add subtle sticky corner badges or ambient gradient halos reminding the user which persona view is currently engaged.

## Sprint 15: Component Library, Glassmorphism & Bento Grids (impeccable extract, polish, distill)
- [ ] 141. **[UI - Saarthi Stash Card 2.0 / polish]**: Overhaul the Micro-Storage card with 3D bag depth preview, tamper-proof seal indicator, ₹300/mo prominent pricing pill, and 1-click booking CTA.
- [ ] 142. **[UI - Saarthi Spaces Card 2.0 / polish]**: Redesign Co-Living room cards featuring 16:9 room image carousels, verified senior host badges, zero-brokerage guarantees, and walking distance tags.
- [ ] 143. **[UI - Saarthi Kitchen Card 2.0 / polish]**: Overhaul Tiffin cards with daily meal countdown timers, rotating homestyle thali previews, calorie/macro breakdowns, and chef bio tags.
- [ ] 144. **[UI - Saarthi Connect Card 2.0 / polish]**: Redesign Intergenerational Mentorship cards with senior hobby tags, student skill-exchange chips, and karma points earned counters.
- [ ] 145. **[UI - Accordion & FAQ Redesign / distill]**: Re-engineer the FAQ accordions with buttery smooth height transitions, glowing active outlines, and instant category filters.
- [ ] 146. **[UI - Testimonial & Review Carousel / delight]**: Build an editorial-grade testimonial carousel with student audio clip quotes, verified college badges, and rating stars.
- [ ] 147. **[UI - Filter & Search Bar Overhaul / shape]**: Redesign the campus directory search bar with auto-suggest chips, distance sliders, and instant live filtering tags.
- [ ] 148. **[UI - Badge & Tag Standardization / extract]**: Unify all metadata tags (e.g., "Verified Host", "Near PW Vidyapeeth", "Veg Only", "AC Room") with cohesive micro-padding and typography.
- [ ] 149. **[UI - Comparison Matrix Table / distill]**: Build a sleek, high-contrast comparison table contrasting StashSaarthi vs Traditional PGs and Commercial Warehouses.
- [ ] 150. **[UI - Skeleton Loader Polishing / polish]**: Design shimmering wave skeleton loaders matching the exact geometric layout of cards to eliminate layout jump during data loading.

## Sprint 16: Micro-Interactions, Motion Physics & Audio-Visual Delight (impeccable animate, delight, overdrive)
- [ ] 151. **[UI - 3D Card Hover Physics / animate]**: Upgrade `Card3D` with smooth GPU-accelerated tilt, dynamic cursor-following specular glare, and auto-disable on touch devices.
- [ ] 152. **[UI - Peacock Feather Micro-Interaction / delight]**: Refine the iconic Peacock Feather dusting animation on Standard Thali selection with crisp particle sparkles and spring physics.
- [ ] 153. **[UI - Spring Modal Entrances / animate]**: Replace linear modal fades with organic spring physics (`cubic-bezier(0.16, 1, 0.3, 1)`) for all booking and detail dialogs.
- [ ] 154. **[UI - Scroll-Triggered Reveal Engine / animate]**: Implement staggered section entrance reveals with subtle translation (`translateY(24px) -> 0`) and opacity fades on scroll.
- [ ] 155. **[UI - Web Audio Haptic Soundscape / delight]**: Expand micro-audio feedback to include distinct, pleasant sounds for toggle switches, item counter increments, and payment confirmations.
- [ ] 156. **[UI - Magnetic Buttons / overdrive]**: Add subtle magnetic pull micro-interactions on primary desktop CTA buttons where the button gently attracts toward the cursor.
- [ ] 157. **[UI - Interactive Dead Rent Savings Slider / delight]**: Build a delightful interactive slider where dragging the vacation days dynamically animates saved currency notes and savings milestones.
- [ ] 158. **[UI - Confetti & Celebration Cannons / delight]**: Integrate a lightweight canvas celebration burst upon successful booking confirmation and senior host agreement signing.
- [ ] 159. **[UI - Tab Switching Indicator Glides / animate]**: Implement fluid sliding background pills for tab navigations using layout transitions (Framer Motion / CSS `layoutId` logic).
- [ ] 160. **[UI - Laser Seal Barcode Glow / overdrive]**: Animate the digital laser barcode seal with a futuristic sweeping beam to highlight anti-tamper security.

## Sprint 17: Booking Flows, Modals, Forms & Friction Reduction (impeccable harden, clarify, distill)
- [ ] 161. **[UI - Multi-Step Booking Modal Overhaul / harden]**: Redesign the core `BookingModal` into a distraction-free, 3-step progress journey with clear breadcrumbs and step validation.
- [ ] 162. **[UI - Phone Number & OTP Input Redesign / clarify]**: Create high-legibility +91 Indian phone and 6-digit OTP input boxes with auto-advance, digit paste support, and clear error hints.
- [ ] 163. **[UI - Luggage Itemizer Visualizer / shape]**: Build an intuitive visual luggage itemizer allowing students to tap 3D-styled icons for suitcases, cartons, coolers, and backpacks.
- [ ] 164. **[UI - Date & Time Slot Picker / harden]**: Design a custom calendar date-range and pickup slot selector optimized for touch devices with campus holiday preset chips.
- [ ] 165. **[UI - Dynamic Pricing Breakdown Drawer / clarify]**: Implement a crystal-clear price summary drawer showing base rate, zero brokerage savings, and platform fee with 100% transparency.
- [ ] 166. **[UI - UPI Payment Intent Modal / harden]**: Redesign the checkout modal with instant 1-tap UPI app buttons (GPay, PhonePe, Paytm, CRED) and auto-generating dynamic QR code.
- [ ] 167. **[UI - Form Validation Micro-States / clarify]**: Add instantaneous inline input validation with friendly micro-copy and gentle shake animations on invalid submissions.
- [ ] 168. **[UI - Booking Confirmation Pass / delight]**: Design an Apple Wallet-style digital boarding pass for confirmed bookings with printable QR seal, host address, and directions.
- [ ] 169. **[UI - WhatsApp Quick-Checkout Fallback / distill]**: Build a streamlined fallback modal for weak network connections allowing students to finalize orders via pre-filled WhatsApp link.
- [ ] 170. **[UI - Modal Backdrop Blur & Scroll Lock / polish]**: Perfect modal backdrop dimming (`backdrop-blur-md bg-black/60`) and body scroll locking to eliminate dual-scrolling glitches.

## Sprint 18: Operational Dashboards, Data Visualization & Admin Console (building-data-apps, impeccable operate)
- [ ] 171. **[UI - Admin Dashboard Modernization / operate]**: Overhaul `/admin` operator console with clean, dark-themed modular analytics cards, tabbed navigation, and live status badges.
- [ ] 172. **[UI - Executive KPI Metric Cards / operate]**: Redesign CAC, LTV, Active Bookings, and Gross Margin cards with sparkline trend charts and percentage growth indicators.
- [ ] 173. **[UI - Real-Time Node Capacity Gauges / operate]**: Build interactive circular capacity gauges showing live locker utilization across Kakadeo, Kalyanpur, and Nawabganj hubs.
- [ ] 174. **[UI - Student My-Bookings Hub / operate]**: Redesign the student profile booking hub with status timelines (Booked -> Picked Up -> In Vault -> Retrieved) and invoice download triggers.
- [ ] 175. **[UI - Host Passive Income Analytics / operate]**: Build interactive monthly income charts for elderly hosts with bank transfer histories, tax breakdowns, and upcoming payout dates.
- [ ] 176. **[UI - Live Booking Feed & Activity Stream / operate]**: Implement a real-time activity feed component showing incoming bookings, host approvals, and delivery dispatches.
- [ ] 177. **[UI - Interactive Campus Map Layer / operate]**: Design an interactive Leaflet/Mapbox campus map interface visualizing host clusters, walking routes, and student coaching hubs.
- [ ] 178. **[UI - Data Table Ergonomics / operate]**: Polish all admin data tables with sticky headers, column sorting, pagination controls, search bars, and CSV export buttons.
- [ ] 179. **[UI - Host Safety & KYC Verification Console / operate]**: Design an inspection view for verifying host Aadhaar, police verification certificates, and 12-point safety checklists.
- [ ] 180. **[UI - Toast & System Notification Overhaul / polish]**: Redesign floating system toasts with sleek glassmorphism, countdown progress bars, and actionable undo/view buttons.

## Sprint 19: Mobile-First Responsive Ergonomics & Safari Hardening (impeccable adapt, optimize)
- [ ] 181. **[UI - Mobile Navigation Drawer 2.0 / adapt]**: Re-engineer the mobile hamburger drawer with buttery smooth slide-in transitions, high-contrast category links, and language/persona toggles.
- [ ] 182. **[UI - Sticky Mobile Bottom Action Bar / adapt]**: Implement a thumb-friendly sticky bottom CTA bar on mobile screens with instant "Book Storage @ ₹300" action.
- [ ] 183. **[UI - iOS Safari 100dvh & Bottom Safe Area / adapt]**: Fix iOS Safari viewport height issues using dynamic viewport units (`100dvh`) and `env(safe-area-inset-bottom)`.
- [ ] 184. **[UI - Touch Target 48px Minimum Audit / adapt]**: Audit and enlarge all interactive buttons, icons, pills, and tap zones to maintain a strict minimum 48x48px touch target size.
- [ ] 185. **[UI - Horizontal Scroll Overflow Quarantine / adapt]**: Enforce strict viewport containment (`overflow-x: hidden`) across all root layouts to permanently eliminate horizontal micro-wobbles.
- [ ] 186. **[UI - Mobile Card Swipe Gestures / delight]**: Add native touch swipe gestures to mobile image galleries and testimonial carousels with smooth inertia snapping.
- [ ] 187. **[UI - Mobile Keyboard Collision Prevention / adapt]**: Ensure input fields automatically scroll into view with comfortable headroom when the virtual keyboard expands on mobile browsers.
- [ ] 188. **[UI - Low-End Device Performance Mode / optimize]**: Automatically disable expensive CSS box-shadows, blurs, and canvas animations when running on low-spec Android devices.
- [ ] 189. **[UI - Bottom Sheet Drawer for Mobile Filters / adapt]**: Replace dropdown select filters on mobile with modern native-feeling bottom sheet swipeable modals.
- [ ] 190. **[UI - Orientation Change & Tablet Layout / adapt]**: Optimize responsive grid layouts for iPad and tablet landscape/portrait orientations (768px - 1024px).

## Sprint 20: Comprehensive UI/UX Audit, WCAG AAA Accessibility & Craft Floor Polish (impeccable audit, critique, polish)
- [ ] 191. **[UI - WCAG 2.1 AAA Contrast Ratio Audit / audit]**: Conduct a full automated and manual contrast audit ensuring all body copy and interactive text exceeds 7:1 contrast against dark obsidian backgrounds.
- [ ] 192. **[UI - Full Screen Reader & ARIA Overhaul / audit]**: Audit and enrich all interactive widgets with explicit `aria-label`, `aria-expanded`, `aria-controls`, and `role` attributes.
- [ ] 193. **[UI - Visible Focus Indicators / audit]**: Implement sleek, high-visibility keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`) for all interactive elements.
- [ ] 194. **[UI - Bilingual Text Overflow & Truncation / audit]**: Audit all UI cards in Hindi (`hi`) mode to verify no text clipping, awkward word wraps, or button text overflow occurs.
- [ ] 195. **[UI - Image Aspect Ratio & Layout Shift Elimination / optimize]**: Enforce explicit width/height aspect-ratio containers on all images to achieve 0 Cumulative Layout Shift (CLS).
- [ ] 196. **[UI - Micro-Copy Polish & Hindi Tone Refinement / clarify]**: Polish all UX micro-copy, ensuring student copy is punchy and energetic while host copy is warm, respectful, and crystal clear.
- [ ] 197. **[UI - Error Boundary Fallback Views / polish]**: Design charming, context-aware error fallback screens with 1-click "Reload Section" and WhatsApp support hotline buttons.
- [ ] 198. **[UI - Print Stylesheet for Invoices & Passes / polish]**: Perfect the `@media print` CSS stylesheet for booking passes, student agreements, and host verification certificates.
- [ ] 199. **[UI - 60 FPS GPU Rendering & Layer Audit / optimize]**: Audit all animated layers with Chrome DevTools Performance profiler to ensure zero paint jank and consistent 60+ FPS rendering.
- [ ] 200. **[UI - Master UI Overhaul Polish & Design System Freeze / polish]**: Complete the final comprehensive craft floor sweep, aligning every border, shadow, micro-interaction, and typography token across the platform.