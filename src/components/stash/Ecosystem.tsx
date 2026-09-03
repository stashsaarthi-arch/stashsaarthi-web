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
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <div id="ecosystem" className="relative mx-auto max-w-4xl px-2 py-2 scroll-mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {NODES_BASE.map((n, i) => {
          const Icon = n.icon;
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
              <Tilt3D max={3} lift={6} className="rounded-2xl h-full">
                <div className="glass h-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <div className="flex items-center gap-3 p-4 sm:p-5 border-b border-white/10">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10"
                      style={{ background: `color-mix(in oklab, ${n.accent} 18%, transparent)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: n.accent }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-bold">
                        {textData.title}
                      </div>
                      <div
                        className="truncate text-xs font-medium mt-0.5"
                        style={{ color: n.accent }}
                      >
                        {textData.badge} - {textData.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 sm:p-5 flex flex-col">
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
                    <ul className="mt-3 space-y-2 flex-1">
                      {textData.bullets.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: n.accent }} />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => onBook({ service: n.id as any, note: textData.title })}
                      className="mt-4 w-full rounded-xl py-4 font-bold shadow-lg transition-all active:scale-95 text-xs sm:text-sm cursor-pointer"
                      style={{
                        backgroundColor: n.accent,
                        color: "black",
                        boxShadow: `0 4px 14px 0 color-mix(in oklab, ${n.accent} 40%, transparent)`,
                      }}
                    >
                      {isHi ? `${textData.title} बुक करें` : `Book ${textData.title}`}
                    </Button>
                  </div>
                </div>
              </Tilt3D>
            </AnimatedContent>
          );
        })}
      </div>
    </div>
  );
}
