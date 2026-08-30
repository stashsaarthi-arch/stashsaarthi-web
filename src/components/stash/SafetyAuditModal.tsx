import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BadgeCheck, Shield, FileText, CheckCircle2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useLanguage } from "@/context/LanguageContext";

export function SafetyAuditModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-emerald-500/30 bg-black/60 backdrop-blur-xl sm:max-w-md p-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>{isHi ? "सुरक्षा ऑडिट प्रमाणपत्र" : "Safety Audit Certificate"}</DialogTitle>
          <DialogDescription>
            {isHi
              ? "सार्थी सुरक्षा ऑडिट और सत्यापन प्रक्रिया का विवरण।"
              : "Details of the StashSaarthi Safety Audit and Verification process."}
          </DialogDescription>
        </VisuallyHidden>
        <div className="relative p-6">
          <div className="absolute top-0 right-0 p-3 opacity-20">
            <Shield className="w-32 h-32 text-emerald-500" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 mb-4 border border-emerald-500/20">
              <BadgeCheck className="h-6 w-6 text-emerald-400" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">
              {isHi ? "सत्यापित होस्ट पहचान" : "Verified Host Identity"}
            </h3>
            <div className="text-xs text-emerald-400 font-medium tracking-wider uppercase mb-6 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              {isHi ? "ऑडिट प्रमाणित" : "Audit Validated"}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {isHi ? "आधार केवाईसी पूर्ण" : "Aadhaar KYC Completed"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isHi
                      ? "सरकारी आईडी का स्थानीय रजिस्ट्रार डेटाबेस से सत्यापन।"
                      : "Government ID verified against local registrar databases."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {isHi ? "पुलिस सत्यापन रिपोर्ट" : "Police Clearance Check"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isHi
                      ? "स्थानीय थाने से शून्य आपराधिक रिकॉर्ड इतिहास।"
                      : "Zero criminal record history within the local precinct."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {isHi ? "भौतिक परिसर ऑडिट" : "Physical Premise Audit"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isHi
                      ? "संपत्ति की स्थिति और सुरक्षा मापदंडों का ऑन-साइट सत्यापन।"
                      : "On-site verification of property condition and safety parameters."}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                {isHi ? "प्रमाणपत्र आईडी: SS-AUTH-9204" : "Certificate ID: SS-AUTH-9204"}
              </div>
              <div className="uppercase tracking-widest font-semibold opacity-50">
                {isHi ? "वैध 2026" : "Valid 2026"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
