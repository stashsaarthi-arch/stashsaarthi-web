import { useState, useEffect } from "react";
import { Boxes, Home, Soup, HandHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Ecosystem } from "./Ecosystem";
import { Rooms } from "./Rooms";
import { TokenMealHub } from "../TokenMealHub";
import { Connect } from "./Connect";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import type { OpenBooking } from "./types";

interface SolutionsHubProps {
  onBook: OpenBooking;
  onListRoom: () => void;
}

export function SolutionsHub({ onBook, onListRoom }: SolutionsHubProps) {
  const [activeTab, setActiveTab] = useState<"stash" | "rooms" | "kitchen" | "connect">("stash");
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["stash", "rooms", "kitchen", "connect"].includes(detail)) {
        setActiveTab(detail as "stash" | "rooms" | "kitchen" | "connect");
      }
    };
    window.addEventListener("stashsaarthi-solution-tab", handleTabChange);
    return () => window.removeEventListener("stashsaarthi-solution-tab", handleTabChange);
  }, []);

  const tabs = [
    {
      id: "stash" as const,
      labelEn: "🎒 Vacation Micro-Storage (₹300/mo)",
      labelHi: "🎒 वेकेशन स्टोरेज (₹300/माह)",
      icon: Boxes,
      badgeEn: "Zero Dead-Rent",
      badgeHi: "80% बचत",
    },
    {
      id: "rooms" as const,
      labelEn: "🏠 Verified Co-Living Rooms",
      labelHi: "🏠 सत्यापित सीनियर रूम्स",
      icon: Home,
      badgeEn: "Zero Brokerage",
      badgeHi: "0% दलाली",
    },
    {
      id: "kitchen" as const,
      labelEn: "🍲 Ghar Ka Swaad Kitchen",
      labelHi: "🍲 घर का स्वाद टिफिन",
      icon: Soup,
      badgeEn: "From ₹90/meal",
      badgeHi: "₹90/भोजन",
    },
    {
      id: "connect" as const,
      labelEn: "🤝 Senior Living Connect",
      labelHi: "🤝 सीनियर कनेक्ट व सौहार्द",
      icon: HandHeart,
      badgeEn: "100% Safe",
      badgeHi: "100% सुरक्षित",
    },
  ];

  return (
    <section id="solutions" className="relative mx-auto max-w-6xl px-4 py-3.5 sm:py-5 scroll-mt-20">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-[9.5px] sm:text-[11px] text-muted-foreground">
          {isHi ? "एकीकृत समाधान हब" : "Integrated Solutions Hub"}
        </Badge>
        <h2 className="mt-1.5 text-balance text-lg font-extrabold tracking-tight sm:text-2xl">
          {isHi ? (
            <>
              एक क्लिक में <span className="text-gradient">सभी सेवाएँ देखें</span>
            </>
          ) : (
            <>
              Explore All <span className="text-gradient">StashSaarthi Solutions</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
          {isHi
            ? "आईआईटी कानपुर और सीएसजेएमयू कॉरिडोर के लिए डिज़ाइन किए गए स्मार्ट समाधान।"
            : "High-density, modular solution matrix for Kanpur academic corridors."}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mt-3 flex items-center justify-center">
        <div className="glass grid w-full max-w-4xl grid-cols-2 gap-1 rounded-xl border border-white/10 p-1 sm:grid-cols-4 sm:gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center rounded-lg p-1.5 text-center transition-all duration-200 cursor-pointer sm:p-2 ${
                  isActive
                    ? "border border-white/20 text-white shadow-xl"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  background: isActive
                    ? isStudent
                      ? "color-mix(in oklab, var(--emerald) 18%, rgba(255,255,255,0.05))"
                      : "color-mix(in oklab, var(--amber) 18%, rgba(255,255,255,0.05))"
                    : "transparent",
                  borderColor: isActive
                    ? isStudent
                      ? "color-mix(in oklab, var(--emerald) 40%, transparent)"
                      : "color-mix(in oklab, var(--amber) 40%, transparent)"
                    : "transparent",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <Icon
                    className="h-3.5 w-3.5 shrink-0"
                    style={{
                      color: isActive
                        ? isStudent
                          ? "var(--emerald)"
                          : "var(--amber)"
                        : "currentColor",
                    }}
                  />
                  <span className="text-xs font-bold sm:text-sm">
                    {isHi ? tab.labelHi.split(" ")[1] : tab.labelEn.split(" ")[1]}
                  </span>
                </div>
                <span
                  className="mt-0.5 text-[9px] sm:text-[10px] font-medium"
                  style={{
                    color: isActive
                      ? isStudent
                        ? "var(--emerald)"
                        : "var(--amber)"
                      : "var(--muted-foreground)",
                  }}
                >
                  {isHi ? tab.badgeHi : tab.badgeEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Panel Content */}
      <div className="mt-2.5 transition-all duration-300">
        {activeTab === "stash" && <Ecosystem onBook={onBook} />}
        {activeTab === "rooms" && <Rooms onList={onListRoom} />}
        {activeTab === "kitchen" && (
          <TokenMealHub />
        )}
        {activeTab === "connect" && <Connect onBook={onBook} />}
      </div>
    </section>
  );
}
