import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { PhoneAuth } from "./PhoneAuth";
import { Smartphone, Mail } from "lucide-react";

export function LoginModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { loginWithGoogle } = useAuth();
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-white/10 bg-[#0A0D0F]/95 backdrop-blur-xl sm:rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-white mb-4">
            Sign in to StashSaarthi
          </DialogTitle>
        </DialogHeader>

        {showPhoneAuth ? (
          <div className="w-full">
            <PhoneAuth />
            <button
              onClick={() => setShowPhoneAuth(false)}
              className="mt-4 text-xs text-muted-foreground w-full text-center hover:text-white transition-colors cursor-pointer"
            >
              Back to options
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-2">
            <button
              onClick={() => {
                loginWithGoogle();
                onOpenChange(false);
              }}
              className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-slate-200 transition-colors cursor-pointer shadow-lg"
            >
              <GoogleGlyph />
              Continue with Google
            </button>

            <button
              onClick={() => setShowPhoneAuth(true)}
              className="flex items-center justify-center gap-3 w-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 py-4 rounded-2xl font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              Continue with Phone / Email
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C36.9 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
