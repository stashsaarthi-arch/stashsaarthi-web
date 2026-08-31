import { useState, useEffect } from "react";
import { ShieldCheck, FileSearch, CheckCircle2, Lock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductSandbox } from "./ProductSandbox";
import { ProcessTransparency } from "./ProcessTransparency";
import { ZeroRisk } from "./ZeroRisk";
import { DataPrivacyCommitment } from "./DataPrivacyCommitment";
import { FounderAccountability } from "./FounderAccountability";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";

export function TrustConsoleHub() {
  const [activeTab, setActiveTab] = useState<"sandbox" | "process" | "zerorisk" | "privacy" | "founder">("sandbox");
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isStudent = role === "student";

  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (["sandbox", "process", "zerorisk", "privacy", "founder"].includes(detail)) {
        setActiveTab(detail as "sandbox" | "process" | "zerorisk" | "privacy" | "founder");
      }
    };
    window.addEventListener("stashsaarthi-trust-tab", handleTabChange);
    return () => window.removeEventListener("stashsaarthi-trust-tab", handleTabChange);
  }, []);

  const tabs = [
    {
      id: "sandbox" as const,
      labelEn: "Live Custody Pass",
      labelHi: "लाइव कस्टडी पास",
      icon: FileSearch,
    },
    {
      id: "process" as const,
      labelEn: "3-Stage Logistics",
      labelHi: "3-चरणीय प्रक्रिया",
      icon: CheckCircle2,
    },
    {
      id: "zerorisk" as const,
      labelEn: "₹10,000 Safety Cover",
      labelHi: "₹10,000 सुरक्षा कवर",
      icon: ShieldCheck,
    },
    {
      id: "privacy" as const,
      labelEn: "Data Privacy & SLA",
      labelHi: "डेटा गोपनीयता व SLA",
      icon: Lock,
    },
    {
      id: "founder" as const,
      labelEn: "Founder Accountability",
      labelHi: "संस्थापक जवाबदेही",
      icon: UserCheck,
    },
  ];

  return (
    <section id="trust" className="relative mx-auto max-w-6xl px-4 py-3.5 sm:py-5 scroll-mt-20">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-[9.5px] sm:text-[11px] text-muted-foreground">
          {isHi ? "100% स्पष्टता व सत्यापन कंसोल" : "100% Radical Transparency Console"}
        </Badge>
        <h2 className="mt-1.5 text-balance text-lg font-extrabold tracking-tight sm:text-2xl">
          {isHi ? (
            <>
              जीरो फेक बैज। <span className="text-gradient">पूरी तरह सत्यापनीय सुरक्षा</span>
            </>
          ) : (
            <>
              Zero Fake Badges. <span className="text-gradient">Verifiable Safety & Custody</span>
            </>
          )}
        </h2>
        <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
          {isHi
            ? "कानपुर में जमीनी सुरक्षा प्रोटोकॉल, लेज़र बारकोड सील और प्रत्यक्ष संस्थापक संपर्क का लाइव निरीक्षण करें।"
            : "Inspect our tamper-evident seals, ground custody protocols, and founder accountability in real time."}
        </p>
      </div>

      {/* Modern High-Density Tab Bar */}
      <div className="mt-3 flex items-center justify-center">
        <div className="glass flex w-full max-w-5xl items-center gap-1 overflow-x-auto rounded-xl border border-white/10 p-1 no-scrollbar sm:gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1 px-2 text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer sm:py-1.5 sm:px-2.5 ${
                  isActive
                    ? "border border-white/20 text-white shadow-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
                style={{
                  background: isActive
                    ? isStudent
                      ? "color-mix(in oklab, var(--emerald) 18%, rgba(255,255,255,0.06))"
                      : "color-mix(in oklab, var(--amber) 18%, rgba(255,255,255,0.06))"
                    : "transparent",
                  borderColor: isActive
                    ? isStudent
                      ? "color-mix(in oklab, var(--emerald) 40%, transparent)"
                      : "color-mix(in oklab, var(--amber) 40%, transparent)"
                    : "transparent",
                }}
              >
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
                <span>{isHi ? tab.labelHi : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panel Display */}
      <div className="mt-2.5">
        {activeTab === "sandbox" && <ProductSandbox />}
        {activeTab === "process" && <ProcessTransparency />}
        {activeTab === "zerorisk" && <ZeroRisk />}
        {activeTab === "privacy" && <DataPrivacyCommitment />}
        {activeTab === "founder" && <FounderAccountability />}
      </div>
    </section>
  );
}
