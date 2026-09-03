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

type NodeKey = "stash" | "spaces" | "kitchen" | "connect" | "trust" | "micro";

type NodeBase = {
  id: NodeKey;
  accent: string;
  icon: typeof Home;
};

const NODES_BASE: NodeBase[] = [
  {
    id: "stash",
    accent: "var(--cyan)",
    icon: Boxes,
  },
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
    <div id="ecosystem" className="relative mx-auto max-w-4xl px-2 py-2 scroll-mt-20">
      <div className="space-y-2.5">
        {NODES_BASE.map((n, i) => {
          const Icon = n.icon;
          const isOpen = open === n.id;
          const textData = t.ecosystem[n.id];
          return (
            <AnimatedContent
              key={n.id}
              distance={30}
              direction="vertical"
              duration={0.6}
              threshold={0.15}
              delay={Math.min(i * 0.05, 0.3)}
            >
              <Tilt3D max={3} lift={6} className="rounded-2xl">
                <div className="glass overflow-hidden rounded-2xl border border-white/10">
                  <button
                    onClick={() => setOpen(isOpen ? null : n.id)}
                    aria-expanded={isOpen}
                    className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 p-3 text-left sm:gap-3 sm:p-4 cursor-pointer"
                  >
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/10"
                      style={{ background: `color-mix(in oklab, ${n.accent} 18%, transparent)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: n.accent }} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 truncate text-sm font-bold sm:text-base">
                        <span>{textData.title}</span>
                      </span>
                      <span
                        className="block truncate text-xs font-medium"
                        style={{ color: n.accent }}
                      >
                        {textData.badge} - {textData.price}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5"
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 p-4 sm:p-6 pb-6 sm:pb-8">
                          <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {textData.subtitle}
                          </p>
                          <div
                            className="mt-3 rounded-xl border border-white/10 p-3 text-xs"
                            style={{
                              background: `color-mix(in oklab, ${n.accent} 10%, transparent)`,
                            }}
                          >
                            <span className="font-semibold">{textData.price}</span>:{" "}
                            {textData.comparison}
                          </div>
                          <ul className="mt-3.5 grid gap-2 sm:grid-cols-2">
                            {textData.bullets.map((f) => (
                              <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald" />
                                <span className="text-muted-foreground">{f}</span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            variant="hero"
                            size="default"
                            className="mt-5 w-full sm:w-auto cursor-pointer text-xs sm:text-sm py-2.5 px-5"
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
    </div>
  );
}
