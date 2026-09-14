import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Zap,
  MessageCircle,
  Phone,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "./button";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import { getSaarthiSpacesCardTokens } from "@/lib/designTokens";
import { playHeroCtaClick, playPop } from "@/lib/audio";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";

export interface SaarthiSpacesListing {
  id: string;
  owner_name: string | null;
  owner_phone: string | null;
  rent_amount: number | null;
  address_location: string | null;
  student_review: string | null;
  ratings: number | null;
  transit_estimate?: string | null;
  transit_estimate_hi?: string | null;
  images?: string[];
  image?: string;
  walking_distance?: {
    en: string;
    hi: string;
  };
  capacity_badge?: {
    text: string;
    text_hi?: string;
    color: "emerald" | "amber" | "cyan";
  } | null;
}

export interface SaarthiSpacesCard2Props {
  listing: SaarthiSpacesListing;
  onBook?: (listing: SaarthiSpacesListing) => void;
  onOpen360?: (listing: SaarthiSpacesListing) => void;
  onOpenAudit?: () => void;
}

const DEFAULT_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
];

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export function SaarthiSpacesCard2({
  listing,
  onBook,
  onOpen360,
  onOpenAudit,
}: SaarthiSpacesCard2Props) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";
  const isHost = role === "host";

  const tokens = getSaarthiSpacesCardTokens(role);

  // Extract or build carousel images (guarantee 3 images)
  const carouselImages =
    listing.images && listing.images.length > 0
      ? listing.images
      : listing.image
      ? [listing.image, DEFAULT_ROOM_IMAGES[1], DEFAULT_ROOM_IMAGES[2]]
      : DEFAULT_ROOM_IMAGES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance carousel when hovered off
  useEffect(() => {
    if (isHovered || carouselImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, tokens.carousel.autoPlayIntervalMs);
    return () => clearInterval(interval);
  }, [isHovered, carouselImages.length, tokens.carousel.autoPlayIntervalMs]);

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Derive walking distance string
  const walkingDist =
    listing.walking_distance?.[isHi ? "hi" : "en"] ||
    (listing.address_location?.toLowerCase().includes("iit")
      ? tokens.distanceTags.iitk[isHi ? "tagHi" : "tagEn"]
      : listing.address_location?.toLowerCase().includes("kakadeo")
      ? tokens.distanceTags.kakadeo[isHi ? "tagHi" : "tagEn"]
      : tokens.distanceTags.csjmu[isHi ? "tagHi" : "tagEn"]);

  return (
    <article
      data-persona={role}
      className={`glass group relative flex flex-col rounded-3xl p-3.5 transition-all duration-300 hover:shadow-2xl ${
        isHost
          ? "border-amber-500/30 hover:border-amber-500/60"
          : "border-emerald-500/30 hover:border-emerald-500/60"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── 16:9 Room Image Carousel ── */}
      <div className="spaces-card-16-9-stage relative w-full rounded-2xl border border-white/10 bg-slate-950">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={carouselImages[currentSlide]}
            alt={listing.address_location || "Verified Room"}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </AnimatePresence>

        {/* Ambient Gradient Overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40" />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          {/* Zero Brokerage Pill */}
          <span className="zero-brokerage-pill-glow inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold text-emerald-300">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>{isHi ? tokens.zeroBrokerageGuarantee.labelHi : tokens.zeroBrokerageGuarantee.labelEn}</span>
          </span>

          {/* 360° Virtual Tour Button */}
          {onOpen360 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                playPop();
                onOpen360(listing);
              }}
              className="bg-emerald-950/85 backdrop-blur-md border border-emerald-500/50 text-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-400 hover:text-slate-950 transition-all cursor-pointer shadow-lg group/tour"
            >
              <Compass className="h-3.5 w-3.5 text-emerald-400 group-hover/tour:rotate-180 transition-transform duration-500" />
              <span>{isHi ? "360° रूम टूर" : "360° Tour"}</span>
            </button>
          )}
        </div>

        {/* Carousel Navigation Arrows */}
        {carouselImages.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 cursor-pointer z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-900 cursor-pointer z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Carousel Slide Indicator Dots */}
        {carouselImages.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  playPop();
                  setCurrentSlide(idx);
                }}
                className={`spaces-carousel-dot cursor-pointer ${
                  currentSlide === idx
                    ? "spaces-carousel-dot-active"
                    : "bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content Body ── */}
      <div className="mt-3 flex flex-1 flex-col px-1">
        {/* Verified Senior Host Badge */}
        <div className="verified-host-shield-badge mb-2.5 flex items-center justify-between rounded-xl px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1">
                <span>{listing.owner_name || (isHi ? "सत्यापित सीनियर होस्ट" : "Verified Senior Host")}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/30">
                  TPA Sec 105
                </span>
              </p>
              <p className="text-[9.5px] text-slate-400">
                {isHi ? tokens.verifiedHostBadge.subtextHi : tokens.verifiedHostBadge.subtextEn}
              </p>
            </div>
          </div>
          {onOpenAudit && (
            <button
              onClick={() => {
                playPop();
                onOpenAudit();
              }}
              className="text-[9.5px] font-bold text-amber-400 hover:underline cursor-pointer"
            >
              {isHi ? "सुरक्षा देखें" : "Audit Shield"}
            </button>
          )}
        </div>

        {/* Price & Rating Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-white tracking-tight">
              {listing.rent_amount ? `${inr(listing.rent_amount)}/mo` : isHi ? "अनुरोध पर किराया" : "Rent on Request"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              {isHi ? "0% ब्रोकरेज" : "0% Brokerage"}
            </span>
          </div>

          {listing.ratings ? (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
              <Star className="h-3 w-3 fill-current text-amber-400" />
              <span>{listing.ratings}</span>
            </span>
          ) : null}
        </div>

        {/* Location & Walking Distance Tag */}
        <p className="flex items-center gap-1 text-xs font-semibold text-slate-300 mb-1.5">
          <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{listing.address_location || "Kanpur Coaching Belt"}</span>
        </p>

        {/* Walking Distance / Proximity Tag */}
        <div className="mb-2 inline-flex items-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
          <span>{walkingDist}</span>
        </div>

        {/* Student Review Highlight */}
        {listing.student_review && (
          <p className="text-xs leading-relaxed text-slate-400 line-clamp-2 italic mb-3">
            "{listing.student_review.split("\n")[0]}"
          </p>
        )}

        {/* ── Action Buttons Footer ── */}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10">
          {onBook && (
            <Button
              variant="hero"
              size="sm"
              className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black hover:brightness-110 shadow-[0_0_16px_-3px_rgba(16,185,129,0.6)] text-xs px-3 py-2 flex items-center gap-1 flex-1 cursor-pointer transition-all active:scale-95"
              onClick={() => {
                playHeroCtaClick();
                onBook(listing);
              }}
            >
              <Zap className="h-3.5 w-3.5 fill-current text-slate-950" />
              <span>{isHi ? tokens.ctaHi : tokens.ctaEn}</span>
            </Button>
          )}

          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/15 bg-white/5 hover:bg-slate-900 text-xs px-3 py-2 text-slate-200"
          >
            <a
              href={(() => {
                const phone = listing.owner_phone
                  ? listing.owner_phone.replace(/\D/g, "")
                  : FOUNDER_WHATSAPP;
                const text = isHi
                  ? `नमस्ते ${listing.owner_name || "होस्ट"}, मैंने StashSaarthi पर आपका 0% ब्रोकरेज कमरा (${listing.address_location || "कानपुर"}) देखा और मैं इसे बुक/देखना चाहता हूं।`
                  : `Hi ${listing.owner_name || "Host"}, I found your 0% brokerage room (${listing.address_location || "Kanpur"}) on StashSaarthi and would like to visit/book.`;
                return getWhatsAppUrl(text, phone);
              })()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playPop()}
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-400 mr-1" />
              <span>WhatsApp</span>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 border-white/15 bg-white/5 hover:bg-slate-900 text-slate-200"
            aria-label="Call Host"
          >
            <a
              href={`tel:${(listing.owner_phone || FOUNDER_WHATSAPP).replace(/\s/g, "")}`}
              onClick={() => playPop()}
            >
              <Phone className="h-3.5 w-3.5 text-amber-400" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
