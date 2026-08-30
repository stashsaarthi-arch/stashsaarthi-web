import { useState } from "react";
import {
  ShieldCheck,
  HeartPulse,
  Smartphone,
  LocateFixed,
  Radio,
  UserCheck,
  Building2,
  BellRing,
  RotateCcw,
} from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Card3D } from "@/components/ui/Card3D";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const FEATURE_ICONS = [Smartphone, HeartPulse, LocateFixed];

export function FamilyDashboard() {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [sosState, setSosState] = useState<"idle" | "triggered" | "resolved">("idle");
  const [activeStep, setActiveStep] = useState<number>(0);

  // Web Audio API Synthesizer for Bedside SOS Demonstration
  const playSosAlertSound = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const tones = [
        { freq: 587.33, start: 0.0, dur: 0.15 }, // D5
        { freq: 739.99, start: 0.18, dur: 0.15 }, // F#5
        { freq: 880.0, start: 0.36, dur: 0.25 }, // A5
      ];

      tones.forEach((tone) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(tone.freq, ctx.currentTime + tone.start);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + tone.start);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + tone.start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.start + tone.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + tone.start);
        osc.stop(ctx.currentTime + tone.start + tone.dur);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const triggerSos = () => {
    playSosAlertSound();
    setSosState("triggered");
    setActiveStep(1);

    setTimeout(() => {
      playSosAlertSound();
      setActiveStep(2);
    }, 1200);

    setTimeout(() => {
      playSosAlertSound();
      setActiveStep(3);
    }, 2400);
  };

  const resetSos = () => {
    setSosState("idle");
    setActiveStep(0);
  };

  const features = t.familyDashboardSection.features || [];

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-4 sm:py-6">
      <AnimatedContent distance={20} direction="vertical" duration={0.5}>
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] sm:text-xs font-semibold text-amber-400 mb-2 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.familyDashboardSection.badge}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight sm:text-3xl mb-1.5">
            {t.familyDashboardSection.title}{" "}
            <span className="text-gradient">{t.familyDashboardSection.titleGradient}</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm max-w-2xl mx-auto">
            {t.familyDashboardSection.subtitle}
          </p>
        </div>

        <div className="grid gap-3.5 md:grid-cols-3">
          {features.map((feat, idx) => {
            const Icon = FEATURE_ICONS[idx] || Smartphone;
            return (
              <Card3D key={idx} maxTilt={8} className="h-full">
                <div className="glass flex h-full flex-col items-center text-center rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden bg-black/40">
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent" />
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-3"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="text-sm sm:text-base font-bold mb-1.5 text-foreground"
                    style={{ transform: "translateZ(15px)" }}
                  >
                    {feat.title}
                  </h3>
                  <p
                    className="text-xs text-muted-foreground leading-relaxed"
                    style={{ transform: "translateZ(10px)" }}
                  >
                    {feat.desc}
                  </p>
                </div>
              </Card3D>
            );
          })}
        </div>

        {/* ── Interactive 1-Touch Bedside SOS Live Simulator ── */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-b from-[#12161A] to-[#0A0D0F] p-4 sm:p-6 shadow-xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Radio className="h-48 w-48 text-amber-400" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  {isHi ? "लाइव हार्डवेयर प्रदर्शन" : "Live Hardware Demonstration"}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {t.familyDashboardSection.sosTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {t.familyDashboardSection.sosSubtitle}
                </p>
              </div>

              {sosState === "idle" ? (
                <button
                  type="button"
                  onClick={triggerSos}
                  className="group relative flex items-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold px-6 py-3.5 shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <span className="absolute -inset-1 rounded-2xl bg-rose-500 opacity-40 blur-md animate-pulse" />
                  <Radio className="relative z-10 h-5 w-5 animate-bounce" />
                  <span className="relative z-10">{t.familyDashboardSection.triggerBtn}</span>
                </button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSos}
                  className="shrink-0 border-white/10 text-slate-300 hover:text-white cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                  {t.familyDashboardSection.resetBtn}
                </Button>
              )}
            </div>

            {/* 3-Tier Cascade Nodes */}
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Step 1: Student Roommate */}
              <div
                className={`rounded-2xl border p-5 transition-all duration-500 ${
                  activeStep >= 1
                    ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : "border-white/10 bg-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <UserCheck className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">
                    {activeStep >= 1
                      ? isHi
                        ? "✓ 0.4s सक्रिय"
                        : "✓ 0.4s TRIGGERED"
                      : isHi
                        ? "टियर 1"
                        : "TIER 1"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isHi ? "सत्यापित छात्र साथी" : "Verified Student Roommate"}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {isHi
                    ? "तत्काल बेडसाइड सहायता और प्राथमिक उपचार के लिए छात्र के फोन पर सायरन अलर्ट।"
                    : "Loud siren alert on student's phone for immediate bedside check-in & first aid assistance."}
                </p>
              </div>

              {/* Step 2: Kanpur Nodal Manager */}
              <div
                className={`rounded-2xl border p-5 transition-all duration-500 ${
                  activeStep >= 2
                    ? "border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : "border-white/10 bg-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-400">
                    {activeStep >= 2
                      ? isHi
                        ? "✓ 1.2s रवाना"
                        : "✓ 1.2s DISPATCHED"
                      : isHi
                        ? "टियर 2"
                        : "TIER 2"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isHi ? "स्थानीय नोडल ऑपरेशंस टीम" : "Local Nodal Ops Team"}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {isHi
                    ? "सटीक पते के साथ स्थानीय कंसीयज और आपातकालीन सेवा टीम को अलर्ट भेजा गया।"
                    : "Area concierge & partner ambulance service alerted with accurate address & landmark."}
                </p>
              </div>

              {/* Step 3: Remote Family WhatsApp */}
              <div
                className={`rounded-2xl border p-5 transition-all duration-500 ${
                  activeStep >= 3
                    ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                    : "border-white/10 bg-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <BellRing className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">
                    {activeStep >= 3
                      ? isHi
                        ? "✓ 2.4s कनेक्टेड"
                        : "✓ 2.4s CONNECTED"
                      : isHi
                        ? "टियर 3"
                        : "TIER 3"}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-foreground">
                  {isHi ? "फैमिली WhatsApp ब्रॉडकास्ट" : "Family WhatsApp Broadcast"}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {isHi
                    ? "बेंगलुरु/दिल्ली में रहने वाले बेटे/बेटी को वास्तविक समय में स्वचालित फोन कॉल और लाइव लोकेशन।"
                    : "Automated phone dial + live GPS telemetry delivered directly to family WhatsApp group."}
                </p>
              </div>
            </div>

            {/* Live GPS Telemetry Indicator */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>KANPUR_NODE_LAT: 26.5123° N, 80.2329° E (IITK Sector)</span>
              </div>
              <span className="text-emerald-400 font-bold">
                {isHi
                  ? "🔒 एन्क्रिप्टेड 256-बिट परिवार सुरक्षा लाइन"
                  : "🔒 256-BIT ENCRYPTED FAMILY SAFETY CHANNEL"}
              </span>
            </div>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
