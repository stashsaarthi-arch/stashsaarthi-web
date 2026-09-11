import React, { useState } from "react";
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Download,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { handleDownloadInvestorMemo } from "@/components/stash/legal";
import { toast } from "sonner";
import { playClick } from "@/lib/audio";
import {
  generateTpaDigitalStampAgreement,
  getLatestTpaAgreementForHost,
  TpaDigitalAgreementRecord,
} from "@/lib/tpaDigitalAgreementEngine";
import { TpaDigitalAgreementModal } from "@/components/stash/TpaDigitalAgreementModal";

export const TpaLegalOverviewSection: React.FC = () => {
  const { language } = useLanguage();
  const isHi = language === "hi" || true; // Emphasize clear Hindi by default
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [tpaModalOpen, setTpaModalOpen] = useState(false);
  const [tpaRecord, setTpaRecord] = useState<TpaDigitalAgreementRecord | null>(null);

  const handleOpenStampModal = () => {
    playClick();
    const existing = getLatestTpaAgreementForHost();
    const record =
      existing ||
      generateTpaDigitalStampAgreement(
        "श्रीमती सरिता शर्मा (नमूना होस्ट)",
        "+91 9839012345",
        "117/N/89 काकादेव, कानपुर",
        "Kakadeo Coaching Belt"
      );
    setTpaRecord(record);
    setTpaModalOpen(true);
  };

  const toggleFaq = (index: number) => {
    playClick();
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const KEY_PROTECTIONS = [
    {
      icon: Lock,
      titleHi: "100% मालिकाना हक सुरक्षित (शून्य कब्जा जोखिम)",
      titleEn: "100% Property Title Safety (Zero Tenancy Claim Risk)",
      descHi: "संपत्ति अंतरण अधिनियम (TPA 1882) की धारा 105 के तहत, छात्र को केवल 'अस्थायी लाइसेंस' मिलता है। छात्र कभी भी किराएदार या कब्जे का कानूनी दावा नहीं कर सकता।",
      descEn: "Under TPA Sec 105, students receive a temporary limited leave-and-license. They hold zero statutory tenancy rights over your premises.",
      badgeHi: "लीव एवं लाइसेंस धारा 105",
      badgeEn: "Sec 105 Protection",
    },
    {
      icon: Scale,
      titleHi: "24 घंटे में खाली कराने का पूर्ण कानूनी अधिकार",
      titleEn: "Instant 24-Hour Eviction Right Upon Rule Breach",
      descHi: "यदि छात्र गृह नियमों का उल्लंघन करता है या अवधि समाप्त होती है, तो होस्ट को बिना किसी कोर्ट-कचहरी के 24 घंटे में स्थान खाली कराने का पूर्ण अधिकार प्राप्त है।",
      descEn: "If house rules are broken or subscription ends, hosts possess full legal right to vacate premises within 24 hours without legal disputes.",
      badgeHi: "त्वरित निष्कासन अधिकार",
      badgeEn: "24H Vacate Right",
    },
    {
      icon: ShieldCheck,
      titleHi: "शून्य पुलिस व कानूनी झंझट (स्टैशसारथी की गारंटी)",
      titleEn: "Zero Police & Legal Liability (Fully Managed by Platform)",
      descHi: "प्रत्येक छात्र का आधार + पुलिस बैकग्राउंड वेरिफिकेशन स्टैशसारथी द्वारा किया जाता है। किसी भी विवाद में कानूनी सहायता और कागजी कार्रवाई स्टैशसारथी संभालती है।",
      descEn: "Full Aadhaar e-KYC and local police clearance are completed by StashSaarthi prior to check-in. Platform handles all legal paperwork.",
      badgeHi: "100% सत्यापित छात्र",
      badgeEn: "Pre-Verified Tenants",
    },
    {
      icon: FileText,
      titleHi: "डिजिटल एग्रीमेंट & ₹10,000 सुरक्षा कवर",
      titleEn: "Digital Legal Agreement & ₹10,000 Damage Guarantee",
      descHi: "आपको कोई वकील या स्टाम्प पेपर खरीदने की जरूरत नहीं। 1-क्लिक में डिजिटल अनुबंध लागू होता है और कमरे व सामान को ₹10,000 तक का सुरक्षा कवर मिलता है।",
      descEn: "Zero lawyer fees or physical stamp paperwork needed. Digital contracts auto-apply with embedded ₹10,000 host damage protection.",
      badgeHi: "रुपये 10,000 सुरक्षा कवर",
      badgeEn: "₹10,000 Insurance",
    },
  ];

  const HINDI_LEGAL_FAQS = [
    {
      q: "क्या छात्र मेरे घर पर स्थायी किराएदारी (Tenancy Claim) का दावा कर सकता है?",
      a: "बिल्कुल नहीं! भारतीय संपत्ति अंतरण अधिनियम 1882 की धारा 105 (TPA Sec 105) के तहत स्टैशसारथी का समझौता 'लीव एंड लाइसेंस' (Leave and License) की श्रेणी में आता है। इसका मतलब है कि छात्र केवल सीमित समय के लिए सुविधा का उपयोग कर रहा है। वह कभी भी मकान पर किराएदार या मालिकाना हक का दावा नहीं कर सकता।",
    },
    {
      q: "अगर छात्र समय पर कमरा या स्टोरेज खाली न करे तो क्या होगा?",
      a: "स्टैशसारथी के डिजिटल लीगल चार्टर के तहत, समय सीमा समाप्त होने के बाद छात्र का लाइसेंस स्वतः समाप्त हो जाता है। हमारी स्थानीय कानपुर ऑपरेशंस टीम 24 घंटे के भीतर स्थान खाली कराने और छात्र का सामान सुरक्षित रूप से स्थानांतरित करने के लिए कानूनी रूप से बाध्य है। होस्ट को किसी पुलिस या अदालत जाने की आवश्यकता नहीं पड़ती।",
    },
    {
      q: "अगर कमरे या घर के सामान को कोई नुकसान पहुँचे तो उसकी भरपाई कौन करेगा?",
      a: "प्रत्येक बुकिंग के साथ स्टैशसारथी का ₹10,000 का एम्बेडेड सुरक्षा कवच (Host Protection Cover) सक्रिय होता है। यदि छात्र द्वारा किसी भी प्रकार का नुकसान होता है, तो स्टैशसारथी की टीम 48 घंटे के भीतर जांच करके सीधे होस्ट के बैंक खाते में क्षतिपूर्ति राशि जमा करती है।",
    },
    {
      q: "क्या सीनियर होस्ट को कानूनी कागजी कार्रवाई या स्टाम्प पेपर बनवाना पड़ेगा?",
      a: "जी नहीं! स्टैशसारथी की पूरी प्रक्रिया 100% डिजिटल है। ऑनबोर्डिंग के समय हमारी ग्राउंड टीम आपके फोन पर 1-टैप डिजिटल कानूनी सहमति दर्ज कराती है। आपको किसी भी वकील, कचहरी या भौतिक स्टाम्प पेपर की आवश्यकता नहीं है।",
    },
  ];

  return (
    <div id="tpa-legal-overview" className="my-12 px-4 max-w-5xl mx-auto scroll-mt-24">
      <div className="relative rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 md:p-10 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto space-y-3 mb-8">
          <Badge className="bg-amber-500/10 border-amber-500/40 text-amber-300 text-xs font-bold py-1 px-3.5 uppercase tracking-widest inline-flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            कानूनी सुरक्षा गाइडलाइन • TPA धारा 105
          </Badge>

          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
            सीनियर होस्ट्स के लिए <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400">100% कानूनी सुरक्षा</span> एवं अधिकार
          </h2>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            भारतीय संपत्ति अंतरण अधिनियम 1882 (Transfer of Property Act, Sec 105) की सरल एवं स्पष्ट व्याख्या। जानें कि स्टैशसारथी आपके मकान और अधिकारों की रक्षा कैसे करता है।
          </p>
        </div>

        {/* 4 Key Protection Cards Grid */}
        <div className="grid md:grid-cols-2 gap-4 relative z-10 mb-10">
          {KEY_PROTECTIONS.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/70 border border-slate-800 p-5 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                      {item.badgeHi}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">
                    {item.titleHi}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.descHi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>कानूनी रूप से सुरक्षित एवं बाध्यकारी</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple Hindi FAQ Accordion Section */}
        <div className="relative z-10 bg-slate-950/80 rounded-2xl border border-slate-800 p-5 md:p-6 mb-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white">
              अक्सर पूछे जाने वाले कानूनी सवाल (सरल हिंदी में)
            </h3>
          </div>

          <div className="space-y-3">
            {HINDI_LEGAL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800/90 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center justify-center font-mono shrink-0">
                        {idx + 1}
                      </span>
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Callout Banner */}
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                कानूनी सलाहकार या फाउंडर से सीधी बात करें
              </h4>
              <p className="text-xs text-slate-300">
                यदि आपके पास TPA धारा 105 या सुरक्षा से संबंधित कोई भी प्रश्न है, तो सीधे हमारी विधिक टीम से संपर्क करें।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenStampModal}
              className="border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs"
            >
              <FileText className="w-3.5 h-3.5 mr-1 text-amber-400" />
              📜 UP ई-स्टांप समझौता देखें
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownloadInvestorMemo("hi")}
              className="border-amber-500/40 bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1 text-amber-400" />
              लीगल समरी डाउनलोड
            </Button>
            <Button
              size="sm"
              onClick={() => {
                playClick();
                window.open(
                  `https://wa.me/919369454350?text=${encodeURIComponent(
                    "नमस्ते स्टैशसारथी टीम, मुझे सीनियर होस्ट TPA धारा 105 कानूनी सुरक्षा के बारे में जानकारी चाहिए।"
                  )}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              व्हाट्सएप सहायता +91 9369454350
            </Button>
          </div>
        </div>
      </div>

      {/* TPA Digital e-Stamp Agreement Viewer Modal */}
      <TpaDigitalAgreementModal
        open={tpaModalOpen}
        onOpenChange={setTpaModalOpen}
        record={tpaRecord}
      />
    </div>
  );
};
