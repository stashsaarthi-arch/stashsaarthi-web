import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Check, ImagePlus, Loader2, Star, X, Sparkles, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";

const AMENITIES_LIST = [
  { en: "High-Speed Wi-Fi", hi: "हाई-स्पीड वाई-फाई" },
  { en: "Attached Washroom", hi: "अटैच्ड वॉशरूम" },
  { en: "24x7 RO Water", hi: "24×7 आरओ पानी" },
  { en: "Power Backup", hi: "पावर बैकअप" },
  { en: "Nani Tiffins Available", hi: "नानी टिफिन उपलब्ध" },
  { en: "Balcony / Sunlit", hi: "बालकनी / हवादार" },
];

export function RoomListingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [rent, setRent] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [foodWater, setFoodWater] = useState(4);
  const [ownerBehaviour, setOwnerBehaviour] = useState(4);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Generate object URLs for previewing photos
  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [files]);

  const STEPS = useMemo(() => [
    isHi ? "कमरे का विवरण" : "Room details",
    isHi ? "सुविधाएं और फोटो" : "Amenities & photos",
    isHi ? "छात्र समीक्षा" : "Student review",
  ], [isHi]);

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const removePhoto = (index: number) => {
    setFiles((prev) => prev.filter((_, j) => j !== index));
  };

  const next = () => {
    if (step === 0 && (!address || !rent)) {
      toast.error(isHi ? "कृपया कम से कम पता और किराया भरें।" : "Please fill in at least address and rent.");
      return;
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const photos: string[] = [];
      for (const f of files) {
        const path = `rooms/${Date.now()}-${f.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
        const { error: upErr } = await supabase.storage.from("room-photos").upload(path, f);
        if (!upErr) {
          const { data } = supabase.storage.from("room-photos").getPublicUrl(path);
          if (data?.publicUrl) photos.push(data.publicUrl);
        }
      }

      const reviewNote = `${pros ? `Pros: ${pros}. ` : ""}${cons ? `Cons: ${cons}. ` : ""}Amenities: ${amenities.join(", ") || "Standard"}. Food/Water: ${foodWater}/5, Owner: ${ownerBehaviour}/5`;

      const { error } = await supabase.from("crowdsourced_room_listings").insert({
        student_id: user?.id ?? null,
        address_location: address,
        rent_amount: rent ? parseInt(rent, 10) : null,
        owner_name: ownerName || null,
        owner_phone: ownerPhone || null,
        photos_urls: photos,
        student_review: reviewNote,
        ratings: Math.round(((foodWater + ownerBehaviour) / 2) * 10) / 10,
        status: "pending_audit",
      });

      if (error) throw error;
      toast.success(isHi ? "🎉 कमरा सफलतापूर्वक लिस्ट हो गया!" : "Room listed!", {
        description: isHi 
          ? "सत्यापन के बाद आपको ₹200 का रिवॉर्ड क्रेडिट मिलेगा।" 
          : "We’ll verify the details and credit your ₹200 reward once verified.",
      });
      onOpenChange(false);
      setStep(0);
      setAddress("");
      setRent("");
      setOwnerName("");
      setOwnerPhone("");
      setPros("");
      setCons("");
      setAmenities([]);
      setFiles([]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit room";
      toast.error(isHi ? "कमरा सबमिट करने में विफल" : "Failed to submit room", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-h-[90vh] overflow-y-auto sm:max-w-lg border-white/10 p-6">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold">
                {isHi ? "खाली हो रहा कमरा लिस्ट करें" : "List your vacating room"}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                {isHi 
                  ? "साथी छात्रों को 1 माह का दलाली शुल्क बचाने में मदद करें और ₹200 पाएं" 
                  : "Help a junior skip 1 month brokerage · earn ₹200 on verification"}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Stepper Header */}
        <div className="mt-2 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${
                  i <= step ? "bg-cyan-500 text-black font-extrabold" : "bg-white/10 text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </span>
              <span className="hidden truncate text-[11px] text-muted-foreground sm:block">{s}</span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="mt-5 space-y-4"
          >
            {step === 0 && (
              <>
                <Field label={isHi ? "पता / इलाका *" : "Address / locality *"}>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder={isHi ? "कल्याणपुर, कानपुर" : "Kalyanpur, Kanpur"} className="border-white/10 bg-white/5" />
                </Field>
                <Field label={isHi ? "वर्तमान मासिक किराया (₹) *" : "Current monthly rent (₹) *"}>
                  <Input
                    value={rent}
                    inputMode="numeric"
                    onChange={(e) => setRent(e.target.value.replace(/\D/g, ""))}
                    placeholder="5500"
                    className="border-white/10 bg-white/5"
                  />
                </Field>
                <Field label={isHi ? "मकान मालिक का नाम" : "Landlord name"}>
                  <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder={isHi ? "श्री शर्मा" : "Mr. Sharma"} className="border-white/10 bg-white/5" />
                </Field>
                <Field label={isHi ? "मकान मालिक का WhatsApp नंबर" : "Landlord WhatsApp number"}>
                  <Input value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value)} placeholder="+91 98xxx xxxxx" className="border-white/10 bg-white/5" />
                </Field>
              </>
            )}

            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    {isHi ? "कमरे की प्रमुख सुविधाएं" : "Key Room Amenities"}
                  </Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {AMENITIES_LIST.map((item) => {
                      const label = isHi ? item.hi : item.en;
                      const isSelected = amenities.includes(item.en);
                      return (
                        <div
                          key={item.en}
                          onClick={() => toggleAmenity(item.en)}
                          className={`rounded-xl border p-2.5 flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-500/50 bg-cyan-500/10 text-white font-medium"
                              : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                          }`}
                        >
                          <span className="truncate">{label}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-center transition hover:border-cyan-500/40">
                  <ImagePlus className="h-6 w-6 text-cyan-400" />
                  <span className="text-sm font-semibold">{isHi ? "कमरे की तस्वीरें जोड़ें" : "Upload room photos"}</span>
                  <span className="text-xs text-muted-foreground">{isHi ? "JPG या PNG (थंबनेल प्रीव्यू के साथ)" : "JPG or PNG with instant thumbnail preview"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? [])])}
                  />
                </label>

                {/* Instant Thumbnail Preview Gallery */}
                {previewUrls.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <Label className="text-xs text-slate-300 font-semibold">
                      {isHi ? `अपलोड की गई तस्वीरें (${files.length})` : `Uploaded Photos (${files.length})`}
                    </Label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {previewUrls.map((url, i) => (
                        <div
                          key={url}
                          className="relative aspect-video rounded-xl overflow-hidden border border-white/15 bg-black/60 group"
                        >
                          <img
                            src={url}
                            alt={`Room thumbnail ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-cyan-500 text-black px-1 rounded">
                              {isHi ? "मुख्य" : "Cover"}
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label="Remove photo"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white/80 hover:text-white hover:bg-destructive transition cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <Field label={isHi ? "इस कमरे में क्या सबसे अच्छा था?" : "What was good about this room?"}>
                  <Textarea value={pros} onChange={(e) => setPros(e.target.value)} rows={2} placeholder={isHi ? "शांत गली, कॉलेज से 5 मिनट की दूरी…" : "Quiet street, 5 min to campus…"} className="border-white/10 bg-white/5" />
                </Field>
                <Field label={isHi ? "अगले छात्र को क्या जानना चाहिए?" : "What should the next student know?"}>
                  <Textarea value={cons} onChange={(e) => setCons(e.target.value)} rows={2} placeholder={isHi ? "गर्मियों में पानी का कम प्रेशर…" : "Low water pressure in summer…"} className="border-white/10 bg-white/5" />
                </Field>
                <RatingRow label={isHi ? "भोजन एवं पानी की उपलब्धता" : "Food & water availability"} value={foodWater} onChange={setFoodWater} />
                <RatingRow label={isHi ? "मकान मालिक का व्यवहार" : "Owner behaviour"} value={ownerBehaviour} onChange={setOwnerBehaviour} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex gap-2">
          {step > 0 && (
            <Button variant="outline" className="flex-1 border-white/10 cursor-pointer" disabled={submitting} onClick={() => setStep((s) => s - 1)}>
              {isHi ? "वापस" : "Back"}
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button variant="hero" className="flex-1 cursor-pointer" onClick={next}>
              {isHi ? "आगे बढ़ें" : "Continue"}
            </Button>
          ) : (
            <Button variant="hero" className="flex-1 cursor-pointer" disabled={submitting} aria-busy={submitting} onClick={() => void submit()}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {isHi ? "सबमिट हो रहा है…" : "Submitting…"}
                </span>
              ) : (
                isHi ? "सबमिट करें और ₹200 रिवॉर्ड पाएं" : "Submit & claim ₹200"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 text-left">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="p-1 text-muted-foreground hover:text-amber-400 transition-colors cursor-pointer"
          >
            <Star className={`h-4 w-4 ${n <= value ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
