import { createFileRoute } from "@tanstack/react-router";
import { KakadeoSurvivalGuide } from "@/components/stash/KakadeoSurvivalGuide";

const GUIDEO_META = {
  metaTitle: "The Complete Kakadeo Student Survival Guide PDF | StashSaarthi Kanpur",
  metaDescription:
    "Free downloadable student survival guide for Kakadeo Kanpur. Essential hacks on PW/Motion/Allen coaching hubs, ₹50 homestyle tiffins, zero-brokerage rooms, and ₹300/mo vacation luggage storage.",
  metaKeywords:
    "Kakadeo survival guide PDF, Kakadeo student guide Kanpur, PW Vidyapeeth Kakadeo mess, Motion coaching Kanpur room rent, Allen Kakadeo PG guide, cheap tiffin Kakadeo ₹50, StashSaarthi Kanpur guide",
  canonicalUrl: "https://stashsaarthi-web.vercel.app/kakadeo-survival-guide",
};

export const Route = createFileRoute("/kakadeo-survival-guide")({
  head: () => ({
    meta: [
      { title: GUIDEO_META.metaTitle },
      { name: "description", content: GUIDEO_META.metaDescription },
      { name: "keywords", content: GUIDEO_META.metaKeywords },
      { property: "og:title", content: GUIDEO_META.metaTitle },
      { property: "og:description", content: GUIDEO_META.metaDescription },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
      { property: "og:url", content: GUIDEO_META.canonicalUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: GUIDEO_META.metaTitle },
      { name: "twitter:description", content: GUIDEO_META.metaDescription },
      { name: "twitter:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
    ],
    links: [{ rel: "canonical", href: GUIDEO_META.canonicalUrl }],
  }),
  component: KakadeoSurvivalGuideRoute,
});

function KakadeoSurvivalGuideRoute() {
  return <KakadeoSurvivalGuide />;
}
