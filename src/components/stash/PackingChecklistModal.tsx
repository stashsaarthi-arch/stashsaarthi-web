import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckSquare, Square, Package, CheckCircle2, Scale, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface PackingChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToBooking?: () => void;
}

const BAG_PRESETS = [
  {
    id: "trolley-24",
    name: '24" Medium Trolley',
    name_hi: '24" मध्यम ट्रॉली',
    volume: "65L",
    maxWeight: "20kg",
    sealPos: "Main Dual-Zipper Head",
  },
  {
    id: "trolley-28",
    name: '28" Large Trolley',
    name_hi: '28" बड़ी ट्रॉली',
    volume: "95L",
    maxWeight: "25kg",
    sealPos: "Dual Zippers + Side Handle",
  },
  {
    id: "rucksack",
    name: "65L Campus Rucksack",
    name_hi: "65L कैंपस रकसैक",
    volume: "65L",
    maxWeight: "18kg",
    sealPos: "Drawstring Buckle Lock",
  },
  {
    id: "study-box",
    name: "Heavy Study Carton",
    name_hi: "किताबों का भारी कार्टन",
    volume: "75L",
    maxWeight: "22kg",
    sealPos: "H-Tape Cross Seal",
  },
];

export function PackingChecklistModal({
  open,
  onOpenChange,
  onProceedToBooking,
}: PackingChecklistModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [selectedBagType, setSelectedBagType] = useState("trolley-24");

  const CHECKLIST_ITEMS = [
    {
      id: "perishables",
      title: isHi ? "कोई खराब होने वाला भोजन या तरल पदार्थ नहीं" : "No Perishable Food or Liquids",
      desc: isHi
        ? "सीलन और कीड़ों से बचाव के लिए पानी की बोतलें खाली करें, फल, खुले स्नैक्स और तरल प्रसाधन सामग्री निकाल लें।"
        : "Empty water bottles, remove fruits, open snacks, and liquid toiletries to prevent spills or pests.",
    },
    {
      id: "valuable",
      title: isHi ? "अति-मूल्यवान वस्तुएं अपने पास रखें" : "Keep High-Valuables with You",
      desc: isHi
        ? "मूल सरकारी आईडी, आभूषण, नकदी और मुख्य लैपटॉप/फोन अपने निजी केबिन बैग में साथ ले जाएं।"
        : "Carry original government IDs, gold/cash, and primary laptops/phones in your personal cabin bag.",
    },
    {
      id: "zipper",
      title: isHi ? "मुख्य ज़िप व तालों को बंद करें" : "Lock Main Zippers & Compartments",
      desc: isHi
        ? "कंसीयज को सौंपने से पहले सभी बैगों के ज़िप पर नंबर लॉक या पैडलॉक लगाएं।"
        : "Use TSA/number locks on all bag zippers before doorstep concierge handoff.",
    },
    {
      id: "barcode",
      title: isHi ? "बारकोड टैम्पर सील लगवाएं" : "Apply Barcode Tamper Seal",
      desc: isHi
        ? "सार्थी कंसीयज आपकी उपस्थिति में लेजर-क्रमांकित सील लगाएगा और सीरियल नंबर दर्ज करेगा।"
        : "Saarthi concierge applies a laser-numbered tamper seal and logs serial numbers in your presence.",
    },
    {
      id: "photo",
      title: isHi ? "समय-मुद्रित दोहरी फोटो लॉग लें" : "Capture Timestamped Dual-Photo Log",
      desc: isHi
        ? "डिजिटल स्टैशपास रिकॉर्ड के लिए कंसीयज के साथ सीलबंद बैग की त्वरित तस्वीर लें।"
        : "Take a quick photo of your sealed bag alongside the concierge for your digital StashPass record.",
    },
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>({
    perishables: true,
    zipper: true,
    valuable: true,
  });

  const toggleItem = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = CHECKLIST_ITEMS.every((item) => checked[item.id]);

  const handleComplete = () => {
    toast.success(isHi ? "पैकिंग प्रोटोकॉल सत्यापित!" : "Packing Protocol Verified!", {
      description: isHi
        ? "आप सुरक्षित वेकेशन स्टोरेज के लिए 100% तैयार हैं।"
        : "You're 100% ready for safe vacation storage.",
    });
    onOpenChange(false);
    if (onProceedToBooking) {
      onProceedToBooking();
    }
  };

  const currentPreset = BAG_PRESETS.find((p) => p.id === selectedBagType) || BAG_PRESETS[0]!;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-emerald-500/30 bg-[#0A0D0F]/95 text-foreground backdrop-blur-2xl p-6 rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 w-fit">
            <Package className="h-3.5 w-3.5" />
            {isHi ? "वेकेशन-पूर्व सुरक्षा मानक" : "Pre-Vacation Safety Standard"}
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            {isHi ? "लगेज पैकिंग व सील चेकलिस्ट" : "Luggage Packing & Seal Checklist"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            {isHi
              ? "100% बीमा वैधता सुनिश्चित करने के लिए बैग सौंपने से पहले इन 5 बिंदुओं का पालन करें।"
              : "Follow this 5-point checklist before handing over bags to ensure 100% insurance validity."}
          </DialogDescription>
        </DialogHeader>

        {/* Dynamic Bag Dimension & Weight Calibrator */}
        <div className="mt-3 p-3.5 rounded-2xl border border-white/10 bg-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-cyan-400" />
              <span>{isHi ? "बैग प्रकार व भार कैलिब्रेटर:" : "Bag Type & Weight Calibrator:"}</span>
            </span>
            <span className="font-mono text-emerald-400">
              {currentPreset.volume} · Max {currentPreset.maxWeight}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {BAG_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedBagType(preset.id)}
                className={`p-2 rounded-xl border text-xs text-left transition cursor-pointer ${
                  selectedBagType === preset.id
                    ? "border-cyan-500/50 bg-cyan-500/10 text-white font-bold"
                    : "border-white/10 bg-black/40 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="truncate">{isHi ? preset.name_hi : preset.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {preset.volume} · Max {preset.maxWeight}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5-Point Checklist */}
        <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {CHECKLIST_ITEMS.map((item) => {
            const isDone = !!checked[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isDone
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-white/5 border-white/10 hover:border-white/20"
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-400 shrink-0 cursor-pointer"
                  aria-label={item.title}
                >
                  {isDone ? (
                    <CheckSquare className="h-5 w-5 fill-emerald-500 text-black" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                <div className="flex-1 text-left">
                  <h3 className={`text-xs font-bold ${isDone ? "text-white" : "text-slate-300"}`}>
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              {isHi
                ? `${Object.values(checked).filter(Boolean).length}/5 मानक सत्यापित`
                : `${Object.values(checked).filter(Boolean).length}/5 verified`}
            </span>
          </div>

          <Button
            variant="hero"
            onClick={handleComplete}
            className="w-full sm:w-auto cursor-pointer"
          >
            {isHi ? "सुरक्षा चेकलिस्ट पूर्ण करें" : "Complete & Reserve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
