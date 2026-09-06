import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KakadeoSurvivalGuide } from "./KakadeoSurvivalGuide";
import { useLanguage } from "@/context/LanguageContext";
import { BookOpen } from "lucide-react";

interface KakadeoSurvivalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KakadeoSurvivalGuideModal({ isOpen, onClose }: KakadeoSurvivalGuideModalProps) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-emerald-500/30 p-4 md:p-6 text-slate-100">
        <DialogHeader className="no-print border-b border-slate-800 pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            {isHi ? "काकादेव न्यू स्टूडेंट सर्वाइवल गाइड (PDF)" : "Kakadeo Student Survival Guide (PDF)"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <KakadeoSurvivalGuide />
        </div>
      </DialogContent>
    </Dialog>
  );
}
