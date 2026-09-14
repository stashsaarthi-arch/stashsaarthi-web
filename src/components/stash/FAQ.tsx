import { memo } from "react";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { FaqAccordion2 } from "@/components/ui/FaqAccordion2";

export const FAQ = memo(function FAQ() {
  const { language } = useLanguage();
  const { role } = usePersona();
  const isHi = language === "hi";
  const isHost = role === "host";

  return (
    <section id="faq" className="section-isolated layout-isolated relative px-4 py-4 sm:py-6 scroll-mt-20">
      <div className="mx-auto max-w-3xl">
        <AnimatedContent distance={20} direction="vertical" duration={0.5}>
          <div className="text-center mb-5">
            <Badge
              variant="outline"
              className={`text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-widest font-mono mb-1.5 ${
                isHost
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
              }`}
            >
              {isHi ? "❓ स्पष्ट एवं ईमानदार उत्तर" : "❓ HONEST & UNFILTERED ANSWERS"}
            </Badge>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
              {isHi ? (
                <>
                  अक्सर पूछे जाने वाले <span className="text-gradient">पारदर्शी सवाल</span>
                </>
              ) : (
                <>
                  Radical Transparency <span className="text-gradient">& Hard Questions</span>
                </>
              )}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {isHi
                ? "बिना किसी कॉर्पोरेट घुमाव के — डेटा सुरक्षा, शुरुआती चरण की विश्वसनीयता और प्रत्यक्ष मानवीय जवाबदेही पर सीधे उत्तर।"
                : "Zero corporate spin. Direct answers addressing data privacy, early-stage reliability, and guaranteed human accountability."}
            </p>
          </div>

          <FaqAccordion2 role={role} />
        </AnimatedContent>
      </div>
    </section>
  );
});

