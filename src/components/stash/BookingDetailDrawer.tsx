/**
 * StashSaarthi — Booking Detail Slide-Over Drawer
 * Task 104: Har past booking card par click karte hi digital receipt, booking ID,
 * allocated slot address aur emergency host contact ka slide-over drawer dikhana.
 */

import React, { useState } from "react";
import {
  X,
  Receipt,
  Copy,
  Check,
  Printer,
  Share2,
  MapPin,
  Phone,
  ShieldCheck,
  MessageSquare,
  Building,
  UserCheck,
  Calendar,
  IndianRupee,
  Clock,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import type { BookingRecord } from "@/lib/localSubmissions";

const FOUNDER_WHATSAPP = "919369454350";

interface BookingDetailDrawerProps {
  booking: BookingRecord | null;
  open: boolean;
  onClose: () => void;
}

const SERVICE_TITLES: Record<string, { en: string; hi: string; icon: string }> = {
  stash: { en: "Saarthi Stash — Micro Luggage Storage", hi: "सारथी स्टैश — लगेज स्टोरेज", icon: "🎒" },
  spaces: { en: "Saarthi Spaces — Co-Living Stay", hi: "सारथी स्पेस — को-लिविंग स्टे", icon: "🏠" },
  kitchen: { en: "Saarthi Kitchen — Homestyle Tiffin", hi: "सारथी किचन — होमस्टाइल टिफिन", icon: "🍲" },
  connect: { en: "Saarthi Connect — Mentorship", hi: "सारथी कनेक्ट — मेंटरशिप", icon: "🤝" },
  trust: { en: "Saarthi Trust — Safety & Audit", hi: "सारथी ट्रस्ट — सुरक्षा व ऑडिट", icon: "🛡️" },
  micro: { en: "Saarthi Micro — Luggage Storage", hi: "सारथी माइक्रो — माइक्रो स्टोरेज", icon: "📦" },
  waitlist: { en: "Saarthi Waitlist Reservation", hi: "सारथी प्रतीक्षा सूची आरक्षण", icon: "⏳" },
  meal: { en: "Saarthi Meal Order", hi: "सारथी भोजन ऑर्डर", icon: "🍛" },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function BookingDetailDrawer({ booking, open, onClose }: BookingDetailDrawerProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [copiedToken, setCopiedToken] = useState(false);

  if (!open || !booking) return null;

  const svc = SERVICE_TITLES[booking.service] || SERVICE_TITLES["stash"]!;
  const status = booking.status || "active";

  const statusConfig = {
    active: {
      labelEn: "Active",
      labelHi: "सक्रिय",
      style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    },
    completed: {
      labelEn: "Completed",
      labelHi: "पूर्ण",
      style: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    },
    cancelled: {
      labelEn: "Cancelled",
      labelHi: "रद्द",
      style: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    },
  }[status];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(booking.token);
    setCopiedToken(true);
    toast.success(isHi ? "बुकिंग आईडी कॉपी की गई!" : "Booking ID copied to clipboard!");
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = isHi
      ? `🧾 *स्टैशसारथी रसीद*\n*बुकिंग आईडी:* ${booking.token}\n*सेवा:* ${svc.hi}\n*राशि paid:* ₹${booking.amount}\n*दिनांक:* ${formatDate(booking.submittedAt)}\n*नोड:* ${booking.city || "Kakadeo Hub Node #4"}`
      : `🧾 *StashSaarthi Digital Receipt*\n*Booking ID:* ${booking.token}\n*Service:* ${svc.en}\n*Amount Paid:* ₹${booking.amount}\n*Date:* ${formatDate(booking.submittedAt)}\n*Node:* ${booking.city || "Kakadeo Hub Node #4"}`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleContactHost = () => {
    const text = isHi
      ? `नमस्ते! मेरी बुकिंग आईडी ${booking.token} के संबंध में आपातकालीन सहायता चाहिए।`
      : `Hello! I need emergency host assistance regarding my booking ID ${booking.token}.`;
    
    window.open(`https://wa.me/${FOUNDER_WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D1117] border-l border-white/10 shadow-2xl text-white flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 bg-black/40 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{svc.icon}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${statusConfig.style}`}>
                {isHi ? statusConfig.labelHi : statusConfig.labelEn}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white tracking-tight">
              {isHi ? svc.hi : svc.en}
            </h2>

            {/* Token Badge */}
            <div className="mt-3 flex items-center justify-between bg-black/50 border border-white/10 rounded-xl p-3">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                  {isHi ? "डिजिटल बुकिंग आईडी" : "Digital Booking ID"}
                </span>
                <span className="text-sm font-mono font-bold text-cyan-300">
                  {booking.token}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToken}
                className="h-8 border-white/10 bg-white/5 hover:bg-white/10 text-xs text-cyan-400 gap-1.5"
              >
                {copiedToken ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{isHi ? "कॉपी हुआ" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>{isHi ? "कॉपी" : "Copy"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-5 flex-1">
            
            {/* 1. Digital Receipt Card */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Receipt className="h-4 w-4" />
                  <span>{isHi ? "डिजिटल रसीद विवरण" : "Digital Receipt Summary"}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  REC-{booking.token.replace("#", "")}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? "ग्राहक नाम:" : "Customer Name:"}</span>
                  <span className="font-semibold text-white">{booking.name}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? "फ़ोन / ईमेल:" : "Phone / Email:"}</span>
                  <span className="font-mono text-slate-200">{booking.phone || booking.email}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? "दिनांक व समय:" : "Date & Time:"}</span>
                  <span>{formatDate(booking.submittedAt)}</span>
                </div>

                {booking.bags !== undefined && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{isHi ? "स्टोरेज बैग संख्या:" : "Storage Bag Count:"}</span>
                    <span>{booking.bags} {isHi ? "बैग" : "bags"}</span>
                  </div>
                )}

                {booking.months !== undefined && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{isHi ? "अवधि:" : "Duration:"}</span>
                    <span>{booking.months} {isHi ? "महीने" : "months"}</span>
                  </div>
                )}

                {booking.roomType && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{isHi ? "कमरे का प्रकार:" : "Room Type:"}</span>
                    <span>{booking.roomType}</span>
                  </div>
                )}

                {booking.mealPlan && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">{isHi ? "टिफिन प्लान:" : "Meal Plan:"}</span>
                    <span>{booking.mealPlan}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">{isHi ? "सुरक्षा एस्क्रो शुल्क:" : "Escrow Safety Cover:"}</span>
                  <span className="text-emerald-400 font-semibold">{isHi ? "₹0 (मुफ़्त ₹10k कवर)" : "₹0 (Free ₹10k Cover)"}</span>
                </div>

                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/5">
                  <span className="text-slate-400">{isHi ? "भुगतान विधि:" : "Payment Mode:"}</span>
                  <span className="font-semibold text-slate-200">{booking.paymentMode}</span>
                </div>

                <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-white/10 text-white">
                  <span>{isHi ? "कुल भुगतान राशि:" : "Total Paid Amount:"}</span>
                  <span className="text-emerald-400 text-base flex items-center">
                    <IndianRupee className="h-4 w-4" />
                    {booking.amount}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Allocated Slot Address & Location */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>{isHi ? "आवंटित स्लोट्स एवं पता" : "Allocated Slot & Address"}</span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-300">
                <div className="flex items-start gap-2">
                  <Building className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">
                      {booking.city ? `${booking.city} Node` : "Kakadeo Campus Hub Node #4"}
                    </p>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      {isHi
                        ? "गली नंबर 3, पीडब्ल्यू विद्यापीठ के पीछे, काकादेव, कानपुर - 208025"
                        : "Gali #3, Behind PW Vidyapeeth, Kakadeo, Kanpur - 208025"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                    {isHi ? "लेजर बारकोड सील सक्रिय" : "Laser Barcode Sealed"}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Kakadeo Kanpur")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <span>{isHi ? "गूगल मैप्स दिशाएं" : "Google Maps Directions"}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Emergency Host & SOS Contact */}
            <div className="bg-gradient-to-br from-amber-500/10 via-black/40 to-black/60 border border-amber-500/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <UserCheck className="h-4 w-4" />
                  <span>{isHi ? "आपातकालीन होस्ट संपर्क" : "Emergency Host Contact"}</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                  24/7 SOS
                </span>
              </div>

              <div className="text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {isHi ? "सुधा त्रिपाठी जी (वरिष्ठ होस्ट)" : "Sudha Tripathi Ji (Senior Host)"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {isHi ? "सत्यापित 4-स्तरीय सुरक्षा ऑडिट पास" : "Verified 4-Tier Safety Audit Pass"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleContactHost}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-8 text-xs gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </Button>
                </div>

                <div className="pt-2 border-t border-amber-500/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-amber-400" />
                    {isHi ? "आपातकालीन हेल्पलाइन:" : "SOS Hotline:"} +91 9369454350
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 bg-black/60 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handlePrintReceipt}
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs gap-2 py-4"
              >
                <Printer className="h-4 w-4 text-cyan-400" />
                <span>{isHi ? "रसीद प्रिंट करें" : "Print Receipt"}</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleShareWhatsApp}
                className="w-full border-white/10 bg-white/5 hover:bg-white/10 text-emerald-400 text-xs gap-2 py-4"
              >
                <Share2 className="h-4 w-4 text-emerald-400" />
                <span>{isHi ? "व्हाट्सएप शेयर" : "Share WhatsApp"}</span>
              </Button>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-white/10 hover:bg-white/20 text-white text-xs py-4 font-semibold"
            >
              {isHi ? "बंद करें" : "Close Drawer"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
