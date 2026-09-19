/**
 * StashSaarthi SEO Long-Tail Keyword & Meta Description Optimization Engine
 *
 * Provides hyper-targeted long-tail metadata optimized for specific search intents:
 * 1. Vacation Micro-Storage (IIT Kanpur, HBTI, CSJMU)
 * 2. Zero-Brokerage Co-Living Rooms (Kakadeo, PW/Allen Coaching Hub)
 * 3. Homemade Tiffin Service (Ghar Ka Swaad Kanpur)
 * 4. Verified PG Owner Host Tech-Enabled Passive Income & Intergenerational Living
 * 5. Student Dead-Rent Savings Calculator
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  h1Text?: string;
}

export const BASE_URL = "https://stashsaarthi-web.vercel.app";

export type SEOKey = "stash" | "rooms" | "kitchen" | "host" | "calculator" | "admin" | "default";

export const LONG_TAIL_SEO_CONFIG: Record<SEOKey, SEOMetadata> = {
  // 1. Vacation Micro-Storage Long-Tail Focus
  stash: {
    title: "Student Luggage Storage Kanpur | IIT Kanpur & HBTI Vacation Stash ₹300/mo",
    description:
      "Affordable student luggage storage in Kanpur. Store vacation suitcases, books & hostel essentials at ₹300/bag/mo with ₹10,000 safety cover, 24/7 IoT climate control & doorstep pickup near IIT Kanpur, HBTI & Kakadeo.",
    keywords:
      "student luggage storage Kanpur, vacation luggage stash IIT Kanpur, hostel luggage storage HBTI, summer break storage Kanpur, cheap luggage storage ₹300, dead rent savings Kanpur, student bag locker Kanpur",
    ogImage: `${BASE_URL}/images/og-student.png`,
    canonicalUrl: `${BASE_URL}/?service=stash`,
    h1Text: "Campus Micro-Storage for Vacation Luggage in Kanpur",
  },

  // 2. Zero-Brokerage Student Rooms Long-Tail Focus
  rooms: {
    title: "Zero-Brokerage Student Rooms Kakadeo Kanpur | PGs near PW & Allen",
    description:
      "Find zero-brokerage student rooms in Kakadeo Kanpur hosted by verified verified PG owner citizens. No broker fees, peaceful study environment, verified student community & safety cover near PW, Motion & Allen coaching centers.",
    keywords:
      "zero brokerage student rooms Kanpur, broker free PG Kakadeo Kanpur, rooms near Physics Wallah Kanpur, student flat Kakadeo, verified PG owner hosted student room Kanpur, Allen coaching PG Kakadeo, single room student Kanpur",
    ogImage: `${BASE_URL}/images/og-student.png`,
    canonicalUrl: `${BASE_URL}/?service=rooms`,
    h1Text: "Zero-Brokerage Verified PG Owner-Hosted Student Rooms in Kakadeo",
  },

  // 3. Homemade Tiffin Service Long-Tail Focus
  kitchen: {
    title: "Homemade Tiffin Service Kakadeo Kanpur | Pure Home-Cooked Meals ₹90",
    description:
      "Pure homestyle tiffin service in Kakadeo Kanpur cooked by verified PG owner mothers. Hygienic, fresh home-cooked thalis from ₹90/meal with zero preservatives, custom monthly meal plans & doorstep delivery near student hostels.",
    keywords:
      "tiffin service Kakadeo Kanpur, home cooked meals student Kanpur, homemade tiffin near Physics Wallah, ghar ka swaad tiffin Kanpur, student thali service Kanpur, best tiffin service Kakadeo, healthy mess Kanpur",
    ogImage: `${BASE_URL}/images/og-student.png`,
    canonicalUrl: `${BASE_URL}/?service=kitchen`,
    h1Text: "Pure Homestyle Tiffin Service in Kakadeo Kanpur",
  },

  // 4. Verified PG Owner Host Passive Income Focus
  host: {
    title: "Verified PG Owner Host Passive Income Kanpur | Rent Empty Room for ₹11,500/month",
    description:
      "Earn ₹11,500+/month tech-enabled passive income in Kanpur by hosting verified university students or storing vacation luggage. 100% control over house norms, zero intrusion & ₹10,000 security cover.",
    keywords:
      "premium host passive income Kanpur, rent empty room verified PG owner host Kanpur, tech-enabled verified PG owner living income, high-margin ROI host student accommodation Kanpur, earn from spare room Kanpur, verified PG owner host safety cover Kanpur",
    ogImage: `${BASE_URL}/images/og-host.png`,
    canonicalUrl: `${BASE_URL}/?role=host`,
    h1Text: "Tech-Enabled Passive Income for Premium Hosts in Kanpur",
  },

  // 5. Calculator Focus
  calculator: {
    title: "Student Vacation Dead-Rent Calculator Kanpur | Calculate Semester Savings",
    description:
      "Calculate your student vacation dead-rent savings in Kanpur. Stop paying full hostel rent during 2-4 month semester breaks. Compare traditional empty room rent vs StashSaarthi ₹300/mo micro-storage.",
    keywords:
      "student dead rent calculator Kanpur, hostel rent savings calculator, vacation rent waste Kanpur, semester break storage savings, IIT Kanpur luggage storage cost calculator",
    ogImage: `${BASE_URL}/images/og-student.png`,
    canonicalUrl: `${BASE_URL}/#calculator`,
    h1Text: "Official Kanpur Student Dead-Rent Savings Audit Calculator",
  },

  // 6. Admin Portal
  admin: {
    title: "StashSaarthi Operations Console & Investor Unit Economics",
    description:
      "Secure operational control dashboard, waitlist telemetry, campus node health, and unit economics console for StashSaarthi Kanpur.",
    keywords:
      "StashSaarthi admin, StashSaarthi operational telemetry, campus storage metrics Kanpur, micro storage unit economics",
    ogImage: `${BASE_URL}/images/og-admin.png`,
    canonicalUrl: `${BASE_URL}/admin`,
    h1Text: "StashSaarthi Governance & Operations Console",
  },

  // Default Home (Student Persona)
  default: {
    title: "StashSaarthi - Campus Micro-Storage & Zero-Brokerage Living in Kanpur",
    description:
      "India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform in Kanpur. Vacation luggage storage at ₹300/bag/mo, zero-brokerage verified PG owner-hosted rooms, and pure homemade tiffins.",
    keywords:
      "StashSaarthi, student luggage storage Kanpur, campus micro storage, Kanpur student rooms, broker free PG Kakadeo, IIT Kanpur luggage stash, vacation dead rent, ghar ka swaad tiffin Kanpur",
    ogImage: `${BASE_URL}/images/og-banner-new.png`,
    canonicalUrl: BASE_URL,
    h1Text: "India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform",
  },
};

/**
 * Derives the optimal long-tail SEO metadata based on current pathname, query params, hash, and persona role.
 */
export function getOptimalSEO(
  pathname: string,
  searchString: string = "",
  hash: string = "",
  role: string = "student"
): SEOMetadata {
  if (pathname === "/admin") {
    return LONG_TAIL_SEO_CONFIG.admin;
  }

  const params = new URLSearchParams(searchString);
  const service = params.get("service")?.toLowerCase();

  if (service === "stash") {
    return LONG_TAIL_SEO_CONFIG.stash;
  }
  if (service === "rooms") {
    return LONG_TAIL_SEO_CONFIG.rooms;
  }
  if (service === "kitchen") {
    return LONG_TAIL_SEO_CONFIG.kitchen;
  }

  if (hash === "#calculator" || params.get("intent") === "calculator") {
    return LONG_TAIL_SEO_CONFIG.calculator;
  }

  if (role === "host" || params.get("role") === "host") {
    return LONG_TAIL_SEO_CONFIG.host;
  }

  return LONG_TAIL_SEO_CONFIG.default;
}


