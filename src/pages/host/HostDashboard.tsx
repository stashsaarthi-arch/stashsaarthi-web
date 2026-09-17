import React, { useState } from 'react';
import { LayoutDashboard, Home, CalendarCheck, IndianRupee, AlertCircle, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function HostDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Overview', icon: LayoutDashboard, active: true },
    { name: 'Properties', icon: Home, active: false },
    { name: 'Bookings', icon: CalendarCheck, active: false },
    { name: 'Earnings', icon: IndianRupee, active: false },
  ];

  return (
    <div className="min-h-screen bg-[#0A0D0F] text-foreground flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0A0D0F]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">S</span>
          Host Portal
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-slate-300 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0B0E11] border-r border-white/5 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="hidden md:flex items-center gap-3 p-6 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xl">S</div>
          <div>
            <div className="font-bold text-white tracking-tight leading-tight">Host Portal</div>
            <div className="text-xs text-amber-500/80 font-medium">StashSaarthi</div>
          </div>
        </div>
        
        <nav className="px-4 py-6 md:py-0 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                item.active 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-amber-500' : 'text-slate-500'}`} />
              {item.name}
            </a>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium hover:bg-white/5 w-full">
            <ArrowRight className="w-5 h-5" />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        <header className="mb-8 hidden md:block">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-1 text-slate-400">Welcome back. Here's what's happening with your properties.</p>
        </header>

        {/* KYC Action Banner */}
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          
          <div className="flex items-start gap-4 z-10">
            <div className="p-2 bg-amber-500/20 rounded-full shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-50 text-sm md:text-base">Action Required: Aadhaar KYC Pending</h3>
              <p className="text-amber-200/80 text-xs md:text-sm mt-1 max-w-xl">
                Complete your Aadhaar KYC to activate your listing for January. Unverified listings are hidden from students.
              </p>
            </div>
          </div>
          
          <button className="z-10 shrink-0 w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-amber-500/20">
            Verify Aadhaar
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm">Active Listings</h3>
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <Home className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-white">0</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm">Total Views</h3>
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <LayoutDashboard className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-white">0</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:bg-white/[0.03] transition-colors relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-400 font-medium text-sm">Pending Inquiries</h3>
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <CalendarCheck className="w-4 h-4 text-slate-300 group-hover:text-amber-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-bold text-white">0</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
