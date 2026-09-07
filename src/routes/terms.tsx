import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Scale, FileText, Printer, CheckCircle, Mail, Phone, MapPin, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service & Host Charter | StashSaarthi Technologies" },
      {
        name: "description",
        content:
          "Official Terms of Service & Host Protection Charter. Governed under Section 105 Transfer of Property Act 1882 with 100% digital bank escrow and zero cancellation fees.",
      },
      { property: "og:title", content: "Terms of Service | StashSaarthi Technologies" },
      {
        property: "og:description",
        content:
          "Official Terms of Service & Host Protection Charter. Sec 105 TPA 1882 governed leave-and-license agreements.",
      },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-host.png" },
    ],
  }),
  component: TermsPageWrapped,
});

function TermsPageWrapped() {
  return (
    <ErrorBoundary sectionName="Terms of Service Page">
      <TermsPage />
    </ErrorBoundary>
  );
}

function TermsPage() {
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const [activeSection, setActiveSection] = useState("overview");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-foreground font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0D0F]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-amber-400"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isHi ? "मुख्य पृष्ठ पर लौटें" : "Back to Home"}</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <BrandLogo height={28} className="hidden sm:block" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(isHi ? "en" : "hi")}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-muted-foreground transition hover:border-amber-500/40 hover:text-amber-400"
            >
              {isHi ? "English" : "हिंदी"}
            </button>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 border-white/10 bg-white/5 text-xs text-muted-foreground hover:text-white"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isHi ? "प्रिंट" : "Print"}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Title Badge */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-400 mb-3">
            <Scale className="h-4 w-4" />
            <span>
              {isHi
                ? "संपत्ति अधिनियम (TPA 1882) धारा 105 एवं भारतीय कानूनी मानकों के तहत"
                : "Sec 105 Transfer of Property Act 1882 & Indian Legal Framework"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isHi ? "सेवा की शर्तें एवं आचार संहिता (Terms of Service)" : "Terms of Service & Operating Charter"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            {isHi
              ? "यह कानूनी समझौता स्टैशसारथी प्लेटफॉर्म के उपयोग, छात्र दायित्वों, सीनियर होस्ट अधिकारों, बारकोड सील सुरक्षा और एस्क्रो भुगतान नियमों को परिभाषित करता है।"
              : "This agreement defines user responsibilities, senior host rights under Sec 105 TPA 1882, prohibited storage item restrictions, zero cancellation fee refunds, and escrow payout guarantees."}
          </p>
          <div className="mt-3 text-xs text-muted-foreground">
            <span>{isHi ? "अंतिम संशोधन:" : "Last Updated:"} September 7, 2026</span> •{" "}
            <span>{isHi ? "संस्करण:" : "Version:"} v2.5 (Predictive AI & Data Governance Standard)</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Quick Nav Sidebar */}
          <aside className="md:col-span-1">
            <div className="sticky top-20 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <h2 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
                {isHi ? "अनुभाग" : "Sections"}
              </h2>
              <nav className="space-y-1 text-xs">
                {[
                  { id: "eligibility", label: isHi ? "1. पात्रता व दायरा" : "1. Eligibility & Scope" },
                  { id: "tpa", label: isHi ? "2. TPA 1882 कानूनी ढांचा" : "2. TPA Sec 105 Framework" },
                  { id: "prohibited", label: isHi ? "3. प्रतिबंधित वस्तुएं" : "3. Prohibited Storage Items" },
                  { id: "escrow", label: isHi ? "4. एस्क्रो व रिफंड SLA" : "4. Escrow & Refund SLA" },
                  { id: "insurance", label: isHi ? "5. ₹10k माइक्रो-बीमा" : "5. ₹10k Micro-Insurance" },
                  { id: "hostcode", label: isHi ? "6. सीनियर होस्ट अधिकार" : "6. Host Rules & Dignity" },
                  { id: "cancellation", label: isHi ? "7. शून्य कैंसिलेशन फीस" : "7. Zero Cancellation Policy" },
                  { id: "disputes", label: isHi ? "8. विवाद निवारण" : "8. Jurisdiction & Disputes" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`block rounded-lg px-2.5 py-1.5 transition-colors ${
                      activeSection === item.id
                        ? "bg-amber-500/20 font-bold text-amber-400 border border-amber-500/30"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Detailed Legal Content */}
          <div className="md:col-span-3 space-y-8 text-sm leading-relaxed text-slate-300">
            {/* 1. Eligibility & Scope */}
            <section id="eligibility" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <FileText className="h-5 w-5" />
                <h2>1. Acceptance of Terms & Service Scope</h2>
              </div>
              <p>
                By accessing StashSaarthi web applications, reserving micro-storage, listing a co-living room, or subscribing to Saarthi Kitchen tiffins, you enter into a binding agreement with StashSaarthi Technologies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-emerald-400 mb-1">A. Saarthi Stash</h3>
                  <p className="text-muted-foreground">Vacation micro-storage at ₹300/bag/mo with elevated wooden pallet placement, laser tamper barcode seals, and ₹10k insurance.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-amber-400 mb-1">B. Saarthi Spaces</h3>
                  <p className="text-muted-foreground">Zero-brokerage student room stays with verified senior households under transparent month-to-month leave-and-license agreements.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-cyan-400 mb-1">C. Saarthi Kitchen</h3>
                  <p className="text-muted-foreground">Pure home-cooked tiffin meals prepared by verified neighborhood senior home-chefs @ ₹90/meal with 1-tap pause flexibility.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-purple-400 mb-1">D. Saarthi Connect</h3>
                  <p className="text-muted-foreground">Intergenerational compatibility matching connecting verified students with dignified senior host household mentorship.</p>
                </div>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 sm:col-span-2">
                  <h3 className="font-bold text-amber-300 mb-1">E. Predictive AI & Client-Side UX Personalization</h3>
                  <p className="text-amber-100/90">
                    StashSaarthi utilizes a 100% client-side neural network classifier to adapt the user experience (Student vs Host view) based on interaction signals. Zero behavioral telemetry is stored on external servers or sold to third parties. Users can toggle "Low-Data Mode" at any time to bypass animations and client-side AI processing.
                  </p>
                </div>
              </div>
            </section>

            {/* 2. TPA Sec 105 Framework */}
            <section id="tpa" className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <Scale className="h-5 w-5" />
                <h2>2. Transfer of Property Act 1882 (Sec 105) Protection</h2>
              </div>
              <p className="text-amber-100">
                {isHi
                  ? "सभी कमरे का प्रवास संपत्ति अंतरण अधिनियम 1882 की धारा 105 के तहत वैध लीव-एंड-लाइसेंस समझौते के रूप में संचालित होता है।"
                  : "All room stays and storage node hosting operate strictly under valid Leave-and-License frameworks governed by Section 105 of the Transfer of Property Act 1882."}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-200/80">
                <li><strong className="text-amber-300">Non-Tenancy Protection:</strong> License agreements grant temporary permissive occupancy only. They do not create permanent tenancy, leasehold equity, or property encumbrance rights.</li>
                <li><strong className="text-amber-300">Senior Dignity Guard:</strong> Senior hosts maintain 100% legal ownership and authority to enforce house norms, quiet hours (e.g. after 10:00 PM), and visitor entry policies.</li>
                <li><strong className="text-amber-300">24-Hour Relocation SLA:</strong> In case of irreconcilable roommate friction, StashSaarthi provides zero-penalty student relocation to an alternate verified node within 24 hours.</li>
              </ul>
            </section>

            {/* 3. Prohibited Items */}
            <section id="prohibited" className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                <AlertTriangle className="h-5 w-5" />
                <h2>3. Prohibited Storage Items & Barcode Seal Charter</h2>
              </div>
              <p className="text-red-200">
                To preserve physical safety across senior host households, students must strictly inspect luggage prior to laser sealing.
              </p>
              <div className="rounded-xl border border-red-500/20 bg-black/40 p-3 space-y-2 text-xs">
                <p className="font-bold text-red-400">Strictly Prohibited Items (Zero Exception):</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li>Cash, currency notes, bearer bonds, or negotiable financial instruments.</li>
                  <li>Real gold, silver, diamonds, or high-value precious jewelry.</li>
                  <li>Perishable food items, cooked meals, or unsealed liquids liable to rot or leak.</li>
                  <li>Flammable liquids, gas cylinders, fireworks, batteries liable to swelling, or hazardous chemicals.</li>
                  <li>Unlawful contraband, weapons, firearms, or substances prohibited under Indian Penal Code (IPC) or NDPS Act.</li>
                </ul>
                <p className="text-red-300/90 text-[11px] pt-1">
                  ⚡ <strong>Laser Barcode Mandate:</strong> Every luggage bag is physically weight-checked and sealed with a uniquely numbered tamper-evident laser barcode seal (#SS-KNP-XXXX) in your presence during pickup.
                </p>
              </div>
            </section>

            {/* 4. Escrow & Refund SLA */}
            <section id="escrow" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle className="h-5 w-5" />
                <h2>4. Escrow Payouts & Cancellation Refund SLA</h2>
              </div>
              <p>StashSaarthi operates with 100% digital bank escrow protection for both students and host keepers:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li><strong className="text-white">Host Escrow Payouts:</strong> Student booking fees are held in escrow and released directly to senior host bank accounts on a weekly schedule (every Monday) following conflict-free handover.</li>
                <li><strong className="text-white">100% Pre-Pickup Cancellation Refund:</strong> Cancellations made up to 24 hours prior to scheduled doorstep luggage pickup or stay move-in receive an instant 100% full refund with zero deduction fees.</li>
                <li><strong className="text-white">Pro-Rata Early Withdrawal Return:</strong> If you return to campus early and withdraw stored luggage mid-vacation, unused whole months are refunded pro-rata directly to your bank account within 3–5 working days.</li>
              </ul>
            </section>

            {/* 5. ₹10k Micro-Insurance */}
            <section id="insurance" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <h2>5. Storage Liability & ₹10,000 Insurance Cover</h2>
              </div>
              <p>
                Every stored luggage bag carrying an intact laser barcode seal is automatically covered under our ₹10,000 Micro-Insurance Charter against physical damage, water ingress, or theft during node custody.
              </p>
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1 text-xs text-muted-foreground">
                <p><strong className="text-white">Elevation Audit:</strong> Host nodes are audited to ensure luggage is stored on raised wooden/polymer pallets (min 2.5 ft elevation) in dry, clean room zones.</p>
                <p><strong className="text-white">Broken Seal Protocol:</strong> If a barcode seal is found tampered or broken upon doorstep return delivery, an immediate claim ticket is registered, and compensation up to ₹10,000 is settled within 48 hours following physical assessment.</p>
              </div>
            </section>

            {/* 6. Host Code & Dignity */}
            <section id="hostcode" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <FileText className="h-5 w-5" />
                <h2>6. Senior Host Charter & Community Norms</h2>
              </div>
              <p>Senior hosts are respected community partners generating dignified passive income from spare household capacity:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li><strong className="text-white">Zero Intrusion Guarantee:</strong> Student luggage is stored in designated spare storage rooms or corner zones. Hosts will never inspect, open, or move sealed luggage without explicit student consent.</li>
                <li><strong className="text-white">Respectful Interaction:</strong> Students residing in co-living rooms or taking home-cooked tiffins must observe household quiet hours and treat senior hosts with utmost respect.</li>
                <li><strong className="text-white">0% Platform Listing Fee:</strong> Hosts enjoy 0% onboarding fees, with transparent payouts disbursing ₹180 out of every ₹300 storage bag.</li>
              </ul>
            </section>

            {/* 7. Zero Cancellation Fee */}
            <section id="cancellation" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle className="h-5 w-5" />
                <h2>7. Prominent "Zero Cancellation Fee" Guarantee</h2>
              </div>
              <p className="text-emerald-100">
                We believe in radical fairness. There are zero hidden processing charges, zero convenience fee forfeitures, and zero cancellation penalties when you modify or cancel a booking with appropriate notice.
              </p>
            </section>

            {/* 8. Disputes & Nodal Contacts */}
            <section id="disputes" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Mail className="h-5 w-5" />
                <h2>8. Governing Law, Jurisdiction & Nodal Escalation</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                This agreement is governed by the laws of India. Any legal disputes or claims shall be subject to the exclusive jurisdiction of courts in Kanpur, Uttar Pradesh, India.
              </p>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Advik Omer</span>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 font-bold text-amber-300">
                    Founder & Operations Nodal Officer
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 pt-1">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Operational Hub: 117/K-Block, Kalyanpur, Kanpur, Uttar Pradesh — 208016, India</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Direct Email: <a href="mailto:stashsaarthi@gmail.com" className="text-amber-400 underline">stashsaarthi@gmail.com</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Founder Line: <a href={`https://wa.me/${FOUNDER_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">{FOUNDER_PHONE_DISPLAY}</a></span>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
