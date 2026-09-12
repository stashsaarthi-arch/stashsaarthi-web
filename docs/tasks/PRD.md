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
- [x] 101. [CEO]: Compile all Sprint Reports into a single Master Release Note (v3.0) and push to production.

## Sprint 11: CTO & CAO (Next-Gen AI, Real-Time Edge & Offline Resilience)
- [ ] 102. [CTO - Offline PWA]: Implement background periodic sync API and dynamic IndexedDB queue for offline booking requests when cell service drops in Kakadeo basements.
- [ ] 103. [CAO - Multi-lingual RAG]: Integrate multilingual embedding search (Hindi-English transliteration / Hinglish) in the FAQ chatbot to understand queries like "hostel se bag uthane ka kya charge hai".
- [ ] 104. [CTO - Edge Functions]: Build a Supabase Edge Function to generate instant dynamic QR codes with signed UPI intent links (`upi://pay?pa=...&am=...&tn=...`) for instant settlement.
- [ ] 105. [CAO - Vision AI]: Train an automated luggage volume and luggage tag OCR scanner using canvas capture to verify standard 80L luggage limits before dispatch.
- [ ] 106. [CTO - Performance]: Implement route-based bundle prefetching and speculative resource hints (`<link rel="prefetch">`) on user hover over Navbar tabs.
- [ ] 107. [CTO - WebSockets]: Set up Supabase Realtime channels for live kitchen inventory counter ("Only 4 thalis remaining for today's lunch!").
- [ ] 108. [CAO - Dynamic Pricing]: Deploy client-side predictive surge and vacancy pricing logic adjusting storage rates based on Kanpur university exam calendars (IITK midsems, CSJMU finals).
- [ ] 109. [CTO - Audio / Telemetry]: Add Web Audio sound effects toggle with persistent localStorage preference and sound effects for QR scan, payment success, and SOS trigger.
- [ ] 110. [CTO - Security]: Implement strict Content Security Policy (CSP) headers and Subresource Integrity (SRI) hashes in the Nitro server configuration.
- [ ] 111. [QA - Automated Benchmarks]: Build a synthetic benchmark script in `execution/` measuring Time-to-Interactive (TTI) and First Input Delay (FID) across simulated slow 3G network conditions.

## Sprint 12: CPO & UX (Hyperlocal Intergenerational Living & Roommate Matching)
- [ ] 112. [CPO - Roommate Matching]: Design and implement an interactive "Habits & Study Hours" compatibility questionnaire for students booking Saarthi Spaces.
- [ ] 113. [UX - Senior House Norms]: Build an interactive visual "House Rules Agreement" selector for Elderly Hosts (e.g., Gate curfew, veg-only kitchen, silent study hours).
- [ ] 114. [UI - 3D Floorplan Viewer]: Create an interactive CSS 3D isometric room visualizer allowing students to inspect desk space, wardrobe, and natural light before booking.
- [ ] 115. [CPO - Host Verification Badge]: Implement a multi-level visual trust badge system on host cards (e.g., "DigiLocker Verified", "IITK Alumni Host", "SuperHost 5★").
- [ ] 116. [UX - Booking Schedule]: Build a date-range picker with visual campus semester presets (e.g., "Summer Vacations May-July", "Diwali Break", "Endsem Sprint").
- [ ] 117. [UI - Neighborhood Vibe Guide]: Add an interactive Kakadeo & Kalyanpur neighborhood map layer showing distance to coaching centers (Allen, PW, Motion, Resonance).
- [ ] 118. [UX - Parent Portal]: Create a simplified, high-contrast "Parents View" mode that presents safety certifications, CCTV node verification, and landlord police verification.
- [ ] 119. [CPO - Room Inventory Filter]: Implement instantaneous multi-attribute filtering (single room, shared room, attached washroom, balcony, AC/cooler) without page reloads.
- [ ] 120. [UI - Senior Voice Intro]: Implement an embedded audio snippet player on host cards where elderly hosts can record a 20-second warm welcome message in Hindi.
- [ ] 121. [UX - Move-in Checklist]: Build an interactive digital move-in checklist with photo upload proof for students and hosts to document room condition at check-in.

## Sprint 13: CRO & Growth (Micro-Payments, UPI Deep-Links & Dynamic Pricing Engine)
- [ ] 122. [CRO - Split Payment]: Implement a "Split with Roommate" feature generating dual UPI payment links for double-occupancy Saarthi Spaces rooms.
- [ ] 123. [CRO - Dead Rent Calculator]: Build an interactive before/after financial infographic modal showing exact rupee savings comparing 3 months dead hostel rent vs. Saarthi Stash.
- [ ] 124. [CRO - Urgency Triggers]: Add subtle, non-intrusive micro-banners showing real-time inventory scarcity (e.g., "Only 2 micro-storage lockers left near Kakadeo Thana node").
- [ ] 125. [CRO - Stash Pass Subscriptions]: Design a multi-semester "Stash Pass" recurring subscription tier offering free locker pickup and 15% discount across all 4 years.
- [ ] 126. [CRO - One-Click WhatsApp Checkout]: Create a frictionless fallback modal for students with unstable 4G allowing 1-tap WhatsApp booking pre-filled with cart payload.
- [ ] 127. [CRO - Host Earnings Simulator]: Upgrade the host passive income calculator with dynamic sliders for spare bedrooms, kitchen meal capacity, and attic storage square footage.
- [ ] 128. [CRO - Abandoned Cart Nudge]: Implement local session storage intent tracking that prompts a polite exit notification with a ₹50 first-order discount code.
- [ ] 129. [CRO - Group Booking Perks]: Add a "Book with Batchmates" referral mechanic unlocking free pickup when 3 or more hostel friends book storage together.
- [ ] 130. [CRO - Gamified Loyalty Badges]: Design a "Campus Saarthi Ambassador" progress meter rewarding students with meal tokens when their friends book a room.
- [ ] 131. [CRO - Fast-Track Deposit Refund]: Build a visual escrow tracker displaying guaranteed 24-hour security deposit return upon room checkout or luggage retrieval.

## Sprint 14: CMO & Hyperlocal SEO (Campus Domination, Referral Loops & Viral Growth)
- [ ] 132. [CMO - Campus Landing Pages]: Build dedicated, SEO-optimized landing pages for `/iit-kanpur-luggage-storage`, `/hbti-kanpur-hostels`, and `/csjmu-rooms`.
- [ ] 133. [CMO - Coaching Hub Directories]: Create structured directory hubs for Allen Kakadeo, Physics Wallah Vidyapeeth, and Aakash Institute with walking distance calculations.
- [ ] 134. [CMO - Dynamic Social Share Cards]: Generate automated SVG-to-Canvas dynamic OG share cards showing personalized savings certificates for students to share on Instagram/WhatsApp.
- [ ] 135. [CMO - Printable Noticeboard Posters]: Build an automated printable PDF generator in the operator console creating QR-coded noticeboard flyers for Kanpur coaching hostels.
- [ ] 136. [CMO - Student Ambassador Dashboard]: Create a dedicated onboarding and tracking route `/ambassador` with custom UTM referral links and live commission analytics.
- [ ] 137. [CMO - Localized Video Embeds]: Integrate responsive, lightweight video embed modals showcasing authentic interviews with senior hosts in Kidwai Nagar and Swaroop Nagar.
- [ ] 138. [CMO - Programmatic Schema Markup]: Implement schema.org `LodgingBusiness`, `SelfStorage`, and `Restaurant` JSON-LD structured tags across all dynamic listing routes.
- [ ] 139. [CMO - Hindi Voice Search Support]: Optimize meta tags and conversational search queries targeting common Hindi voice search phrases (e.g., "Kanpur me sasta luggage store").
- [ ] 140. [CMO - Campus Fest Sponsorship Hub]: Build an interactive landing page section highlighting StashSaarthi's partnership with IIT Kanpur Antaragni and Techkriti student festivals.
- [ ] 141. [CMO - Wall of Gratitude]: Build an interactive, filterable community appreciation board displaying thank-you messages from students to their host "Nanis and Dadis".

## Sprint 15: CSO & Legal (4-Tier Senior Safety, DigiLocker e-KYC & DPDP 2023 Enforcement)
- [ ] 142. [CSO - DigiLocker Integration]: Implement a mock/live DigiLocker e-KYC verification bridge verifying student college enrollment and Aadhaar identity.
- [ ] 143. [CSO - Police Verification Form]: Create a downloadable and auto-filled Kanpur Nagar Police verification tenant certificate generator for elderly hosts.
- [ ] 144. [CSO - TPA Sec 105 Leave & License]: Build an automated digital Leave & License agreement generator embedding statutory Transfer of Property Act Sec 105 non-tenancy clauses.
- [ ] 145. [CSO - DPDP Consent Ledger]: Implement a granular consent management banner complying with India's Digital Personal Data Protection (DPDP) Act 2023.
- [ ] 146. [CSO - ₹10k Luggage Guarantee Vault]: Build an interactive insurance policy certificate generator showing the itemized protection terms backed by platform micro-reserves.
- [ ] 147. [CSO - Emergency Bedside SOS Link]: Implement a one-tap emergency SOS broadcast system triggering instant SMS/WhatsApp alerts to registered local wardens and verified volunteers.
- [ ] 148. [CSO - Anti-Tamper Barcode Scanner]: Build a client-side camera QR/Barcode scanner component for luggage pickup agents to verify physical tamper-evident seals.
- [ ] 149. [CSO - Data Anonymization Engine]: Build an automated data masking routine that scrambles student phone numbers and addresses for non-active bookings in logs.
- [ ] 150. [CSO - Dispute Resolution Portal]: Design and implement an arbitration and resolution claim workflow allowing hosts and students to file damage or delay reports.
- [ ] 151. [CSO - Senior Safety Hotline Widget]: Create a persistent, high-contrast floating emergency widget tailored for elderly hosts with one-tap Hindi telephone connection.

## Sprint 16: CPO & Operations (Saarthi Kitchen 2.0, Meal Subscriptions & Tiffin Logistics)
- [ ] 152. [CPO - Dietary Customization]: Implement dietary preferences selector (Satvik, Jain, Low-Spicy, Diabetic-friendly) in the Saarthi Kitchen subscription flow.
- [ ] 153. [UX - Meal Pause & Resume]: Build a flexible calendar modal allowing students to pause their tiffin plan during coaching exam holidays or hometown visits.
- [ ] 154. [UI - Kitchen Live Hygiene Preview]: Design a verified hygiene badge section with timestamped kitchen hygiene inspection photos and FSSAI certificate previews.
- [ ] 155. [CPO - Thali Meal Planner]: Build a weekly rolling menu widget displaying daily rotating vegetables, dals, and regional specials (e.g., Dal Bati Churma, Poori Sabzi).
- [ ] 156. [UX - Delivery Slot Selector]: Add precise lunch (12:30 PM - 2:00 PM) and dinner (7:30 PM - 9:30 PM) delivery window selector matching coaching batch schedules.
- [ ] 157. [CPO - Eco Tiffin Box Deposit]: Implement an eco-friendly stainless steel dabba exchange ledger tracking reusable tiffin box deposits and returns.
- [ ] 158. [UI - Kitchen Host Bio Card]: Create heartwarming host profiles for home chefs featuring their culinary background, signature dish, and love for feeding students.
- [ ] 159. [UX - Instant Meal Rating]: Implement a 1-tap post-meal emoji feedback modal (Roti softness, Dal taste, Temperature) piped to host analytics.
- [ ] 160. [CPO - Special Sunday Feasts]: Build an upsell module for Sunday special meals and celebratory festival feasts (e.g., Holi Gujiya, Diwali Kheer tokens).
- [ ] 161. [UX - Real-Time Tiffin ETA]: Build a simulated courier dispatch and delivery ETA tracker showing bike courier progress from senior home to student hostel.

## Sprint 17: CTO & QA (Enterprise E2E Test Matrix, Chaos Engineering & Android Go V2)
- [ ] 162. [QA - Playwright Multi-Role Matrix]: Expand E2E Playwright test suites covering full concurrent flows: Student booking, Host approval, and Operator dispatch.
- [ ] 163. [CTO - Client-Side Error Telemetry]: Implement a lightweight client-side crash and unhandled promise rejection reporter sending error logs to Supabase telemetry.
- [ ] 164. [QA - 2G Network Throttling Test]: Create an automated script in `execution/` validating page interactivity and critical CSS rendering under 50kbps network throttling.
- [ ] 165. [CTO - Web Worker Computation]: Offload heavy client-side filtering, distance calculations, and savings math to a background dedicated Web Worker.
- [ ] 166. [QA - Cross-Browser Safari/iOS Glitch Test]: Audit and fix webkit-specific CSS flexbox stretching, safe-area-inset padding, and 100dvh viewport height bugs on mobile Safari.
- [ ] 167. [CTO - Memory Leak Profiler]: Implement an automated script testing continuous page scroll and modal open/close cycles for JavaScript heap memory leaks.
- [ ] 168. [QA - Form Validation Boundary Test]: Build comprehensive automated unit tests covering phone number regex (`+91`), Aadhaar formatting, and SQL injection sanitization.
- [ ] 169. [CTO - Dynamic Asset Compression]: Configure automated build-time AVIF/WebP image generation pipeline with responsive image placeholders (LQIP).
- [ ] 170. [QA - Dark/Light Contrast Audit]: Conduct an automated WCAG 2.1 AAA color contrast ratio audit across all text and icon components in both Student and Host modes.
- [ ] 171. [CTO - Edge Regional Failover]: Implement client-side automatic fallback to secondary REST endpoints when primary Supabase edge gateways experience high latency.

## Sprint 18: CPO & Community (Saarthi Connect, Intergenerational Mentorship & Senior SOS)
- [ ] 172. [CPO - Saarthi Connect Matching]: Build a mutual interest matching algorithm pairing student study disciplines (e.g., Tech, Literature, Music) with senior citizen hobbies.
- [ ] 173. [UI - Tech Assist Request Board]: Create an in-app noticeboard where senior hosts can post simple smartphone/computer tech help tasks (e.g., "Need help booking railway ticket").
- [ ] 174. [UX - Karma Points Redemption]: Build an exchange store where students can redeem volunteer Karma points earned through senior mentorship for free meal tokens.
- [ ] 175. [UI - Evening Chai Meetup Scheduler]: Design a calendar scheduling module for weekly communal terrace gatherings and storytelling sessions between hosts and students.
- [ ] 176. [CPO - Emergency Contact Sync]: Implement a one-click sync feature allowing parents to link directly with the elderly host's WhatsApp for real-time safety updates.
- [ ] 177. [UI - Digital Memory Book]: Create a shared digital photobook where departing students can leave handwritten notes and graduation photos for their senior hosts.
- [ ] 178. [UX - Senior Accessibility Controls]: Add an instant 1-tap "Elderly High Legibility" control setting 18px+ base typography, high contrast, and simplified button labels.
- [ ] 179. [CPO - Community Forum]: Build a moderated student-host discussion forum for sharing campus updates, second-hand books, and coaching advice.
- [ ] 180. [UI - Host Milestone Celebrations]: Design celebratory visual confetti and anniversary milestone banners for hosts completing 1 year of hosting with StashSaarthi.
- [ ] 181. [UX - Wellbeing Check-in]: Build a daily gentle notification prompt asking senior hosts for a 1-tap morning wellness check ("Sab theek hai?").

## Sprint 19: CRO & Operator Ops (Fleet & Logistics Routing, Warehouse Hubs & Pickup Schedulers)
- [ ] 182. [CRO - Multi-Item Stash Bundler]: Build an intuitive multi-item drag-and-drop luggage builder (Carton, Suitcase, Bicycle, Cooler, Books) with volume calculations.
- [ ] 183. [Operator - Dispatch Route Optimizer]: Design an operator routing view grouping hostel pickups in Kakadeo by street nodes to minimize travel time for logistics captains.
- [ ] 184. [UI - Logistics Captain App View]: Build a dedicated mobile web portal `/captain` for pickup drivers with barcode scanner, receipt printer trigger, and GPS route map.
- [ ] 185. [CRO - Same-Day Express Pickup]: Implement an "Express 2-Hour Pickup" upsell toggle with real-time captain availability confirmation.
- [ ] 186. [Operator - Warehouse Node Inventory Grid]: Create an interactive visual grid map of the micro-storage facility showing occupied vs. empty locker slots and shelf numbers.
- [ ] 187. [UX - Luggage Retrieval Scheduler]: Build an appointment scheduler for students returning to Kanpur after vacation to request locker drop-off at their new room.
- [ ] 188. [Operator - Host Payout Ledger]: Build an automated weekly payout calculation dashboard for elderly hosts with instant NEFT/IMPS payout CSV export.
- [ ] 189. [CRO - Fragile Item Insurance Addon]: Add a micro-insurance upgrade option for delicate electronics (laptops, monitors, guitar) during transit and storage.
- [ ] 190. [UI - Physical Seal Verification Screen]: Build a side-by-side photographic verification tool comparing bag seal photos taken at pickup vs. warehouse arrival.
- [ ] 191. [Operator - Real-Time Incident Reporting]: Create a quick-dispatch ticket logger for captains to flag broken bags, unverified contents, or rescheduled pickups.

## Sprint 20: CEO & Analytics (Investor Pitch Metrics, Unit Economics Scale & v4.0 Release)
- [ ] 192. [CEO - Unit Economics Heatmap]: Build an interactive unit economics cohort visualization showing monthly revenue per active student and host margin progression.
- [ ] 193. [CEO - Campus Market Penetration Tracker]: Create an executive dashboard module calculating market share across IIT Kanpur, HBTI, CSJMU, and Allen Kakadeo.
- [ ] 194. [CEO - Live Investor Deck Mode]: Implement an investor presentation mode on `/pitch` featuring real-time platform KPIs, unit margins, and growth trajectory.
- [ ] 195. [CEO - Founder WhatsApp Escalation Bot]: Build an automated routing system flagging critical host or safety tickets directly to the founder's WhatsApp (`+91 9369454350`).
- [ ] 196. [CEO - Impact Metrics Display]: Create a live public impact ticker showcasing total dead rent saved by students (₹) and dignified retirement income paid to seniors (₹).
- [ ] 197. [CEO - Multi-City Expansion Simulator]: Build an interactive financial model forecasting expansion to Kota, Lucknow, and Prayagraj student hubs.
- [ ] 198. [CEO - Operational SLA Dashboard]: Create an executive SLA monitoring console tracking average luggage pickup time, meal delivery punctuality, and host support response.
- [ ] 199. [CEO - Automated Daily Executive Digest]: Implement an automated cron script generating a daily operational summary of bookings, revenues, and active node capacity.
- [ ] 200. [CEO - Dynamic Prototype Toggle Guard]: Formalize and verify the global `SHOW_PROTOTYPE_TAGS` flag across all 200 feature modules for instant production switch.
- [ ] 201. [CEO - Master Release Note v4.0]: Compile all 200 tasks and Sprint 0-20 technical breakthroughs into the comprehensive StashSaarthi v4.0 Master Release Manifest.