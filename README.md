# StashSaarthi Connect

Build a world-class, hyper-interactive, dark-themed Web App for "StashSaarthi" — India's premier hyper-local living ecosystem bridging student mobility with intergenerational community support.

### 🎨 1. DESIGN SYSTEM & VISUAL STYLE

- Theme: Ultra-modern Dark Mode (`bg-[#06080E]`, surface `bg-[#0F1420]/80`, borders `border-white/10`).

- Accent Colors:

  - Electric Cyan (`#00F2FE`) for Tech & Stash Logistics

  - Warm Amber (`#F59E0B`) for Senior Companion & Home Kitchen

  - Trust Emerald (`#10B981`) for Verification & Safety

- Glassmorphism: Heavy backdrop blur (`backdrop-blur-xl`), soft inner glows, and floating 3D glass elevation effects.

- Typography: Plus Jakarta Sans / Inter with gradient text fills (`bg-clip-text text-transparent bg-gradient-to-r`).

- Cursor & Motion: Custom magnetic cursor effect, Lenis smooth scrolling, and Framer Motion spring physics on all hover/click states.

---

### 🧱 2. NAVIGATION BAR

- Glassmorphic top sticky header with StashSaarthi brand logo and glowing badge "Hyper-Local Living Engine".

- Nav Links: "Ecosystem Nodes", "Dual Crisis", "Storage Calculator", "Saarthi Connect", "Safety Infrastructure".

- Interactive Role Switcher Toggle: "I am a Student" vs "I am an Elderly Host" (dynamically updates page highlight accents, hero stats, and primary CTA buttons).

- CTA Button: "Explore Ecosystem" (opens interactive booking modal).

---

### 🚀 3. HERO SECTION WITH 3D CANVAS NODE NETWORK

- Background: A WebGL/Canvas interactive particle constellation network that moves smoothly with mouse cursor physics.

- Headlines:

  - Small Badge: "INDIA'S FIRST INTERGENERATIONAL LIVING PLATFORM"

  - Main Title: "Your Space. Your Food. Your People." (with animated gradient sweep).

  - Subtitle: "Solving student housing & vacation storage friction while bringing companionship and assistance to senior citizens."

- Dual Primary CTAs:

  - "Store Luggage @ ₹300/mo" (Primary Cyan Gradient)

  - "Find Verified Co-Living" (Secondary Frosted Glass)

- Live Stats Bar (Floating Glass Card):

  - 100% Brokerage Free | 3-Tier Verified | 10k+ Unused Spaces Mapped | Zero-CapEx Model

---

### 🎛️ 4. INTERACTIVE DUAL-CRISIS SPLIT SLIDER

- Headline: "Two Crises. One Connected Ecosystem."

- Interactive Drag/Hover Split Container:

  - Left Panel (Student Crisis): High Rent, Broker Fraud, Vacation Luggage Risk, Unhygienic Mess Food.

  - Right Panel (Senior Isolation): 1.5Cr+ Living Alone, Empty Rooms, Lack of Daily Errands & Tech Support.

  - Center Divider Handle: User can drag the handle or click "Merge Solution" to trigger a particle effect converging both problems into the StashSaarthi ecosystem solution.

---

### 🌀 5. THE 6-DIMENSION ECOSYSTEM EXPLORER

- Interactive Circular/Grid Node Interface for the 6 core pillars:

  1. `Saarthi Spaces` (Broker-free PGs & Flats)

  2. `Saarthi Kitchen` (Home-style Tiffins & Home Chefs)

  3. `Saarthi Stash` (Micro-storage @ ₹300/month)

  4. `Saarthi Connect` (Intergenerational Skill Exchange Stay)

  5. `Trust Infrastructure` (3-Tier Verification)

  6. `Micro-Opportunity` (Local Economy Onboarding)

- Interaction: Clicking any node pulls focus smoothly, expands an interactive slide-over drawer with detailed features, real-world previews, and an instant booking action button.

---

### 🧮 6. LIVE STASH & RENT SAVINGS CALCULATOR (WIDGET)

- Build a fully working React state widget:

  - Slider 1: "Number of Luggage Bags / Boxes" (1 to 10 bags)

  - Slider 2: "Vacation Duration" (1 to 4 Months)

  - Input: "Your Monthly Rent" (e.g., ₹8,000/month)

- Live Output Box:

  - Money Lost paying rent during breaks vs Cost with Saarthi Stash (₹300/mo per bag).

  - Highlights Total Net Savings (e.g., "You Save ₹21,600 this vacation!").

  - CTA Button: "Reserve Stash Spot Now".

---

### 🤝 7. SAARTHI CONNECT: INTERGENERATIONAL MATCH SIMULATOR

- Headline: "Built for Youth. Powered by Wisdom."

- Interactive Matchmaker Cards showing sample student-senior pairs:

  - Student Card: Provides 1 hr/day Tech Help & Grocery Errands.

  - Senior Card: Offers Subsidized Private Room & Mentorship.

- Interactive Filter Pills: Select city (Kanpur, Lucknow, Delhi NCR, Pune) to update matched profiles with subtle hover glass card zoom.

---

### 🛡️ 8. 3-TIER TRUST & SAFETY INFRASTRUCTURE

- Headline: "Trust is Our Core Infrastructure"

- Interactive Hologram Inspection Cards:

  - Level 1: Government Identity & Biometric Verification Check

  - Level 2: Police Background Check & Student University Enrollment Verification

  - Level 3: Physical On-Site Property & Micro-Storage Security Audit

- On hover/click, display a animated green scan-line effect over a mock verification badge.

---

### 💬 9. COMMUNITY STORIES & TESTIMONIALS

- Tabbed Interface: "Student Experiences" | "Elderly Host Stories" | "Food Vendor Partners"

- Cards with avatar, star rating, verified badge, audio visualizer bar effect, and real text reviews.

---

### 🏁 10. FOOTER & CONCIERGE BOOKING DRAWER

- Headline: "A City Where No One Arrives Alone."

- Newsletter/Waitlist Input: Email input with instant success Sonner toast notification ("You're on the priority list!").

- City Ticker & Footers: Quick Links, Legal Disclaimers, Social Media icons, and Copyright notice.

---

### 💻 TECHNICAL STACK

- React 19 + TypeScript + Vite + TanStack Start SSR
- Tailwind CSS with custom utilities for glassmorphism and gradient text
- Motion / Framer Motion & GSAP for rich animations
- Lenis smooth scrolling
- Sonner for toast notifications
- Radix UI primitives (Dialog, Tabs, Slider, Drawer, Badge, Tooltip)
- Supabase integration with Google OAuth

**Live app**: https://stashsaarthi.in

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
