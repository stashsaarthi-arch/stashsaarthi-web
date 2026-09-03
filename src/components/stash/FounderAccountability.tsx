import { useState } from "react";
import { motion } from "motion/react";
import {
  Linkedin,
  Twitter,
  Mail,
  MessageCircle,
  MapPin,
  ShieldCheck,
  PhoneCall,
  ExternalLink,
  Award,
  Sparkles,
  CheckCircle2,
  Building,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Card3D } from "@/components/ui/Card3D";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  FOUNDER_WHATSAPP,
  FOUNDER_PHONE_DISPLAY,
  FOUNDER_EMAIL,
  FOUNDER_LINKEDIN,
  getWhatsAppUrl,
} from "@/lib/constants";

export function FounderAccountability() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <div id="founder-accountability" className="relative mx-auto max-w-6xl px-2 py-2 scroll-mt-20">
      <div className="grid gap-5 lg:grid-cols-12 items-center">
        {/* ── Founder Profile Card (5 Cols) ── */}
        <div className="lg:col-span-5">
          <AnimatedContent distance={30} direction="horizontal" duration={0.6} delay={0.1}>
            <Card3D maxTilt={5} className="rounded-2xl">
              <div className="glass overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-5 relative shadow-xl">
                <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Profile Image & Status */}
                <div className="relative aspect-video sm:aspect-square max-h-56 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900 shadow-inner group mx-auto">
                  <img
                    src="/images/founder_advik.jpg"
                    alt="Advik Omer - Founder & Operations Lead at StashSaarthi"
                    width={400}
                    height={400}
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-lg bg-black/70 px-2.5 py-1.5 backdrop-blur-md border border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[11px] font-semibold text-white">
                        {isHi ? "ग्राउंड ऑपरेशंस सक्रिय" : "Ground Ops Active"}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                      Kanpur Hub
                    </span>
                  </div>
                </div>

                {/* Founder Credentials */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                        Advik Omer
                      </h3>
                      <p className="text-xs text-emerald-400 font-medium mt-0.5">
                        {isHi ? "संस्थापक एवं ग्राउंड ऑपरेशंस प्रमुख" : "Founder & Operations Lead"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{isHi ? "सत्यापित" : "Verified"}</span>
                    </div>
                  </div>

                  {/* Physical Location Badge */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground bg-white/[0.03] p-2 rounded-lg border border-white/5">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px]">
                      {isHi
                        ? "कल्याणपुर, कानपुर, उत्तर प्रदेश (पिन: 208016)"
                        : "Kalyanpur, Kanpur, UP — 208016, India"}
                    </span>
                  </div>

                  {/* Social & Contact Channels */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={FOUNDER_LINKEDIN}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Advik Omer on LinkedIn"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-blue-500/40 hover:bg-blue-500/10 transition-all cursor-pointer"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href="https://x.com/advikomer"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Advik Omer on X / Twitter"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-pointer"
                      >
                        <Twitter className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={`mailto:${FOUNDER_EMAIL}`}
                        aria-label="Email Founder directly"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-amber-500/40 hover:bg-amber-500/10 transition-all cursor-pointer"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </a>
                    </div>

                    <a
                      href={getWhatsAppUrl(
                        isHi
                          ? "नमस्ते Advik, मैं StashSaarthi के बारे में सीधे बात करना चाहता/चाहती हूं।"
                          : "Hi Advik, I would like to connect directly regarding StashSaarthi.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/25 transition-all cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{isHi ? "सीधा व्हाट्सएप" : "Direct WhatsApp"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </Card3D>
          </AnimatedContent>
        </div>

        {/* ── Founder's Grounded Letter (7 Cols) ── */}
        <div className="lg:col-span-7">
          <AnimatedContent distance={30} direction="horizontal" duration={0.6} delay={0.2}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 backdrop-blur-xl relative">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 uppercase tracking-widest mb-2">
                <Sparkles className="h-3 w-3" />
                <span>{isHi ? "फाउंडर का नोट" : "FOUNDER'S NOTE & MISSION"}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                {isHi
                  ? "«हमने इसे इसलिए बनाया क्योंकि बिचौलियों और खाली कमरों की समस्या का वास्तविक समाधान जरूरी था»"
                  : '"We built StashSaarthi because Indian campus living deserved radical honesty, not broker traps."'}
              </h3>

              <div className="mt-3 space-y-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                <p>
                  {isHi
                    ? "हर सेमेस्टर ब्रेक पर मैंने अपने साथी छात्रों को केवल दो सूटकेस सुरक्षित रखने के लिए खाली पीजी कमरों का ₹4,000–₹8,000 का 'डेड-रेंट' भरते देखा। वहीं दूसरी ओर, कल्याणपुर और स्वरूप नगर में बुजुर्ग दंपत्ति खाली कमरों और अकेलेपन के साथ रहते थे।"
                    : "Every semester transition, I watched classmates across Kanpur bleed ₹4,000 to ₹8,000 in dead vacation rent just to lock two suitcases and a mattress in empty rooms. Meanwhile, senior citizens in our own neighborhoods lived with quiet, unused spaces and fixed-pension inflation."}
                </p>
                <p>
                  {isHi
                    ? "StashSaarthi किसी अमूर्त ऐप या अनाम कॉर्पोरेशन की तरह नहीं चलता। हमने सॉफ्टवेयर के अनुशासन के साथ ज़मीनी मानवीय विश्वास का ढांचा तैयार किया है — जहां हर बैग पर लेजर सील लगती है, हर भुगतान डिजिटल एस्क्रो में सुरक्षित रहता है और वरिष्ठ नागरिकों को सम्मानजनक आय मिलती है।"
                    : "StashSaarthi isn't an anonymous corporate software layer. We combined deterministic software safeguards with real human community: tamper-evident barcode seals, 100% digital escrow, and dignified micro-earnings for senior hosts."}
                </p>
                <p className="text-foreground/90 font-medium">
                  {isHi
                    ? "मैं व्यक्तिगत रूप से हमारे कानपुर नोड्स और सुरक्षा ऑडिट की निगरानी करता हूं। यदि कभी कोई समस्या आती है, तो आपको किसी बोट से नहीं, सीधे मुझसे बात करने का अधिकार है।"
                    : "I personally oversee our Kanpur ground audits and security protocols. If anything ever goes wrong, you don't fight an automated chatbot — you reach directly out to me."}
                </p>
              </div>

              {/* Accountability Pillars */}
              <div className="mt-4 pt-3 border-t border-white/10 grid gap-2 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">
                      {isHi ? "प्रत्यक्ष एस्केलेशन: " : "Direct Escalation: "}
                    </strong>
                    {isHi
                      ? "फाउंडर फोन लाइन " + FOUNDER_PHONE_DISPLAY
                      : `Founder phone line ${FOUNDER_PHONE_DISPLAY}`}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-[11px] text-muted-foreground">
                    <strong className="text-foreground">
                      {isHi ? "भौतिक उपस्थिति: " : "Physical Presence: "}
                    </strong>
                    {isHi
                      ? "कानपुर कैंपस कॉरिडोर में ऑन-ग्राउंड टीम"
                      : "On-ground ops team in Kanpur Academic Corridor"}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </div>
  );
}
