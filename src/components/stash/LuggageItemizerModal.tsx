import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Luggage,
  Package,
  Plus,
  Trash2,
  Tag,
  QrCode,
  ShieldCheck,
  Check,
  Printer,
  Sparkles,
  AlertTriangle,
  Copy,
  BookOpen,
  Shirt,
  Box,
  Laptop,
  Layers,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

export interface LuggageStorageItem {
  id: string;
  category: "Carton Box" | "Suitcase" | "Duffle Bag" | "Books & Notes" | "Electronics" | "Other";
  customLabel: string;
  barcode: string;
  isFragile: boolean;
  weightEstKg: number;
}

interface LuggageItemizerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: LuggageStorageItem[];
  onSaveItems?: (items: LuggageStorageItem[]) => void;
  onProceedToBooking?: (items: LuggageStorageItem[]) => void;
}

const CATEGORY_PRESETS = [
  {
    id: "Carton Box",
    label_en: "Carton Box",
    label_hi: "कार्टन बॉक्स",
    icon: Box,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    defaultLabel: "Carton #1: Semester Notes & Books",
  },
  {
    id: "Suitcase",
    label_en: "Suitcase / Trolley",
    label_hi: "सूटकेस / ट्रॉली",
    icon: Luggage,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    defaultLabel: "Suitcase: Winter Jackets & Clothes",
  },
  {
    id: "Duffle Bag",
    label_en: "Duffle Bag",
    label_hi: "डफ़ल बैग",
    icon: Shirt,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    defaultLabel: "Duffle: Daily Wear & Sportswear",
  },
  {
    id: "Books & Notes",
    label_en: "Books & Notes",
    label_hi: "किताबें व नोट्स",
    icon: BookOpen,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    defaultLabel: "Box: JEE/GATE Prep Materials",
  },
  {
    id: "Electronics",
    label_en: "Electronics Box",
    label_hi: "इलेक्ट्रॉनिक्स बॉक्स",
    icon: Laptop,
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    defaultLabel: "Electronics: Kettle, Monitor & Cables",
  },
  {
    id: "Other",
    label_en: "Miscellaneous",
    label_hi: "अन्य सामान",
    icon: Package,
    color: "text-slate-400 bg-slate-500/10 border-slate-500/30",
    defaultLabel: "Miscellaneous: Bedding & Household",
  },
] as const;

const POPULAR_ITEM_PRESETS = [
  { cat: "Carton Box" as const, label: "Carton #1: Books & Semester Notes", weight: 15, fragile: false },
  { cat: "Suitcase" as const, label: "Suitcase: Winter Clothes & Jackets", weight: 18, fragile: false },
  { cat: "Carton Box" as const, label: "Box #2: Bedding, Pillows & Blanket", weight: 8, fragile: false },
  { cat: "Duffle Bag" as const, label: "Duffle: Shoes, Boots & Gym Gear", weight: 7, fragile: false },
  { cat: "Electronics" as const, label: "Electronics Box: Electric Kettle & Charger", weight: 5, fragile: true },
  { cat: "Carton Box" as const, label: "Box #3: Kitchen Utensils & Induction", weight: 10, fragile: true },
];

export function LuggageItemizerModal({
  open,
  onOpenChange,
  items: initialItemsProp,
  onSaveItems,
  onProceedToBooking,
}: LuggageItemizerModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [items, setItems] = useState<LuggageStorageItem[]>(() => {
    if (initialItemsProp && initialItemsProp.length > 0) return initialItemsProp;
    return [
      {
        id: `item-1-${Date.now()}`,
        category: "Suitcase",
        customLabel: "Suitcase: Winter Clothes & Jackets",
        barcode: "#SS-BAG-01",
        isFragile: false,
        weightEstKg: 18,
      },
      {
        id: `item-2-${Date.now()}`,
        category: "Carton Box",
        customLabel: "Carton #1: Books & Semester Notes",
        barcode: "#SS-BAG-02",
        isFragile: false,
        weightEstKg: 15,
      },
    ];
  });

  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [tagPrintMode, setTagPrintMode] = useState<boolean>(false);

  useEffect(() => {
    if (initialItemsProp && initialItemsProp.length > 0) {
      setItems(initialItemsProp);
    }
  }, [initialItemsProp]);

  const updateItem = (
    index: number,
    field: keyof LuggageStorageItem,
    value: string | boolean | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const addItemWithPreset = (
    category: LuggageStorageItem["category"],
    label: string,
    weight = 10,
    fragile = false
  ) => {
    const nextNum = items.length + 1;
    const newItem: LuggageStorageItem = {
      id: `item-${nextNum}-${Date.now()}`,
      category,
      customLabel: label,
      barcode: `#SS-BAG-${String(nextNum).padStart(2, "0")}`,
      isFragile: fragile,
      weightEstKg: weight,
    };
    setItems((prev) => [...prev, newItem]);
    toast.success(
      isHi ? `आईटम #${nextNum} जोड़ा गया!` : `Item #${nextNum} added!`,
      { description: label }
    );
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      toast.error(
        isHi
          ? "कम से कम 1 सामान होना आवश्यक है।"
          : "At least 1 item is required for storage."
      );
      return;
    }
    setItems((prev) => prev.filter((_, i) => i !== index));
    toast.info(isHi ? "सामान सूची से हटाया गया।" : "Item removed from storage manifest.");
  };

  const copyManifestSummary = () => {
    const summary = items
      .map(
        (it, idx) =>
          `Item #${idx + 1} (${it.barcode}): [${it.category}] ${it.customLabel} ${
            it.isFragile ? "⚠️ FRAGILE" : ""
          } (${it.weightEstKg}kg est)`
      )
      .join("\n");
    navigator.clipboard.writeText(`STASHSAARTHI STORAGE MANIFEST:\n${summary}`);
    toast.success(isHi ? "इन्वेंट्री विवरण कॉपी हुआ!" : "Inventory Manifest Copied!", {
      description: isHi
        ? "सामान सूची क्लिपबोर्ड पर कॉपी हो गई है।"
        : "Storage manifest copied to clipboard.",
    });
  };

  const handleSaveAndProceed = () => {
    if (onSaveItems) onSaveItems(items);
    if (onProceedToBooking) onProceedToBooking(items);
    onOpenChange(false);
    toast.success(isHi ? "लगेज आईटमाइजेशन सहेजा गया!" : "Luggage Itemization Saved!", {
      description: isHi
        ? `${items.length} आइटम टैग और लेजर बारकोड सील से जुड़े हैं।`
        : `${items.length} items itemized and linked with tamper barcode seals.`,
    });
  };

  const filteredItems =
    filterCategory === "ALL"
      ? items
      : items.filter((it) => it.category === filterCategory);

  const totalEstWeight = items.reduce((acc, it) => acc + (it.weightEstKg || 0), 0);
  const fragileCount = items.filter((it) => it.isFragile).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-emerald-500/30 bg-[#0A0D0F]/95 text-foreground backdrop-blur-2xl p-6 rounded-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
              <Luggage className="h-3.5 w-3.5" />
              {isHi ? "सार्थी स्टैश लगीज आईटमाइज़र" : "Saarthi Stash Luggage Itemizer"}
            </div>
            <button
              type="button"
              onClick={() => setTagPrintMode(!tagPrintMode)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              {tagPrintMode
                ? isHi
                  ? "संपादक पर वापस जाएं"
                  : "Back to Editor"
                : isHi
                ? "बारकोड टैग शीट देखें"
                : "View Print Tag Sheet"}
            </button>
          </div>

          <DialogTitle className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            {isHi ? "लगेज आईटमाइजेशन व कस्टम लेबलिंग" : "Luggage Itemization & Custom Labeling"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {isHi
              ? "प्रत्येक डिब्बे व सूटकेस को अलग-अलग लेबल करें। लेजर बारकोड सील के साथ 100% सटीक रिडीम व ट्रेसिएबिलिटी गारंटी।"
              : "Specify category, custom labels, and fragility tags for each storage bag. Linked directly with laser tamper barcode seals."}
          </DialogDescription>
        </DialogHeader>

        {tagPrintMode ? (
          /* Printable / Printable Barcode Sheet Preview */
          <div className="mt-4 space-y-4 text-left">
            <div className="p-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 text-xs text-cyan-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  {isHi
                    ? "डिजिटल लगीज बारकोड टैग शीट (प्रिंट या स्क्रीनशॉट लें)"
                    : "Digital Luggage Barcode Tag Sheet (Print or Screenshot)"}
                </span>
              </div>
              <button
                type="button"
                onClick={copyManifestSummary}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-200 text-[11px] font-medium hover:bg-cyan-500/30 transition flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" /> {isHi ? "विवरण कॉपी करें" : "Copy Manifest"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-2xl border-2 border-dashed border-emerald-500/40 bg-black/80 p-4 space-y-2 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {item.barcode}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      TAG #{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white truncate">
                      {item.customLabel || `Luggage Item #${idx + 1}`}
                    </h4>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 mt-0.5">
                      <span>Category: {item.category}</span>
                      <span>•</span>
                      <span>Weight: ~{item.weightEstKg}kg</span>
                    </div>
                  </div>

                  {item.isFragile && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3" /> FRAGILE / HANDLE WITH CARE
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400 font-mono">
                    <span>SEAL: LASER BARCODE TAMPER PROOF</span>
                    <span>STASHSAARTHI KANPUR</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Normal Interactive Itemization Editor */
          <div className="mt-3 space-y-4 text-left">
            {/* Quick 1-Tap Preset Addition Bar */}
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{isHi ? "त्वरित आईटम जोड़ें (1-टैप प्रेसेट):" : "1-Tap Quick Item Presets:"}</span>
                </span>
                <span className="font-mono text-emerald-400 text-[11px]">
                  {items.length} {isHi ? "सामान टैग किए गए" : "Items Itemized"}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {POPULAR_ITEM_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      addItemWithPreset(p.cat, p.label, p.weight, p.fragile)
                    }
                    className="px-2.5 py-1 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 text-slate-200 text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>{p.label.split(":")[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({p.cat})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterCategory("ALL")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                    filterCategory === "ALL"
                      ? "bg-emerald-500 text-black font-bold"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {isHi ? "सभी (" + items.length + ")" : "All (" + items.length + ")"}
                </button>
                {CATEGORY_PRESETS.map((cat) => {
                  const count = items.filter((it) => it.category === cat.id).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFilterCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                        filterCategory === cat.id
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{isHi ? cat.label_hi : cat.label_en}</span>
                      <span className="font-mono text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-400 font-mono shrink-0 hidden sm:block">
                Est Total: <strong className="text-emerald-400">{totalEstWeight} kg</strong>
                {fragileCount > 0 && (
                  <span className="text-rose-400 ml-2">({fragileCount} Fragile)</span>
                )}
              </div>
            </div>

            {/* Luggage Item Cards List */}
            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {filteredItems.map((item) => {
                const globalIndex = items.findIndex((i) => i.id === item.id);
                const catInfo =
                  CATEGORY_PRESETS.find((c) => c.id === item.category) ||
                  CATEGORY_PRESETS[0]!;
                const IconComponent = catInfo.icon;

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/60 p-3.5 space-y-3 transition hover:border-emerald-500/40 text-left relative"
                  >
                    {/* Top Item Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg border ${catInfo.color}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              {item.barcode}
                            </span>
                            <span className="text-xs font-bold text-slate-200">
                              {isHi
                                ? `सामान #${globalIndex + 1}`
                                : `Luggage Item #${globalIndex + 1}`}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Fragile Toggle Button */}
                        <button
                          type="button"
                          onClick={() =>
                            updateItem(globalIndex, "isFragile", !item.isFragile)
                          }
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1 ${
                            item.isFragile
                              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              : "bg-white/5 text-slate-400 border-white/10 hover:text-slate-200"
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {item.isFragile ? (isHi ? "नाजुक/ग्लास ⚠️" : "Fragile ⚠️") : (isHi ? "+ नाजुक टैग" : "+ Tag Fragile")}
                        </button>

                        {/* Remove Button */}
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(globalIndex)}
                            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition cursor-pointer"
                            title={isHi ? "सामान हटाएं" : "Remove Item"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      {/* Category Selector */}
                      <div className="sm:col-span-5">
                        <Label className="text-[10px] text-muted-foreground mb-1 block">
                          {isHi ? "सामान श्रेणी:" : "Item Category:"}
                        </Label>
                        <select
                          value={item.category}
                          onChange={(e) =>
                            updateItem(
                              globalIndex,
                              "category",
                              e.target.value as LuggageStorageItem["category"]
                            )
                          }
                          className="w-full rounded-xl border border-white/15 bg-black/90 px-2.5 py-1.5 text-xs text-white cursor-pointer font-medium"
                        >
                          {CATEGORY_PRESETS.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-[#0A0D0F]">
                              {isHi ? cat.label_hi : cat.label_en}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Custom Label Text */}
                      <div className="sm:col-span-7">
                        <Label className="text-[10px] text-muted-foreground mb-1 block">
                          {isHi ? "कस्टम लेबल विवरण (उदा. पुस्तकें, जैकेट):" : "Custom Item Label (e.g. Books, Winter Wear):"}
                        </Label>
                        <Input
                          type="text"
                          value={item.customLabel}
                          onChange={(e) =>
                            updateItem(globalIndex, "customLabel", e.target.value)
                          }
                          placeholder={isHi ? "उदा. कार्टन #1: ऑर्गेनिक केमिस्ट्री नोट्स" : "e.g., Carton #1: Books & Notes"}
                          className="border-white/15 bg-black/90 text-xs text-white h-9 px-3 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inventory Manifest Summary Footer Bar */}
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="leading-tight">
                  {isHi
                    ? `कुल ${items.length} आइटम दर्ज। लेजर सील और ₹10k बीमा से कवर।`
                    : `Total ${items.length} items logged. Sealed & covered under ₹10k micro-insurance.`}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    addItemWithPreset(
                      "Carton Box",
                      `Carton #${items.length + 1}: Miscellaneous Items`,
                      10
                    )
                  }
                  className="text-xs border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {isHi ? "नया सामान जोड़ें" : "Add New Item"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dialog Actions */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={copyManifestSummary}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            {isHi ? "मेनिफेस्ट कॉपी करें" : "Copy Manifest"}
          </button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="hero"
              onClick={handleSaveAndProceed}
              className="cursor-pointer"
            >
              <Check className="w-4 h-4 mr-1" />
              {isHi ? "आईटमाइजेशन सहेजें व आगे बढ़ें" : "Save Itemization & Proceed"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
