import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Boxes,
  Briefcase,
  HandHeart,
  Home,
  ShieldCheck,
  Soup,
  ChevronDown,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OpenBooking } from "./types";
import { Tilt3D } from "./Tilt3D";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { PrototypeBadge } from "@/components/ui/PrototypeBadge";
import { useLanguage } from "@/context/LanguageContext";

type NodeKey = "spaces" | "kitchen" | "stash" | "connect" | "trust" | "micro";

type NodeBase = {
  id: NodeKey;
  accent: string;
  icon: typeof Home;
};

const NODES_BASE: NodeBase[] = [
  {
    id: "spaces",
    accent: "var(--cyan)",
    icon: Home,
  },
  {
    id: "kitchen",
    accent: "var(--amber)",
    icon: Soup,
  },
  {
    id: "stash",
    accent: "var(--cyan)",
    icon: Boxes,
  },
  {
    id: "connect",
    accent: "var(--amber)",
    icon: HandHeart,
  },
  {
    id: "trust",
    accent: "var(--emerald)",
    icon: ShieldCheck,
  },
  {
    id: "micro",
    accent: "var(--emerald)",
    icon: Briefcase,
  },
];

export function Ecosystem({ onBook }: { onBook: OpenBooking }) {
  const [open, setOpen] = useState<string | null>("stash");
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <section id="ecosystem" className="relative mx-auto max-w-4xl px-4 py-10 sm:py-14 scroll-mt-20">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="border-white/15 bg-white/5 text-muted-foreground">
          {isHi ? "6 प्रमुख आयाम" : "6 Dimensions"}
        </Badge>
        <h2 className="mt-5 text-balance text-[1.75rem] font-extrabold tracking-tight sm:text-5xl">
          {t.ecosystem.titlePart1} <span className="text-gradient">{t.ecosystem.titlePart2}</span>
        </h2>
        <p className="mt-4 text-sm text-muted-foreground sm:text-base">{t.ecosystem.subtitle}</p>
      </div>

      <div className="mt-10 space-y-3 sm:mt-14">
        {NODES_BASE.map((n, i) => {
          const Icon = n.icon;
          const isOpen = open === n.id;
          const textData = t.ecosystem[n.id];
          return (
            <AnimatedContent
              key={n.id}
              distance={50}
              direction="vertical"
              duration={0.7}
              threshold={0.15}
              delay={Math.min(i * 0.08, 0.4)}
            >
              <Tilt3D max={4} lift={10} className="rounded-3xl">
                <div className="glass overflow-hidden rounded-3xl">
                  <button
                    onClick={() => setOpen(isOpen ? null : n.id)}
                    aria-expanded={isOpen}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-4 text-left sm:gap-4 sm:p-6 cursor-pointer"
                  >
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10"
                      style={{ background: `color-mix(in oklab, ${n.accent} 18%, transparent)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: n.accent }} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 truncate text-base font-bold sm:text-lg">
                        <span>{textData.title}</span>
                        <PrototypeBadge variant="text" />
                      </span>
                      <span
                        className="block truncate text-xs sm:text-sm"
                        style={{ color: n.accent }}
                      >
                        {textData.badge} - {textData.price}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5"
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 p-4 sm:p-6">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {textData.subtitle}
                          </p>
                          <div
                            className="mt-4 rounded-2xl border border-white/10 p-3 text-xs sm:text-sm"
                            style={{
                              background: `color-mix(in oklab, ${n.accent} 10%, transparent)`,
                            }}
                          >
                            <span className="font-semibold">{textData.price}</span>:{" "}
                            {textData.comparison}
                          </div>
                          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                            {textData.bullets.map((f) => (
                              <li key={f} className="flex items-start gap-2.5 text-sm">
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                                <span className="text-muted-foreground">{f}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant="hero"
                            size="lg"
                            className="mt-6 w-full sm:w-auto cursor-pointer"
                            onClick={() => onBook({ service: n.id, note: textData.title })}
                          >
                            {isHi ? `${textData.title} बुक करें` : `Book ${textData.title}`}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Tilt3D>
            </AnimatedContent>
          );
        })}
      </div>
    </section>
  );
}
