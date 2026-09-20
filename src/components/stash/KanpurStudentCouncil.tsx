import React, { useState } from "react";
import {
  Users,
  ShieldCheck,
  Award,
  Vote,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  Phone,
  ArrowRight,
  BadgeCheck,
  Sparkles,
  HeartHandshake,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { checkAndRecordRateLimit } from "@/lib/rateLimiter";
import { playClick, playPop } from "@/lib/audio";

interface CouncilMember {
  id: string;
  name: string;
  campus: string;
  campusCode: "iitk" | "hbtu" | "csjmu" | "kakadeo" | "gsvm";
  role: string;
  roleHi: string;
  branchYear: string;
  issuesSolved: number;
  avatar: string;
  badge: string;
  quote: string;
  quoteHi: string;
}

interface StudentProposal {
  id: string;
  title: string;
  titleHi: string;
  category: "housing" | "storage" | "tiffin" | "safety";
  campus: string;
  submittedBy: string;
  upvotes: number;
  status: "enforced" | "under_review" | "active_debate";
  statusText: string;
  statusTextHi: string;
  councilResponse: string;
  councilResponseHi: string;
}

const COUNCIL_MEMBERS: CouncilMember[] = [
  {
    id: "rep-1",
    name: "Aman Sharma",
    campus: "IIT Kanpur (Hall 1)",
    campusCode: "iitk",
    role: "Council President & Logistics Lead",
    roleHi: "परिषद अध्यक्ष एवं लॉजिस्टिक्स प्रमुख",
    branchYear: "B.Tech CSE '26",
    issuesSolved: 14,
    avatar: "AS",
    badge: "Verified Student Leader",
    quote: "Ensuring zero dead-rent loss for IITK students during summer breaks through verified micro-storage.",
    quoteHi: "समर ब्रेक के दौरान सत्यापित माइक्रो-स्टोरेज के माध्यम से IITK छात्रों के लिए शून्य डेड-रेंट नुकसान सुनिश्चित करना।",
  },
  {
    id: "rep-2",
    name: "Ritika Mishra",
    campus: "HBTI Kanpur (West Campus)",
    campusCode: "hbtu",
    role: "Zero-Brokerage Housing Chair",
    roleHi: "जीरो-ब्रोकरेज आवास अध्यक्ष",
    branchYear: "B.Tech Chemical '25",
    issuesSolved: 11,
    avatar: "RM",
    badge: "Verified PG Owner Host Liaison",
    quote: "Connecting HBTI students directly with verified premium hosts in Swaroop Nagar without broker extortion.",
    quoteHi: "बिना दलालों के शोषण के स्वरूप नगर में एचबीटीआई छात्रों को सीधे सत्यापित वरिष्ठ मेज़बानों से जोड़ना।",
  },
  {
    id: "rep-3",
    name: "Priyansh Pandey",
    campus: "PW Vidyapeeth Kakadeo Hub",
    campusCode: "kakadeo",
    role: "Coaching Belt Student Advocate",
    roleHi: "कोचिंग बेल्ट छात्र प्रतिनिधि",
    branchYear: "JEE Dropper '26",
    issuesSolved: 19,
    avatar: "PP",
    badge: "Kakadeo Ground Lead",
    quote: "Eliminating illegal PG security deposit forfeitures and ensuring transparent room rental terms.",
    quoteHi: "अवैध पीजी सुरक्षा जमा जब्ती को समाप्त करना और पारदर्शी कमरा किराए की शर्तें सुनिश्चित करना।",
  },
  {
    id: "rep-4",
    name: "Shivani Verma",
    campus: "CSJMU Kalyanpur",
    campusCode: "csjmu",
    role: "Mess Hygiene & Nutrition Inspector",
    roleHi: "मेस स्वच्छता एवं पोषण निरीक्षक",
    branchYear: "M.Sc Biotech '25",
    issuesSolved: 9,
    avatar: "SV",
    badge: "Ghar Ka Swaad Lead",
    quote: "Strict quality audits for ₹50 daily tiffins so outstation hostelers get hygienic home-cooked meals.",
    quoteHi: "₹50 दैनिक टिफिन के लिए सख्त गुणवत्ता ऑडिट ताकि बाहरी छात्रों को स्वच्छ घरेलू भोजन मिले।",
  },
  {
    id: "rep-5",
    name: "Dr. Utkarsh Singh",
    campus: "GSVM Medical College",
    campusCode: "gsvm",
    role: "Campus Safety & Emergency Ombudsman",
    roleHi: "कैंपस सुरक्षा एवं आपातकालीन लोकपाल",
    branchYear: "MBBS Intern '25",
    issuesSolved: 8,
    avatar: "US",
    badge: "Emergency Response",
    quote: "Coordinating 24/7 safe student transit routes between Swaroop Nagar, Medical Gate, and Kakadeo.",
    quoteHi: "स्वरूप नगर, मेडिकल गेट और काकादेव के बीच 24/7 सुरक्षित छात्र पारगमन मार्गों का समन्वय करना।",
  },
  {
    id: "rep-6",
    name: "Devendra Shukla",
    campus: "Allen Career Institute Kakadeo",
    campusCode: "kakadeo",
    role: "Student Storage Delegate",
    roleHi: "छात्र भण्डारण प्रतिनिधि",
    branchYear: "NEET Aspirant '26",
    issuesSolved: 12,
    avatar: "DS",
    badge: "Storage Safety Audit",
    quote: "Guaranteeing laser tamper barcode seals and moisture-proof packaging for student luggage.",
    quoteHi: "छात्रों के सामान के लिए लेजर छेड़छाड़ बारकोड सील और नमी-रोधी पैकेजिंग की गारंटी।",
  },
];

const INITIAL_PROPOSALS: StudentProposal[] = [
  {
    id: "prop-1",
    title: "Enforce Standardized 0-Deposit Terms for Kakadeo PG Admissions",
    titleHi: "काकादेव पीजी प्रवेश के लिए मानकीकृत 0-जमा शर्तों को लागू करें",
    category: "housing",
    campus: "Kakadeo Coaching Belt",
    submittedBy: "Priyansh Pandey (PW Vidyapeeth)",
    upvotes: 142,
    status: "enforced",
    statusText: "StashSaarthi Policy Enforced",
    statusTextHi: "स्टैशसारथी नीति लागू",
    councilResponse: "All Saarthi Spaces listed in Kakadeo now operate on strict 0-brokerage and zero non-refundable deposit terms.",
    councilResponseHi: "काकादेव में सूचीबद्ध सभी सारथी स्पेस अब सख्त 0-ब्रोकरेज और शून्य गैर-वापसी योग्य जमा शर्तों पर संचालित होते हैं।",
  },
  {
    id: "prop-2",
    title: "Mandatory FSSAI & RO Water Certification for All ₹50 Tiffin Providers",
    titleHi: "सभी ₹50 टिफिन प्रदाताओं के लिए अनिवार्य FSSAI एवं RO जल प्रमाणन",
    category: "tiffin",
    campus: "CSJMU & HBTI Belt",
    submittedBy: "Shivani Verma (CSJMU)",
    upvotes: 118,
    status: "enforced",
    statusText: "StashSaarthi Policy Enforced",
    statusTextHi: "स्टैशसारथी नीति लागू",
    councilResponse: "Verified verified PG owner home kitchens in Saarthi Kitchen hub now feature mandatory RO filtration audit Badges.",
    councilResponseHi: "सारथी किचन हब में सत्यापित वरिष्ठ होम रसोई में अब अनिवार्य आरओ निस्पंदन ऑडिट बैज शामिल हैं।",
  },
  {
    id: "prop-3",
    title: "Shared Night Auto Shuttle Service for Female Coaching Students in Kakadeo",
    titleHi: "काकादेव में महिला कोचिंग छात्राओं के लिए साझा नाइट ऑटो शटल सेवा",
    category: "safety",
    campus: "Kakadeo PW/Allen Gate",
    submittedBy: "Ananya Saxena (Allen Kakadeo)",
    upvotes: 95,
    status: "under_review",
    statusText: "Under Council Review",
    statusTextHi: "परिषद समीक्षा के अधीन",
    councilResponse: "Council is partnering with local auto associations & premium hosts to launch verified night route pick-ups.",
    councilResponseHi: "परिषद सत्यापित नाइट रूट पिक-अप शुरू करने के लिए स्थानीय ऑटो संघों और वरिष्ठ मेज़बानों के साथ साझेदारी कर रही है।",
  },
  {
    id: "prop-4",
    title: "Summer Vacation Luggage Free Pick-up from IITK & CSJMU Hostels",
    titleHi: "IITK और CSJMU हॉस्टल से ग्रीष्मकालीन अवकाश के सामान की मुफ्त पिक-अप",
    category: "storage",
    campus: "IIT Kanpur & CSJMU",
    submittedBy: "Aman Sharma (IIT Kanpur)",
    upvotes: 164,
    status: "enforced",
    statusText: "StashSaarthi Policy Enforced",
    statusTextHi: "स्टैशसारथी नीति लागू",
    councilResponse: "StashSaarthi platform introduced campus-gate direct doorstep pick-up for all ₹300/bag/mo stashes.",
    councilResponseHi: "स्टैशसारथी प्लेटफॉर्म ने सभी ₹300/बैग/माह स्टैश के लिए कैंपस-गेट डायरेक्ट डोरस्टेप पिक-अप पेश किया।",
  },
];

export function KanpurStudentCouncil() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeCampus, setActiveCampus] = useState<string>("all");
  const [proposals, setProposals] = useState<StudentProposal[]>(INITIAL_PROPOSALS);
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"apply" | "proposal">("proposal");
  const [fullName, setFullName] = useState("");
  const [campusName, setCampusName] = useState("IIT Kanpur");
  const [phone, setPhone] = useState("");
  const [detailText, setDetailText] = useState("");

  const handleUpvote = (id: string) => {
    playPop();
    setUpvotedIds((prev) => {
      const already = prev[id];
      const nextState = !already;
      setProposals((curr) =>
        curr.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + (nextState ? 1 : -1) } : p))
      );
      if (nextState) {
        toast.success(isHi ? "प्रस्ताव को वोट दिया गया!" : "Upvote recorded!");
      }
      return { ...prev, [id]: nextState };
    });
  };

  const handleOpenModal = (type: "apply" | "proposal") => {
    playClick();
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    // Check Rate Limiting
    const limitCheck = checkAndRecordRateLimit("student_council_submit", {
      minIntervalMs: 5000,
      maxSubmissions: 3,
      windowMs: 30000,
    });
    if (!limitCheck.allowed) {
      toast.error(limitCheck.message);
      return;
    }

    if (!fullName.trim() || !phone.trim() || !detailText.trim()) {
      toast.error(isHi ? "कृपया सभी आवश्यक फ़ील्ड भरें।" : "Please complete all required fields.");
      return;
    }

    playPop();

    if (modalType === "proposal") {
      const newProp: StudentProposal = {
        id: `prop-${Date.now()}`,
        title: detailText.slice(0, 80),
        titleHi: detailText.slice(0, 80),
        category: "housing",
        campus: campusName,
        submittedBy: `${fullName} (${campusName})`,
        upvotes: 1,
        status: "under_review",
        statusText: "Under Council Review",
        statusTextHi: "परिषद समीक्षा के अधीन",
        councilResponse: "Your proposal has been logged and assigned to the campus student delegate.",
        councilResponseHi: "आपका प्रस्ताव दर्ज कर लिया गया है और परिसर छात्र प्रतिनिधि को सौंपा गया है।",
      };
      setProposals([newProp, ...proposals]);
      toast.success(
        isHi
          ? "आपका प्रस्ताव कानपुर छात्र परिषद में प्रस्तुत किया गया!"
          : "Your proposal was submitted to the Kanpur Student Council!"
      );
    } else {
      toast.success(
        isHi
          ? "आपकी परिषद प्रतिनिधि आवेदन जमा हो गई! संस्था अध्यक्ष आपसे जल्द संपर्क करेंगे।"
          : "Council seat application submitted! Campus chairs will contact you shortly."
      );
    }

    setModalOpen(false);
    setFullName("");
    setPhone("");
    setDetailText("");
  };

  const filteredMembers =
    activeCampus === "all"
      ? COUNCIL_MEMBERS
      : COUNCIL_MEMBERS.filter((m) => m.campusCode === activeCampus);

  return (
    <section id="student-council" className="relative py-20 bg-background text-foreground overflow-hidden">
      {/* Background Neon Accent Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? "आधिकारिक छात्र मंच" : "Official Student Governance Hub"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-heading">
            {isHi ? (
              <>
                कानपुर <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">छात्र परिषद</span>
              </>
            ) : (
              <>
                Kanpur <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Student Council</span>
              </>
            )}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            {isHi
              ? "IIT Kanpur, HBTI, CSJMU, काकादेव कोचिंग हब एवं GSVM के छात्र नेताओं द्वारा संचालित निष्पक्ष मंच। हम कमरा दलाली, मृत-किराया शोषण, और घटिया मेस भोजन के खिलाफ एक साथ खड़े हैं।"
              : "An autonomous, student-led council representing IIT Kanpur, HBTI, CSJMU, Kakadeo PW/Allen hubs, & GSVM. Eliminating dead-rent exploitation, broker fees, and poor mess hygiene."}
          </p>

          {/* Key Metrics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-card/60 border border-border/60 backdrop-blur-md rounded-2xl p-4 shadow-xl">
            <div className="text-center p-2">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">12</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isHi ? "कैंपस प्रतिनिधि" : "Campus Reps"}</p>
            </div>
            <div className="text-center p-2 border-l border-border/40">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">84+</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isHi ? "छात्र प्रस्ताव दर्ज" : "Proposals Logged"}</p>
            </div>
            <div className="text-center p-2 border-l border-border/40">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">38</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isHi ? "नीति समाधान लागू" : "Policies Enforced"}</p>
            </div>
            <div className="text-center p-2 border-l border-border/40">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">₹6,400</p>
              <p className="text-xs text-muted-foreground mt-0.5">{isHi ? "औसत बचत/छात्र" : "Avg Dead-Rent Saved"}</p>
            </div>
          </div>
        </div>

        {/* Section 1: Campus Council Representatives */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 font-heading">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>{isHi ? "परिषद छात्र प्रतिनिधि" : "Council Student Representatives"}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isHi
                  ? "आपके विश्वविद्यालय एवं कोचिंग हब में समर्पित छात्र प्रतिनिधि।"
                  : "Verified student representatives across Kanpur's premier institutes."}
              </p>
            </div>

            {/* Campus Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: isHi ? "सभी संस्थान" : "All Institutes" },
                { id: "iitk", label: "IIT Kanpur" },
                { id: "hbtu", label: "HBTI Kanpur" },
                { id: "csjmu", label: "CSJMU" },
                { id: "kakadeo", label: "Kakadeo Hub" },
                { id: "gsvm", label: "GSVM Medical" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick();
                    setActiveCampus(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCampus === tab.id
                      ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-card/80 border border-border/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
                        {member.avatar}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground flex items-center gap-1.5 font-heading">
                          {member.name}
                          <BadgeCheck className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                        </h4>
                        <p className="text-xs text-emerald-400 font-semibold">{member.campus}</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {member.badge}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-cyan-400 mb-2">
                    {isHi ? member.roleHi : member.role} • <span className="text-muted-foreground">{member.branchYear}</span>
                  </p>

                  <blockquote className="text-xs text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-border/40 mb-4">
                    "{isHi ? member.quoteHi : member.quote}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{member.issuesSolved} {isHi ? "मुद्दे हल किए" : "Issues Solved"}</span>
                  </span>

                  <button
                    onClick={() => handleOpenModal("apply")}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>{isHi ? "परिषद से जुड़ें" : "Nominate / Connect"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Active Student Issue & Proposal Forum */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 font-heading">
                <Vote className="w-6 h-6 text-cyan-400" />
                <span>{isHi ? "छात्र प्रस्ताव एवं समस्या निवारण मंच" : "Student Issue & Proposal Forum"}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {isHi
                  ? "छात्रों द्वारा उठाए गए वास्तविक मुद्दे। वोट दें और बदलाव लाएं।"
                  : "Upvote active student issues to push for official StashSaarthi council policy enforcement."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleOpenModal("proposal")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 transition-all shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isHi ? "+ नया प्रस्ताव सबमिट करें" : "+ Submit New Proposal"}</span>
              </button>
            </div>
          </div>

          {/* Proposals List */}
          <div className="space-y-4">
            {proposals.map((prop) => {
              const isUpvoted = !!upvotedIds[prop.id];

              return (
                <div
                  key={prop.id}
                  className="bg-card/70 border border-border/80 rounded-2xl p-6 backdrop-blur-sm transition-all hover:border-border"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            prop.status === "enforced"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {isHi ? prop.statusTextHi : prop.statusText}
                        </span>
                        <span className="text-xs text-muted-foreground">📍 {prop.campus}</span>
                      </div>

                      <h4 className="text-base sm:text-lg font-bold text-foreground font-heading">
                        {isHi ? prop.titleHi : prop.title}
                      </h4>

                      <p className="text-xs text-muted-foreground mt-1">
                        {isHi ? "प्रस्तावित द्वारा:" : "Submitted by:"} <span className="text-foreground font-semibold">{prop.submittedBy}</span>
                      </p>

                      <div className="mt-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
                        <span className="font-bold text-emerald-400 block mb-0.5">
                          💬 {isHi ? "परिषद कार्रवाई की स्थिति:" : "Council Resolution Note:"}
                        </span>
                        <p className="text-muted-foreground">{isHi ? prop.councilResponseHi : prop.councilResponse}</p>
                      </div>
                    </div>

                    {/* Upvote Button */}
                    <div className="flex md:flex-col items-center justify-center gap-1 bg-muted/40 p-3 rounded-xl border border-border/50 min-w-[90px]">
                      <button
                        onClick={() => handleUpvote(prop.id)}
                        className={`p-2 rounded-lg transition-all ${
                          isUpvoted
                            ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-105"
                            : "bg-card text-muted-foreground hover:text-emerald-400 hover:bg-muted"
                        }`}
                        title={isHi ? "वोट दें" : "Upvote"}
                      >
                        <Vote className="w-5 h-5" />
                      </button>
                      <span className="text-xs font-black text-foreground mt-1">{prop.upvotes} Votes</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: WhatsApp Community Banner */}
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase mb-3">
                <HeartHandshake className="w-4 h-4" />
                <span>{isHi ? "आधिकारिक व्हाट्सएप कम्युनिटी" : "Official WhatsApp Community"}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
                {isHi ? "कानपुर छात्र परिषद व्हाट्सएप ग्रुप में शामिल हों" : "Join the Kanpur Student Council Community"}
              </h3>

              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                {isHi
                  ? "मासिक ओपन-माइक टाउनहॉल, प्रत्यक्ष संस्थापक सलाह (Advik Omer), और नए कमरा/टिफिन लिस्टिंग की प्राथमिकता सूचनाएं प्राप्त करें।"
                  : "Connect directly with campus chairs, participate in monthly open-mic townhalls, and get priority room & storage alerts."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="https://wa.me/919369454350?text=Hi%20StashSaarthi!%20I%20want%20to%20join%20the%20Kanpur%20Student%20Council%20WhatsApp%20Group."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/30"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>{isHi ? "व्हाट्सएप ग्रुप ज्वाइन करें" : "Join WhatsApp Group"}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => handleOpenModal("apply")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-foreground font-bold text-sm border border-slate-700 transition-all"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? "परिषद लीडर बनें" : "Apply for Seat"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal & Lead Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-border/40 pb-3">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2 font-heading">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>
                  {modalType === "proposal"
                    ? isHi
                      ? "नया छात्र प्रस्ताव सबमिट करें"
                      : "Submit Campus Proposal / Issue"
                    : isHi
                    ? "कानपुर छात्र परिषद प्रतिनिधि आवेदन"
                    : "Apply for Kanpur Student Council Seat"}
                </span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {isHi ? "पूरा नाम" : "Full Name"} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isHi ? "संस्थान / कॉलेज" : "Institute / College"} *
                  </label>
                  <select
                    value={campusName}
                    onChange={(e) => setCampusName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IIT Kanpur">IIT Kanpur</option>
                    <option value="HBTI Kanpur">HBTI / HBTU Kanpur</option>
                    <option value="CSJMU Kalyanpur">CSJMU Kalyanpur</option>
                    <option value="PW Vidyapeeth Kakadeo">PW Vidyapeeth Kakadeo</option>
                    <option value="Allen Career Institute">Allen Kakadeo</option>
                    <option value="Motion Coaching">Motion Kakadeo</option>
                    <option value="GSVM Medical College">GSVM Medical College</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    {isHi ? "व्हाट्सएप नंबर" : "WhatsApp Number"} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9369454350"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  {modalType === "proposal"
                    ? isHi
                      ? "प्रस्ताव या समस्या विवरण"
                      : "Proposal or Issue Details"
                    : isHi
                    ? "आप परिषद में क्या योगदान देना चाहते हैं?"
                    : "Why do you want to join the Council?"} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={
                    modalType === "proposal"
                      ? isHi
                        ? "समस्या का स्पष्ट विवरण लिखें..."
                        : "Describe the issue or proposal for StashSaarthi council action..."
                      : isHi
                      ? "अपनी रुचि और छात्र मुद्दों के बारे में बताएं..."
                      : "Tell us about your campus role and key student issues you want to address..."
                  }
                  value={detailText}
                  onChange={(e) => setDetailText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border text-foreground text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-muted-foreground font-semibold text-xs hover:text-foreground"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
                >
                  {isHi ? "सबमिट करें" : "Submit Proposal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
