import React, { useState } from "react";
import { MessageCircle, Share2, Copy, Check, Sparkles, User, Home, Utensils, Clock, X, HeartHandshake } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP } from "@/lib/constants";
import { playClick, playPop } from "@/lib/audio";
import { checkAndRecordRateLimit, showRateLimitToast } from "@/lib/rateLimiter";
import { toast } from "sonner";

export interface MenuShareDetails {
  menuName?: string;
  price?: number;
  kitchenNode?: string;
  slot?: "Lunch" | "Dinner";
  description?: string;
}

interface RoommateMenuShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultDetails?: MenuShareDetails | undefined;
}

const MENU_OPTIONS = [
  { id: "standard", name: "Standard Thali", price: 50, desc: "4 Roti, Dal, Sabzi, Rice, Salad" },
  { id: "special", name: "Special Thali", price: 70, desc: "Butter Roti, Special Curry, Dal, Rice, Sweet" },
  { id: "paneer", name: "Paneer Thali", price: 80, desc: "Paneer Sabzi, Butter Roti, Dal Makhani, Jeera Rice" },
  { id: "sunday", name: "Sunday Feast", price: 85, desc: "Chef's Special Weekend Feast + Matka Kheer" },
  { id: "monthly", name: "Monthly Pass", price: 2400, desc: "60 Meal Tokens + Free Delivery" },
];

const PRESET_NOTES_EN = [
  "Bro, let's order lunch together today! 🍲",
  "Check out this homestyle Verified PG Owner Mother kitchen near us! 😋",
  "Use code TASTE50 for flat ₹50 OFF on 1st meal! 🎁",
  "Pure Desi Ghee Phulkas & 0 Palm Oil — stomach friendly! 🌟",
];

const PRESET_NOTES_HI = [
  "भाई, आज का लंच/डिनर साथ में आर्डर करते हैं! 🍲",
  "अपने पास का 100% माँ के हाथ का टिफिन मेनू देखो! 😋",
  "कोड TASTE50 लगा कर पहली थाली पर ₹50 छूट मिलेगी! 🎁",
  "शुद्ध देसी घी की रोटी & 0 पाम ऑयल — पेट एकदम मस्त रहेगा! 🌟",
];

export const RoommateMenuShareModal: React.FC<RoommateMenuShareModalProps> = ({
  open,
  onOpenChange,
  defaultDetails,
}) => {
  const { language } = useLanguage();
  const isHindi = language === "hi";

  const [roommateName, setRoommateName] = useState<string>("");
  const [hostelRoom, setHostelRoom] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<string>(defaultDetails?.menuName || "Special Thali");
  const [menuPrice, setMenuPrice] = useState<number>(defaultDetails?.price || 70);
  const [slot, setSlot] = useState<"Lunch" | "Dinner">(defaultDetails?.slot || "Lunch");
  const [kitchenNode, setKitchenNode] = useState<string>(defaultDetails?.kitchenNode || "Kakadeo Hub - Annapurna Kitchen");
  const [customNote, setCustomNote] = useState<string>(
    isHindi ? "भाई, आज का खाना साथ में आर्डर करते हैं! 🍲" : "Bro, let's order food together today! 🍲"
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleMenuSelect = (name: string, price: number) => {
    playClick();
    setSelectedMenu(name);
    setMenuPrice(price);
  };

  const constructShareMessage = () => {
    const greeting = roommateName.trim()
      ? isHindi
        ? `अरे ${roommateName.trim()}! 👋`
        : `Hey ${roommateName.trim()}! 👋`
      : isHindi
      ? `अरे रूममेट! 👋`
      : `Hey Roommate! 👋`;

    const locationText = hostelRoom.trim()
      ? isHindi
        ? `📍 रूम/हॉस्टल: ${hostelRoom.trim()}`
        : `📍 Room/Hostel: ${hostelRoom.trim()}`
      : "";

    if (isHindi) {
      return (
        `${greeting}\n\n` +
        `🍲 *StashSaarthi साबरकांता / कानपुर होमस्टार्ट टिफिन मेनू*\n` +
        `✨ *थाली:* ${selectedMenu} (₹${menuPrice})\n` +
        `🕒 *स्लॉट:* ${slot === "Lunch" ? "लंच (1:00 PM)" : "डिनर (8:00 PM)"}\n` +
        `🏠 *किचन:* ${kitchenNode}\n` +
        `${locationText ? locationText + "\n" : ""}` +
        `💬 *संदेश:* "${customNote}"\n\n` +
        `🔥 100% सीनियर माताओं द्वारा तैयार • शुद्ध देसी घी • 0 पाम ऑयल\n` +
        `🎁 *ऑफर:* कोड *TASTE50* लगा कर पहली थाली पर ₹50 छूट पाएं!\n\n` +
        `👉 अभी यहाँ ऑर्डर करें: https://stashsaarthi.in/tiffin?ref=TASTE50`
      );
    }

    return (
      `${greeting}\n\n` +
      `🍲 *StashSaarthi Verified PG Owner Mother Kitchen Menu*\n` +
      `✨ *Meal:* ${selectedMenu} (₹${menuPrice})\n` +
      `🕒 *Slot:* ${slot === "Lunch" ? "Lunch (1:00 PM)" : "Dinner (8:00 PM)"}\n` +
      `🏠 *Kitchen:* ${kitchenNode}\n` +
      `${locationText ? locationText + "\n" : ""}` +
      `💬 *Note:* "${customNote}"\n\n` +
      `🔥 100% Homestyle Cooked by Verified PG Owner Mothers • Pure Desi Ghee • 0 Palm Oil\n` +
      `🎁 *Special Offer:* Use Code *TASTE50* for Flat ₹50 OFF on 1st Order!\n\n` +
      `👉 Order Now: https://stashsaarthi.in/tiffin?ref=TASTE50`
    );
  };

  const handleWhatsAppShare = () => {
    const limit = checkAndRecordRateLimit("roommate_menu_share", { minIntervalMs: 2000 });
    if (!limit.allowed) {
      showRateLimitToast(limit.remainingSeconds);
      return;
    }

    playPop();
    const text = constructShareMessage();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success(isHindi ? "व्हाट्सएप शेयर खुला! 🚀" : "WhatsApp Share Opened! 🚀");
  };

  const handleCopyMessage = () => {
    playClick();
    const text = constructShareMessage();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(isHindi ? "संदेश क्लिपबोर्ड पर कॉपी हो गया! 📋" : "Message copied to clipboard! 📋");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = () => {
    const text = constructShareMessage();
    if (navigator.share) {
      navigator
        .share({
          title: `StashSaarthi Tiffin Menu - ${selectedMenu}`,
          text: text,
        })
        .catch(() => {});
    } else {
      handleCopyMessage();
    }
  };

  const presetNotes = isHindi ? PRESET_NOTES_HI : PRESET_NOTES_EN;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw] bg-[#0A0D0F] border border-emerald-500/30 text-slate-100 rounded-2xl p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{isHindi ? "रूममेट डायरेक्ट व्हाट्सएप शेयर" : "Roommate Direct WhatsApp Share"}</span>
            </div>
          </div>
          <DialogTitle className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>{isHindi ? "रूममेट के साथ मेनू शेयर करें 🍲" : "Share Menu with Roommate 🍲"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            {isHindi
              ? "अपने हॉस्टल रूममेट का नाम, रूम नंबर और पसंद की थाली चुनकर सीधे व्हाट्सएप संदेश भेजें।"
              : "Customize roommate name, hostel room details, and meal selection to send an instant WhatsApp menu invite."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Roommate Name & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-400" />
                {isHindi ? "रूममेट का नाम" : "Roommate Name"}
              </label>
              <Input
                placeholder={isHindi ? "उदा. राहुल / अमन" : "e.g. Rahul / Aman"}
                value={roommateName}
                onChange={(e) => setRoommateName(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Home className="w-3 h-3 text-emerald-400" />
                {isHindi ? "हॉस्टल / रूम नं." : "Hostel / Room No."}
              </label>
              <Input
                placeholder={isHindi ? "उदा. हॉस्टल 4, रूम 204" : "e.g. Hostel 4, Room 204"}
                value={hostelRoom}
                onChange={(e) => setHostelRoom(e.target.value)}
                className="bg-slate-950 border-slate-800 text-xs focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Select Menu Tier */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Utensils className="w-3 h-3 text-emerald-400" />
              {isHindi ? "थाली / मेनू चुनें" : "Select Menu / Meal Tier"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MENU_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleMenuSelect(item.name, item.price)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between ${
                    selectedMenu === item.name
                      ? "bg-emerald-950/40 border-emerald-500 text-white font-bold shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className="truncate block font-semibold">{item.name}</span>
                  <span className="text-emerald-400 font-extrabold mt-1">₹{item.price}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Slot Selection */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {isHindi ? "डिलीवरी स्लॉट:" : "Delivery Slot:"}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSlot("Lunch");
                }}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  slot === "Lunch"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "लंच (1 PM)" : "Lunch (1 PM)"}
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setSlot("Dinner");
                }}
                className={`px-3 py-1 text-xs rounded-lg font-bold transition-all ${
                  slot === "Dinner"
                    ? "bg-emerald-500 text-slate-950 shadow-sm"
                    : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {isHindi ? "डिनर (8 PM)" : "Dinner (8 PM)"}
              </button>
            </div>
          </div>

          {/* Preset Custom Note Chips */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              {isHindi ? "क्विक नोट चिप्स (1-टैप)" : "Quick Note Chips (1-Tap)"}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetNotes.map((note, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playClick();
                    setCustomNote(note);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-300 transition-colors text-left"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Note Input */}
          <div>
            <Input
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder={isHindi ? "कस्टम नोट दर्ज करें..." : "Enter custom message..."}
              className="bg-slate-950 border-slate-800 text-xs focus:border-emerald-500"
            />
          </div>

          {/* Live WhatsApp Message Preview Box */}
          <div className="bg-slate-950/90 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {isHindi ? "व्हाट्सएप संदेश पूर्वावलोकन" : "WhatsApp Live Message Preview"}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">WhatsApp Ready</span>
            </div>
            <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 max-h-36 overflow-y-auto">
              {constructShareMessage()}
            </pre>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
          <Button
            type="button"
            onClick={handleWhatsAppShare}
            className="sm:col-span-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
          >
            <MessageCircle className="w-4 h-4 mr-1.5 fill-slate-950" />
            {isHindi ? "व्हाट्सएप पर भेजें" : "Send via WhatsApp"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCopyMessage}
            className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                {isHindi ? "कॉपी हुआ!" : "Copied!"}
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                {isHindi ? "कॉपी संदेश" : "Copy Text"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
