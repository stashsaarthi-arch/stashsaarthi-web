import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOUNDER_WHATSAPP, getWhatsAppUrl } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

interface HostPayoutCharterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostPayoutCharterModal({ open, onOpenChange }: HostPayoutCharterModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const whatsappUrl = getWhatsAppUrl(
    isHi
      ? "नमस्ते StashSaarthi, मैं अपनी संपत्ति के लिए होस्ट साप्ताहिक एस्क्रो और भुगतान समझौते की समीक्षा करना चाहता/चाहती हूं।"
      : "Namaste StashSaarthi, I want to review the Host Weekly Escrow & Payout Agreement for my property.",
    FOUNDER_WHATSAPP
  );

  const guarantees = isHi
    ? [
        "चेक-इन से पहले छात्र शुल्क का 100% स्टैशसारथी एस्क्रो खाते में अग्रिम जमा किया जाता है",
        "प्रत्येक बुकिंग पर ₹10,000 की सुरक्षा कवर एवं संपत्ति संरक्षण गारंटी",
        "हर महीने आपके व्हाट्सएप पर डिजिटल विवरण और जीएसटी सारांश भेजा जाता है",
        "किसी भी बैंकिंग प्रश्न के लिए 24×7 कॉल पर प्रत्यक्ष नोडल कंसीयज प्रबंधक उपलब्ध",
      ]
    : [
        "100% Student Fee Pre-Collected into StashSaarthi Escrow Account before check-in",
        "₹10,000 Safety Cover & Property Protection Guarantee on every booking",
        "Digital Statement & GST compliant summary sent to your WhatsApp every month",
        "Direct 1-on-1 Nodal Concierge manager available on call 24×7 for any banking query",
      ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-amber-500/30 bg-[#0A0D0F]/95 text-foreground backdrop-blur-2xl p-6 rounded-3xl">
        <DialogHeader className="text-left space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 w-fit">
            <ShieldCheck className="h-3.5 w-3.5" />
            {isHi ? "100% एस्क्रो समर्थित भुगतान चार्टर" : "100% Escrow Backed Payout Charter"}
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight text-white">
            {isHi ? "आपको भुगतान कैसे और कब मिलता है" : "How & When You Get Paid"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            {isHi 
              ? "शून्य नकद झंझट, शून्य देरी। हर सप्ताह सीधा पारदर्शी बैंक निपटान।"
              : "Zero cash friction, zero delayed calls. Transparent, direct bank settlement every single week."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          {/* Payout Schedule Timeline */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {isHi ? "प्रत्येक मंगलवार सुबह 10:00 बजे निपटान" : "Every Tuesday Settlement (10:00 AM)"}
                </h4>
                <p className="text-xs text-slate-400">
                  {isHi ? "आपके पंजीकृत बैंक खाते में सीधे NEFT / UPI ट्रांसफर।" : "Direct NEFT / UPI deposit directly into your registered bank account."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  {isHi ? "लगेज स्टैश (प्रति बैग)" : "Luggage Stash (per bag)"}
                </span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {isHi ? "₹180/माह (60%)" : "₹180/mo (60%)"}
                </span>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  {isHi ? "घरेलू टिफिन (प्रति भोजन)" : "Home Tiffins (per meal)"}
                </span>
                <span className="text-base font-extrabold text-amber-400 font-mono">
                  {isHi ? "₹55/भोजन नेट" : "₹55/meal net"}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantees List */}
          <div className="space-y-2 text-xs">
            {guarantees.map((text, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold h-11 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <PhoneCall className="mr-2 h-4 w-4" />
              {isHi ? "भुगतान डेस्क से बात करें" : "Speak with Payout Desk"}
            </a>
          </Button>
          <Button
            variant="outline"
            className="border-white/10 text-slate-300 hover:text-white h-11 rounded-xl cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            {isHi ? "बंद करें" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
