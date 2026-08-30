import { useState, useEffect } from "react";
import { Boxes, Calculator, ShieldCheck, MessageSquare, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";

interface CategoryItem {
  id: string;
  labelEn: string;
  labelHi: string;
  icon: typeof Boxes;
}

const CATEGORIES: CategoryItem[] = [
  { id: "solutions", labelEn: "Solutions & Hub", labelHi: "समाधान व सेवाएँ", icon: Boxes },
  { id: "calculator", labelEn: "Savings Calculator", labelHi: "बचत कैलकुलेटर", icon: Calculator },
  { id: "trust", labelEn: "Trust & Custody Pass", labelHi: "सुरक्षा व कस्टडी पास", icon: ShieldCheck },
  { id: "feedback", labelEn: "Reviews & Roadmap", labelHi: "समीक्षाएँ व रोडमैप", icon: MessageSquare },
  { id: "faq", labelEn: "FAQ", labelHi: "अक्सर पूछे जाने वाले सवाल", icon: HelpCircle },
];

export function QuickCategoryNav() {
  const [active, setActive] = useState("solutions");
  const [isSticky, setIsSticky] = useState(false);
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

  const scrollTo = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`z-30 transition-all duration-300 ${
        isSticky ? "sticky top-16 mx-auto max-w-5xl px-4 py-2" : "relative mx-auto max-w-5xl px-4 py-3"
      }`}
    >
      <div className="glass flex items-center justify-between gap-1.5 overflow-x-auto rounded-full border border-white/10 p-1.5 shadow-2xl backdrop-blur-xl no-scrollbar sm:gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => scrollTo(cat.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer sm:px-4 sm:py-2 sm:text-sm ${
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
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0"
                style={{ color: isActive ? accentColor : "currentColor" }}
              />
              <span>{isHi ? cat.labelHi : cat.labelEn}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
