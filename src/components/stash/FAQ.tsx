import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnimatedContent from "@/components/ui/AnimatedContent";
import { HelpCircle, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/context/LanguageContext";

interface FAQItem {
  category: string;
  question: string;
  question_hi?: string;
  answer: string;
  answer_hi?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "storage",
    question: "Can I retrieve my bags early if my plans change?",
    question_hi: "यदि मेरा प्लान बदल जाए, तो क्या मैं अपना सामान समय से पहले ले सकता/सकती हूं?",
    answer: "Absolutely. With Saarthi Stash, early retrieval is supported with 48 hours notice. Your designated Concierge will arrange a seamless handover directly from the node without any hidden exit penalties.",
    answer_hi: "बिल्कुल। सार्थी स्टैश के साथ 48 घंटे पहले सूचना देकर कभी भी सामान वापस लिया जा सकता है। हमारे कंसीयज बिना किसी अतिरिक्त शुल्क के सुरक्षित हैंडओवर की व्यवस्था करेंगे।",
  },
  {
    category: "storage",
    question: "What items are prohibited from vacation micro-storage?",
    question_hi: "वेकेशन स्टोरेज में किन वस्तुओं को रखने की मनाही है?",
    answer: "Perishable foods, open liquids, unsealed cosmetics, weapons, inflammable liquids, and contraband are strictly prohibited. Every bag is scanned and laser-sealed in your presence at pickup.",
    answer_hi: "खराब होने वाला खाना, खुली तरल वस्तुएं, हथियार, ज्वलनशील पदार्थ और गैर-कानूनी वस्तुएं सख्त वर्जित हैं। पिकअप के समय आपके सामने हर बैग की जांच व लेजर-सीलिंग की जाती है।",
  },
  {
    category: "safety",
    question: "How do you protect luggage from dampness and monsoons?",
    question_hi: "आप बारिश और सीलन से सामान को कैसे सुरक्षित रखते हैं?",
    answer: "Every luggage item is securely wrapped in industrial-grade, waterproof polyethylene before storage. Our verified Host Nodes undergo strict humidity checks and are required to store items elevated on pallets, ensuring 100% monsoon resilience.",
    answer_hi: "हर सामान को स्टोरेज से पहले वाटरप्रूफ पॉलीथीन में सुरक्षित लपेटा जाता है। हमारे होस्ट नोड्स में नमी की नियमित जांच होती है और सामान जमीन से ऊपर पैलेट्स पर रखा जाता है।",
  },
  {
    category: "safety",
    question: "How fast is the claim settlement SLA?",
    question_hi: "बीमा क्लेम निपटान कितने समय में होता है?",
    answer: "We guarantee a 48-hour Service Level Agreement (SLA) for processing insurance claims. Because we apply tamper-seals at pickup, any verifiable damage up to ₹10,000 is settled directly to your bank account with zero-deductibles.",
    answer_hi: "हम 48 घंटे के भीतर क्लेम प्रोसेसिंग की गारंटी देते हैं। पिकअप पर टैम्पर-प्रूफ सील लगने के कारण ₹10,000 तक की किसी भी क्षति की भरपाई सीधे बैंक खाते में बिना कटौती की जाती है।",
  },
  {
    category: "host",
    question: "What are the emergency access protocols for senior hosts?",
    question_hi: "सीनियर होस्ट्स के लिए आपातकालीन सहायता प्रोटोकॉल क्या है?",
    answer: "Senior Hosts are equipped with a direct 24x7 SOS line to our operations team. If any medical or maintenance emergency arises, our rapid response fleet steps in instantly to assist the host and secure all stored items.",
    answer_hi: "वरिष्ठ नागरिकों को हमारी ऑपरेशंस टीम से जुड़ी 24×7 डायरेक्ट एसओएस लाइन मिलती है। किसी भी चिकित्सा या आपात स्थिति में हमारी त्वरित प्रतिक्रिया टीम तुरंत सहायता हेतु पहुंचती है।",
  },
  {
    category: "host",
    question: "How does passive income escrow payout work for senior hosts?",
    question_hi: "सीनियर होस्ट्स को मासिक कमाई का भुगतान कैसे प्राप्त होता है?",
    answer: "Zero direct cash transactions. All student payments are locked in digital escrow and disbursed directly to the senior host's verified bank account on the 1st of every month automatically.",
    answer_hi: "शून्य नकद लेन-देन। सभी छात्रों का भुगतान डिजिटल एस्क्रो में सुरक्षित रहता है और हर महीने की 1 तारीख को सीधे सीनियर होस्ट के बैंक खाते में ट्रांसफर कर दिया जाता है।",
  },
  {
    category: "storage",
    question: "Where are StashNodes located in Kanpur?",
    question_hi: "कानपुर में स्टैश नोड्स कहां-कहां स्थित हैं?",
    answer: "StashNodes are situated within 300m to 1.2km of IIT Kanpur (Nankari), CSJMU (Kalyanpur), HBTI (Nawabganj), and GSVM Medical College (Swaroop Nagar) gates, hosted inside verified elder homes with CCTV and dedicated dry storage rooms.",
    answer_hi: "स्टैश नोड्स आईआईटी कानपुर (नानकारी), सीएसजेएमयू (कल्याणपुर), एचबीटीआई (नवाबगंज), और जीएसवीएम मेडिकल कॉलेज (स्वरूप नगर) के गेट से 300मी से 1.2किमी के दायरे में स्थित हैं।",
  },
  {
    category: "host",
    question: "What if a student violates the House Norms Matrix?",
    question_hi: "यदि कोई छात्र घर के नियमों का उल्लंघन करता है तो क्या होगा?",
    answer: "Hosts maintain 100% control. Our 24-Hour Relocation SLA guarantees instant relocation of the student to a backup campus node with zero penalty or awkward confrontations for the host.",
    answer_hi: "होस्ट का 100% नियंत्रण रहता है। हमारी 24-घंटे रीलोकेशन गारंटी के तहत छात्र को बिना किसी जुर्माने या असुविधा के तुरंत दूसरे नोड में शिफ्ट कर दिया जाता है।",
  }
];

export function FAQ() {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = t.faqSection.categories || [
    { id: "all", label: isHi ? "सभी प्रश्न" : "All Questions" },
    { id: "storage", label: isHi ? "📦 छात्र स्टोरेज" : "📦 Student Storage" },
    { id: "safety", label: isHi ? "🛡️ सुरक्षा व क्लेम" : "🛡️ Safety & Claims" },
    { id: "host", label: isHi ? "🏡 सीनियर होस्ट नियम" : "🏡 Senior Host Norms" },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((faq) => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const q = isHi && faq.question_hi ? faq.question_hi : faq.question;
      const a = isHi && faq.answer_hi ? faq.answer_hi : faq.answer;
      const matchesSearch =
        search.trim() === "" ||
        q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory, isHi]);

  const getCategoryCount = (catId: string) => {
    if (catId === "all") return FAQ_ITEMS.length;
    return FAQ_ITEMS.filter((f) => f.category === catId).length;
  };

  return (
    <section className="relative px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <AnimatedContent distance={40} direction="vertical" duration={0.8}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 mb-6">
              <HelpCircle className="h-4 w-4 text-cyan-400 mr-2" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
                {t.faqSection.badge}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              {t.faqSection.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              {t.faqSection.subtitle}
            </p>
          </div>

          {/* Search Input & Category Pills */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder={t.faqSection.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-5 rounded-2xl border-white/10 bg-black/40 backdrop-blur-md text-sm text-foreground focus-visible:ring-emerald-500/50"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => {
                const count = getCategoryCount(cat.id);
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "border border-cyan-500/50 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_-2px_rgba(6,182,212,0.3)]"
                        : "border border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${isActive ? "bg-cyan-500/20 text-cyan-300" : "bg-white/10 text-slate-400"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="glass rounded-3xl border border-white/10 p-6 sm:p-10">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-white/10 bg-white/5 rounded-xl px-4 overflow-hidden border-b-0">
                    <AccordionTrigger className="text-left font-semibold text-sm hover:no-underline py-4">
                      {isHi && faq.question_hi ? faq.question_hi : faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {isHi && faq.answer_hi ? faq.answer_hi : faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center text-muted-foreground text-sm">
                <Sparkles className="h-6 w-6 mx-auto mb-2 text-cyan-400 opacity-60" />
                {isHi ? (
                  <>
                    &ldquo;{search}&rdquo; के लिए कोई प्रश्न नहीं मिला। आप हमारे 24×7 कंसीयज से सीधे WhatsApp पर पूछ सकते हैं।
                  </>
                ) : (
                  <>
                    No matching questions found for &ldquo;{search}&rdquo;. You can ask our 24×7 concierge directly on WhatsApp.
                  </>
                )}
              </div>
            )}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
