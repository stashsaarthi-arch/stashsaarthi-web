import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Lock, FileText, Printer, CheckCircle, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { useLanguage } from "@/context/LanguageContext";
import { FOUNDER_WHATSAPP, FOUNDER_PHONE_DISPLAY } from "@/lib/constants";
import { DataPrivacyAuditModal } from "@/components/stash/DataPrivacyAuditModal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | StashSaarthi Technologies" },
      {
        name: "description",
        content:
          "Official Privacy Policy of StashSaarthi. We strictly adhere to India's DPDP Act 2023 with zero data resale, encrypted node logs, and 100% user data sovereignty.",
      },
      { property: "og:title", content: "Privacy Policy | StashSaarthi Technologies" },
      {
        property: "og:description",
        content:
          "Official Privacy Policy of StashSaarthi. Zero data resale, encrypted node logs, and DPDP Act 2023 compliance.",
      },
      { property: "og:image", content: "https://stashsaarthi-web.vercel.app/images/og-student.png" },
    ],
  }),
  component: PrivacyPageWrapped,
});

function PrivacyPageWrapped() {
  return (
    <ErrorBoundary sectionName="Privacy Policy Page">
      <PrivacyPage />
    </ErrorBoundary>
  );
}

function PrivacyPage() {
  const { language, setLanguage } = useLanguage();
  const isHi = language === "hi";
  const [activeSection, setActiveSection] = useState("overview");
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-foreground font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0D0F]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-emerald-400"
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
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-muted-foreground transition hover:border-emerald-500/40 hover:text-emerald-400"
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
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-3">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {isHi
                ? "DPDP अधिनियम 2023 एवं वैश्विक डेटा मानकों के अनुसार"
                : "DPDP Act 2023 & Global Data Governance Compliant"}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {isHi ? "गोपनीयता नीति (Privacy Policy)" : "Privacy Policy & Data Sovereignty"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            {isHi
              ? "स्टैशसारथी टेक्नोलॉजीज आपकी व्यक्तिगत जानकारी की सुरक्षा और गोपनीयता के प्रति 100% प्रतिबद्ध है। हम आपकी जानकारी का कभी व्यापार नहीं करते।"
              : "StashSaarthi Technologies is committed to radical transparency and absolute data privacy. Read how we protect student identity and host safety under India's Digital Personal Data Protection Act."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsAuditModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{isHi ? "🛡️ ऑटोनॉमस DPDP व GDPR ऑडिट पोर्टल" : "🛡️ Audit DPDP & GDPR Compliance Portal"}</span>
            </Button>
            <div className="text-xs text-muted-foreground">
              <span>{isHi ? "अंतिम संशोधन:" : "Last Updated:"} September 6, 2026</span> •{" "}
              <span>{isHi ? "संस्करण:" : "Version:"} v2.4 (Kanpur Operational Standard)</span>
            </div>
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
                  { id: "overview", label: isHi ? "1. मुख्य सिद्धांत" : "1. Core Governance" },
                  { id: "collection", label: isHi ? "2. एकत्रित डेटा" : "2. Information Collected" },
                  { id: "purpose", label: isHi ? "3. डेटा उपयोग" : "3. Purpose of Processing" },
                  { id: "sharing", label: isHi ? "4. शून्य बिक्री गारंटी" : "4. Zero-Resale Guarantee" },
                  { id: "security", label: isHi ? "5. सुरक्षा व एन्क्रिप्शन" : "5. Encryption & Security" },
                  { id: "retention", label: isHi ? "6. डेटा विलोपन अधिकार" : "6. Retention & Erasure" },
                  { id: "dpdp", label: isHi ? "7. DPDP 2023 अधिकार" : "7. DPDP Act Rights" },
                  { id: "nodal", label: isHi ? "8. नोडल अधिकारी" : "8. Nodal Officer Contacts" },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={`block rounded-lg px-2.5 py-1.5 transition-colors ${
                      activeSection === item.id
                        ? "bg-emerald-500/20 font-bold text-emerald-400 border border-emerald-500/30"
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
            {/* 1. Core Governance */}
            <section id="overview" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Lock className="h-5 w-5" />
                <h2>1. Core Governance & Privacy Principles</h2>
              </div>
              <p>
                {isHi
                  ? "स्टैशसारथी ('हम', 'हमारा' या 'प्लेटफ़ॉर्म') उपयोगकर्ताओं की गोपनीयता को सर्वोच्च प्राथमिकता देता है। हम छात्रों और बुजुर्ग सीनियर होस्ट्स के बीच सुरक्षित माइक्रो-स्टोरेज और आवास नेटवर्क संचालित करते हैं।"
                  : "StashSaarthi Technologies ('we', 'us', or 'our') operates India's intergenerational micro-storage and co-living platform. We respect the personal data of all students, campus captains, senior hosts, and partners. This policy outlines how your data is collected, protected, and processed under India's Digital Personal Data Protection (DPDP) Act 2023."}
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li>
                  <strong className="text-white">Zero Resale Guarantee:</strong> We never monetize, sell, lease, or rent personal data to ad networks, lead aggregators, or third-party marketing companies.
                </li>
                <li>
                  <strong className="text-white">Data Minimization:</strong> We collect strictly the minimum operational parameters required to verify node security, issue StashPasses, and clear bank escrow payouts.
                </li>
                <li>
                  <strong className="text-white">User Sovereignty:</strong> You retain complete ownership over your identity, contact details, and stored records at all times.
                </li>
              </ul>
            </section>

            {/* 2. Information Collected */}
            <section id="collection" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan font-bold text-base">
                <FileText className="h-5 w-5" />
                <h2>2. Information We Collect</h2>
              </div>
              <p>To enable deterministic node custody and verified bookings, we collect the following categories of information:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-emerald-400 mb-1">A. Student Identity & Contact</h3>
                  <p className="text-muted-foreground">Name, mobile phone number, official college email, college ID/hostel registration for student discount verification, and destination campus locality.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-amber-400 mb-1">B. Senior Host & Node Details</h3>
                  <p className="text-muted-foreground">Host name, address in Kanpur/Lucknow, Aadhaar biometric verification proof, bank account details for weekly escrow payouts, and property safety photos.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-cyan-400 mb-1">C. Custody & Booking Logs</h3>
                  <p className="text-muted-foreground">Tamper-evident laser barcode numbers (#SS-KNP-XXXX), weight check records, item check-in photo proof, and UPI payment clearance reference IDs.</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <h3 className="font-bold text-purple-400 mb-1">D. Technical Telemetry</h3>
                  <p className="text-muted-foreground">Browser device user-agent, network error logs, and anonymized performance telemetry to optimize 60–120 FPS web application performance.</p>
                </div>
              </div>
            </section>

            {/* 3. Purpose of Processing */}
            <section id="purpose" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <CheckCircle className="h-5 w-5" />
                <h2>3. Purpose & Legal Basis of Processing</h2>
              </div>
              <p>Your personal data is processed strictly for the following operational objectives:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li>Issuing digital custody certificates (StashPass) with embedded ₹10,000 micro-insurance coverage.</li>
                <li>Executing 3-tier host background verification and legal leave-and-license agreements under Sec 105 Transfer of Property Act 1882.</li>
                <li>Processing 100% digital escrow payouts to verified hosts on weekly schedules.</li>
                <li>Sending essential transactional updates via SMS and WhatsApp (e.g., luggage arrival alerts, doorstep pickup confirmations).</li>
                <li>Preventing platform abuse, fraudulent room listings, or illegal item storage.</li>
              </ul>
            </section>

            {/* 4. Zero-Resale Guarantee */}
            <section id="sharing" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <h2>4. Zero Data Resale & Strict Non-Disclosure</h2>
              </div>
              <p className="text-emerald-100">
                {isHi
                  ? "हम कभी भी आपकी व्यक्तिगत जानकारी, फोन नंबर या ईमेल किसी तीसरे पक्ष, विज्ञापन नेटवर्क या टेलीमार्केटर्स को नहीं बेचते।"
                  : "StashSaarthi maintains an uncompromised zero-data-resale policy. We do not sell, trade, monetize, or disclose your personal data to any external advertising agencies, data brokers, or telemarketing firms under any circumstances."}
              </p>
              <p className="text-xs text-emerald-200/80">
                Data is shared strictly on a need-to-know basis with verified node keepers during active custody (e.g. host receiving student contact for doorstep pickup coordination) or when mandated by law enforcement under legal judicial warrants.
              </p>
            </section>

            {/* 5. Encryption & Security */}
            <section id="security" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan font-bold text-base">
                <Lock className="h-5 w-5" />
                <h2>5. Data Storage & Encryption Standards</h2>
              </div>
              <p>We employ military-grade technical & organizational safety standards:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
                <li><strong className="text-white">Encryption at Rest & Transit:</strong> All database tables and telemetry logs are encrypted using AES-256 at rest and TLS 1.3 in transit.</li>
                <li><strong className="text-white">Offline Resilience:</strong> Form submissions queue securely in encrypted browser IndexedDB storage during network drops and sync automatically upon reconnection.</li>
                <li><strong className="text-white">Row-Level Security (RLS):</strong> Supabase database schemas enforce strict Row-Level Security policies preventing unauthorized cross-tenant data access.</li>
              </ul>
            </section>

            {/* 6. Retention & Erasure */}
            <section id="retention" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <FileText className="h-5 w-5" />
                <h2>6. Data Retention & Right to Permanent Erasure</h2>
              </div>
              <p>
                We retain personal records only for as long as necessary to fulfill active custody bookings and comply with financial auditing regulations.
              </p>
              <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-2 text-xs">
                <p className="text-white font-semibold">Automatic 18-Month Purge SLA:</p>
                <p className="text-muted-foreground">
                  Inactive student account records, check-in photo logs, and expired waitlist entries are automatically purged from our primary database 18 months after your last transaction.
                </p>
                <p className="text-emerald-400 font-semibold pt-1">Request Immediate Manual Erasure:</p>
                <p className="text-muted-foreground">
                  You may request immediate permanent deletion of your profile, verification documents, and contact details at any time by emailing <a href="mailto:stashsaarthi@gmail.com" className="text-emerald-400 underline">stashsaarthi@gmail.com</a>. Requests are processed within 24 hours.
                </p>
              </div>
            </section>

            {/* 7. DPDP Act Rights */}
            <section id="dpdp" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-base">
                <ShieldCheck className="h-5 w-5" />
                <h2>7. Your Rights Under India's DPDP Act 2023</h2>
              </div>
              <p>Under the Digital Personal Data Protection Act 2023, Indian citizens have the following statutory rights:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                  <span className="font-bold text-white block">Right to Access Summary</span>
                  <span className="text-muted-foreground">Request a comprehensive copy of all personal data held in our systems.</span>
                </div>
                <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                  <span className="font-bold text-white block">Right to Correction</span>
                  <span className="text-muted-foreground">Update outdated mobile numbers, college affiliations, or host addresses.</span>
                </div>
                <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                  <span className="font-bold text-white block">Right to Erasure</span>
                  <span className="text-muted-foreground">Withdraw consent and mandate permanent removal of stored profile logs.</span>
                </div>
                <div className="rounded-lg border border-white/10 p-3 bg-black/20">
                  <span className="font-bold text-white block">Right to Nomination</span>
                  <span className="text-muted-foreground">Nominate an authorized representative in the event of medical incapacity.</span>
                </div>
              </div>
            </section>

            {/* 8. Nodal Grievance Officer */}
            <section id="nodal" className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <Mail className="h-5 w-5" />
                <h2>8. Nodal Grievance Officer & Contact Information</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                In compliance with Rule 3(11) of Information Technology Guidelines and DPDP Rules, for any privacy concerns, data erasure requests, or security grievances, please contact our designated Nodal Officer:
              </p>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Advik Omer</span>
                  <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-300">
                    Nodal Grievance Officer & Founder
                  </span>
                </div>
                <div className="space-y-1 text-slate-300 pt-1">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>StashSaarthi Hub: 117/K-Block, Kalyanpur, Kanpur, Uttar Pradesh — 208016, India</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Direct Email: <a href="mailto:stashsaarthi@gmail.com" className="text-emerald-400 underline">stashsaarthi@gmail.com</a></span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Founder Phone Line: <a href={`https://wa.me/${FOUNDER_WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">{FOUNDER_PHONE_DISPLAY}</a></span>
                  </p>
                </div>
                <p className="text-[11px] text-emerald-200/80 pt-2 border-t border-emerald-500/20">
                  ⚡ <strong>SLA Commitment:</strong> Official privacy grievances acknowledged within 4 hours; full resolution guaranteed within 24 hours.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* DPDP & GDPR Audit Modal */}
      <DataPrivacyAuditModal isOpen={isAuditModalOpen} onClose={() => setIsAuditModalOpen(false)} />
    </div>
  );
}
