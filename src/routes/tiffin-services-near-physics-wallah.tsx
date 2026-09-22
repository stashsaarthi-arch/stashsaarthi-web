import { createFileRoute } from "@tanstack/react-router";
import { CoachingHubTiffinPage, HubConfig } from "@/components/stash/CoachingHubTiffinPage";

const PW_CONFIG: HubConfig = {
  slug: "tiffin-services-near-physics-wallah",
  hubName: "Physics Wallah Vidyapeeth Hub Kakadeo",
  coachingName: "Physics Wallah (PW)",
  tagline: "Homestyle Tiffin Service 80m from Physics Wallah Vidyapeeth Kakadeo",
  heroDescription:
    "Pure homestyle tiffin service cooked by verified verified PG owner mothers in Kakadeo Kanpur. Located just 80 meters from Physics Wallah (PW) Vidyapeeth Chhapeda Pulia Center. Fresh hot phulkas, zero commercial preservatives, and flexible meal token system for PW students.",
  distance: "80 meters",
  walkingTime: "1-min walk",
  nearbyLandmarks: [
    "PW Vidyapeeth Main Campus Kakadeo",
    "Gurudev Palace Road",
    "Chhapeda Pulia Bus Stop",
    "Sharda Nagar Crossing",
  ],
  canonicalUrl: "https://stashsaarthi-web.vercel.app/tiffin-services-near-physics-wallah",
  metaTitle: "Tiffin Service Near Physics Wallah Kakadeo Kanpur | Home Food ₹50",
  metaDescription:
    "Best homestyle tiffin service near Physics Wallah (PW) Vidyapeeth Kakadeo Kanpur. Pure home-cooked meals from ₹50 cooked by verified PG owner mothers. Zero palm oil, 1-tap pause feature for NEET & JEE students.",
  metaKeywords:
    "tiffin service near Physics Wallah Kakadeo, PW Vidyapeeth Kanpur mess, home cooked thali near PW Kakadeo, ghar ka swaad tiffin PW Kanpur, cheap tiffin Kakadeo ₹50, PW student food Kanpur",
  chefName: "Annapurna Verified PG Owner Home Kitchen (PW Lane)",
  chefBio:
    "Managed by Sunita Sharma Ji and local verified PG owner homemakers. Serving hygienic, less-oil homemade thalis to 400+ Physics Wallah students daily.",
  rating: 4.8,
  totalOrders: "15,800+",
  activeStudents: 410,
  highlightReview: {
    studentName: "Divyansh Verma",
    targetExam: "NEET UG 2026",
    comment:
      "PW Vidyapeeth Kakadeo classes run long. Sunita Aunty's tiffin is right behind PW lane. The food tastes exactly like my premium host's cooking in Prayagraj—clean, non-oily, and super affordable at ₹50!",
    stars: 5,
  },
};

export const Route = createFileRoute("/tiffin-services-near-physics-wallah")({
  head: () => ({
    meta: [
      { title: PW_CONFIG.metaTitle },
      { name: "description", content: PW_CONFIG.metaDescription },
      { name: "keywords", content: PW_CONFIG.metaKeywords },
      { property: "og:title", content: PW_CONFIG.metaTitle },
      { property: "og:description", content: PW_CONFIG.metaDescription },
      {
        property: "og:image",
        content: "https://stashsaarthi-web.vercel.app/images/og-student.png",
      },
      { property: "og:url", content: PW_CONFIG.canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PW_CONFIG.metaTitle },
      { name: "twitter:description", content: PW_CONFIG.metaDescription },
      {
        name: "twitter:image",
        content: "https://stashsaarthi-web.vercel.app/images/og-student.png",
      },
    ],
    links: [{ rel: "canonical", href: PW_CONFIG.canonicalUrl }],
  }),
  component: PwTiffinRoute,
});

function PwTiffinRoute() {
  return <CoachingHubTiffinPage config={PW_CONFIG} />;
}
