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
        </div>
      </DialogContent>
    </Dialog>
  );
}
