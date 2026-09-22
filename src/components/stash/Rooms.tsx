import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BadgeCheck,
  MessageCircle,
  Phone,
  MapPin,
  Star,
  Gift,
  Compass,
  Zap,
  Search,
  Home,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { supabase } from "@/integrations/supabase/client";
import { SafetyAuditModal } from "./SafetyAuditModal";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { useLanguage } from "@/context/LanguageContext";
import { RoomCardSkeleton } from "@/components/ui/skeleton";
import type { OpenBooking } from "./types";

type Listing = {
  id: string;
  owner_name: string | null;
  owner_phone: string | null;
  rent_amount: number | null;
  address_location: string | null;
  student_review: string | null;
  ratings: number | null;
  transit_estimate?: string | null;
  transit_estimate_hi?: string | null;
  capacity_badge?: { text: string; text_hi?: string; color: "emerald" | "amber" | "cyan" } | null;
  image?: string;
};

const DEMO: Listing[] = [
  {
    id: "demo-kakadeo",
    owner_name: "Mrs. Pushpa Bajpai",
    owner_phone: "+919369454350",
    rent_amount: 5800,
    address_location: "Kakadeo, Kanpur · 3 min walk to PW & Allen",
    transit_estimate: "🚶 350m walk to Coaching Hub · ₹10 E-Rickshaw to Metro",
    transit_estimate_hi: "🚶 कोचिंग हब से 350मी पैदल · मेट्रो तक ₹10 ई-रिक्शा",
    student_review:
      "Pros: Silent study room, inverter backup, hot water in winter, home tiffin available.\nCons: Gate closes at 10:30 PM.",
    ratings: 4.9,
    capacity_badge: {
      text: "🟢 2 slots left in Kakadeo",
      text_hi: "🟢 काकादेव में 2 स्लॉट शेष",
      color: "emerald",
    },
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-kalyanpur",
    owner_name: "Mr. R. K. Sharma",
    owner_phone: "+919369454350",
    rent_amount: 6500,
    address_location: "Kalyanpur, Kanpur · 6 min to IIT Kanpur Gate 1",
    transit_estimate: "🛺 ₹10 E-Rickshaw (4m) · 650m walk to Gate 1",
    transit_estimate_hi: "🛺 ₹10 ई-रिक्शा (4 मिनट) · 650मी गेट 1 तक पैदल",
    student_review:
      "Pros: Quiet lane, 24x7 water, owner never enters without asking.\nCons: Only one power backup point.",
    ratings: 4.8,
    capacity_badge: {
      text: "🟢 3 slots left in Kalyanpur",
      text_hi: "🟢 कल्याणपुर में 3 स्लॉट शेष",
      color: "emerald",
    },
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-rawatpur",
    owner_name: "Col. D. S. Sengar (Retd.)",
    owner_phone: "+919369454350",
    rent_amount: 5200,
    address_location: "Rawatpur, Kanpur · 8 min to HBTI East Campus",
    transit_estimate: "🛺 ₹10 to Rawatpur Metro · 500m to HBTI",
    transit_estimate_hi: "🛺 रावतपुर मेट्रो तक ₹10 · HBTI से 500मी",
    student_review:
      "Pros: Verified PG Owner host family, safe environment for girl students, high-speed Wi-Fi.\nCons: No loud late-night music.",
    ratings: 4.7,
    capacity_badge: {
      text: "🟡 Only 1 room left",
      text_hi: "🟡 केवल 1 कमरा शेष",
      color: "amber",
    },
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-gumti",
    owner_name: "Dr. S. K. Gupta",
    owner_phone: "+919369454350",
    rent_amount: 6000,
    address_location: "Gumti No. 5, Kanpur · near GSVM Medical College",
    transit_estimate: "🚶 800m walk to GSVM Hospital · Market corridor",
    transit_estimate_hi: "🚶 GSVM अस्पताल से 800मी पैदल · मार्केट कॉरिडोर",
    student_review:
      "Pros: Complete market proximity, medical stores downstairs, clean attached washroom.\nCons: Evening street traffic.",
    ratings: 4.6,
    capacity_badge: {
      text: "🔵 High Demand",
      text_hi: "🔵 उच्च मांग क्षेत्र",
      color: "cyan",
    },
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-sharda",
    owner_name: "Mrs. Meena Srivastava",
    owner_phone: "+919369454350",
    rent_amount: 4900,
    address_location: "Sharda Nagar, Kanpur · peaceful student residential belt",
    transit_estimate: "🛺 ₹10 E-Rickshaw to Kakadeo Hub (5 min)",
    transit_estimate_hi: "🛺 काकादेव हब तक ₹10 ई-रिक्शा (5 मिनट)",
    student_review:
      "Pros: Zero disturbance, RO drinking water, private balcony, warm verified PG owner host.\nCons: Shared kitchen stove.",
    ratings: 4.9,
    capacity_badge: {
      text: "🟢 2 slots left",
      text_hi: "🟢 2 स्लॉट उपलब्ध",
      color: "emerald",
    },
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
  },
];

const DEFAULT_ROOM_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Crect width='600' height='400' fill='%23111827'/%3E%3Cpath d='M250 200 L300 150 L350 200 L350 260 L250 260 Z' fill='%2310B981' opacity='0.3'/%3E%3Crect x='285' y='215' width='30' height='45' fill='%23059669'/%3E%3Ctext x='300' y='300' font-family='sans-serif' font-size='16' fill='%239CA3AF' font-weight='bold' text-anchor='middle'%3EVerified Student Living%3C/text%3E%3C/svg%3E";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function RoomImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Blur-up placeholder skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/5" />
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        width={400}
        height={225}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setImgSrc(DEFAULT_ROOM_SVG);
          setLoaded(true);
        }}
        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
          loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"
        }`}
      />
    </div>
  );
}

export function Rooms({ onList, onBook }: { onList: () => void; onBook?: OpenBooking }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [listings, setListings] = useState<Listing[]>(DEMO);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [auditOpen, setAuditOpen] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  const filters = [
    { id: "all", label: isHi ? "सभी कानपुर क्लस्टर" : "All Kanpur Clusters" },
    { id: "kakadeo", label: isHi ? "🎯 काकादेव (कोचिंग)" : "🎯 Kakadeo Coaching" },
    { id: "kalyanpur", label: isHi ? "🎓 कल्याणपुर (IITK)" : "🎓 Kalyanpur (IITK)" },
    { id: "rawatpur", label: isHi ? "🚇 रावतपुर (HBTI)" : "🚇 Rawatpur (HBTI)" },
    { id: "gumti", label: isHi ? "🏥 गुमटी नं. 5 (GSVM)" : "🏥 Gumti No. 5" },
    { id: "sharda", label: isHi ? "🌿 शारदा नगर" : "🌿 Sharda Nagar" },
    { id: "budget", label: isHi ? "🏷️ ₹6,000 से कम" : "🏷️ Under ₹6,000/mo" },
    { id: "top-rated", label: isHi ? "★ रेटेड 4.8+" : "★ Top Rated 4.8+" },
  ];

  useEffect(() => {
    let active = true;
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("crowdsourced_room_listings")
          .select(
            "id, owner_name, owner_phone, rent_amount, address_location, student_review, ratings",
          )
          .eq("status", "verified")
          .order("created_at", { ascending: false })
          .limit(6);
        if (active && Array.isArray(data) && data.length > 0) {
          setListings(data as Listing[]);
        }
      } catch {
        // use default DEMO
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchListings();
    return () => {
      active = false;
    };
  }, []);

  const filteredListings = listings.filter((l) => {
    const loc = (l.address_location || "").toLowerCase();
    if (activeFilter === "kakadeo") {
      return loc.includes("kakadeo") || loc.includes("allen") || loc.includes("coaching");
    }
    if (activeFilter === "kalyanpur") {
      return loc.includes("kalyanpur") || loc.includes("iit");
    }
    if (activeFilter === "rawatpur") {
      return loc.includes("rawatpur") || loc.includes("hbti");
    }
    if (activeFilter === "gumti") {
      return loc.includes("gumti") || loc.includes("gsvm");
    }
    if (activeFilter === "sharda") {
      return loc.includes("sharda");
    }
    if (activeFilter === "budget") {
      return (l.rent_amount ?? 99999) <= 6000;
    }
    if (activeFilter === "top-rated") {
      return (l.ratings ?? 0) >= 4.8;
    }
    return true;
  });

  const formatReview = (text: string | null) => {
    if (!text) return null;
    if (isHi) {
      return text
        .replace(/Pros:/gi, "फायदे:")
        .replace(/Cons:/gi, "कमियां:")
        .replace(
          /Quiet lane, 24x7 water, owner never enters without asking./gi,
          "शांत गली, 24x7 पानी, मकान मालिक बिना पूछे कभी कमरे में नहीं आते।",
        )
        .replace(/Only one power backup point./gi, "केवल एक पावर बैकअप पॉइंट।")
        .replace(
          /Furnished, home-cooked tiffin available downstairs./gi,
          "फर्निश्ड, नीचे घर का बना टिफिन उपलब्ध है।",
        )
        .replace(
          /Street parking is tight in the evening./gi,
          "शाम को सड़क पर पार्किंग तंग हो जाती है।",
        )
        .replace(
          /Sunlit corner room, super-fast fibre./gi,
          "धूप वाला कोना कमरा, सुपर-फास्ट इंटरनेट फाइबर।",
        )
        .replace(/Third floor, no lift./gi, "तीसरी मंजिल, लिफ्ट नहीं है।");
    }
    return text;
  };

  return (
    <div id="rooms" className="relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20">
      {/* ── High-Contrast Action Banner: Find Broker-Free Rooms & Instant Booking ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 p-3 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
            <Home className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
              {isHi ? "सत्यापित 0% दलाली कमरे" : "Verified Broker-Free Rooms"}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                0% Brokerage
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isHi
                ? "आईआईटीके, सीएसजेएमयू और काकादेव के पास डायरेक्ट हॉस्ट को-लिविंग रूम्स"
                : "Direct host co-living rooms near IITK, CSJMU & Kakadeo coaching belt"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-500/40 bg-slate-950/80 text-emerald-300 hover:bg-emerald-500/20 text-xs px-3.5 py-2 font-bold flex-1 sm:flex-none border min-h-[44px]"
            onClick={() => {
              const el = document.getElementById("rooms");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Search className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
            {isHi ? "कमरे खोजें (0% ब्रोकरेज)" : "Find Broker-Free Rooms"}
          </Button>
          {onBook && (
            <Button
              variant="hero"
              size="sm"
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black hover:brightness-110 shadow-[0_0_20px_-3px_rgba(16,185,129,0.6)] text-xs px-4 py-2 flex items-center gap-1.5 flex-1 sm:flex-none transition-all active:scale-95 cursor-pointer min-h-[44px]"
              onClick={() => onBook({ service: "spaces" })}
            >
              <Zap className="h-4 w-4 fill-current text-slate-950" />
              <span>{isHi ? "इन्स्टेंट रूम बुकिंग ⚡" : "Instant Booking ⚡"}</span>
            </Button>
          )}
        </div>
      </div>
      {/* ── 1-Tap Kanpur Cluster Filter Pills ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto overscroll-x-contain no-scrollbar pb-2.5 mb-2 touch-pan-x">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[38px] flex items-center shrink-0 ${
                isActive
                  ? "border border-emerald-500/50 bg-emerald-500/15 text-emerald-300 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]"
                  : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        {/* Mobile Horizontal Carousel & Desktop 3-Column Grid */}
        <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory gap-3.5 sm:grid-cols-2 lg:grid-cols-3 pb-3 no-scrollbar touch-pan-x overscroll-x-contain">
          {loading ? (
            <>
              <RoomCardSkeleton />
              <RoomCardSkeleton />
              <RoomCardSkeleton />
            </>
          ) : (
            filteredListings.map((l, i) => (
              <AnimatedContent
                key={l.id}
                distance={30}
                direction="vertical"
                duration={0.5}
                delay={i * 0.05}
                className="snap-center min-w-[85vw] max-w-[88vw] sm:min-w-0 sm:max-w-none shrink-0 sm:shrink"
              >
                <article className="glass flex flex-col rounded-2xl p-3 group w-full h-full border border-white/[0.08]">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-2.5 border border-white/10 bg-slate-900">
                    <RoomImage
                      src={l.image || FALLBACK_IMAGES[i % 3] || DEFAULT_ROOM_SVG}
                      alt={l.address_location || "Student Room"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Badge overlay */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1.5 pointer-events-none">
                      <button
                        type="button"
                        onClick={() => setAuditOpen(true)}
                        className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-black/85 transition-colors cursor-pointer"
                      >
                        <span>✓</span> {t.rooms.studentReviewedBadge}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-1 pb-1">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-base font-extrabold">
                          {l.rent_amount
                            ? `${inr(l.rent_amount)}${t.rooms.perMonth}`
                            : t.rooms.rentOnRequest}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          ⚡ {isHi ? "0 रद्दीकरण शुल्क" : "Zero Cancellation"}
                        </span>
                      </div>
                      {l.ratings ? (
                        <span className="flex shrink-0 items-center gap-1 text-xs font-bold text-amber">
                          <Star className="h-3 w-3 fill-current" /> {l.ratings}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 flex items-center flex-wrap gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0 text-cyan" />
                      <span className="min-w-0">{l.address_location}</span>
                      <PrototypeBadge variant="text" />
                    </p>

                    {(isHi && l.transit_estimate_hi
                      ? l.transit_estimate_hi
                      : l.transit_estimate) && (
                      <div className="mt-1.5 inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        {isHi && l.transit_estimate_hi ? l.transit_estimate_hi : l.transit_estimate}
                      </div>
                    )}

                    {(l as any).capacity_badge && (
                      <div
                        className={`mt-1.5 inline-flex items-center w-fit rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          (l as any).capacity_badge.color === "emerald"
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : (l as any).capacity_badge.color === "amber"
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                              : "border-cyan-500/20 bg-cyan-500/10 text-cyan-400"
                        }`}
                      >
                        {(l as any).capacity_badge.label}
                      </div>
                    )}

                    {l.student_review && (
                      <div className="mt-2 rounded-xl bg-white/[0.03] border border-white/[0.05] p-2 text-[11px] text-slate-300 italic line-clamp-2">
                        "{formatReview(l.student_review)}"
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between gap-1.5 pt-2 border-t border-white/[0.06]">
                      {onBook ? (
                        <div className="flex-1 flex items-center gap-1.5">
                          <Button
                            variant="heroEmerald"
                            size="sm"
                            className="flex-1 text-xs py-1.5 font-bold min-h-[36px]"
                            onClick={() => {
                              const roomRent = l.rent_amount || 6000;
                              const roomTypePref =
                                roomRent > 8000 ? "floor" : roomRent <= 4500 ? "shared" : "single";
                              onBook({
                                service: "spaces",
                                note: `Selected Room: ${l.address_location} (₹${roomRent.toLocaleString("en-IN")}/mo)`,
                                amount: roomRent,
                                address: l.address_location || undefined,
                                roomType: roomTypePref,
                              });
                            }}
                          >
                            {t.rooms.bookDirectly}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] py-1.5 px-2 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 min-h-[36px]"
                            onClick={() => {
                              onBook({
                                service: "spaces",
                                note: `Schedule Verified Visit: ${l.address_location} (₹${(l.rent_amount || 6000).toLocaleString("en-IN")}/mo)`,
                                amount: 0,
                                address: l.address_location || undefined,
                                roomType:
                                  (l.rent_amount || 6000) > 8000
                                    ? "floor"
                                    : (l.rent_amount || 6000) <= 4500
                                      ? "shared"
                                      : "single",
                              });
                            }}
                            title={
                              isHi
                                ? "15-मिनट ऑन-साइट रूम विजिट शेड्यूल करें"
                                : "Schedule 15-min Room Visit"
                            }
                          >
                            <Calendar className="h-3 w-3 sm:mr-1 text-emerald-400" />
                            <span className="hidden sm:inline">{isHi ? "विजिट" : "Visit"}</span>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs py-1.5 border-emerald-500/30 text-emerald-400"
                          onClick={() => {
                            const url = `https://wa.me/919369454350?text=${encodeURIComponent(
                              `Hello StashSaarthi, I am interested in verified room: ${l.address_location} (₹${l.rent_amount}/mo)`,
                            )}`;
                            window.open(url, "_blank");
                          }}
                        >
                          {isHi ? "व्हाट्सएप पूछताछ" : "Inquire Room"}
                        </Button>
                      )}
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 shrink-0"
                        aria-label={
                          isHi ? "मालिक या सार्थी कंसीयज को कॉल करें" : "Call owner or concierge"
                        }
                      >
                        <a href={`tel:${(l.owner_phone || FOUNDER_WHATSAPP).replace(/\s/g, "")}`}>
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </AnimatedContent>
            ))
          )}
        </div>
      </div>

      <div className="glass mt-4 flex flex-col items-center gap-3 rounded-2xl p-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <Gift className="h-5 w-5 shrink-0 text-amber" />
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{t.rooms.vacatingTitle}</span>{" "}
            {t.rooms.vacatingDesc}
          </p>
        </div>
        <Button
          variant="warm"
          size="default"
          className="w-full shrink-0 sm:w-auto text-xs py-1.5"
          onClick={onList}
        >
          {t.rooms.listVacatingBtn}
        </Button>
      </div>

      <SafetyAuditModal open={auditOpen} onOpenChange={setAuditOpen} />
    </div>
  );
}
