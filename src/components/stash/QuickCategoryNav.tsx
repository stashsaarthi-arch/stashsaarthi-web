import { useState, useEffect } from "react";
import {
  Boxes,
  Calculator,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  Home,
  Soup,
  Search,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { smoothScrollTo } from "./legal";

interface CategoryItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: typeof Boxes;
}

const CATEGORIES: CategoryItem[] = [
  { id: "solutions", labelEn: "Solutions & Hub", labelHi: "समाधान व सेवाएँ", icon: Boxes },
  { id: "calculator", labelEn: "Savings Simulator", labelHi: "बचत कैलकुलेटर", icon: Calculator },
  { id: "trust", labelEn: "Trust & Safety Pass", labelHi: "सुरक्षा व कस्टडी पास", icon: ShieldCheck },
  { id: "feedback", labelEn: "Community & Roadmap", labelHi: "समीक्षाएँ व रोडमैप", icon: MessageSquare },
  { id: "faq", labelEn: "FAQ & Help", labelHi: "अक्सर पूछे जाने वाले सवाल", icon: HelpCircle },
];

interface QuickChip {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: typeof Boxes;
  badgeEn?: string;
  badgeHi?: string;
  target: string;
}

const QUICK_CHIPS: QuickChip[] = [
  {
    id: "stash",
    labelEn: "Micro-Storage",
    labelHi: "माइक्रो-स्टोरेज",
    icon: Boxes,
    badgeEn: "₹300/mo",
    badgeHi: "₹300/माह",
    target: "solutions",
  },
  {
    id: "rooms",
    labelEn: "Verified Rooms",
    labelHi: "सत्यापित कमरे",
    icon: Home,
    badgeEn: "0% Brokerage",
    badgeHi: "0% दलाली",
    target: "solutions",
  },
  {
    id: "kitchen",
    labelEn: "Ghar Ka Khana",
    labelHi: "घर का खाना",
    icon: Soup,
    badgeEn: "₹90/meal",
    badgeHi: "₹90/भोजन",
    target: "solutions",
  },
  {
    id: "calculator",
    labelEn: "Savings Calculator",
    labelHi: "बचत कैलकुलेटर",
    icon: Calculator,
    badgeEn: "Save ₹8k",
    badgeHi: "बचत ₹8k",
    target: "calculator",
  },
  {
    id: "custody",
    labelEn: "Live Custody Pass",
    labelHi: "लाइव कस्टडी पास",
    icon: ShieldCheck,
    badgeEn: "QR Seal",
    badgeHi: "QR सील",
    target: "trust",
  },
];

export function QuickCategoryNav() {
  const [active, setActive] = useState("solutions");
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  const accentColor = isStudent ? "var(--emerald)" : "var(--amber)";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 480);

      // Track active section
      for (let i = CATEGORIES.length - 1; i >= 0; i--) {
        const cat = CATEGORIES[i];
        if (cat) {
          const el = document.getElementById(cat.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200) {
              setActive(cat.id);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchResultClick = (target: string) => {
    smoothScrollTo(target)();
    setShowSearch(false);
    setSearchQuery("");
  };

  const filteredChips = searchQuery.trim()
    ? QUICK_CHIPS.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.labelEn.toLowerCase().includes(q) ||
          c.labelHi.toLowerCase().includes(q) ||
          (c.badgeEn && c.badgeEn.toLowerCase().includes(q)) ||
          (c.badgeHi && c.badgeHi.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div
      className={`z-30 transition-all duration-300 ${
        isSticky ? "sticky top-16 mx-auto max-w-5xl px-3 py-1.5" : "relative mx-auto max-w-5xl px-3 py-2"
      }`}
    >
      {/* ── Consolidated Single-Row Category Bar ── */}
      <div className="glass flex flex-col gap-1.5 rounded-2xl border border-white/10 p-1.5 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar sm:gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActive(cat.id);
                  smoothScrollTo(cat.id)();
                }}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer sm:px-3.5 sm:py-2 ${
                  isActive
                    ? "border border-white/20 text-white shadow-lg"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  background: isActive
                    ? `color-mix(in oklab, ${accentColor} 22%, rgba(255,255,255,0.06))`
                    : "transparent",
                  borderColor: isActive
                    ? `color-mix(in oklab, ${accentColor} 45%, transparent)`
                    : "transparent",
                }}
              >
                <Icon
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ color: isActive ? accentColor : "currentColor" }}
                />
                <span>{isHi ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}

          {/* Quick Search Toggle Button */}
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Search website services"
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              showSearch
                ? "bg-white/15 text-white border border-white/20"
                : "text-slate-400 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{isHi ? "खोजें" : "Quick Find"}</span>
          </button>
        </div>

        {/* ── Expandable Quick Search Input ── */}
        {showSearch && (
          <div className="pt-1 px-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isHi
                      ? "सीधे खोजें: माइक्रो-स्टोरेज, कमरे, टिफिन, कैलकुलेटर, सुरक्षा..."
                      : "Type to jump: Micro-Storage, Rooms, Tiffin, Calculator, Safety, FAQ..."
                  }
                  aria-label={isHi ? "त्वरित नेविगेशन खोजें" : "Quick jump search"}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-white/15 bg-black/50 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
                  autoFocus
                />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded-lg"
                >
                  {isHi ? "हटाएं" : "Clear"}
                </button>
              )}
            </div>

            {/* Quick search result suggestions */}
            {filteredChips.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {filteredChips.map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => handleSearchResultClick(chip.target)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-medium whitespace-nowrap cursor-pointer"
                    >
                      <Icon className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span>{isHi ? chip.labelHi : chip.labelEn}</span>
                      <span className="text-xs text-emerald-300 font-mono font-semibold">
                        ({isHi ? chip.badgeHi : chip.badgeEn})
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
