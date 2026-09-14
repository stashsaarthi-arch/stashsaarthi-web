import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  BookOpen,
  Download,
  Share2,
  PhoneCall,
  MapPin,
  Utensils,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Printer,
  Sparkles,
  FileText,
  Clock,
  Building,
  Heart,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function KakadeoSurvivalGuide() {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const [activeTab, setActiveTab] = useState<string>("all");
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadBlob = () => {
    setDownloading(true);
    try {
      const content = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <title>The Complete Guide to Surviving Kakadeo as a New Student - StashSaarthi</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #059669; border-bottom: 2px solid #10b981; padding-bottom: 8px; }
    h2 { color: #0284c7; margin-top: 24px; }
    .badge { background: #dcfce7; color: #15803d; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 14px; }
    .box { background: #f8fafc; border-left: 4px solid #0284c7; padding: 16px; margin: 16px 0; border-radius: 4px; }
    .warning { background: #fff7ed; border-left: 4px solid #f97316; padding: 16px; margin: 16px 0; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <span class="badge">STASHSAARTHI OFFICIAL STUDENT HANDBOOK 2026</span>
  <h1>The Complete Guide to Surviving Kakadeo as a New Student</h1>
  <p><em>Powered by StashSaarthi — Kanpur's #1 Intergenerational Living & Campus Micro-Storage Network</em></p>
  <hr/>

  <h2>📍 Chapter 1: Navigating the Kakadeo Coaching Hub</h2>
  <p>Kakadeo is Kanpur's coaching epicenter with over 40,000+ JEE and NEET aspirants. Key coaching nodes include Physics Wallah (PW) Vidyapeeth, Motion Coaching, Allen Career Institute, and Vibrant Academy.</p>
  <div class="box">
    <strong>💡 Pro-Tip for New Arrivals:</strong> Main roads like Chhapeda Pulia and Geeta Nagar get congested during batch exit times (1:15 PM and 5:30 PM). Use narrow Gali #3 behind Sharma Tea Stall to bypass traffic in under 3 minutes.
  </div>

  <h2>🍲 Chapter 2: Food & Mess Survival (Avoiding Canteen Stomach Bugs)</h2>
  <p>Commercial canteens often reuse palm oil and heavy spices causing digestive issues before test series. Always prefer pure homestyle tiffins prepared by verified local mother chefs.</p>
  <ul>
    <li><strong>Annapurna Home Kitchen:</strong> 80m from PW Vidyapeeth — Standard Thali @ ₹50 (Pure Desi Ghee Phulkas).</li>
    <li><strong>Shanti Home Kitchen:</strong> 120m from Motion Kakadeo — Senior Feast @ ₹90 (Home-curd, dal fry, fresh sabzi).</li>
    <li><strong>Dadi Maa Rasoi:</strong> 100m from Allen Institute — Monthly Tiffin Pass @ ₹2,400/mo with 1-tap pause facility.</li>
  </ul>

  <h2>🏡 Chapter 3: Zero-Brokerage Room Hunting Checklist</h2>
  <p>Never pay 1-month rent as brokerage to unauthorized local middlemen. Look for StashSaarthi verified senior host homes.</p>
  <div class="warning">
    <strong>⚠️ Red Flags to Watch Out For:</strong>
    1. Demand for non-refundable cash deposits over 1 month rent.<br/>
    2. Sub-meters charged above ₹12/unit (Kanpur standard is ₹7.5-9/unit).<br/>
    3. Low water pressure during morning 6-9 AM rush.
  </div>

  <h2>🧳 Chapter 4: Vacation Dead-Rent Waste & Micro-Storage Hacks</h2>
  <p>During 2-month summer and Diwali vacations, students lose ~₹8,000 by keeping empty rooms locked just to hold luggage. Instead, use Saarthi Stash @ ₹300/bag/month with doorstep pickup, laser tamper-barcode seals, and ₹10,000 safety insurance.</p>

  <h2>📞 Chapter 5: Essential Emergency Helplines</h2>
  <ul>
    <li><strong>StashSaarthi 24/7 Student Hotline:</strong> +91 9369454350</li>
    <li><strong>Kakadeo Police Station:</strong> 0512-2500100</li>
    <li><strong>Regency Hospital Kakadeo:</strong> 0512-3081111</li>
    <li><strong>CSJMU Student Support Cell:</strong> 0512-2580044</li>
  </ul>

  <div class="footer">
    © 2026 StashSaarthi Autonomous System. All rights reserved. Issued for student welfare in Kakadeo, Kanpur.
  </div>
</body>
</html>
      `;
      const blob = new Blob([content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Kakadeo_Student_Survival_Guide_StashSaarthi.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = isHi
      ? `📚 काकादेव न्यू स्टूडेंट सर्वाइवल गाइड (StashSaarthi द्वारा संचालित):\n\nकाकादेव कानपुर में हॉस्टल, टिफिन (₹50), और छुट्टियों में सामान स्टोरेज (₹300/माह) की पूरी जानकारी गाइड प्राप्त करें!\n\nडाउनलोड करें: https://stashsaarthi-web.vercel.app/kakadeo-survival-guide`
      : `📚 The Complete Guide to Surviving Kakadeo as a New Student (powered by StashSaarthi):\n\nGet essential hacks on Kakadeo PGs, ₹50 homestyle tiffins, and ₹300/mo vacation storage!\n\nRead & Download PDF: https://stashsaarthi-web.vercel.app/kakadeo-survival-guide`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="section-isolated layout-isolated w-full max-w-5xl mx-auto px-4 py-8 space-y-8 font-sans text-slate-100 print:text-slate-900 print:bg-white print:p-0 print:m-0 print:max-w-none">
      {/* Printable Header styling injected for browser print mode */}
      <style>{`
        @media print {
          body { background: white !important; color: black !important; font-size: 12pt; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          .page-break { page-break-after: always; }
          .border-print { border: 1px solid #ccc !important; box-shadow: none !important; background: white !important; }
        }
      `}</style>

      {/* Top Banner / Navigation Actions */}
      <div className="no-print flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Official PDF Guide 2026
              </span>
              <span className="text-xs text-slate-400">Verified Kakadeo Edition</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white mt-1">
              {isHi
                ? "काकादेव न्यू स्टूडेंट सर्वाइवल गाइड"
                : "The Complete Kakadeo Student Survival Guide"}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 border-none shadow-lg transition-transform active:scale-95"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isHi ? "PDF प्रिंट / सेव करें" : "Print / Download PDF"}
          </Button>

          <Button
            onClick={handleDownloadBlob}
            disabled={downloading}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-semibold"
          >
            <Download className="w-4 h-4 mr-2 text-cyan-400" />
            {isHi ? "ऑफ़लाइन गाइड (.html)" : "Offline Guide (.html)"}
          </Button>

          <Button
            onClick={handleShareWhatsApp}
            variant="outline"
            className="bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {isHi ? "शेयर" : "Share"}
          </Button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="border-print bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-10">
        {/* Document Header Header */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <span>DOCUMENT ID: SS-KNP-GUIDE-2026</span>
              <span>•</span>
              <span>FREE DISTRIBUTION SLA</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              {isHi
                ? "काकादेव में नए छात्र का सर्वाइवल गाइड"
                : "The Complete Guide to Surviving Kakadeo as a New Student"}
            </h2>
            <p className="text-emerald-400 font-medium text-sm md:text-base">
              {isHi
                ? "StashSaarthi द्वारा संचालित - कानपुर का #1 इंटरजनरेशनल लिविंग एवं कैंपस माइक्रो-स्टोरेज नेटवर्क"
                : "Powered by StashSaarthi — India's Zero-CapEx Intergenerational Living & Campus Micro-Storage Platform"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center min-w-[200px]">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Verified Kakadeo Nodes
            </span>
            <span className="text-lg font-black text-emerald-400">40,000+ Students</span>
            <p className="text-xs text-slate-500 mt-1">PW • Motion • Allen Hubs</p>
          </div>
        </div>

        {/* Executive Summary & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
            <MapPin className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">{isHi ? "कोचिंग हब" : "Coaching Hub"}</div>
            <div className="font-bold text-white text-sm">Kakadeo, Kanpur</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
            <Utensils className="w-5 h-5 text-amber-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">{isHi ? "घर का खाना" : "Homestyle Thali"}</div>
            <div className="font-bold text-white text-sm">₹50 / meal</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
            <Building className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">{isHi ? "ज़ीरो-ब्रोकरेज रूम" : "Zero Brokerage"}</div>
            <div className="font-bold text-white text-sm">Avg ₹5,500/mo</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center">
            <PackageCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
            <div className="text-xs text-slate-400">{isHi ? "छुट्टियों में स्टोरेज" : "Vacation Storage"}</div>
            <div className="font-bold text-white text-sm">₹300 / bag / mo</div>
          </div>
        </div>

        {/* SECTION 1: COACHING HUB NAVIGATION */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
              1
            </div>
            <h3 className="text-xl font-bold text-white">
              {isHi ? "काकादेव कोचिंग हब नेविगेशन" : "Navigating the Kakadeo Coaching Belt"}
            </h3>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {isHi
              ? "काकादेव में हर साल 40,000+ JEE और NEET छात्र आते हैं। मुख्य कोचिंग संस्थान Chhapeda Pulia और Geeta Nagar क्रॉसिंग के आसपास केंद्रित हैं।"
              : "Kakadeo accommodates over 40,000+ JEE & NEET aspirants annually. Primary coaching institutes are clustered around Chhapeda Pulia and Geeta Nagar crossing."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Physics Wallah (PW) Hub
              </span>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "छपेड़ा पुलिया चौराहा, काकादेव। दोपहर 1:15 और शाम 5:30 बजे मुख्य मार्ग पर भीड़ रहती है। गली #3 बाईपास का उपयोग करें।"
                  : "Chhapeda Pulia Circle, Kakadeo. Peak exits at 1:15 PM & 5:30 PM. Take Gali #3 bypass to save 10 mins walk."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Motion Coaching Hub
              </span>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "देवकी पैलेस लेन के निकट। शांति सीनियर होम किचन निकटतम 120m दूरी पर स्थित है।"
                  : "Near Devki Palace Hostel Lane. Shanti Senior Home Kitchen is located just 120m away."}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                Allen Institute Hub
              </span>
              <p className="text-xs text-slate-400">
                {isHi
                  ? "पांडु नगर क्रॉसिंग रोड। दादी माँ रसोई 100m पर शुद्ध देशी घी की रोटियां उपलब्ध कराती है।"
                  : "Pandu Nagar Crossing Road. Dadi Maa Rasoi offers fresh desi ghee rotis at 100m distance."}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: FOOD & MESS SURVIVAL */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
              2
            </div>
            <h3 className="text-xl font-bold text-white">
              {isHi ? "भोजन एवं मेस सर्वाइवल (पेट की बीमारियों से बचाव)" : "Food & Mess Survival Guide"}
            </h3>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {isHi
              ? "कामर्शियल मेस में बार-बार गर्म किया पाम ऑयल इस्तेमाल होता है, जिससे परीक्षा से ठीक पहले पेट खराब हो सकता है। हमेशा सत्यापित वरिष्ठ माताओं (Mother Chefs) द्वारा तैयार घर का खाना ही चुनें।"
              : "Commercial canteens frequently reuse palm oil and synthetic spices leading to digestive issues right before test series. Always prefer home meals prepared by verified senior mother chefs."}
          </p>

          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-300 text-sm">
                {isHi ? "सारथी किचन - होमस्टाइल टिफिन विकल्प" : "Saarthi Kitchen - Homestyle Meal Options"}
              </h4>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-mono">
                1-TAP PAUSE FEATURE
              </span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Standard Thali (₹50):</strong> 4 Desi Ghee Phulkas, Arhar Dal, Seasonal Sabzi, Salad.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Senior Feast (₹90):</strong> 5 Phulkas, Paneer/Special Sabzi, Curd, Rice, Sweet.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Monthly Pass (₹2,400):</strong> Unlimited pause tokens during JEE/NEET test series breaks.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* SECTION 3: ZERO-BROKERAGE ROOM HUNTING */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
              3
            </div>
            <h3 className="text-xl font-bold text-white">
              {isHi ? "ज़ीरो-ब्रोकरेज कमरा खोज चेकलिस्ट" : "Zero-Brokerage Room Hunting Checklist"}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4" />
                {isHi ? "दलालों और ठगी से बचें" : "Red Flags to Avoid"}
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Never pay 1-month rent as brokerage to unauthorized local middlemen.</li>
                <li>Verify sub-meter electric tariff is under ₹9/unit (standard Kanpur domestic rate).</li>
                <li>Check water pressure between 6:00 AM - 8:30 AM before signing agreement.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
                <ShieldCheck className="w-4 h-4" />
                {isHi ? "सारथी स्पेस गारंटी" : "Saarthi Spaces Advantage"}
              </div>
              <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
                <li>Direct connection with verified senior host families (Average ₹5,500/mo).</li>
                <li>Zero brokerage fee, zero security deposit forfeiture traps.</li>
                <li>Quiet study environment with senior citizen house guardians.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4: VACATION STORAGE HACKS */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400">
              4
            </div>
            <h3 className="text-xl font-bold text-white">
              {isHi ? "छुट्टियों में डेड-रेंट बचत एवं स्टोरेज हैक्स" : "Vacation Dead-Rent Savings & Micro-Storage"}
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-300 text-sm">
                {isHi
                  ? "खाली कमरे का ₹8,000 किराया न दें - ₹300/बैग में स्टोर करें"
                  : "Don't pay ₹8,000 PG rent for empty rooms — Store at ₹300/bag/mo"}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isHi
                  ? "दीपावली या गर्मियों की छुट्टियों में केवल सामान रखने के लिए किराया देना बंद करें। सारथी स्टैश आपके कमरे से सामान पिक करता है, लेज़र बारकोड सील लगाता है और ₹10,000 सुरक्षा बीमा के साथ सुरक्षित रखता है।"
                  : "Stop burning money on empty rooms during vacation breaks. Saarthi Stash picks up your luggage from your doorstep, seals it with tamper-evident laser barcodes, and stores it with ₹10,000 micro-insurance coverage."}
              </p>
            </div>
            <div className="shrink-0 text-center bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
              <span className="text-2xl font-black text-emerald-400">₹300 / mo</span>
              <p className="text-xs text-slate-400 font-mono mt-1">Laser Barcode Sealed</p>
            </div>
          </div>
        </section>

        {/* SECTION 5: EMERGENCY HELPLINES */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400">
              5
            </div>
            <h3 className="text-xl font-bold text-white">
              {isHi ? "महत्वपूर्ण काकादेव हेल्पलाइन एवं इमरजेंसी संपर्क" : "Essential Kakadeo Emergency Helplines"}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-bold">StashSaarthi Founder Hotline</span>
              <a href="tel:+919369454350" className="text-emerald-400 font-mono font-bold text-sm hover:underline">
                +91 9369454350
              </a>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-bold">Kakadeo Police Station</span>
              <a href="tel:05122500100" className="text-cyan-400 font-mono font-bold text-sm hover:underline">
                0512-2500100
              </a>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-bold">Regency Hospital Kakadeo</span>
              <a href="tel:05123081111" className="text-rose-400 font-mono font-bold text-sm hover:underline">
                0512-3081111
              </a>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 block mb-1 font-bold">CSJMU Student Support Cell</span>
              <a href="tel:05122580044" className="text-amber-400 font-mono font-bold text-sm hover:underline">
                0512-2580044
              </a>
            </div>
          </div>
        </section>

        {/* Footer Seal & Signoff */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>StashSaarthi Autonomous Student Welfare Charter • Kanpur, UP</span>
          </div>
          <div className="font-mono text-slate-500">
            OFFICIAL STAMP: APPROVED FOR FREE KAKADEO DISTRIBUTION
          </div>
        </div>
      </div>
    </div>
  );
}
