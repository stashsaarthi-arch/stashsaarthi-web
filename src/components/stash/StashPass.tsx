import { ShieldCheck, CalendarClock, Share2, ScanBarcode } from "lucide-react";
import { toast } from "sonner";
import { Card3D } from "@/components/ui/Card3D";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export interface StashPassItem {
  category: string;
  customLabel: string;
  barcode?: string;
}

export interface StashPassProps {
  tokenId: string;
  name: string;
  serviceLabel?: string | undefined;
  type?: "student" | "host";
  bags?: number | undefined;
  months?: number | undefined;
  items?: StashPassItem[] | undefined;
  paymentMode?: "upi_qr" | "partial_cash" | "escrow_reserve" | string | undefined;
}

export function StashPass({ tokenId, name, serviceLabel, type, bags, months, items, paymentMode }: StashPassProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const handleShare = async () => {
    const text = isHi
      ? `नमस्ते! मैंने StashSaarthi पर अपना आधिकारिक स्टैशपास™ (${tokenId}) सुरक्षित कर लिया है। विवरण देखें: https://stashsaarthi-web.vercel.app`
      : `Hey! I just reserved my official StashPass™ (${tokenId}) on StashSaarthi. Check it out at https://stashsaarthi-web.vercel.app`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `StashPass™ #${tokenId} — StashSaarthi`,
          text: text,
          url: "https://stashsaarthi-web.vercel.app",
        });
        toast.success(
          isHi ? "स्टैशपास™ सफलतापूर्वक साझा किया गया!" : "StashPass™ Shared Successfully!",
        );
        return;
      } catch {
        // User dismissed native share sheet
      }
    }
    const url = getWhatsAppUrl(text, FOUNDER_WHATSAPP);
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(isHi ? "व्हाट्सएप शेयरिंग शुरू" : "WhatsApp Sharing Initiated", {
      description: isHi
        ? "डायरेक्ट मैसेज लिंक जनरेट किया गया।"
        : "Direct message concierge link generated.",
      duration: 3000,
    });
  };

  const validityDate = new Date();
  validityDate.setMonth(validityDate.getMonth() + (months || 1));

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card3D maxTilt={10}>
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-black/60 backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)] text-left mb-5">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ShieldCheck className="h-32 w-32 text-cyan-400" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-50 blur-xl animate-pulse" />

          <div
            className="relative z-10 p-5 border-b border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-1">
                  {isHi ? "स्टैशपास™ बोर्डिंग पास" : "StashPass™ Boarding Pass"}
                </p>
                <p className="text-3xl font-mono font-bold text-foreground">{tokenId}</p>
              </div>
              <ScanBarcode className="h-10 w-10 text-white/40" />
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              {isHi
                ? `टैम्पर सील आईडी: ${Math.floor(Math.random() * 9000000) + 1000000}`
                : `Tamper Seal ID: ${Math.floor(Math.random() * 9000000) + 1000000}`}
            </div>
          </div>

          <div className="relative z-10 p-5 bg-black/40" style={{ transform: "translateZ(20px)" }}>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs">
              <div>
                <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-0.5">
                  {isHi ? "यात्री / उपयोगकर्ता" : "Passenger"}
                </p>
                <p className="font-semibold text-foreground truncate text-sm">{name}</p>
              </div>
              <div>
                <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-0.5">
                  {isHi ? "श्रेणी" : "Type"}
                </p>
                <p className="font-semibold text-foreground truncate text-sm capitalize">
                  {serviceLabel ||
                    (type === "student" ? (isHi ? "छात्र" : "Student") : isHi ? "होस्ट" : "Host") ||
                    (isHi ? "मानक" : "Standard")}
                </p>
              </div>

              {bags !== undefined && (
                <div>
                  <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-0.5">
                    {isHi ? "सामान" : "Baggage"}
                  </p>
                  <p className="font-semibold text-foreground text-sm">
                    {bags} {isHi ? "बैग" : `Bag${bags > 1 ? "s" : ""}`}
                  </p>
                </div>
              )}

              <div>
                <p className="text-muted-foreground uppercase text-[10px] tracking-wider mb-0.5">
                  {isHi ? "वैधता तिथि" : "Valid Until"}
                </p>
                <p className="font-semibold text-emerald-400 text-sm flex items-center gap-1">
                  <CalendarClock className="h-3 w-3" />
                  {validityDate.toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              {paymentMode && (
                <div className="col-span-2 pt-1 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground uppercase text-[10px] tracking-wider">
                    {isHi ? "भुगतान विधि:" : "Escrow Payment:"}
                  </span>
                  {paymentMode === "partial_cash" ? (
                    <span className="text-amber-300 font-mono font-bold bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ⚡ {isHi ? "50% UPI + 50% पिकअप कैश" : "50% Pay Now · 50% Cash @ Pickup"}
                    </span>
                  ) : paymentMode === "upi_qr" ? (
                    <span className="text-emerald-300 font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      🔒 {isHi ? "100% यूपीआई एस्क्रो भुगतान" : "100% Instant Escrow UPI"}
                    </span>
                  ) : (
                    <span className="text-cyan-300 font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      🛡️ {isHi ? "एस्क्रो होल्ड रिजर्व" : "Escrow Reserve Hold"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {items && items.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {isHi ? "आधिकारिक आईटमाइज्ड सामान टैग:" : "Official Itemized Storage Inventory:"}
                </p>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[10px] bg-white/5 border border-white/10 rounded-md px-2 py-1"
                    >
                      <span className="font-mono text-emerald-400 font-bold">
                        {it.barcode || `#SS-BAG-${String(idx + 1).padStart(2, "0")}`}
                      </span>
                      <span className="text-foreground truncate max-w-[170px]">
                        {it.customLabel || `${it.category} #${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center pt-4 border-t border-white/5 opacity-40">
              <div className="w-full h-8 flex gap-1 justify-center">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white ${i % 3 === 0 ? "w-1.5" : i % 2 === 0 ? "w-1" : "w-0.5"} h-full`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center font-mono text-[9px] text-muted-foreground tracking-widest mt-1">
              {tokenId} • KANPUR-CAMPUS-NODE-01
            </div>
          </div>
        </div>
      </Card3D>

      <button
        onClick={handleShare}
        className="w-full py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
      >
        <Share2 className="h-4 w-4" />
        <span>{isHi ? "व्हाट्सएप पर पास शेयर करें" : "Share StashPass via WhatsApp"}</span>
      </button>
    </div>
  );
}
