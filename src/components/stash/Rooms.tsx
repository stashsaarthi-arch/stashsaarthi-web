import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Gift, Compass, Zap, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { supabase } from "@/integrations/supabase/client";
import { SafetyAuditModal } from "./SafetyAuditModal";
import { Room360Viewer } from "./Room360Viewer";
import { useLanguage } from "@/context/LanguageContext";
import { RoomCardSkeleton } from "@/components/ui/skeleton";
import { SaarthiSpacesCard2, type SaarthiSpacesListing } from "@/components/ui/primitives";
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
    id: "demo-1",
    owner_name: "Mr. Sharma",
    owner_phone: "+919369454350",
    rent_amount: 6500,
    address_location: "Kalyanpur, Kanpur · 6 min to IIT gate",
    transit_estimate: "🛺 ₹10 E-Rickshaw (4m) · 650m walk to Gate 1",
    transit_estimate_hi: "🛺 ₹10 ई-रिक्शा (4 मिनट) · 650मी गेट 1 तक पैदल",
    student_review:
      "Pros: Quiet lane, 24x7 water, owner never enters without asking.\nCons: Only one power backup point.",
    ratings: 4.5,
    capacity_badge: {
      text: "🟢 3 slots left in Kalyanpur",
      text_hi: "🟢 कल्याणपुर में 3 स्लॉट शेष",
      color: "emerald",
    },
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-2",
    owner_name: "Mrs. Verma",
    owner_phone: "+919369454350",
    rent_amount: 7800,
    address_location: "Gomti Nagar, Lucknow · near Phoenix",
    transit_estimate: "🛺 ₹15 E-Rickshaw (6m) · 900m to Metro / Campus",
    transit_estimate_hi: "🛺 ₹15 ई-रिक्शा (6 मिनट) · 900मी मेट्रो / कैंपस",
    student_review:
      "Pros: Furnished, home-cooked tiffin available downstairs.\nCons: Street parking is tight in the evening.",
    ratings: 4.8,
    capacity_badge: { text: "🟡 Only 1 room left", text_hi: "🟡 केवल 1 कमरा शेष", color: "amber" },
    image:
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "demo-3",
    owner_name: "Mr. Deshpande",
    owner_phone: "+919369454350",
    rent_amount: 9200,
    address_location: "Kothrud, Pune · 10 min to campus shuttle",
    transit_estimate: "🚌 Free Campus Shuttle (5m) · 400m to stop",
    transit_estimate_hi: "🚌 मुफ्त कैंपस शटल (5 मिनट) · 400मी स्टॉप तक",
    student_review: "Pros: Sunlit corner room, super-fast fibre.\nCons: Third floor, no lift.",
    ratings: 4.3,
    capacity_badge: {
      text: "🔵 High Demand Area",
      text_hi: "🔵 उच्च मांग वाला क्षेत्र",
      color: "cyan",
    },
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
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
  const [viewer360Open, setViewer360Open] = useState(false);
  const [selected360Room, setSelected360Room] = useState<Listing | null>(null);

  const handleOpen360 = (room: Listing) => {
    setSelected360Room(room);
    setViewer360Open(true);
  };

  const filters = t.rooms.filters || [
    { id: "all", label: isHi ? "सभी कमरे" : "All Rooms" },
    { id: "proximity", label: isHi ? "📍 कैंपस के पास (< 10 मिनट)" : "📍 Near Campus (< 10 min)" },
    { id: "iitk", label: isHi ? "🎓 आईआईटी कानपुर बेल्ट" : "🎓 IIT Kanpur Belt" },
    { id: "csjmu", label: isHi ? "🏢 सीएसजेएमयू / कल्याणपुर" : "🏢 CSJMU / Kalyanpur" },
    { id: "budget", label: isHi ? "🏷️ ₹7,000/माह से कम" : "🏷️ Under ₹7,000/mo" },
    { id: "top-rated", label: isHi ? "★ उच्चतम रेटेड (4.5+)" : "★ Highly Rated (4.5+)" },
  ];

  useEffect(() => {
    let active = true;
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from("crowdsourced_room_listings")
          .select("id, owner_name, owner_phone, rent_amount, address_location, student_review, ratings")
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
    if (activeFilter === "budget") {
      return (l.rent_amount ?? 99999) <= 7000;
    }
    if (activeFilter === "top-rated") {
      return (l.ratings ?? 0) >= 4.5;
    }
    if (activeFilter === "iitk") {
      return loc.includes("iit") || loc.includes("nankari") || loc.includes("barra");
    }
    if (activeFilter === "csjmu") {
      return loc.includes("kalyanpur") || loc.includes("csjmu") || loc.includes("awas vikas");
    }
    if (activeFilter === "proximity") {
      return (
        loc.includes("iit") ||
        loc.includes("min") ||
        loc.includes("gate") ||
        loc.includes("kalyanpur")
      );
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
    <div id="rooms" className="section-isolated layout-isolated relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20">
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
            className="border-emerald-500/40 bg-slate-950/80 text-emerald-300 hover:bg-emerald-500/20 text-xs px-3.5 py-2 font-bold flex-1 sm:flex-none border"
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
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black hover:brightness-110 shadow-[0_0_20px_-3px_rgba(16,185,129,0.6)] text-xs px-4 py-2 flex items-center gap-1.5 flex-1 sm:flex-none transition-all active:scale-95 cursor-pointer"
              onClick={() => onBook({ service: "spaces" })}
            >
              <Zap className="h-4 w-4 fill-current text-slate-950" />
              <span>{isHi ? "इन्स्टेंट रूम बुकिंग ⚡" : "Instant Booking ⚡"}</span>
            </Button>
          )}
        </div>
      </div>
      {/* ── 1-Tap Quick Filter Pills ── */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
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
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 md:grid md:gap-3.5 sm:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
          {loading ? (
            <>
              <div className="snap-center min-w-[85vw] md:min-w-0"><RoomCardSkeleton /></div>
              <div className="snap-center min-w-[85vw] md:min-w-0"><RoomCardSkeleton /></div>
              <div className="snap-center min-w-[85vw] md:min-w-0"><RoomCardSkeleton /></div>
            </>
          ) : (
            filteredListings.map((l, i) => (
              <div key={l.id} className="snap-center min-w-[85vw] md:min-w-0">
                <AnimatedContent
                  distance={30}
                  direction="vertical"
                  duration={0.5}
                  delay={i * 0.05}
                >
                  <SaarthiSpacesCard2
                    listing={{
                      ...l,
                      images: [
                        l.image || FALLBACK_IMAGES[i % 3] || "",
                        FALLBACK_IMAGES[(i + 1) % 3] || "",
                        FALLBACK_IMAGES[(i + 2) % 3] || "",
                      ],
                    }}
                    onBook={() => onBook?.({ service: "spaces" })}
                    onOpen360={(item) => handleOpen360(item as any)}
                    onOpenAudit={() => setAuditOpen(true)}
                  />
                </AnimatedContent>
              </div>
            )))}
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
      <Room360Viewer
        open={viewer360Open}
        onOpenChange={setViewer360Open}
        roomTitle={
          selected360Room?.owner_name
            ? `${selected360Room.owner_name}'s Verified Room`
            : "Saarthi Spaces Verified Room"
        }
        roomLocation={selected360Room?.address_location || "Kalyanpur, Kanpur"}
        rentAmount={selected360Room?.rent_amount || 6500}
      />
    </div>
  );
}
