import { createFileRoute } from "@tanstack/react-router";
import { CoachingHubTiffinPage, HubConfig } from "@/components/stash/CoachingHubTiffinPage";

const MOTION_CONFIG: HubConfig = {
  slug: "tiffin-services-near-motion",
  hubName: "Motion Coaching Hub Kakadeo",
  coachingName: "Motion Coaching",
  tagline: "Pure Homestyle Tiffin Service 120m from Motion Coaching Kakadeo",
  heroDescription:
    "Pure homestyle tiffin service cooked by verified verified PG owner mothers in Kakadeo Kanpur. Located just 120 meters from Motion Coaching Main Building. Pure desi ghee rotis, zero palm oil, and 1-tap meal pause during JEE/NEET test series.",
  distance: "120 meters",
  walkingTime: "2-min walk",
  nearbyLandmarks: [
    "Motion Coaching Main Building Kakadeo",
    "Chhapeda Pulia Circle",
    "Geeta Nagar Cross Road",
    "Devki Palace Hostel Lane",
  ],
  canonicalUrl: "https://stashsaarthi-web.vercel.app/tiffin-services-near-motion",
  metaTitle: "Tiffin Service Near Motion Coaching Kakadeo Kanpur | Homestyle Thali ₹50",
  metaDescription:
    "Best home-cooked tiffin service near Motion Coaching Kakadeo Kanpur. Pure homestyle thali from ₹50 cooked by verified PG owner mothers. 100% hygienic, zero palm oil, 1-tap pause feature for NEET/JEE students.",
  metaKeywords:
    "tiffin service near Motion coaching Kakadeo, Motion coaching Kanpur mess, home cooked thali near Motion Kakadeo, ghar ka swaad tiffin Motion Kanpur, cheap tiffin Kakadeo ₹50, student thali Motion coaching",
  chefName: "Shanti Verified PG Owner Home Kitchen (Motion Lane)",
  chefBio: "Cooking nutritious home meals for NEET & JEE aspirants in Kakadeo for over 14 years. Specializes in light digestible dal fry & pure desi ghee rotis.",
  rating: 4.9,
  totalOrders: "12,400+",
  activeStudents: 340,
  highlightReview: {
    studentName: "Anurag Sharma",
    targetExam: "JEE Advanced 2026",
    comment:
      "Motion Coaching classes end at 1:15 PM and I get fresh hot phulkas with pure ghee right opposite the lane in 2 minutes. Never had stomach trouble once since switching to Shanti Aunty's tiffin!",
    stars: 5,
  },
};

export const Route = createFileRoute("/tiffin-services-near-motion")({
  head: () => ({
    meta: [
      { title: MOTION_CONFIG.metaTitle },
      { name: "description", content: MOTION_CONFIG.metaDescription },
      { name: "keywords", content: MOTION_CONFIG.metaKeywords },
      { property: "og:title", content: MOTION_CONFIG.metaTitle },
      { property: "og:description", content: MOTION_CONFIG.metaDescription },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
      { property: "og:url", content: MOTION_CONFIG.canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: MOTION_CONFIG.metaTitle },
      { name: "twitter:description", content: MOTION_CONFIG.metaDescription },
      { name: "twitter:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
    ],
    links: [{ rel: "canonical", href: MOTION_CONFIG.canonicalUrl }],
  }),
  component: MotionTiffinRoute,
});

function MotionTiffinRoute() {
  return <CoachingHubTiffinPage config={MOTION_CONFIG} />;
}
