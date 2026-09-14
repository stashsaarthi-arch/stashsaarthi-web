import { useState, useMemo, memo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, Sparkles, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { FOUNDER_PHONE_DISPLAY, getWhatsAppUrl } from "@/lib/constants";
import {
  FAQ_ACCORDION_TOKENS,
  getFaqAccordionTokens,
  getFaqAccordionItemClasses,
} from "@/lib/designTokens";
import { playPop, playClick } from "@/lib/audio";

export interface FAQItem {
  category: "transparency" | "storage" | "safety" | "host";
  question: string;
  question_hi?: string;
  answer: string;
  answer_hi?: string;
  badgeTagEn?: string;
  badgeTagHi?: string;
}

export interface FaqAccordion2Props {
  items?: FAQItem[];
  defaultCategory?: string;
  role?: "student" | "host";
  showSearch?: boolean;
  showCategoryFilters?: boolean;
  className?: string;
}

export const DEFAULT_FAQ_ITEMS: FAQItem[] = [
  // ── Radical Transparency / Real Concerns ──
  {
    category: "transparency",
    question: "Is StashSaarthi an early-stage venture? How reliable is my storage if you are new?",
    question_hi:
      "क्या StashSaarthi एक शुरुआती उद्यम है? यदि आप नए हैं, तो मेरा स्टोरेज कितना विश्वसनीय है?",
    answer:
      "Yes, we are proudly transparent about being a specialized hyper-local living network. We currently operate verified pilot nodes across Kanpur's academic corridor (IITK, CSJMU, HBTU, GSVM, Kakadeo). To ensure 100% operational reliability, our founder personally oversees on-site inspections, all payments sit in escrow bank accounts, and every luggage item is physically laser-sealed and insured up to ₹10,000.",
    answer_hi:
      "हां, हम पूरी ईमानदारी से स्वीकार करते हैं कि हम एक हाइपर-लोकल नेटवर्क हैं जो कानपुर के प्रमुख कैंपस कॉरिडोर में संचालित है। विश्वसनीयता सुनिश्चित करने के लिए हमारे संस्थापक व्यक्तिगत रूप से ऑन-साइट निरीक्षण करते हैं, सभी भुगतान बैंक एस्क्रो में सुरक्षित रहते हैं और प्रत्येक बैग पर लेजर सील व ₹10,000 का बीमा लागू रहता है।",
    badgeTagEn: "100% Verified Pilot",
    badgeTagHi: "100% सत्यापित पायलट",
  },
  {
    category: "transparency",
    question: "Do you sell or share my phone number, Aadhaar, or student ID with third parties?",
    question_hi:
      "क्या आप मेरा फोन नंबर, आधार या कॉलेज आईडी किसी तीसरे पक्ष को बेचते या साझा करते हैं?",
    answer:
      "Never. We enforce an absolute Zero Data Resale policy. We do not integrate third-party ad trackers or telemarketing data pools. Your documents and phone number are encrypted and used solely for node custody clearance and emergency escalation.",
    answer_hi:
      "बिल्कुल नहीं। हम शून्य डेटा बिक्री नीति का कड़ाई से पालन करते हैं। हम विज्ञापन ट्रैकर्स का उपयोग नहीं करते। आपके दस्तावेज और फोन नंबर केवल नोड कस्टडी सत्यापन और आपातकालीन संपर्क के लिए सुरक्षित रखे जाते हैं।",
    badgeTagEn: "Zero Data Resale",
    badgeTagHi: "शून्य डेटा बिक्री",
  },
  {
    category: "transparency",
    question: "What happens if a senior host cancels or locks me out during vacations?",
    question_hi:
      "क्या होगा यदि कोई सीनियर होस्ट छुट्टियों के दौरान अचानक मना कर दे या ताला लगा दे?",
    answer:
      "We operate a strict 24-Hour Relocation SLA. In the rare event of a host issue, our on-ground Kanpur operations team immediately dispatches a concierge to transfer stored luggage or relocate student stays to a pre-verified backup node in the same neighborhood at zero extra cost.",
    answer_hi:
      "हम 24-घंटे रीलोकेशन गारंटी (SLA) पर काम करते हैं। किसी भी दुर्लभ समस्या की स्थिति में हमारी कानपुर ऑन-ग्राउंड टीम तुरंत उसी इलाके में पूर्व-सत्यापित वैकल्पिक नोड पर सुरक्षित शिफ्टिंग सुनिश्चित करती है, बिना किसी अतिरिक्त खर्च के।",
    badgeTagEn: "24-Hr Relocation SLA",
    badgeTagHi: "24-घंटे रीलोकेशन SLA",
  },
  {
    category: "transparency",
    question: "How do you make money if you charge zero brokerage on student rooms?",
    question_hi: "यदि आप कमरों पर शून्य ब्रोकरेज लेते हैं तो StashSaarthi कमाई कैसे करता है?",
    answer:
      "We believe in 100% transparent unit economics. We earn through a 26.7% operational fee on luggage storage (₹80 per ₹300 bag/mo) and a modest 10% student platform fee on co-living bookings (~₹500/mo). We never charge predatory 1-month broker fees or hidden checkout convenience surcharges.",
    answer_hi:
      "हम 100% पारदर्शी अर्थशास्त्र में विश्वास करते हैं। हमारी आय लगेज स्टोरेज पर 26.7% ऑपरेशनल मार्जिन (₹80 प्रति ₹300 बैग) और रूम बुकिंग पर केवल 10% प्लेटफॉर्म फीस (~₹500/माह) से होती है। हम 1 महीने की भारी ब्रोकरेज या छिपे हुए शुल्क कभी नहीं लेते।",
    badgeTagEn: "Zero Brokerage Math",
    badgeTagHi: "शून्य ब्रोकरेज गणित",
  },
  {
    category: "transparency",
    question: "Can I talk directly to a human team member before booking anything?",
    question_hi: "क्या मैं बुकिंग से पहले किसी वास्तविक टीम सदस्य से सीधे बात कर सकता/सकती हूं?",
    answer: `Yes! You never get trapped in automated chatbots. You can reach our founder and operations team directly on WhatsApp or phone (${FOUNDER_PHONE_DISPLAY}) with a guaranteed 15-minute response SLA during active campus hours (8 AM – 10 PM IST).`,
    answer_hi: `जी हां! आप बिना किसी बॉट के सीधे हमारे संस्थापक और ऑपरेशंस टीम से व्हाट्सएप या फोन (${FOUNDER_PHONE_DISPLAY}) पर बात कर सकते हैं। सुबह 8 बजे से रात 10 बजे के बीच 15 मिनट के भीतर उत्तर देने की गारंटी है।`,
    badgeTagEn: "Direct Founder Access",
    badgeTagHi: "सीधा संस्थापक संपर्क",
  },
  // ── Storage FAQs ──
  {
    category: "storage",
    question: "Can I retrieve my bags early if my plans change?",
    question_hi: "यदि मेरा प्लान बदल जाए, तो क्या मैं अपना सामान समय से पहले ले सकता/सकती हूं?",
    answer:
      "Absolutely. With Saarthi Stash, early retrieval is supported with 48 hours notice. Your designated Concierge will arrange a seamless handover directly from the node without any hidden exit penalties.",
    answer_hi:
      "बिल्कुल। सार्थी स्टैश के साथ 48 घंटे पहले सूचना देकर कभी भी सामान वापस लिया जा सकता है। हमारे कंसीयज बिना किसी अतिरिक्त शुल्क के सुरक्षित हैंडओवर की व्यवस्था करेंगे।",
    badgeTagEn: "Flex Retrieval",
    badgeTagHi: "लचीली वापसी",
  },
  {
    category: "storage",
    question: "What items are prohibited from vacation micro-storage?",
    question_hi: "वेकेशन स्टोरेज में किन वस्तुओं को रखने की मनाही है?",
    answer:
      "Perishable foods, open liquids, unsealed cosmetics, weapons, inflammable liquids, cash, and contraband are strictly prohibited. Every bag is scanned and laser-sealed in your presence at pickup.",
    answer_hi:
      "खराब होने वाला खाना, खुली तरल वस्तुएं, हथियार, नकदी, सोना, ज्वलनशील पदार्थ और गैर-कानूनी वस्तुएं सख्त वर्जित हैं। पिकअप पर आपके सामने हर बैग की लेजर-सीलिंग की जाती है।",
    badgeTagEn: "Prohibited Items List",
    badgeTagHi: "वर्जित वस्तु सूची",
  },
  {
    category: "storage",
    question: "Where are StashNodes located in Kanpur?",
    question_hi: "कानपुर में स्टैश नोड्स कहां-कहां स्थित हैं?",
    answer:
      "StashNodes are situated within 300m to 1.2km of IIT Kanpur (Nankari), CSJMU (Kalyanpur), HBTI (Nawabganj), and GSVM Medical College (Swaroop Nagar) gates, hosted inside verified elder homes with CCTV and dedicated dry storage rooms.",
    answer_hi:
      "स्टैश नोड्स आईआईटी कानपुर (नानकारी), सीएसजेएमयू (कल्याणपुर), एचबीटीआई (नवाबगंज), और जीएसवीएम मेडिकल कॉलेज (स्वरूप नगर) के गेट से 300मी से 1.2किमी के दायरे में स्थित हैं।",
    badgeTagEn: "< 1.2km Campus Hubs",
    badgeTagHi: "< 1.2किमी कैंपस नोड्स",
  },
  // ── Safety & Claims ──
  {
    category: "safety",
    question: "How do you protect luggage from dampness and monsoons?",
    question_hi: "आप बारिश और सीलन से सामान को कैसे सुरक्षित रखते हैं?",
    answer:
      "Every luggage item is stored on raised wooden/polymer pallets (minimum 2.5 ft elevation) in dry, well-ventilated rooms. Our verified Host Nodes undergo moisture audits to ensure 100% monsoon protection.",
    answer_hi:
      "हर सामान को जमीन से कम से कम 2.5 फीट ऊंचे लकड़ी के पैलेट्स पर सूखे कमरों में रखा जाता है। हमारे सभी होस्ट नोड्स में सीलन व नमी की ऑन-साइट जांच की जाती है।",
    badgeTagEn: "Monsoon Moisture Guard",
    badgeTagHi: "सीलन व बारिश सुरक्षा",
  },
  {
    category: "safety",
    question: "How is the ₹10,000 micro-insurance claim settled without deductibles?",
    question_hi: "₹10,000 का माइक्रो-बीमा क्लेम बिना कटौती के कैसे निपटाया जाता है?",
    answer:
      "Because every bag receives a laser-engraved serialized tamper barcode and timestamped dual-photo log at pickup, any verifiable damage upon return is verified instantly against pickup photos. Compensation up to ₹10,000 is transferred directly to your bank account within 48 hours.",
    answer_hi:
      "क्योंकि पिकअप पर प्रत्येक बैग पर लेजर बारकोड सील और दोहरी फोटो लॉग बनती है, वापसी पर किसी भी क्षति का मिलान तत्काल होता है। ₹10,000 तक का क्लेम 48 घंटे में सीधे आपके बैंक खाते में ट्रांसफर किया जाता है।",
    badgeTagEn: "₹10k Instant Cover",
    badgeTagHi: "₹10,000 तत्काल बीमा",
  },
  // ── Senior Host Norms ──
  {
    category: "host",
    question: "What are the emergency access protocols for senior hosts?",
    question_hi: "सीनियर होस्ट्स के लिए आपातकालीन सहायता प्रोटोकॉल क्या है?",
    answer:
      "Senior Hosts have a direct 24x7 SOS line to our Kanpur operations crew. If any medical or maintenance emergency arises, our rapid response fleet steps in instantly to assist the host.",
    answer_hi:
      "वरिष्ठ नागरिकों को हमारी ऑपरेशंस टीम से जुड़ी 24×7 डायरेक्ट एसओएस लाइन मिलती है। किसी भी आपात स्थिति में हमारी त्वरित प्रतिक्रिया टीम तुरंत सहायता हेतु पहुंचती है।",
    badgeTagEn: "24×7 Host SOS Fleet",
    badgeTagHi: "24×7 होस्ट एसओएस रिस्पॉन्स",
  },
  {
    category: "host",
    question: "How does passive income escrow payout work for senior hosts?",
    question_hi: "सीनियर होस्ट्स को मासिक कमाई का भुगतान कैसे प्राप्त होता है?",
    answer:
      "Zero direct cash transactions. All student payments are locked in digital escrow and disbursed directly to the senior host's verified bank account on a structured weekly/monthly schedule automatically.",
    answer_hi:
      "शून्य नकद लेन-देन। सभी छात्रों का भुगतान डिजिटल एस्क्रो में सुरक्षित रहता है और निर्धारित समय पर सीधे सीनियर होस्ट के बैंक खाते में ट्रांसफर कर दिया जाता है।",
    badgeTagEn: "Direct Bank Escrow",
    badgeTagHi: "डायरेक्ट बैंक एस्क्रो",
  },
];

export const FaqAccordion2 = memo(function FaqAccordion2({
  items = DEFAULT_FAQ_ITEMS,
  defaultCategory = "transparency",
  role: roleProp,
  showSearch = true,
  showCategoryFilters = true,
  className = "",
}: FaqAccordion2Props) {
  const { language } = useLanguage();
  const { role: contextRole } = usePersona();
  const activeRole = roleProp || contextRole || "student";
  const isHost = activeRole === "host";
  const isHi = language === "hi";

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory);
  const [openItem, setOpenItem] = useState<string>("item-0");

  const tokens = useMemo(() => getFaqAccordionTokens(activeRole), [activeRole]);

  const categories = useMemo(() => {
    return FAQ_ACCORDION_TOKENS.categories.map((cat) => ({
      ...cat,
      label: isHi ? cat.labelHi : cat.labelEn,
    }));
  }, [isHi]);

  const filteredFaqs = useMemo(() => {
    return items.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const q = isHi && faq.question_hi ? faq.question_hi : faq.question;
      const a = isHi && faq.answer_hi ? faq.answer_hi : faq.answer;
      const matchesSearch =
        search.trim() === "" ||
        q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, search, activeCategory, isHi]);

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return items.length;
    return items.filter((f) => f.category === catId).length;
  };

  const handleCategoryChange = (catId: string) => {
    playPop();
    setActiveCategory(catId);
  };

  const handleAccordionValueChange = (val: string) => {
    playClick();
    setOpenItem(val || "");
  };

  const whatsappLink = getWhatsAppUrl(
    isHi
      ? "नमस्कार StashSaarthi टीम, मेरे पास एक प्रश्न है:"
      : "Hi StashSaarthi Team, I have a question about:"
  );

  return (
    <div className={`faq-accordion-2-wrapper w-full ${className}`}>
      {/* Search Input & Category Filters */}
      {(showSearch || showCategoryFilters) && (
        <div className="mb-4 space-y-3">
          {showSearch && (
            <div className="relative">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${isHost ? 'text-amber-400' : 'text-emerald-400'}`} />
              <Input
                type="text"
                placeholder={
                  isHi
                    ? "कोई भी प्रश्न खोजें (उदा. डेटा सुरक्षा, क्लेम, नोड्स, एस्क्रो)..."
                    : "Search any question (e.g. data safety, claims, reliability, escrow)..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`pl-9 pr-4 py-2.5 h-10 rounded-xl border-white/15 bg-black/50 backdrop-blur-md text-xs sm:text-sm text-foreground transition-all ${
                  isHost
                    ? "focus-visible:ring-amber-500/60 focus-visible:border-amber-500/60"
                    : "focus-visible:ring-emerald-500/60 focus-visible:border-emerald-500/60"
                }`}
              />
            </div>
          )}

          {showCategoryFilters && (
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isActive = activeCategory === cat.id;
                const activeStyle = isActive
                  ? isHost
                    ? FAQ_ACCORDION_TOKENS.activeOutlines.host.pillActiveClass
                    : FAQ_ACCORDION_TOKENS.activeOutlines.student.pillActiveClass
                  : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white";

                const activeBadgeStyle = isActive
                  ? isHost
                    ? FAQ_ACCORDION_TOKENS.activeOutlines.host.pillBadgeActiveClass
                    : FAQ_ACCORDION_TOKENS.activeOutlines.student.pillBadgeActiveClass
                  : "bg-white/10 text-slate-400";

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`accordion-category-pill inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${activeStyle}`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${activeBadgeStyle}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Accordion List Stage */}
      <div className="glass rounded-2xl border border-white/10 p-3 sm:p-5 backdrop-blur-xl">
        {filteredFaqs.length > 0 ? (
          <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={handleAccordionValueChange}
            className="w-full space-y-2.5"
          >
            {filteredFaqs.map((faq, index) => {
              const itemValue = `item-${index}`;
              const isOpen = openItem === itemValue;
              const itemClasses = getFaqAccordionItemClasses(isOpen, activeRole);
              const badgeTag = isHi ? faq.badgeTagHi : faq.badgeTagEn;

              return (
                <AccordionItem
                  key={index}
                  value={itemValue}
                  className={itemClasses}
                >
                  <AccordionTrigger className="px-4 py-3.5 sm:px-5 hover:no-underline text-left">
                    <div className="flex items-center gap-2.5 pr-2">
                      {badgeTag && (
                        <Badge
                          variant="outline"
                          className={`hidden sm:inline-flex shrink-0 text-[10px] font-mono font-semibold ${
                            isHost
                              ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          }`}
                        >
                          {badgeTag}
                        </Badge>
                      )}
                      <span className="font-semibold text-xs sm:text-sm text-foreground/95 leading-snug">
                        {isHi && faq.question_hi ? faq.question_hi : faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-1 sm:px-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <div className="border-t border-white/5 pt-3">
                      {isHi && faq.answer_hi ? faq.answer_hi : faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="py-8 text-center text-muted-foreground text-xs sm:text-sm space-y-3">
            <Sparkles className={`h-6 w-6 mx-auto ${isHost ? 'text-amber-400' : 'text-emerald-400'} opacity-70 animate-pulse`} />
            <p>
              {isHi ? (
                <>
                  &ldquo;{search}&rdquo; के लिए कोई प्रश्न नहीं मिला। आप हमारे संस्थापक से सीधे
                  WhatsApp पर पूछ सकते हैं।
                </>
              ) : (
                <>
                  No matching questions found for &ldquo;{search}&rdquo;. You can ask our founder
                  directly on WhatsApp.
                </>
              )}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                isHost
                  ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                  : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
              }`}
            >
              <PhoneCall className="h-3.5 w-3.5" />
              {isHi ? "संस्थापक से व्हाट्सएप पर बात करें" : "Ask Founder on WhatsApp"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
});
