import React from 'react';
import { PhoneAuth } from '@/components/auth/PhoneAuth';

export function HostLogin() {
  return (
    <div className="min-h-screen bg-[#0A0D0F] text-foreground flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center relative z-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Partner with StashSaarthi</h1>
        <p className="text-sm text-muted-foreground">Join our network of verified premium hosts and earn tech-enabled passive income.</p>
      </div>
      <PhoneAuth />
    </div>
  );
}
