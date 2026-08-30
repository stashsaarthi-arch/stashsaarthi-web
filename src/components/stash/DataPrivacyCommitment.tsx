import { motion } from "motion/react";
import {
  Lock,
  EyeOff,
  ShieldAlert,
  Clock,
  CheckCircle,
  FileText,
  BadgePercent,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Badge } from "@/components/ui/badge";
import { Card3D } from "@/components/ui/Card3D";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_PHONE_DISPLAY } from "@/lib/constants";

export function DataPrivacyCommitment() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const COMMITMENTS = [
    {
      id: "privacy",
      icon: EyeOff,
      accent: "#10B981",
      tag: isHi ? "डेटा सुरक्षा प्रतिज्ञा" : "Zero Data Resale",
      title: isHi
        ? "🔒 एंड-टू-एंड गोपनीयता एवं शून्य डेटा बिक्री"
        : "🔒 End-to-End Session Privacy & Zero Data Resale",
      description: isHi
        ? "हम आपके संपर्क नंबर, छात्र आईडी या पहचान दस्तावेजों को किसी भी तीसरे पक्ष या विज्ञापन नेटवर्क को नहीं बेचते, किराए पर नहीं देते और न ही साझा करते हैं। आपका डेटा केवल सुरक्षित नोड कस्टडी के लिए एन्क्रिप्टेड रखा जाता है।"
        : "We do not sell, rent, monetize, or distribute your phone number, university ID, or verification docs to any advertising network or third party. Data is encrypted and used exclusively for safe node custody matching.",
      proof: isHi ? "शून्य थर्ड-पार्टी ट्रैकर" : "Zero 3rd-party ad trackers",
    },
    {
      id: "dark-patterns",
      icon: BadgePercent,
      accent: "#F59E0B",
      tag: isHi ? "शून्य डार्क पैटर्न" : "Zero Dark Patterns",
      title: isHi
        ? "🛡️ शून्य डार्क पैटर्न एवं पारदर्शी शुल्क"
        : "🛡️ Zero Dark Patterns & 100% Fee Transparency",
      description: isHi
        ? "कोई छुपा हुआ 'प्लेटफॉर्म कन्वीनियंस फीस' नहीं, कोई चुपके से ऑटो-डेबिट नहीं, और चेकआउट पर कोई अप्रत्याशित वृद्धि नहीं। भुगतान से पहले आपको होस्ट शेयर, बीमा और प्लेटफॉर्म मार्जिन का स्पष्ट ब्रेकडाउन दिखता है।"
        : "No stealth convenience fees, no surprise auto-debit renewals, and no unexpected checkout surge charges. You see the exact rupee-for-rupee breakdown (Host Share, Insurance Pool, Platform Margin) before paying ₹1.",
      proof: isHi ? "100% अग्रिम मूल्य निर्धारण" : "100% Upfront Rupee Breakdown",
    },
    {
      id: "sla",
      icon: Zap,
      accent: "#38BDF8",
      tag: isHi ? "मानवीय सहायता गारंटी" : "Human Response SLA",
      title: isHi
        ? "⚡ 15-मिनट प्रत्यक्ष मानवीय सहायता SLA"
        : "⚡ Direct 15-Minute Human Support Guarantee",
      description: isHi
        ? `किसी स्वचालित चैटबॉट का चक्कर नहीं। सक्रिय कैंपस घंटों (सुबह 8:00 से रात 10:00 IST) के दौरान हमारे कानपुर ऑपरेशंस सदस्य से 15 मिनट के भीतर सीधी व्हाट्सएप या फोन (${FOUNDER_PHONE_DISPLAY}) सहायता की गारंटी।`
        : `No infinite automated chatbot loops. Guaranteed response SLA from a real human operations lead within 15 minutes during campus hours (8:00 AM – 10:00 PM IST) directly on WhatsApp or phone (${FOUNDER_PHONE_DISPLAY}).`,
      proof: isHi ? "15 मिनट में मानवीय प्रतिक्रिया" : "15-Min Human Escalation SLA",
    },
  ];

  return (
    <section
      id="privacy-commitments"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 scroll-mt-20"
    >
      <AnimatedContent distance={40} direction="vertical" duration={0.7}>
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold uppercase tracking-widest text-emerald-400 font-mono"
          >
            {isHi ? "🛡️ केवल सत्यापनीय सुरक्षा" : "🛡️ VERIFIABLE INTEGRITY & PRIVACY"}
          </Badge>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            {isHi ? (
              <>
                वास्तविक डेटा गोपनीयता एवं <span className="text-gradient">पारदर्शिता वचन</span>
              </>
            ) : (
              <>
                Radical Data Privacy & <span className="text-gradient">Zero Dark Patterns</span>
              </>
            )}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {isHi
              ? "नकली सुरक्षा लोगो या भ्रामक बैज नहीं — हमारी तकनीकी और परिचालन प्रतिबद्धताएं जो पूरी तरह से जांच योग्य हैं।"
              : "No generic stock badges or fake compliance stamps. Here are our factual, verifiable technical and operational commitments."}
          </p>
        </div>
      </AnimatedContent>

      <div className="mt-12 sm:mt-16 grid gap-6 md:grid-cols-3">
        {COMMITMENTS.map((item, index) => {
          const Icon = item.icon;
          return (
            <AnimatedContent
              key={item.id}
              distance={40}
              direction="vertical"
              duration={0.7}
              delay={index * 0.12}
            >
              <Card3D maxTilt={6} className="h-full rounded-3xl">
                <div className="glass flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-6 sm:p-7 relative transition-all hover:border-white/20">
                  <div
                    className="absolute -top-16 -right-16 h-32 w-32 rounded-full opacity-10 blur-2xl pointer-events-none"
                    style={{ background: item.accent }}
                  />

                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10"
                        style={{ background: `${item.accent}18` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: item.accent }} />
                      </span>
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border"
                        style={{
                          borderColor: `${item.accent}40`,
                          backgroundColor: `${item.accent}12`,
                          color: item.accent,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="mt-5 text-base sm:text-lg font-bold text-foreground leading-snug">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="text-xs font-semibold text-foreground/85">{item.proof}</span>
                  </div>
                </div>
              </Card3D>
            </AnimatedContent>
          );
        })}
      </div>
    </section>
  );
}
