import {
  Boxes,
  Briefcase,
  HandHeart,
  Home,
  ShieldCheck,
  Soup,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OpenBooking } from "./types";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { useLanguage } from "@/context/LanguageContext";
import { BentoGrid, BentoCard } from "@/components/ui/BentoGrid";
import { BentoSpanType, BentoAspectRatioType } from "@/lib/designTokens";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

import { SaarthiStashCard2 } from "@/components/ui/SaarthiStashCard2";

type NodeKey = "stash" | "spaces" | "kitchen" | "connect" | "trust" | "micro";

type NodeBase = {
  id: NodeKey;
  accent: string;
  icon: typeof Home;
  span: BentoSpanType;
  aspectRatio: BentoAspectRatioType;
};

const NODES_BASE: NodeBase[] = [
  {
    id: "stash",
    accent: "var(--cyan)",
    icon: Boxes,
    span: "normal",
    aspectRatio: "auto",
  },
  {
    id: "spaces",
    accent: "var(--cyan)",
    icon: Home,
    span: "normal",
    aspectRatio: "auto",
  },
  {
    id: "kitchen",
    accent: "var(--amber)",
    icon: Soup,
    span: "normal",
    aspectRatio: "auto",
  },
  {
    id: "connect",
    accent: "var(--amber)",
    icon: HandHeart,
    span: "normal",
    aspectRatio: "auto",
  },
  {
    id: "trust",
    accent: "var(--emerald)",
    icon: ShieldCheck,
    span: "normal",
    aspectRatio: "auto",
  },
  {
    id: "micro",
    accent: "var(--emerald)",
    icon: Briefcase,
    span: "normal",
    aspectRatio: "auto",
  },
];

export function Ecosystem({ onBook }: { onBook: OpenBooking }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <SectionWrapper id="ecosystem" rhythm="compact" containerSize="lg" className="scroll-mt-20">

      <BentoGrid columns={3} className="flex flex-row overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 md:grid md:grid-cols-3 items-stretch md:overflow-visible" autoFlow="dense">
        {NODES_BASE.map((n, i) => {
          const Icon = n.icon;
          const textData = t.ecosystem[n.id];
          const isFeatured = n.span === "featured";

          if (n.id === "stash") {
            return (
              <div key={n.id} className="snap-center min-w-[85vw] md:min-w-0 h-full">
                <AnimatedContent
                  distance={30}
                  direction="vertical"
                  duration={0.6}
                  threshold={0.15}
                  delay={Math.min(i * 0.05, 0.3)}
                  className="col-span-1 h-full flex flex-col items-stretch"
                >
                  <SaarthiStashCard2 onBook={onBook} className="h-full flex flex-col justify-between" />
                </AnimatedContent>
              </div>
            );
          }

          return (
            <div key={n.id} className="snap-center min-w-[85vw] md:min-w-0 h-full">
              <AnimatedContent
                distance={30}
                direction="vertical"
                duration={0.6}
                threshold={0.15}
                delay={Math.min(i * 0.05, 0.3)}
                className="col-span-1 h-full flex flex-col items-stretch"
              >
              <BentoCard
                span={n.span}
                aspectRatio={n.aspectRatio}
                accentColor={n.accent}
                enableTilt={true}
                className="h-full flex flex-col justify-between"
              >
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10"
                      style={{ background: `color-mix(in oklab, ${n.accent} 18%, transparent)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: n.accent }} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base sm:text-lg font-bold">{textData.title}</div>
                      <div
                        className="truncate text-xs font-medium mt-0.5 flex items-center gap-1.5 flex-wrap"
                        style={{ color: n.accent }}
                      >
                        <span>{textData.badge} - {textData.price}</span>
                        <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                          ⚡ {isHi ? "0 रद्दीकरण शुल्क" : "Zero Cancellation Fee"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className={`text-xs leading-relaxed text-muted-foreground ${isFeatured ? 'sm:text-base' : 'sm:text-sm'}`}>
                        {textData.subtitle}
                      </p>
                      <div
                        className="mt-3 rounded-xl border border-white/10 p-3 text-xs"
                        style={{
                          background: `color-mix(in oklab, ${n.accent} 10%, transparent)`,
                        }}
                      >
                        <span className="font-semibold">{textData.price}</span>: {textData.comparison}
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2 flex-1">
                      {textData.bullets.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check
                            className="mt-0.5 h-3.5 w-3.5 shrink-0"
                            style={{ color: n.accent }}
                          />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

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
              </BentoCard>
            </AnimatedContent>
          </div>
        );
      })}
      </BentoGrid>
    </SectionWrapper>
  );
}


