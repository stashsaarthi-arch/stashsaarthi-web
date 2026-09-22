import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DOCS } from "./legal";
import { useLanguage } from "@/context/LanguageContext";

export function LegalDialog({
  docKey,
  onOpenChange,
}: {
  docKey: string | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const doc = docKey ? DOCS[docKey] : undefined;

  const title = doc ? (isHi && doc.title_hi ? doc.title_hi : doc.title) : "";
  const body = doc ? (isHi && doc.body_hi ? doc.body_hi : doc.body) : [];

  const targetPath = docKey === "privacy" ? "/privacy" : docKey === "terms" ? "/terms" : null;

  return (
    <Dialog open={!!doc} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title} details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          {body.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}

          {targetPath && (
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <Link
                to={targetPath}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
              >
                <span>{isHi ? "पूरा दस्तावेज़ पेज देखें" : "View Full Formal Page"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
