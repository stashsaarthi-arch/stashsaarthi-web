import { LogOut, User as UserIcon, CalendarCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/context/LanguageContext";
import { useGoogleLogin } from "@react-oauth/google";

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
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

export function AuthButton({ compact = false }: { compact?: boolean }) {
  const { user, authenticating, loginWithProfile, setAuthenticating, logout } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const handleCustomLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setAuthenticating(true);
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const data = await res.json();

        loginWithProfile({
          id: data.sub || data.email || "saarthi",
          name: data.name || data.email?.split("@")[0] || "Saarthi",
          email: data.email || "",
          avatar: data.picture || "",
          role: "student",
          verified: !!data.email_verified,
        });
      } catch {
        toast.error(
          isHi ? "उपयोगकर्ता प्रोफ़ाइल लोड करने में विफल" : "Failed to fetch user profile",
        );
      } finally {
        setAuthenticating(false);
      }
    },
    onError: (errorResponse) => {
      console.error("[AuthButton] Google sign-in failed:", errorResponse);
      toast.error(isHi ? "गूगल साइन-इन विफल रहा" : "Google sign-in failed");
    },
  });

  if (!user) {
    return (
      <Button
        variant="outline"
        size={compact ? "sm" : "default"}
        onClick={() => handleCustomLogin()}
        disabled={authenticating}
        aria-busy={authenticating}
        className="gap-2 bg-[#161B22] hover:bg-[#21262D] border border-slate-700 text-white rounded-full px-4 cursor-pointer"
      >
        {authenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleGlyph />}
        <span className="whitespace-nowrap">
          {authenticating ? (isHi ? "प्रमाणीकरण…" : "Authenticating…") : t.nav.auth}
        </span>
      </Button>
    );
  }

  const name = user.name || user.email || "User";
  const first = (name.split(" ")[0] || "User").trim();
  const roleBadge =
    user.role === "student" ? (isHi ? "छात्र" : "Student") : isHi ? "होस्ट" : "Host";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border border-slate-700 bg-[#161B22] py-1 pl-1 pr-3 transition hover:bg-[#21262D] cursor-pointer">
          <Avatar className="h-7 w-7">
            {user.avatar ? <AvatarImage src={user.avatar} alt={name} /> : null}
            <AvatarFallback className="text-[10px] bg-slate-800 text-white">
              {(first.slice(0, 2) || "U").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start leading-none">
            <span className="max-w-[7rem] truncate text-xs font-semibold text-white">{first}</span>
            <span className="text-[9px] text-cyan-400 font-medium uppercase tracking-wider">
              {roleBadge}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            toast.info(
              isHi ? "प्रोफ़ाइल सेटिंग्स जल्द ही आ रही हैं।" : "Profile settings are coming soon.",
            )
          }
        >
          <UserIcon className="mr-2 h-4 w-4" /> {isHi ? "प्रोफ़ाइल" : "Profile"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            toast.info(
              isHi
                ? "बुकिंग डैशबोर्ड जल्द ही आ रहा है।"
                : "Your bookings dashboard is coming soon.",
            )
          }
        >
          <CalendarCheck className="mr-2 h-4 w-4" /> {isHi ? "मेरी बुकिंग" : "My Bookings"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" /> {isHi ? "लॉग आउट" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
