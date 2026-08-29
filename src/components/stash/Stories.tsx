import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BadgeCheck, Pause, Play, Star } from "lucide-react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import type { Role } from "./types";
import { useLanguage } from "@/context/LanguageContext";

type Story = {
  name: string;
  role: string;
  role_hi?: string;
  city: string;
  city_hi?: string;
  rating: number;
  text: string;
  text_hi?: string;
  clip: string;
  group: Group;
};

type Group = "students" | "seniors" | "partners";

const STORIES: Story[] = [
  {
    group: "students",
    name: "Aarav Mishra",
    role: "B.Tech, IIT Kanpur belt",
    role_hi: "बी.टेक छात्र, आईआईटी कानपुर",
    city: "Kanpur",
    city_hi: "कानपुर",
    rating: 5,
    clip: "0:42",
    text: "I stashed 4 bags for the summer for ₹1,200 instead of paying ₹16,000 rent for an empty room. Pickup and return were both on time.",
    text_hi: "मैंने खाली कमरे का ₹16,000 किराया देने के बजाय पूरी गर्मियों के लिए 4 बैग मात्र ₹1,200 में रखे। पिकअप और वापसी दोनों समय पर हुए।",
  },
  {
    group: "students",
    name: "Ishita Rawat",
    role: "MBA student",
    role_hi: "एमबीए छात्रा",
    city: "Lucknow",
    city_hi: "लखनऊ",
    rating: 5,
    clip: "0:31",
    text: "Found a brokerage-free room in six days. The on-site audit photos matched exactly what I moved into.",
    text_hi: "छह दिनों में बिना किसी ब्रोकर के कमरा मिल गया। ऑन-साइट ऑडिट की तस्वीरें बिल्कुल वैसी ही थीं जैसा वास्तविक कमरा था।",
  },
  {
    group: "seniors",
    name: "Sudha Tripathi",
    role: "Retired principal, 71",
    role_hi: "सेवानिवृत्त प्रधानाचार्य, 71 वर्ष",
    city: "Kanpur",
    city_hi: "कानपुर",
    rating: 5,
    clip: "0:55",
    text: "My first floor was empty for nine years. Now Aarav sets up my video calls every evening and the house has noise again.",
    text_hi: "मेरी पहली मंजिल नौ साल से खाली थी। अब आरव हर शाम मेरे वीडियो कॉल सेट करता है और घर में फिर से रौनक आ गई है।",
  },
  {
    group: "seniors",
    name: "Col. R. Bajpai",
    role: "Ex-Army, 78",
    role_hi: "पूर्व सैन्य अधिकारी, 78 वर्ष",
    city: "Lucknow",
    city_hi: "लखनऊ",
    rating: 5,
    clip: "0:38",
    text: "The police verification gave my daughter confidence. I get help, company, and a little income.",
    text_hi: "पुलिस सत्यापन से मेरी बेटी को पूरा भरोसा हुआ। मुझे घर में मदद, पारिवारिक साथ और सम्मानजनक आय मिलती है।",
  },
  {
    group: "partners",
    name: "Rekha Yadav",
    role: "Home chef partner",
    role_hi: "घरेलू शेफ पार्टनर",
    city: "Pune",
    city_hi: "पुणे",
    rating: 5,
    clip: "0:27",
    text: "I cook 40 tiffins a day from my own kitchen. Weekly payouts arrive without a single follow-up call.",
    text_hi: "मैं अपनी रसोई से प्रतिदिन 40 टिफिन बनाती हूं। बिना किसी फॉलो-अप के हर हफ्ते बैंक खाते में भुगतान आ जाता है।",
  },
  {
    group: "partners",
    name: "Imran Sheikh",
    role: "Stash node partner",
    role_hi: "स्टैश नोड पार्टनर",
    city: "Delhi NCR",
    city_hi: "दिल्ली एनसीआर",
    rating: 4,
    clip: "0:33",
    text: "My unused godown corner now earns steady monthly income with zero investment from my side.",
    text_hi: "मेरे गोदाम का खाली कोना अब बिना किसी निवेश के हर महीने निश्चित आय देता है।",
  },
];

export function Stories({ role }: { role?: Role }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [filter, setFilter] = useState<Group | "all">(role === "host" ? "seniors" : "all");
  const [playing, setPlaying] = useState<string | null>(null);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(0);
  const list = filter === "all" ? STORIES : STORIES.filter((s) => s.group === filter);

  const filters = t.storiesSection.filters || [
    { id: "all", label: isHi ? "सभी" : "All" },
    { id: "students", label: isHi ? "छात्र" : "Students" },
    { id: "seniors", label: isHi ? "सीनियर होस्ट्स" : "Senior Hosts" },
    { id: "partners", label: isHi ? "पार्टनर्स" : "Partners" },
  ];

  // Web Audio chime generator
  const playAmbientChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5 major chord
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.9);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 1.0);
      });
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  const handleTogglePlay = (storyName: string) => {
    if (playing === storyName) {
      setPlaying(null);
      setPlaybackSeconds(0);
    } else {
      setPlaying(storyName);
      setPlaybackSeconds(0);
      playAmbientChime();
    }
  };

  // Timer loop for simulated playback
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setPlaybackSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [playing]);

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
          {t.storiesSection.title} <span className="text-gradient">{t.storiesSection.titleGradient}</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">
          {t.storiesSection.subtitle}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-center">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as Group | "all")}
            className={`min-w-0 truncate rounded-full border px-4 py-2 text-sm font-medium transition cursor-pointer ${
              filter === f.id
                ? "border-cyan/50 bg-cyan/15 text-foreground"
                : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((s, idx) => {
            const on = playing === s.name;
            const currentSecs = on ? playbackSeconds : 0;
            const formattedCurrent = `0:${currentSecs < 10 ? `0${currentSecs}` : currentSecs}`;
            return (
              <AnimatedContent
                key={s.name}
                scale={0.9}
                duration={0.5}
                ease="power3.out"
                delay={idx * 0.08}
              >
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="glass flex h-full flex-col justify-between rounded-3xl p-5 sm:p-6"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold">{s.name}</h3>
                          <BadgeCheck className="h-4 w-4 text-cyan" />
                          <PrototypeBadge variant="text" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isHi && s.role_hi ? s.role_hi : s.role} · {isHi && s.city_hi ? s.city_hi : s.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber">
                        {Array.from({ length: s.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{isHi && s.text_hi ? s.text_hi : s.text}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-2.5">
                    <button
                      type="button"
                      onClick={() => handleTogglePlay(s.name)}
                      className="flex items-center gap-2 rounded-xl bg-cyan/15 px-3 py-1.5 text-xs font-semibold text-cyan transition hover:bg-cyan/25 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan focus-visible:outline-none"
                      aria-label={on ? "Pause audio story" : "Play audio story"}
                    >
                      {on ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                      <span>{on ? (isHi ? "रोकें" : "Pause") : (isHi ? "ऑडियो सुनें" : "Listen")}</span>
                    </button>

                    {/* Equalizer animation */}
                    {on && (
                      <div className="hidden sm:flex items-center gap-1">
                        {[40, 80, 55, 95, 60, 85, 45].map((h, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: ["4px", `${h * 0.2}px`, "4px"] }}
                            transition={{
                              duration: 0.6 + (i % 3) * 0.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: i * 0.08,
                            }}
                            className="w-1 rounded-full bg-cyan"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                      <span className={on ? "text-cyan font-bold" : ""}>
                        {on ? formattedCurrent : "0:00"}
                      </span>
                      <span>/</span>
                      <span>{s.clip}</span>
                    </div>
                  </div>
                </motion.article>
              </AnimatedContent>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
