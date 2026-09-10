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
  RefreshCw,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import type { BookingRecord } from "@/lib/localSubmissions";
import { OfflineQrCode } from "@/components/ui/OfflineQrCode";
import { downloadInvoicePdf } from "@/lib/pdfInvoiceEngine";
import { BookingLiveStatusBadge } from "./BookingLiveStatusBadge";

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
  const [showFullQr, setShowFullQr] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  if (!open || !booking) return null;

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await downloadInvoicePdf(booking);
      toast.success(
        isHi
          ? "GST टैक्स चालान PDF सफलतापूर्वक डाउनलोड हुआ!"
          : "GST Tax Invoice PDF downloaded successfully!",
      );
    } catch (err) {
      toast.error(isHi ? "चालान PDF डाउनलोड विफल रहा" : "Failed to generate PDF invoice");
    } finally {
      setDownloadingPdf(false);
    }
  };

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

  const handleRenew = () => {
    const serviceName = booking.service === "micro" ? "stash" : booking.service;
    window.dispatchEvent(
      new CustomEvent("stashsaarthi:open-booking", {
        detail: {
          service: serviceName,
          note: `Renewing/Rebooking Token ${booking.token} (${booking.name || serviceName})`,
        },
      })
    );
    toast.success(
      isHi
        ? `नवीनीकरण फॉर्म खोला गया: ${booking.token}`
        : `Opening renewal booking flow for ${booking.token}...`
    );
    onClose();
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
            
            {/* Supabase Realtime Dynamic Status Stepper (Task 111) */}
            <BookingLiveStatusBadge
              bookingId={booking.id}
              submittedAt={booking.submittedAt}
              currentStatus={booking.status}
              showStepper={true}
            />

            {/* 0. Offline Storage QR Lock Pass (Task 105) */}
            <div className="bg-gradient-to-br from-cyan-950/40 via-black/50 to-emerald-950/30 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <QrCode className="h-4 w-4" />
                  <span>{isHi ? "ऑफ़लाइन पिकअप/ड्रॉप QR पास" : "Offline Pickup/Drop QR Pass"}</span>
                </div>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {isHi ? "100% ऑफ़लाइन रेडी" : "100% Offline Ready"}
                </span>
              </div>

              <div className="flex items-center gap-4 bg-black/60 border border-white/10 rounded-xl p-3">
                <button
                  type="button"
                  onClick={() => setShowFullQr(true)}
                  className="relative group shrink-0 focus:outline-none"
                  title={isHi ? "बड़ा QR कोड देखें" : "View Fullscreen QR"}
                >
                  <OfflineQrCode value={booking.token} size={88} className="border border-cyan-500/40 group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-[10px] text-white font-bold">
                    🔍 Zoom
                  </div>
                </button>

                <div className="space-y-1 text-xs min-w-0">
                  <p className="text-[11px] text-slate-300 font-semibold leading-tight">
                    {isHi
                      ? "पिकअप व ड्रॉप के समय सीनियर होस्ट को यह QR कोड दिखाएं।"
                      : "Present this QR code to the senior host at node pickup/drop-off."}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>{isHi ? "बिना इंटरनेट के कार्य करता है" : "Works without cellular internet"}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowFullQr(true)}
                    className="mt-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold underline flex items-center gap-1"
                  >
                    <span>{isHi ? "फुलस्क्रीन QR दिखाएं" : "Show Fullscreen QR Pass"}</span>
                  </button>
                </div>
              </div>
            </div>

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

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                    className="w-full bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border border-emerald-500/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                  >
                    {downloadingPdf ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-400" />
                        <span>{isHi ? "PDF जनरेट हो रहा है..." : "Generating GST Invoice PDF..."}</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{isHi ? "GST टैक्स चालान PDF डाउनलोड करें" : "Download GST Tax Invoice PDF"}</span>
                      </>
                    )}
                  </Button>
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
            <Button
              onClick={handleRenew}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs py-4 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>
                {booking.service === "stash" || booking.service === "micro"
                  ? (isHi ? "1-टैप स्लॉट नवीनीकृत करें (Renew Slot)" : "1-Tap Renew Storage Slot")
                  : booking.service === "kitchen" || booking.service === "meal"
                  ? (isHi ? "1-टैप टिफिन पुनः ऑर्डर करें (Reorder Pack)" : "1-Tap Reorder Meal Pack")
                  : (isHi ? "1-टैप पुनः बुक करें (Rebook)" : "1-Tap Rebook Service")}
              </span>
            </Button>

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

      {/* Fullscreen Offline QR Pass Modal */}
      {showFullQr && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <button
            onClick={() => setShowFullQr(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="max-w-xs w-full bg-[#0D1117] border border-cyan-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-bold uppercase tracking-wider">
              <QrCode className="h-5 w-5" />
              <span>{isHi ? "ऑफ़लाइन कस्टडी पास" : "Offline Custody Pass"}</span>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-inner inline-block">
              <OfflineQrCode value={booking.token} size={220} />
            </div>

            <div>
              <p className="text-2xl font-mono font-bold text-white tracking-widest">
                {booking.token}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {booking.name} · {booking.city || "Kakadeo Campus Hub"}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              <span>{isHi ? "ऑफ़लाइन मोड में 100% कार्यशील" : "100% Functional in Offline Mode"}</span>
            </div>

            <Button
              onClick={() => setShowFullQr(false)}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 text-xs"
            >
              {isHi ? "वापस जाएं" : "Close QR Pass"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

