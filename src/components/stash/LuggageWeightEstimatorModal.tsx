import React, { useState, useMemo } from 'react';
import { 
  Weight, 
  Package, 
  Plus, 
  Minus, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Shirt, 
  BookOpen, 
  Utensils, 
  Bed, 
  Laptop, 
  ShieldCheck,
  TrendingDown,
  Zap
} from 'lucide-react';
import { 
  LUGGAGE_CATEGORIES, 
  LUGGAGE_ITEMS_DATABASE, 
  ESTIMATOR_PRESETS, 
  calculateLuggageEstimate, 
  ItemQuantityMap 
} from '../../lib/luggageWeightEstimatorEngine';
import { useLanguage } from '../../context/LanguageContext';

interface LuggageWeightEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStorage?: (boxCount: number, priceMonthly: number) => void;
}

export const LuggageWeightEstimatorModal: React.FC<LuggageWeightEstimatorModalProps> = ({
  isOpen,
  onClose,
  onSelectStorage
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [activeCategory, setActiveCategory] = useState<'clothing' | 'study' | 'kitchen' | 'misc'>('clothing');
  const [quantities, setQuantities] = useState<ItemQuantityMap>({
    jeans: 3,
    tshirt: 5,
    book_heavy: 4,
    bedsheet: 1
  });

  const estimate = useMemo(() => calculateLuggageEstimate(quantities), [quantities]);

  if (!isOpen) return null;

  const handleQtyChange = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [itemId]: updated };
    });
  };

  const handleApplyPreset = (items: ItemQuantityMap) => {
    setQuantities(items);
  };

  const handleReset = () => {
    setQuantities({});
  };

  const handleProceedToBooking = () => {
    if (onSelectStorage) {
      onSelectStorage(estimate.recommendedBoxCount, estimate.estimatedPriceMonthly);
    } else {
      window.dispatchEvent(
        new CustomEvent('stashsaarthi:open-booking', {
          detail: {
            service: 'stash',
            bags: estimate.recommendedBoxCount,
            estimatedWeight: estimate.totalWeightKg
          }
        })
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0D0F] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/50 via-[#0D1117] to-cyan-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Weight className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">
                  {isHi ? 'स्मार्ट सामान वजन एवं बॉक्स कैलकुलेटर' : 'Smart Luggage Weight & Box Estimator'}
                </h3>
                <span className="px-2 py-0.5 text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  AI WEIGHT MATRIX
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHi 
                  ? 'सामान चुनें (जैसे 3 जींस + 5 बुक्स + 1 कंबल) और सटीक वजन एवं सही बॉक्स का आकार जानें' 
                  : 'Select your items (e.g. 3 Jeans + 5 Books + 1 Blanket) to estimate weight & recommended box size'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-6 py-3 bg-[#06080A] border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-3">
          <span className="text-xs text-slate-400 font-semibold shrink-0">
            ⚡ {isHi ? 'त्वरित पैक प्रीसेट:' : 'Quick Student Presets:'}
          </span>
          <div className="flex items-center gap-2 overflow-x-auto">
            {ESTIMATOR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.items)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 hover:text-emerald-400 whitespace-nowrap transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isHi ? preset.nameHi : preset.name}</span>
              </button>
            ))}
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition-colors flex items-center gap-1"
              title="Clear all selected items"
            >
              <RotateCcw className="w-3 h-3" />
              {isHi ? 'रीसेट' : 'Reset'}
            </button>
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Item Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Category Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-1 overflow-x-auto">
              {LUGGAGE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isHi ? cat.labelHi : cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {LUGGAGE_ITEMS_DATABASE.filter((i) => i.category === activeCategory).map((item) => {
                const qty = quantities[item.id] || 0;
                return (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                      qty > 0 
                        ? 'bg-slate-900 border-emerald-500/40 shadow-sm' 
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        {isHi ? item.nameHi : item.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ~{item.weightKg} kg / item
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQtyChange(item.id, -1)}
                        disabled={qty === 0}
                        className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-30 text-slate-200 hover:bg-slate-700 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-8 text-center font-mono font-bold text-sm text-emerald-400">
                        {qty}
                      </span>

                      <button
                        onClick={() => handleQtyChange(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Count Summary Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
              <span>{isHi ? 'कुल चयनित आइटम:' : 'Total Items Selected:'} <strong className="text-white">{estimate.itemCount} items</strong></span>
              <span className="font-mono text-emerald-400">{estimate.totalWeightKg} kg calculated</span>
            </div>
          </div>

          {/* Right Column: Live Meter & Box Recommendation (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Weight Gauge Meter */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Weight className="w-4 h-4 text-emerald-400" />
                  {isHi ? 'अनुमानित कुल वजन:' : 'Estimated Total Weight:'}
                </span>
                <span className="text-lg font-mono font-bold text-emerald-400">
                  {estimate.totalWeightKg} <span className="text-xs text-slate-400 font-sans">kg</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      estimate.recommendedBoxType === 'STANDARD'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : estimate.recommendedBoxType === 'JUMBO'
                        ? 'bg-gradient-to-r from-teal-400 to-amber-400'
                        : 'bg-gradient-to-r from-amber-400 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, estimate.capacityUtilizationPct)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0 kg</span>
                  <span>15 kg (Standard)</span>
                  <span>25 kg (Jumbo)</span>
                </div>
              </div>
            </div>

            {/* Recommended Box Card */}
            <div className="bg-gradient-to-br from-emerald-950/30 to-cyan-950/20 border border-emerald-500/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-white">
                    {isHi ? estimate.boxTitleHi : estimate.boxTitle}
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  RECOMMENDED
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi ? estimate.boxDescriptionHi : estimate.boxDescription}
              </p>

              {/* Price & Savings Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Storage Cost</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    ₹{estimate.estimatedPriceMonthly}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-amber-400 uppercase block font-semibold flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-amber-400" />
                    Dead-Rent Savings
                  </span>
                  <span className="text-sm font-bold text-amber-300 font-mono">
                    ~₹{estimate.deadRentSavingsVsPg}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex items-center gap-3 pt-2 text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Laser Barcode Sealed
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-300">
                  <Zap className="w-3.5 h-3.5" />
                  ₹10k Micro-Insurance
                </span>
              </div>

              {/* Action Button */}
              <button
                onClick={handleProceedToBooking}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>{isHi ? 'अनुशंसित स्टोरेज बुक करें (₹' + estimate.estimatedPriceMonthly + '/महीना)' : 'Book Recommended Storage (₹' + estimate.estimatedPriceMonthly + '/mo)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#06080A] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>StashSaarthi Zero-CapEx Campus Micro-Storage Network</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
