import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Share2,
  PhoneCall,
  CheckCircle2,
  Compass,
  Footprints,
  AlertTriangle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import {
  KANPUR_GROUND_NODES,
  getGoogleMapsDirectionsUrl,
  getAppleMapsDirectionsUrl,
  getWhatsAppDirectionsShareUrl,
  isAppleDevice,
  type GroundStashNode,
} from "@/lib/stashNavigation";

interface FindMyStashModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNodeId?: string | undefined;
  nodeName?: string | undefined;
}

export function FindMyStashModal({
  isOpen,
  onClose,
  initialNodeId,
  nodeName,
}: FindMyStashModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  // Find target node or default to Kakadeo PW Hub
  const defaultNode: GroundStashNode =
    KANPUR_GROUND_NODES.find((n) => n.id === initialNodeId) ||
    KANPUR_GROUND_NODES.find(
      (n) => nodeName && n.name.toLowerCase().includes(nodeName.toLowerCase()),
    ) ||
    KANPUR_GROUND_NODES[0]!;

  const [selectedNode, setSelectedNode] = useState<GroundStashNode>(defaultNode);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isApple = isAppleDevice();
  const googleMapsUrl = getGoogleMapsDirectionsUrl(selectedNode);
  const appleMapsUrl = getAppleMapsDirectionsUrl(selectedNode);
  const primaryMapUrl = isApple ? appleMapsUrl : googleMapsUrl;
  const whatsappShareUrl = getWhatsAppDirectionsShareUrl(selectedNode, isHi);

  const handleCopyLandmark = () => {
    const textToCopy = `${selectedNode.name} - ${selectedNode.locality} (Pincode: ${selectedNode.pincode}). Landmark: ${selectedNode.mainRoadLandmark}. Guide: ${selectedNode.backAlleyGuide}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="find-stash-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-3xl border border-emerald-500/30 bg-[#0A0D0F] p-5 sm:p-7 shadow-2xl text-slate-100 overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Compass className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="find-stash-title" className="text-lg sm:text-xl font-bold text-white">
                    {isHi
                      ? "फ़ाइंड माय स्टैश (बैक-गली नेविगेशन)"
                      : "Find My Stash (Back-Alley Directions)"}
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  {isHi
                    ? "काकादेव व कानपुर कैंपस कॉरिडोर के लिए सत्यापित ग्राउंड नेविगेशन"
                    : "Verified ground navigation for Kakadeo & Kanpur campus corridors"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label={
                isHi ? "दिशा-निर्देश मोडल बंद करें" : "Close Find My Stash Directions Modal"
              }
              className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Node Selector Pills */}
          <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {KANPUR_GROUND_NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`flex items-center gap-1.5 shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500 text-black shadow-md font-bold"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <MapPin className="h-3 w-3" />
                  <span>{isHi ? node.name_hi.split(" ")[0] : node.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Node Info Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-emerald-400">
                  {isHi ? selectedNode.name_hi : selectedNode.name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                  <Footprints className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                  <span>
                    {isHi ? selectedNode.distance_hi : selectedNode.distance} (
                    {isHi ? selectedNode.walkTime_hi : selectedNode.walkTime}) ·{" "}
                    {selectedNode.campusNearby}
                  </span>
                </p>
              </div>

              <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-2.5 py-1 text-[11px] font-mono font-bold text-cyan-300 border border-cyan-500/30 w-fit">
                ★ {selectedNode.rating} · PIN {selectedNode.pincode}
              </span>
            </div>

            {/* Back-Alley Entrance Alert Banner */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">
                  {isHi ? "⚠️ काकादेव संकरी गली नेविगेशन चेतावनी:" : "⚠️ Back-Alley Route Notice:"}
                </span>
                {isHi ? selectedNode.backAlleyGuide_hi : selectedNode.backAlleyGuide}
              </div>
            </div>

            {/* Step by Step Walking Checkpoints */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                <span>
                  {isHi ? "चरण-दर-चरण मार्ग चेकपॉइंट" : "Step-by-Step Walking Checkpoints"}
                </span>
              </h4>

              <div className="space-y-1.5">
                {selectedNode.stepByStepDirections.map((step) => (
                  <div
                    key={step.step}
                    className="flex items-start gap-2.5 text-xs text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/5"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                      {step.step}
                    </span>
                    <span className="pt-0.5">{isHi ? step.instruction_hi : step.instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-5 space-y-2.5">
            {/* Primary Native Maps Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button
                variant="hero"
                size="lg"
                className="w-full justify-center gap-2 text-xs sm:text-sm font-bold cursor-pointer"
                asChild
              >
                <a href={primaryMapUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {isApple
                      ? isHi
                        ? "एप्पल मैप्स में खोलें"
                        : "Open in Apple Maps"
                      : isHi
                        ? "गूगल मैप्स में खोलें"
                        : "Open in Google Maps"}
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full justify-center gap-2 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-bold cursor-pointer"
                asChild
              >
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <Navigation className="h-4 w-4" />
                  <span>{isHi ? "पैदल दिशा गूगल मैप्स" : "Google Maps Walking"}</span>
                  <ExternalLink className="h-3.5 w-3.5 ml-auto opacity-70" />
                </a>
              </Button>
            </div>

            {/* Secondary Share / Contact Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyLandmark}
                className="text-xs text-slate-400 hover:text-white gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>
                  {copied
                    ? isHi
                      ? "कॉपी हो गया!"
                      : "Copied!"
                    : isHi
                      ? "लैंडमार्क कॉपी करें"
                      : "Copy Address"}
                </span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 hover:bg-white/10 text-xs text-slate-200 gap-1.5 cursor-pointer"
                  asChild
                >
                  <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer">
                    <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{isHi ? "शेयर करें" : "Share"}</span>
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-xs text-amber-300 gap-1.5 cursor-pointer"
                  asChild
                >
                  <a href={`tel:${selectedNode.contactPhone}`}>
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{isHi ? "होस्ट कॉल करें" : "Call Host"}</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
