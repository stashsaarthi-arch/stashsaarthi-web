import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

export function MatchDrawer({
  open,
  onOpenChange,
  city,
  presetRole = "student",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  city?: string;
  presetRole?: "student" | "senior";
}) {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(city ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLocation(city ?? "");
    if (user?.name) setName(user.name);
    if (user?.email) setEmail(user.email);
  }, [open, city, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(isHi ? "कृपया अपना पूरा नाम दर्ज करें।" : "Please enter your name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error(isHi ? "कृपया एक मान्य ईमेल दर्ज करें।" : "Please enter a valid email address.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      toast.error(isHi ? "कृपया 10-अंकों का वैध फोन नंबर दर्ज करें।" : "Please enter a valid phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("co_living_inquiries").insert({
        user_id: user?.id ?? null,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: presetRole,
        preferred_location: location.trim() || null,
        message: message.trim() || null,
      });
      if (error) throw error;
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      onOpenChange(false);
      toast.success(isHi ? "🎉 आपका अनुरोध प्राप्त हुआ! हमारी टीम 24 घंटे में संपर्क करेगी।" : "Welcome aboard! Our team will reach out within 24 hours", {
        description: isHi ? "आपका मैचिंग अनुरोध हमारी कम्युनिटी टीम के पास है।" : "Your match request is with our community team.",
      });
    } catch {
      toast.error(isHi ? "अनुरोध भेजने में असमर्थ" : "We couldn't send your match request", {
        description: isHi ? "कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।" : "Please check your connection and try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="glass w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl">
            {isHi ? "सार्थी मैचिंग अनुरोध" : "Request a Saarthi match"}
          </SheetTitle>
          <SheetDescription>
            {isHi
              ? "अपने बारे में थोड़ा बताएं — हम हर जोड़ी का व्यक्तिगत सत्यापन करके 24 घंटे में पुष्टि करते हैं।"
              : "Tell us a little about you — we hand-match every pair and confirm within 24 hours."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={isHi ? "पूरा नाम" : "Full name"}>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={submitting} placeholder={isHi ? "आपका नाम" : "Your name"} />
          </Field>
          <Field label={isHi ? "ईमेल" : "Email"}>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={submitting} placeholder="you@college.edu" />
          </Field>
          <Field label={isHi ? "फ़ोन / WhatsApp" : "Phone / WhatsApp"}>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={submitting} placeholder="+91 98xxx xxxxx" />
          </Field>
          <Field label={isHi ? "पसंदीदा शहर या इलाका" : "Preferred city or locality"}>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} disabled={submitting} placeholder={isHi ? "जैसे कल्याणपुर, कानपुर" : "e.g. Swaroop Nagar, Kanpur"} />
          </Field>
          <Field label={isHi ? "आप किस तरह का साथ / सहायता ढूंढ रहे हैं?" : "What kind of companionship are you looking for?"}>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
              rows={3}
              placeholder={isHi ? "शाम की बातचीत, तकनीकी सहायता, भोजन प्राथमिकताएं..." : "Evening chats, tech support, dietary preferences..."}
            />
          </Field>

          <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> {isHi ? "भेजा जा रहा है…" : "Submitting…"}
              </span>
            ) : (
              isHi ? "मैच अनुरोध सबमिट करें" : "Submit match request"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
