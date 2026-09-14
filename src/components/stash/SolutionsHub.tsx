import { useState, useEffect, useRef, memo } from "react";
import { Boxes, Home, Soup, HandHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GlidingTabs } from "@/components/ui/GlidingTabs";
import { Ecosystem } from "./Ecosystem";
import { Rooms } from "./Rooms";
import { TokenMealHub } from "../TokenMealHub";
import { Connect } from "./Connect";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { trackPersonaLayoutRecording } from "@/lib/abTesting";
import type { OpenBooking } from "./types";

interface SolutionsHubProps {
  onBook: OpenBooking;
  onListRoom: () => void;
}

export const SolutionsHub = memo(function SolutionsHub({ onBook, onListRoom }: SolutionsHubProps) {
  const { role } = usePersona();
  const isStudent = role === "student";
  const [activeTab, setActiveTab] = useState<"stash" | "rooms" | "kitchen" | "connect">(
    isStudent ? "stash" : "connect"
  );
  const { language } = useLanguage();
  const isHi = language === "hi";

  const sectionRef = useRef<HTMLElement>(null);
  const orbTopRef = useRef<HTMLDivElement>(null);
  const orbBottomRef = useRef<HTMLDivElement>(null);
  const orbCenterRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Auto-switch tab and log heatmap recording telemetry when persona changes
  useEffect(() => {
    if (role === "host") {
      setActiveTab("connect");
      trackPersonaLayoutRecording("host", "SaarthiConnect", 15);
    } else {
      setActiveTab("stash");
      trackPersonaLayoutRecording("student", "SaarthiStash", 25);
    }
  }, [role]);

  useEffect(() => {
    let rafId: number;
    let isIntersecting = false;
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || "ontouchstart" in window);

    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isIntersecting = entries[0].isIntersecting;
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionEl);

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobile || !isIntersecting) return;
      const rect = sectionEl.getBoundingClientRect();
      const relativeX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relativeY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX = relativeX;
      mouseY = relativeY;
    };

    const updateParallax = () => {
      if (isIntersecting && sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const scrollProgress = (rect.top - viewportHeight / 2) / (viewportHeight / 2);

        if (orbTopRef.current) {
          const translateY = scrollProgress * -28 + (isMobile ? 0 : mouseY * -14);
          const translateX = isMobile ? 0 : mouseX * -18;
          orbTopRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;
        }

        if (orbBottomRef.current) {
          const translateY = scrollProgress * 32 + (isMobile ? 0 : mouseY * 16);
          const translateX = isMobile ? 0 : mouseX * 22;
          orbBottomRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px)`;
        }

        if (orbCenterRef.current) {
          const translateY = scrollProgress * -45 + (isMobile ? 0 : mouseY * -20);
          const translateX = isMobile ? 0 : mouseX * 28;
          orbCenterRef.current.style.transform = `translate3d(${translateX}px, ${translateY}px, 0px) rotate(${scrollProgress * 15}deg)`;
        }

        if (gridRef.current) {
          const translateY = scrollProgress * -12;
          gridRef.current.style.transform = `translate3d(0px, ${translateY}px, 0px)`;
        }
      }
      rafId = requestAnimationFrame(updateParallax);
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      observer.disconnect();
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(rafId);
    };
  }, []);

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

  const studentTabs = [
    {
      id: "stash" as const,
      nameEn: "Saarthi Stash",
      nameHi: "सारथी स्टैश",
      icon: Boxes,
      badgeEn: "Zero Dead-Rent",
      badgeHi: "80% बचत",
    },
    {
      id: "rooms" as const,
      nameEn: "Saarthi Spaces",
      nameHi: "सारथी स्पेसेस",
      icon: Home,
      badgeEn: "Zero Brokerage",
      badgeHi: "0% दलाली",
    },
    {
      id: "kitchen" as const,
      nameEn: "Saarthi Kitchen",
      nameHi: "सारथी किचन",
      icon: Soup,
      badgeEn: "From ₹90/meal",
      badgeHi: "₹90/भोजन",
    },
    {
      id: "connect" as const,
      nameEn: "Saarthi Connect",
      nameHi: "सारथी कनेक्ट",
      icon: HandHeart,
      badgeEn: "100% Safe",
      badgeHi: "100% सुरक्षित",
    },
  ];

  const hostTabs = [
    {
      id: "connect" as const,
      nameEn: "Saarthi Connect",
      nameHi: "सारथी कनेक्ट",
      icon: HandHeart,
      badgeEn: "Verified Seniors",
      badgeHi: "सत्यापित वरिष्ठ",
    },
    {
      id: "rooms" as const,
      nameEn: "Saarthi Spaces",
      nameHi: "सारथी स्पेसेस",
      icon: Home,
      badgeEn: "₹11,500+/mo Income",
      badgeHi: "₹11,500+/माह आय",
    },
    {
      id: "stash" as const,
      nameEn: "Saarthi Stash",
      nameHi: "सारथी स्टैश",
      icon: Boxes,
      badgeEn: "Spare Room Stash",
      badgeHi: "खाली कमरा स्टैश",
    },
    {
      id: "kitchen" as const,
      nameEn: "Saarthi Kitchen",
      nameHi: "सारथी किचन",
      icon: Soup,
      badgeEn: "Home Cooking",
      badgeHi: "घरेलू रसोई",
    },
  ];

  const tabs = isStudent ? studentTabs : hostTabs;

  return (
    <section id="solutions" ref={sectionRef} className="section-isolated layout-isolated relative mx-auto max-w-6xl px-4 py-3.5 sm:py-5 pb-32 scroll-mt-20 overflow-hidden">
      {/* Background Ambient Parallax Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
        {/* Ambient Gradient Orb Top Left */}
        <div
          ref={orbTopRef}
          className="absolute -top-16 -left-16 w-80 h-80 rounded-full transition-transform duration-75 ease-out will-change-transform opacity-30"
          style={{
            background: isStudent
              ? "radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(245,158,11,0.25) 0%, rgba(251,191,36,0.08) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Ambient Gradient Orb Bottom Right */}
        <div
          ref={orbBottomRef}
          className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full transition-transform duration-75 ease-out will-change-transform opacity-25"
          style={{
            background: isStudent
              ? "radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(16,185,129,0.08) 50%, transparent 70%)"
              : "radial-gradient(circle, rgba(251,191,36,0.22) 0%, rgba(245,158,11,0.08) 50%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Ambient Secondary Center Ring Parallax */}
        <div
          ref={orbCenterRef}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-white/5 opacity-20 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
          style={{
            background: isStudent
              ? "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Background Micro Grid Pattern with Parallax Shift */}
        <div
          ref={gridRef}
          className="absolute inset-0 opacity-[0.04] transition-transform duration-100 ease-out will-change-transform"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge
          variant="outline"
          className="border-white/15 bg-white/5 text-xs text-muted-foreground"
        >
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
        <p className="mt-1 text-xs text-muted-foreground">
          {isHi
            ? "आईआईटी कानपुर और सीएसजेएमयू कॉरिडोर के लिए डिज़ाइन किए गए स्मार्ट समाधान।"
            : "A complete range of living and storage solutions for Kanpur campus corridors."}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mt-3 flex items-center justify-center">
        <GlidingTabs
          tabs={tabs.map((tab) => {
            const Icon = tab.icon;
            return {
              id: tab.id,
              labelEn: tab.nameEn,
              labelHi: tab.nameHi,
              icon: <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />,
              badge: isHi ? tab.badgeHi : tab.badgeEn,
            };
          })}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as "stash" | "rooms" | "kitchen" | "connect")}
          layoutId="solutions-hub-tab-glider"
          variant="segmented"
          size="md"
          fullWidth
          ariaLabel={isHi ? "समाधान सेवा टैब" : "StashSaarthi Solutions Tabs"}
          className="w-full max-w-4xl"
        />
      </div>

      {/* Active Tab Panel Content */}
      <div
        role="tabpanel"
        id={`solutions-panel-${activeTab}`}
        aria-labelledby={`solutions-tab-${activeTab}`}
        tabIndex={0}
        className="mt-2.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded-xl"
      >
        {activeTab === "stash" && <Ecosystem onBook={onBook} />}
        {activeTab === "rooms" && <Rooms onList={onListRoom} onBook={onBook} />}
        {activeTab === "kitchen" && <TokenMealHub />}
        {activeTab === "connect" && <Connect onBook={onBook} />}
      </div>
    </section>
  );
});

