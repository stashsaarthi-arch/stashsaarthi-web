import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Boxes, Home, Soup, ShieldCheck, Sparkles, X, MapPin, ExternalLink } from "lucide-react";
import { usePersona } from "@/context/PersonaContext";
import { useLanguage } from "@/context/LanguageContext";
import type { BookingPrefill } from "./types";

interface ActivityItem {
  id: string;
  name: string;
  name_hi?: string;
  action: string;
  action_hi?: string;
  detail: string;
  detail_hi?: string;
  timeAgo: string;
  timeAgo_hi?: string;
  type: "student" | "host" | "both";
  icon: typeof Boxes;
  badge: string;
  badge_hi?: string;
  accent: "emerald" | "amber" | "cyan";
  service?: "stash" | "rooms" | "kitchen";
}

interface ActivityTickerProps {
  onBook?: (prefill?: BookingPrefill) => void;
  onListRoom?: () => void;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-0",
    name: "Rahul M. (IIT Kanpur)",
    name_hi: "राहुल एम. (आईआईटी कानपुर)",
    action: "just booked 3 bags vacation stash",
    action_hi: "अभी 3 बैग वेकेशन स्टैश बुक किया",
    detail: "IITK Hall 1 · Kalyanpur Node",
    detail_hi: "आईआईटीके हॉल 1 · कल्याणपुर नोड",
    timeAgo: "1 min ago",
    timeAgo_hi: "1 मिनट पहले",
    type: "student",
    icon: Boxes,
    badge: "Saved ₹6,400 dead-rent",
    badge_hi: "₹6,400 डेड-रेंट की बचत",
    accent: "emerald",
    service: "stash",
  },
  {
    id: "act-1",
    name: "Aman K.",
    name_hi: "अमन के.",
    action: "reserved 2 bags luggage storage",
    action_hi: "2 बैग स्टोरेज सुरक्षित किया",
    detail: "Kalyanpur Node (near IIT Gate 1)",
    detail_hi: "कल्याणपुर नोड (आईआईटी गेट 1 के पास)",
    timeAgo: "2 mins ago",
    timeAgo_hi: "2 मिनट पहले",
    type: "student",
    icon: Boxes,
    badge: "Laser Barcode Sealed",
    badge_hi: "लेजर बारकोड सीलबंद",
    accent: "emerald",
    service: "stash",
  },
  {
    id: "act-2",
    name: "Priya M. (HBTI)",
    name_hi: "प्रिया एम. (एचबीटीआई)",
    action: "booked Kakadeo single room",
    action_hi: "काकादेव सिंगल रूम बुक किया",
    detail: "Zero Brokerage · Near PW & Allen Hub",
    detail_hi: "शून्य ब्रोकरेज · पीडब्ल्यू व एलन के पास",
    timeAgo: "4 mins ago",
    timeAgo_hi: "4 मिनट पहले",
    type: "student",
    icon: Home,
    badge: "0% Brokerage Verified",
    badge_hi: "0% ब्रोकरेज सत्यापित",
    accent: "emerald",
    service: "rooms",
  },
  {
    id: "act-3",
    name: "Sunita Sharma (Host)",
    name_hi: "सुनीता शर्मा (सीनियर होस्ट)",
    action: "listed 1 spare bedroom",
    action_hi: "1 खाली कमरा सूचीबद्ध किया",
    detail: "Swaroop Nagar, Kanpur · ₹6,000/mo",
    detail_hi: "स्वरूप नगर, कानपुर · ₹6,000/माह",
    timeAgo: "6 mins ago",
    timeAgo_hi: "6 मिनट पहले",
    type: "host",
    icon: Home,
    badge: "Verified Senior Host",
    badge_hi: "सत्यापित सीनियर होस्ट",
    accent: "amber",
    service: "rooms",
  },
  {
    id: "act-4",
    name: "Vivek S. (CSJMU)",
    name_hi: "विवेक एस. (सीएसजेएमयू)",
    action: "subscribed to Nani Tiffins",
    action_hi: "नानी टिफिन सेवा से जुड़े",
    detail: "30-day lunch pack · Swaroop Nagar",
    detail_hi: "30-दिवसीय लंच पैक · स्वरूप नगर",
    timeAgo: "8 mins ago",
    timeAgo_hi: "8 मिनट पहले",
    type: "student",
    icon: Soup,
    badge: "Homestyle Food",
    badge_hi: "घर का शुद्ध भोजन",
    accent: "emerald",
    service: "kitchen",
  },
  {
    id: "act-5",
    name: "Dinesh & Geeta Ji",
    name_hi: "दिनेश व गीता जी",
    action: "payout disbursed ₹12,800",
    action_hi: "₹12,800 भुगतान हस्तांतरित",
    detail: "Host passive income (Feb batch)",
    detail_hi: "होस्ट मासिक आय (फरवरी बैच)",
    timeAgo: "12 mins ago",
    timeAgo_hi: "12 मिनट पहले",
    type: "host",
    icon: ShieldCheck,
    badge: "100% Escrow Settled",
    badge_hi: "100% एस्क्रो भुगतान",
    accent: "amber",
  },
  {
    id: "act-6",
    name: "Rohan S.",
    name_hi: "रोहन एस.",
    action: "claimed StashPass #ST-84920",
    action_hi: "स्टैशपास #ST-84920 प्राप्त किया",
    detail: "CSJMU Hostel exit pickup (4 bags)",
    detail_hi: "सीएसजेएमयू हॉस्टल पिकअप (4 बैग)",
    timeAgo: "15 mins ago",
    timeAgo_hi: "15 मिनट पहले",
    type: "student",
    icon: Sparkles,
    badge: "₹10k Insurance Active",
    badge_hi: "₹10k बीमा सक्रिय",
    accent: "cyan",
    service: "stash",
  },
  {
    id: "act-7",
    name: "Sneha T. (Allen Kakadeo)",
    name_hi: "स्नेहा टी. (एलन काकादेव)",
    action: "claimed ₹50 OFF code STASH50",
    action_hi: "₹50 छूट कोड STASH50 का उपयोग किया",
    detail: "Vacation luggage storage deposit",
    detail_hi: "वेकेशन सामान स्टोरेज डिपॉजिट",
    timeAgo: "18 mins ago",
    timeAgo_hi: "18 मिनट पहले",
    type: "student",
    icon: Sparkles,
    badge: "Instant ₹50 Discount",
    badge_hi: "तत्काल ₹50 की छूट",
    accent: "cyan",
    service: "stash",
  },
];

export const ActivityTicker = memo(function ActivityTicker({ onBook, onListRoom }: ActivityTickerProps) {
  const { role } = usePersona();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("stash_hide_activity_ticker") === "true";
    }
    return false;
  });

  const relevantActivities = ACTIVITIES.filter(
    (a) => a.type === role || a.type === "both" || (role === "student" && a.type === "student") || (role === "host" && a.type === "host")
  );
  const displayActivities = relevantActivities.length > 0 ? relevantActivities : ACTIVITIES;

  useEffect(() => {
    if (dismissed || paused || (typeof window !== "undefined" && window.innerWidth < 768)) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % displayActivities.length);
        setVisible(true);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, [dismissed, paused, displayActivities.length]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("stash_hide_activity_ticker", "true");
    }
  };

  const handleCardClick = () => {
    const current = displayActivities[index % displayActivities.length]!;
    if (current.type === "host" && onListRoom) {
      onListRoom();
    } else if (onBook) {
      onBook({
        service: current.service || (role === "host" ? "rooms" : "stash"),
        note: `Social Proof Triggered: ${current.name} - ${current.action}`,
      });
    }
  };

  if (dismissed || displayActivities.length === 0) return null;

  const current = displayActivities[index % displayActivities.length]!;
  const Icon = current.icon;

  const name = isHi && current.name_hi ? current.name_hi : current.name;
  const action = isHi && current.action_hi ? current.action_hi : current.action;
  const detail = isHi && current.detail_hi ? current.detail_hi : current.detail;
  const timeAgo = isHi && current.timeAgo_hi ? current.timeAgo_hi : current.timeAgo;
  const badge = isHi && current.badge_hi ? current.badge_hi : current.badge;

  const accentStyles = {
    emerald: {
      border: "border-emerald-500/30 hover:border-emerald-400/60",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "shadow-emerald-500/10",
    },
    amber: {
      border: "border-amber-500/30 hover:border-amber-400/60",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      glow: "shadow-amber-500/10",
    },
    cyan: {
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      glow: "shadow-cyan-500/10",
    },
  }[current.accent];

  return (
    <div
      data-widget="live-activity-ticker"
      className="hidden md:flex fixed md:bottom-5 md:left-5 md:right-auto md:max-w-[380px] z-40 pointer-events-auto"
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onClick={handleCardClick}
            className={`rounded-2xl border ${accentStyles.border} bg-[#0A0D0F]/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-xl ${accentStyles.glow} flex items-start gap-3 relative group cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
            role="button"
            tabIndex={0}
            aria-label={isHi ? `${name} - ${action}` : `${name} - ${action}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            }}
          >
            {/* Animated pulsing dot */}
            <div className="relative shrink-0 mt-0.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${accentStyles.bg} ${accentStyles.text}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accentStyles.bg} opacity-75`} />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    current.accent === "emerald" ? "bg-emerald-500" : current.accent === "amber" ? "bg-amber-500" : "bg-cyan-500"
                  }`}
                />
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white truncate">{name}</span>
                <span className="text-[11px] text-slate-300">{action}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <MapPin className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="truncate">{detail}</span>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-xs">
                <span className={`font-mono font-bold ${accentStyles.text} flex items-center gap-1`}>
                  {badge}
                  <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
                <span className="text-slate-400 font-mono text-[10px] sm:text-xs">{timeAgo}</span>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              aria-label={isHi ? "लाइव अपडेट हटाएं" : "Dismiss live updates"}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer z-10"
              title={isHi ? "हटाएं" : "Dismiss live updates"}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

