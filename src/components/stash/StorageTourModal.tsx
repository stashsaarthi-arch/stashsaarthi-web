import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Truck,
  ShieldCheck,
  Building2,
  RotateCcw,
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface StorageTourModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookClick?: () => void;
}

export function StorageTourModal({ open, onOpenChange, onBookClick }: StorageTourModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [currentStep, setCurrentStep] = useState(0);

  const TOUR_STEPS = [
    {
      step: 1,
      title: isHi ? "1. डोरस्टेप पिकअप व बारकोड टैम्पर सील" : "1. Doorstep Pickup & Barcode Tamper Seal",
      desc: isHi 
        ? "सत्यापित कॉलेज कंसीयज आपके हॉस्टल गेट पर पहुंचता है। हर बैग को आपकी उपस्थिति में सीरियलाइज्ड बारकोड टैग से सील किया जाता है।"
        : "Our verified college concierge arrives at your hostel room gate. Each bag is sealed with a serialized, non-tearable barcode tag in your presence.",
      icon: Truck,
      badge: isHi ? "15-मिनट पिकअप SLA" : "15-Min Pickup SLA",
      metric: isHi ? "100% बैग निरीक्षण" : "100% Bag Inspection",
      bgGradient: "from-emerald-600/20 to-cyan-600/10",
    },
    {
      step: 2,
      title: isHi ? "2. नमी-सुरक्षित पैलेट स्टोरेज" : "2. Climate-Safe Pallet Storage",
      desc: isHi
        ? "बैग्स को सीसीटीवी व डिह्यूमिडिफिकेशन युक्त सीनियर होस्ट कमरों में जमीन से ऊंचे पैलेट्स पर रखा जाता है।"
        : "Bags are stored elevated on moisture-proof wooden/plastic pallets in senior citizen host rooms with CCTV security and dehumidification.",
      icon: Building2,
      badge: isHi ? "मानसून-प्रूफ पैलेट्स" : "Monsoon Proof Pallets",
      metric: isHi ? "जमीन से ऊंचा भंडारण" : "Elevated off ground",
      bgGradient: "from-cyan-600/20 to-blue-600/10",
    },
    {
      step: 3,
      title: isHi ? "3. डिजिटल स्टैशपास ट्रैकिंग व बीमा" : "3. Digital StashPass Tracking & Insurance",
      desc: isHi
        ? "सील फोटो लॉग के साथ आपका डिजिटल बोर्डिंग पास व्हाट्सएप पर तुरंत उपलब्ध होता है, जिसमें ₹10,000 की सक्रिय सुरक्षा बीमा शामिल है।"
        : "Your digital boarding pass with sealed photo logs is instantly accessible on WhatsApp with active ₹10,000 safety insurance coverage.",
      icon: ShieldCheck,
      badge: isHi ? "₹10,000 सुरक्षा बीमा" : "₹10,000 Safety Cover",
      metric: isHi ? "रीयल-टाइम नोड चेक-इन" : "Real-time Node Check-in",
      bgGradient: "from-indigo-600/20 to-purple-600/10",
    },
    {
      step: 4,
      title: isHi ? "4. 48-घंटे में निःशुल्क डोरस्टेप वापसी" : "4. 48-Hour Free Doorstep Return",
      desc: isHi
        ? "नया सेमेस्टर शुरू होने पर, व्हाट्सएप पर 1-टैप अनुरोध से सभी बैग सीधे आपके नए कमरे तक बिना किसी अतिरिक्त शुल्क के पहुंचाए जाते हैं।"
        : "When the new semester starts, 1-tap request on WhatsApp delivers all bags back to your new hostel or room with zero delivery fees.",
      icon: RotateCcw,
      badge: isHi ? "शून्य निकास शुल्क" : "Zero Hidden Exit Fees",
      metric: isHi ? "कमरे के दरवाजे तक डिलीवरी" : "Delivered to Room Door",
      bgGradient: "from-emerald-600/20 to-amber-600/10",
    },
  ];

  const step = (TOUR_STEPS[currentStep] ?? TOUR_STEPS[0])!;
  const Icon = step.icon;

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % TOUR_STEPS.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + TOUR_STEPS.length) % TOUR_STEPS.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-emerald-500/30 bg-[#0A0D0F]/95 text-foreground backdrop-blur-2xl p-6 rounded-3xl">
        <DialogHeader className="text-left space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 w-fit">
            <Play className="h-3.5 w-3.5" />
            {isHi ? "4-चरणीय स्टोरेज विजुअल टूर" : "4-Step Storage Visual Tour"}
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            {isHi ? "सार्थी स्टैश कैसे काम करता है" : "How Saarthi Stash Works"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {isHi 
              ? "हॉस्टल दरवाजे से सुरक्षित नोड और वापसी तक — शून्य तनाव, 100% बीमित।"
              : "From hostel door to dry node and back — zero stress, 100% insured."}
          </DialogDescription>
        </DialogHeader>

        {/* Step Visual Preview Card */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-5 relative">
          <div className={`absolute inset-0 bg-gradient-to-br ${step.bgGradient} opacity-30`} />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold font-mono">
                  0{step.step}
                </span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  {step.badge}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                {step.metric}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              {step.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {step.desc}
            </p>
          </div>
        </div>

        {/* Navigation Indicators */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? "w-6 bg-emerald-400" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevStep}
              className="h-8 w-8 p-0 border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextStep}
              className="h-8 w-8 p-0 border-white/10 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Footers */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
          <Button
            variant="hero"
            className="flex-1 text-xs sm:text-sm font-bold cursor-pointer"
            onClick={() => {
              onOpenChange(false);
              if (onBookClick) onBookClick();
            }}
          >
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            {isHi ? "₹300/माह में स्टैश लॉक करें" : "Lock ₹300/mo Stash Now"}
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            {isHi ? "बंद करें" : "Close Tour"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
