import { createFileRoute } from "@tanstack/react-router";
import { CoachingHubTiffinPage, HubConfig } from "@/components/stash/CoachingHubTiffinPage";

const ALLEN_CONFIG: HubConfig = {
  slug: "tiffin-services-near-allen",
  hubName: "Allen Career Institute Kakadeo Hub",
  coachingName: "Allen Career Institute",
  tagline: "Pure Homestyle Tiffin Service 100m from Allen Career Institute Kakadeo",
  heroDescription:
    "Pure home-cooked tiffin service prepared by verified verified PG owner mothers in Kakadeo Kanpur. Located just 100 meters from Allen Career Institute (Allen Kakadeo Main Building). Pure desi ghee phulkas, zero commercial preservatives, and flexible meal pause during test series.",
  distance: "100 meters",
  walkingTime: "2-min walk",
  nearbyLandmarks: [
    "Allen Kakadeo Main Campus",
    "Chhapeda Pulia Circle",
    "Geeta Nagar Road",
    "Allen Hostel Lane #4",
  ],
  canonicalUrl: "https://stashsaarthi-web.vercel.app/tiffin-services-near-allen",
  metaTitle: "Tiffin Service Near Allen Coaching Kakadeo Kanpur | Homestyle Thali ₹50",
  metaDescription:
    "Best home-cooked tiffin service near Allen Career Institute Kakadeo Kanpur. Pure homestyle thali from ₹50 prepared by verified PG owner mothers. 100% hygienic, zero palm oil, 1-tap meal pause feature for Allen NEET/JEE students.",
  metaKeywords:
    "tiffin service near Allen coaching Kakadeo, Allen coaching Kanpur mess, home cooked thali near Allen Kakadeo, ghar ka swaad tiffin Allen Kanpur, cheap tiffin Kakadeo ₹50, Allen student thali Kanpur",
  chefName: "Dadi Maa Verified PG Owner Home Kitchen (Allen Lane)",
  chefBio: "Managed by Verified PG Owner Host Kamla Arora Ji. Cooking light, nutritious, digestive home meals for Allen JEE & NEET aspirants in Kakadeo for over 12 years.",
  rating: 4.9,
  totalOrders: "14,200+",
  activeStudents: 380,
  highlightReview: {
    studentName: "Rishabh Tripathi",
    targetExam: "NEET UG 2026",
    comment:
      "Allen Kakadeo doubt classes finish late. Kamla Aunty's tiffin center is right in the lane behind Allen building. Fresh hot rotis with pure ghee every single afternoon!",
    stars: 5,
  },
};

export const Route = createFileRoute("/tiffin-services-near-allen")({
  head: () => ({
    meta: [
      { title: ALLEN_CONFIG.metaTitle },
      { name: "description", content: ALLEN_CONFIG.metaDescription },
      { name: "keywords", content: ALLEN_CONFIG.metaKeywords },
      { property: "og:title", content: ALLEN_CONFIG.metaTitle },
      { property: "og:description", content: ALLEN_CONFIG.metaDescription },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
      { property: "og:url", content: ALLEN_CONFIG.canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ALLEN_CONFIG.metaTitle },
      { name: "twitter:description", content: ALLEN_CONFIG.metaDescription },
      { name: "twitter:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
    ],
    links: [{ rel: "canonical", href: ALLEN_CONFIG.canonicalUrl }],
  }),
  component: AllenTiffinRoute,
});

function AllenTiffinRoute() {
  return <CoachingHubTiffinPage config={ALLEN_CONFIG} />;
}
