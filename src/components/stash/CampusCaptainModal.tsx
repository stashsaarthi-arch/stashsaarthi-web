import { useState } from "react";
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
import { Award, CheckCircle2, Phone } from "lucide-react";
import { toast } from "sonner";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";
import { isValidPhone } from "@/lib/waitlistService";
import { useLanguage } from "@/context/LanguageContext";

export function CampusCaptainModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [hostel, setHostel] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !college.trim() || !phone.trim()) {
      toast.error(
        isHi
          ? "कृपया अपना नाम, कॉलेज और फोन नंबर भरें।"
          : "Please fill in your name, campus, and phone number.",
      );
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error(
        isHi
          ? "कृपया एक वैध फोन नंबर दर्ज करें।"
          : "Please enter a valid phone number.",
      );
      return;
    }

    setSubmitted(true);
    toast.success(
      isHi ? "कैंपस कैप्टन आवेदन प्राप्त हुआ! 🎓" : "Campus Captain Application Received! 🎓",
      {
        description: isHi
          ? "हमारे कैंपस लीड 6 घंटे के भीतर आपसे संपर्क करेंगे।"
          : "Our campus lead will reach out to you within 6 hours.",
      },
    );

    const text = isHi
      ? `नमस्ते StashSaarthi! मैं ${college} (${hostel || "मुख्य परिसर"}) में कैंपस नोड कैप्टन बनना चाहता/चाहती हूं। मेरा नाम ${name} है, फोन: ${phone}।`
      : `Hi StashSaarthi! I want to become a Campus Node Captain at ${college} (${hostel || "Main Campus"}). My name is ${name}, phone: ${phone}.`;
    const url = getWhatsAppUrl(text, FOUNDER_WHATSAPP);
    setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 800);
  };

  const handleReset = () => {
    setName("");
    setCollege("");
    setHostel("");
    setPhone("");
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-cyan-500/30 bg-[#0A0D0F]/95 text-white backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl">
        <DialogHeader className="text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold text-cyan-400 mb-2 w-fit">
            <Award className="h-3.5 w-3.5" />
            {isHi ? "छात्र एंबेसडर कार्यक्रम" : "Student Ambassador Program"}
          </div>
          <DialogTitle className="text-2xl font-extrabold tracking-tight text-white">
            {isHi ? (
              <>
                बनें <span className="text-gradient">कैंपस कैप्टन</span>
              </>
            ) : (
              <>
                Become a <span className="text-gradient">Campus Captain</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-400">
            {isHi
              ? "अपने हॉस्टल में वेकेशन बैग स्टोरेज और छात्र चेक-इन समन्वित करके प्रति माह ₹5,000 से ₹12,000 कमाएं।"
              : "Earn ₹5,000 to ₹12,000/month by coordinating vacation bag storage and student check-ins in your hostel."}
          </DialogDescription>
        </DialogHeader>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <p className="text-[10px] text-slate-400 uppercase font-mono">
                  {isHi ? "कमीशन" : "Commission"}
                </p>
                <p className="font-bold text-emerald-400 text-sm mt-0.5">
                  {isHi ? "₹50 / टैग्ड बैग" : "₹50 / Bag Tagged"}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                <p className="text-[10px] text-slate-400 uppercase font-mono">
                  {isHi ? "लाभ" : "Perks"}
                </p>
                <p className="font-bold text-cyan-400 text-sm mt-0.5">
                  {isHi ? "फ्री स्टोरेज + सर्टिफिकेट" : "Free Storage + Cert"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="text-xs text-slate-300 font-medium">
                {isHi ? "आपका पूरा नाम *" : "Your Full Name *"}
              </Label>
              <Input
                placeholder={isHi ? "जैसे यश वर्धन" : "e.g. Yash Vardhan"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border-white/10 bg-black/40 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-medium">
                  {isHi ? "कॉलेज / परिसर *" : "College / Campus *"}
                </Label>
                <Input
                  placeholder={isHi ? "आईआईटी कानपुर / एचबीटीआई" : "IIT Kanpur / HBTI"}
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="rounded-xl border-white/10 bg-black/40 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-medium">
                  {isHi ? "हॉस्टल / हॉल नंबर" : "Hostel / Hall No."}
                </Label>
                <Input
                  placeholder={isHi ? "हॉल 13 / विंग B" : "Hall 13 / Wing B"}
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="rounded-xl border-white/10 bg-black/40 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="text-xs text-slate-300 font-medium">
                {isHi ? "व्हाट्सएप नंबर *" : "WhatsApp Number *"}
              </Label>
              <Input
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={14}
                className="rounded-xl border-white/10 bg-black/40 text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full h-11 rounded-xl font-bold cursor-pointer"
            >
              {isHi ? "कैप्टन आवेदन सबमिट करें" : "Apply as Campus Captain"}
            </Button>
          </form>
        ) : (
          <div className="mt-4 space-y-4 text-center py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isHi ? "आवेदन सफलतापूर्वक भेजा गया!" : "Application Sent!"}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                {isHi
                  ? "व्हाट्सएप चैट खुल रही है। आप सीधे फाउंडर से अपना ऑनबोर्डिंग किट प्राप्त कर सकते हैं।"
                  : "WhatsApp chat opening up. You can directly chat with the founder to receive your starter captain kit."}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              className="border-white/10 text-xs cursor-pointer"
            >
              {isHi ? "बंद करें" : "Done"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
