import { useState, useRef, useEffect, memo } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { usePersona } from "@/context/PersonaContext";
import { generateRagResponse, RagResponse } from "@/lib/ragChatbot";
import { FOUNDER_PHONE_DISPLAY, getWhatsAppUrl } from "@/lib/constants";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  ragMeta?: {
    confidence: number;
    citations: string[];
  };
}

export const RagChatbotWidget = memo(function RagChatbotWidget() {
  const { language } = useLanguage();
  const { isStudent } = usePersona();
  const isHi = language === "hi";

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const initialGreeting: ChatMessage = {
    id: "msg-0",
    sender: "bot",
    text: isHi
      ? "नमस्ते! मैं सार्थी RAG AI सहायक हूँ। स्टैश स्टोरेज, 0% ब्रोकरेज कमरों, ₹10k बीमे या भोजन सेवाओं के बारे में कोई भी सवाल पूछें!"
      : "Namaste! I am the Saarthi RAG AI Assistant. Ask me anything about micro-storage, 0% brokerage rooms, ₹10k insurance, or home-cooked meals!",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    ragMeta: {
      confidence: 100,
      citations: ["FAQ Knowledge Index v2.0"],
    },
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedChips = isHi
    ? [
        "₹300 स्टोरेज में क्या शामिल है?",
        "क्या कमरों पर 0% ब्रोकरेज है?",
        "₹10,000 क्लेम कैसे मिलता है?",
        "संस्थापक से बात करें",
      ]
    : [
        "What is included in ₹300 storage?",
        "Are rooms really 0% brokerage?",
        "How does the ₹10k claim work?",
        "Talk to Founder",
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    // Special trigger for talking to founder
    if (query.toLowerCase().includes("founder") || query.includes("संस्थापक")) {
      window.open(getWhatsAppUrl("Hello StashSaarthi Founder, I need help!"), "_blank");
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate instant RAG query retrieval (250ms)
    setTimeout(() => {
      const rag: RagResponse = generateRagResponse(query, isHi ? "hi" : "en");
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: isHi ? rag.answerHi : rag.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        ragMeta: {
          confidence: rag.confidenceScore,
          citations: rag.citations,
        },
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 300);
  };

  const resetChat = () => {
    setMessages([initialGreeting]);
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-[160px] md:bottom-[76px] right-4 md:right-6 z-40 flex items-center gap-2 rounded-full px-3.5 py-2.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
            isStudent
              ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 shadow-emerald-500/20"
              : "bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-slate-950 shadow-amber-500/20"
          }`}
          aria-label="Open RAG AI Assistant"
        >
          <div className="relative">
            <Bot className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
          </div>
          <span className="text-xs font-bold font-mono tracking-tight hidden sm:inline">
            {isHi ? "सार्थी AI RAG सहायक" : "Saarthi AI RAG Bot"}
          </span>
          <Badge
            variant="secondary"
            className="bg-black/30 text-white text-[9px] px-1.5 py-0 font-mono"
          >
            RAG v2.0
          </Badge>
        </button>
      )}

      {/* Floating RAG Drawer/Modal */}
      {isOpen && (
        <div className="fixed bottom-[80px] md:bottom-4 right-2 md:right-4 z-50 w-[calc(100vw-16px)] sm:w-[380px] max-h-[580px] flex flex-col rounded-2xl border border-white/15 bg-neutral-950/95 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 border-b border-white/10 ${
              isStudent
                ? "bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80"
                : "bg-gradient-to-r from-amber-950/80 via-slate-900 to-yellow-950/80"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-1.5 rounded-lg ${
                  isStudent
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-foreground">
                    {isHi ? "सार्थी RAG AI सहायक" : "Saarthi RAG AI Assistant"}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`text-[8.5px] px-1 py-0 font-mono ${
                      isStudent
                        ? "border-emerald-500/40 text-emerald-300 bg-emerald-500/10"
                        : "border-amber-500/40 text-amber-300 bg-amber-500/10"
                    }`}
                  >
                    FAQ RAG
                  </Badge>
                </div>
                <p className="text-[9.5px] text-muted-foreground">
                  {isHi
                    ? "तत्काल पारदर्शी उत्तर • शून्य बॉट जाल"
                    : "Instant FAQ Retrieval • 0 Bot Trap"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                title="Reset Chat"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[260px] max-h-[360px] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    msg.sender === "user"
                      ? isStudent
                        ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950/40"
                        : "bg-amber-600 text-white rounded-br-none shadow-md shadow-amber-950/40"
                      : "bg-neutral-900 border border-white/10 text-neutral-200 rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                </div>

                {/* Metadata & Citations for Bot */}
                {msg.sender === "bot" && msg.ragMeta && (
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 px-1">
                    <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="h-2.5 w-2.5 inline" />
                      {msg.ragMeta.confidence}% Match
                    </span>
                    {msg.ragMeta.citations.map((cite, idx) => (
                      <span
                        key={idx}
                        className="text-[8.5px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded px-1"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-[8.5px] text-slate-500 mt-0.5 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground p-2 bg-neutral-900/60 border border-white/5 rounded-xl w-fit">
                <Sparkles className="h-3 w-3 animate-spin text-cyan-400" />
                <span className="text-[10px] font-mono">Retrieving from FAQ Index...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-3 py-1.5 border-t border-white/5 bg-black/40 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip)}
                className="text-[9.5px] px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all flex-shrink-0 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 border-t border-white/10 bg-neutral-900/90 flex items-center gap-2">
            <Input
              type="text"
              placeholder={isHi ? "कोई भी प्रश्न पूछें..." : "Ask any FAQ question..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="h-8 text-xs border-white/10 bg-black/50 text-foreground focus-visible:ring-emerald-500/40 rounded-xl"
            />
            <Button
              size="sm"
              onClick={() => handleSend()}
              className={`h-8 px-3 rounded-xl cursor-pointer ${
                isStudent
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
});
