import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  GraduationCap,
  MapPin,
  Activity,
  Save,
  Loader2,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/lib/waitlistService";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, updateUser } = useAuth();
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    user_type: "student" as "student" | "host",
    college_or_locality: "",
    bio: "",
    address: "",
    emergency_contact: "",
  });

  useEffect(() => {
    if (user && open) {
      setFormData({
        full_name: user.name || "",
        phone_number: user.phone_number || "",
        user_type: user.role || "student",
        college_or_locality: user.college_or_locality || "",
        bio: user.bio || "",
        address: user.address || "",
        emergency_contact: user.emergency_contact || "",
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.full_name.trim()) {
      toast.error(isHi ? "नाम अनिवार्य है" : "Name is required");
      return;
    }

    setSaving(true);
    const result = await updateUserProfile(user.email, formData);

    if (result.success) {
      updateUser({
        name: formData.full_name,
        phone_number: formData.phone_number,
        role: formData.user_type,
        college_or_locality: formData.college_or_locality,
        bio: formData.bio,
        address: formData.address,
        emergency_contact: formData.emergency_contact,
      });
      toast.success(isHi ? "प्रोफ़ाइल अपडेट की गई" : "Profile updated successfully");
      onOpenChange(false);
    } else {
      toast.error(isHi ? "प्रोफ़ाइल अपडेट विफल रहा" : "Failed to update profile", {
        description: isHi ? "कृपया पुनः प्रयास करें" : "Please try again",
      });
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] overflow-y-auto bg-[#0D1117]/95 backdrop-blur-xl border border-white/10 p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                {isHi ? "प्रोफ़ाइल सेटिंग्स" : "Profile Settings"}
              </DialogTitle>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-cyan-400">
                {isHi ? "आपका स्टैशसारथी खाता" : "Your StashSaarthi Account"}
              </span>
            </div>
          </div>
          <DialogDescription className="text-xs text-slate-300 leading-relaxed mt-2">
            {isHi
              ? "अपने खाते का विवरण अपडेट करें।"
              : "Update your account details and preferences."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Email (Readonly) */}
          <div>
            <label className="text-xs text-muted-foreground font-semibold mb-1 block">
              {isHi ? "ईमेल पता" : "Email Address"}
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                value={user?.email || ""}
                disabled
                aria-label={isHi ? "ईमेल पता" : "Email Address"}
                className="pl-10 bg-black/30 border-white/5 text-slate-300 rounded-lg text-sm cursor-not-allowed"
              />
            </div>
            {user?.provider === "google" && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                <Info className="h-3 w-3" />
                {isHi ? "ईमेल गूगल द्वारा प्रबंधित है।" : "Email is managed by Google."}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-1 block">
                {isHi ? "पूरा नाम" : "Full Name"}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Advik Omer"
                  className="pl-10 bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-cyan-500/50"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-1 block">
                {isHi ? "फ़ोन नंबर" : "Phone Number"}
              </label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+91"
                  className="pl-10 bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* User Type Toggle */}
          <div>
            <label className="text-xs text-muted-foreground font-semibold mb-2 block">
              {isHi ? "मेरी भूमिका" : "My Role"}
            </label>
            <div className="flex bg-black/50 border border-white/10 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: "student" })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  formData.user_type === "student"
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                🎓 {isHi ? "छात्र" : "Student"}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, user_type: "host" })}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  formData.user_type === "host"
                    ? "bg-amber-500/20 text-amber-300"
                    : "text-slate-400 hover:bg-white/5"
                }`}
              >
                🏠 {isHi ? "होस्ट" : "Host"}
              </button>
            </div>
          </div>

          {/* College or Locality */}
          <div>
            <label className="text-xs text-muted-foreground font-semibold mb-1 block">
              {formData.user_type === "student"
                ? isHi
                  ? "कॉलेज / परिसर"
                  : "College / Campus"
                : isHi
                  ? "इलाका / शहर"
                  : "Locality / City"}
            </label>
            <div className="relative flex items-center">
              {formData.user_type === "student" ? (
                <GraduationCap className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              ) : (
                <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              )}
              <Input
                value={formData.college_or_locality}
                onChange={(e) => setFormData({ ...formData, college_or_locality: e.target.value })}
                placeholder={
                  formData.user_type === "student" ? "e.g. IIT Kanpur" : "e.g. Kalyanpur"
                }
                className="pl-10 bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-cyan-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bio */}
            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-1 block">
                {isHi ? "बायो / मेरे बारे में" : "Bio / About Me"}
              </label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder={
                  isHi ? "अपने बारे में कुछ बताएं..." : "Tell us a bit about yourself..."
                }
                className="bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-cyan-500/50 resize-none h-20"
              />
            </div>

            {/* Address */}
            <div>
              <label className="text-xs text-muted-foreground font-semibold mb-1 block">
                {isHi ? "पूर्ण पता" : "Full Address"}
              </label>
              <Textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder={isHi ? "अपना पूरा पता दर्ज करें" : "Enter your full address"}
                className="bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-cyan-500/50 resize-none h-20"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <label className="text-xs text-muted-foreground font-semibold mb-1 block">
              {isHi ? "आपातकालीन संपर्क" : "Emergency Contact"}
            </label>
            <div className="relative flex items-center">
              <Activity className="absolute left-3.5 h-4 w-4 text-rose-400 pointer-events-none" />
              <Input
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                placeholder="+91"
                className="pl-10 bg-black/50 border-white/10 text-white rounded-lg text-sm focus-visible:ring-rose-500/50"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={saving}
              className="w-full py-5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isHi ? "सहेजा जा रहा है..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isHi ? "परिवर्तन सहेजें" : "Save Changes"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
