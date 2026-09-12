import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Key, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Share2, 
  X, 
  Lock, 
  ArrowRight, 
  FileText, 
  Building2, 
  Sparkles, 
  RefreshCw,
  Phone,
  User,
  BadgeCheck,
  Zap
} from 'lucide-react';
import { 
  ProxyHandoverRequest, 
  createProxyHandoverAuthorization, 
  getProxyHandoverRecords, 
  verifyProxyHandoverCode, 
  confirmProxyHandoverRelease, 
  getProxyHandoverStats,
  revokeProxyHandoverAuthorization
} from '../../lib/reverseLogisticsEngine';
import { useLanguage } from '../../context/LanguageContext';
import { OfflineQrCode } from '../ui/OfflineQrCode';

interface ReverseLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBookingId?: string;
}

export const ReverseLogisticsModal: React.FC<ReverseLogisticsModalProps> = ({
  isOpen,
  onClose,
  initialBookingId = 'STASH-KNP-8921'
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'authorize' | 'verify' | 'charter'>('authorize');

  // Form State
  const [bookingId, setBookingId] = useState(initialBookingId);
  const [studentName, setStudentName] = useState('Advik Sharma');
  const [studentPhone, setStudentPhone] = useState('+919876543210');
  const [proxyName, setProxyName] = useState('');
  const [proxyPhone, setProxyPhone] = useState('');
  const [proxyGovtIdLast4, setProxyGovtIdLast4] = useState('');
  const [deliveryNode, setDeliveryNode] = useState('IIT Kanpur Nankari Gate');
  const [notes, setNotes] = useState('');

  // Result State
  const [createdPass, setCreatedPass] = useState<ProxyHandoverRequest | null>(null);
  const [records, setRecords] = useState<ProxyHandoverRequest[]>([]);
  
  // Verification State
  const [inputCodeOrPin, setInputCodeOrPin] = useState('');
  const [runnerId, setRunnerId] = useState('RUNNER-KAKADEO-01');
  const [verifyResult, setVerifyResult] = useState<{
    status: 'idle' | 'success' | 'claimed' | 'error';
    message: string;
    record?: ProxyHandoverRequest | undefined;
  }>({ status: 'idle', message: '' });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const all = getProxyHandoverRecords();
      setRecords(all);
      if (initialBookingId) {
        setBookingId(initialBookingId);
        const existing = all.find(r => r.bookingId === initialBookingId.toUpperCase() && r.status === 'AUTHORIZED');
        if (existing) {
          setCreatedPass(existing);
        }
      }
    }
  }, [isOpen, initialBookingId]);

  if (!isOpen) return null;

  const handleCreateAuthorization = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proxyName.trim() || !proxyPhone.trim() || !proxyGovtIdLast4.trim()) {
      alert(isHi ? 'कृपया मित्र का नाम, मोबाइल नंबर और आईडी के अंतिम 4 अंक भरें।' : 'Please enter proxy name, phone number, and last 4 digits of ID.');
      return;
    }

    const pass = createProxyHandoverAuthorization({
      bookingId,
      studentName,
      studentPhone,
      proxyName,
      proxyPhone,
      proxyGovtIdLast4,
      deliveryNode,
      notes
    });

    setCreatedPass(pass);
    setRecords(getProxyHandoverRecords());
  };

  const handleVerifyCode = () => {
    if (!inputCodeOrPin.trim()) return;
    const res = verifyProxyHandoverCode(inputCodeOrPin);
    if (res.success && res.record) {
      setVerifyResult({
        status: 'success',
        message: res.message,
        record: res.record
      });
    } else {
      setVerifyResult({
        status: res.record?.status === 'CLAIMED' ? 'claimed' : 'error',
        message: res.message,
        record: res.record
      });
    }
  };

  const handleConfirmRelease = () => {
    if (!inputCodeOrPin.trim()) return;
    const res = confirmProxyHandoverRelease(inputCodeOrPin, runnerId);
    if (res.success && res.record) {
      setVerifyResult({
        status: 'claimed',
        message: res.message,
        record: res.record
      });
      setRecords(getProxyHandoverRecords());
    } else {
      setVerifyResult({
        status: 'error',
        message: res.message,
        record: res.record
      });
    }
  };

  const handleRevoke = (id: string) => {
    if (confirm(isHi ? 'क्या आप इस प्रॉक्सी अधिकृतीकरण को रद्द करना चाहते हैं?' : 'Revoke this proxy handover authorization?')) {
      revokeProxyHandoverAuthorization(id);
      setRecords(getProxyHandoverRecords());
      if (createdPass?.id === id) {
        setCreatedPass(null);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = (pass: ProxyHandoverRequest) => {
    const text = `🚨 *STASHSAARTHI PROXY HANDOVER PASS* 🚨\n\nHi ${pass.proxyName},\n${pass.studentName} has authorized you to collect stored luggage box (*${pass.bookingId}*).\n\n🔑 *6-Digit Verification PIN:* ${pass.verificationPin}\n📜 *Authorization Code:* ${pass.authCode}\n📍 *Pickup Node:* ${pass.deliveryNode}\n🆔 *Your ID Verification:* Last 4 Digits must match (${pass.proxyGovtIdLast4})\n\nShow this code to StashSaarthi Campus Runner at handover.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const stats = getProxyHandoverStats();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0D0F] border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-950/40 text-slate-100 my-8 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {isHi ? 'रिवर्स लॉजिस्टिक्स एवं प्रॉक्सी-हैंडओवर' : 'Reverse Logistics & Proxy-Handover Pass'}
                </h3>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Task 131 QA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHi ? 'सुरक्षित 2FA मित्र सामान वितरण एवं सत्यापन प्रणाली' : 'Secure 2FA Proxy Handover Protocol for Out-of-City Students'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('authorize')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'authorize'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            {isHi ? '1. प्रॉक्सी अधिकृत करें' : '1. Authorize Proxy'}
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'verify'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            {isHi ? '2. रनर हैंडओवर सत्यापन' : '2. Runner Verification Terminal'}
          </button>
          <button
            onClick={() => setActiveTab('charter')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'charter'
                ? 'border-amber-400 text-amber-400 bg-amber-500/10 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {isHi ? '3. सुरक्षा एवं नियम' : '3. QA Security Protocol'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* TAB 1: AUTHORIZE PROXY FORM & PASS */}
          {activeTab === 'authorize' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Column */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-sm font-semibold text-emerald-400 mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isHi ? 'मित्र / प्रॉक्सी अधिकृतीकरण विवरण' : 'Proxy Friend Authorization Details'}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    {isHi ? 'छुट्टियां खत्म होने पर यदि आप कानपुर नहीं आ पा रहे हैं, तो अपने मित्र को सामान रिसीव करने का अधिकार दें।' : 'Authorize a trusted friend to collect your box if you cannot return to campus at break end.'}
                  </p>

                  <form onSubmit={handleCreateAuthorization} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'बुकिंग आईडी' : 'Booking ID'}
                        </label>
                        <input
                          type="text"
                          value={bookingId}
                          onChange={(e) => setBookingId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono uppercase focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'विद्यार्थी (मूल स्वामी) का नाम' : 'Student (Owner) Name'}
                        </label>
                        <input
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'अधिकृत मित्र का नाम' : 'Authorized Friend (Proxy) Name'}
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            placeholder="e.g. Rohan Verma"
                            value={proxyName}
                            onChange={(e) => setProxyName(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'मित्र का मोबाइल नंबर' : 'Proxy Phone Number'}
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            placeholder="+91 9876543210"
                            value={proxyPhone}
                            onChange={(e) => setProxyPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'मित्र की आईडी (आधार/कॉलेज) अंतिम 4 अंक' : 'Proxy Govt/College ID Last 4 Digits'}
                        </label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="e.g. 4821"
                          value={proxyGovtIdLast4}
                          onChange={(e) => setProxyGovtIdLast4(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-300 block mb-1">
                          {isHi ? 'कैंपस डिलीवरी नोड' : 'Campus Delivery Node'}
                        </label>
                        <select
                          value={deliveryNode}
                          onChange={(e) => setDeliveryNode(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="IIT Kanpur Nankari Gate">IIT Kanpur Nankari Gate</option>
                          <option value="Kakadeo PW Hostel Hub">Kakadeo PW Hostel Hub</option>
                          <option value="CSJMU Kalyanpur Gate 1">CSJMU Kalyanpur Gate 1</option>
                          <option value="HBTI Nawabganj Node">HBTI Nawabganj Node</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        {isHi ? 'विशेष निर्देश / टिप्पणी (ऐच्छिक)' : 'Handover Instructions (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Handover only after 4:00 PM at Gate 1"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="w-5 h-5 fill-slate-950" />
                      {isHi ? '2FA प्रॉक्सी डिजिटल पास जनरेट करें' : 'Generate 2FA Proxy Authorization Pass'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Pass Column */}
              <div className="lg:col-span-5 space-y-4">
                {createdPass ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 relative overflow-hidden shadow-xl shadow-emerald-950/30">
                    <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wider">
                      ACTIVE PROXY PASS
                    </div>

                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <BadgeCheck className="w-4 h-4" />
                      StashSaarthi Proxy Pass
                    </div>

                    <div className="space-y-3 border-b border-slate-800 pb-3 mb-3">
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">{isHi ? 'बुकिंग रेफरेंस' : 'Booking Reference'}</div>
                        <div className="text-lg font-extrabold text-white font-mono">{createdPass.bookingId}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block">{isHi ? 'मूल विद्यार्थी:' : 'Owner:'}</span>
                          <span className="text-slate-200 font-semibold">{createdPass.studentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">{isHi ? 'अधिकृत मित्र:' : 'Proxy Friend:'}</span>
                          <span className="text-emerald-300 font-semibold">{createdPass.proxyName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Verification PIN & QR */}
                    <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
                      <div className="text-center">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{isHi ? '6-अंकीय सत्यापन पिन' : '6-Digit Verification PIN'}</div>
                        <div className="text-3xl font-extrabold font-mono tracking-widest text-emerald-400 bg-emerald-950/40 py-1.5 px-4 rounded-lg border border-emerald-500/30 inline-block">
                          {createdPass.verificationPin}
                        </div>
                      </div>

                      <div className="flex justify-center my-2">
                        <div className="bg-white p-2 rounded-xl border-2 border-emerald-500/30">
                          <OfflineQrCode value={createdPass.authCode} size={110} />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest">{isHi ? 'पास कोड' : 'Auth Code'}</div>
                        <div className="text-xs font-mono font-bold text-slate-300">{createdPass.authCode}</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => copyToClipboard(createdPass.verificationPin)}
                        className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 border border-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copied ? (isHi ? 'कॉपी हो गया!' : 'Copied!') : (isHi ? 'पिन कॉपी करें' : 'Copy PIN')}
                      </button>
                      <button
                        onClick={() => shareWhatsApp(createdPass)}
                        className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        {isHi ? 'WhatsApp भेजें' : 'Share WhatsApp'}
                      </button>
                    </div>

                    <button
                      onClick={() => handleRevoke(createdPass.id)}
                      className="w-full mt-2 py-1.5 text-[11px] text-rose-400 hover:text-rose-300 font-medium text-center"
                    >
                      {isHi ? 'रद्द करें (Revoke Pass)' : 'Revoke Authorization Pass'}
                    </button>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 border-dashed text-center flex flex-col items-center justify-center min-h-[360px]">
                    <Lock className="w-12 h-12 text-slate-600 mb-3" />
                    <h5 className="text-sm font-semibold text-slate-300 mb-1">
                      {isHi ? 'कोई पास एक्टिव नहीं है' : 'No Active Proxy Pass Generated'}
                    </h5>
                    <p className="text-xs text-slate-500 max-w-xs">
                      {isHi ? 'बाएं फॉर्म में मित्र का विवरण भरकर 2FA सत्यापन पास बनाएं।' : 'Fill out the proxy authorization form on the left to issue a secure digital handover pass.'}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: RUNNER VERIFICATION TERMINAL */}
          {activeTab === 'verify' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-2xl mx-auto space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {isHi ? 'कैंपस रनर प्रॉक्सी सत्यापन टर्मिनल' : 'Campus Runner Proxy Verification Terminal'}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isHi ? 'सामान हैंडओवर से पूर्व विद्यार्थी के मित्र का 6-अंकीय पिन या पास कोड सत्यापित करें।' : 'Verify 6-digit PIN or authorization code before handing over luggage to designated friend.'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        {isHi ? '6-अंकीय पिन या ऑथ कोड दर्ज करें' : 'Enter 6-Digit PIN or Auth Code'}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 849201 or PROXY-PASS-8921-8492"
                        value={inputCodeOrPin}
                        onChange={(e) => setInputCodeOrPin(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-mono text-cyan-300 uppercase tracking-widest focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="text-xs font-medium text-slate-300 block mb-1">
                        {isHi ? 'रनर आईडी' : 'Runner ID'}
                      </label>
                      <input
                        type="text"
                        value={runnerId}
                        onChange={(e) => setRunnerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleVerifyCode}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      {isHi ? 'कोड जांचें (Verify Code)' : 'Verify Code'}
                    </button>
                    <button
                      onClick={handleConfirmRelease}
                      className="flex-1 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {isHi ? 'सामान हैंडओवर करें (Release Luggage)' : 'Release Luggage'}
                    </button>
                  </div>
                </div>

                {/* Result Display Box */}
                {verifyResult.status !== 'idle' && (
                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                    verifyResult.status === 'success' 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : verifyResult.status === 'claimed'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {verifyResult.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {verifyResult.status === 'claimed' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                      {verifyResult.status === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                      {verifyResult.message}
                    </div>

                    {verifyResult.record && (
                      <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300 mt-2">
                        <div><span className="text-slate-500">Booking:</span> {verifyResult.record.bookingId}</div>
                        <div><span className="text-slate-500">Owner Student:</span> {verifyResult.record.studentName} ({verifyResult.record.studentPhone})</div>
                        <div><span className="text-slate-500">Authorized Proxy:</span> {verifyResult.record.proxyName} ({verifyResult.record.proxyPhone})</div>
                        <div><span className="text-slate-500">Proxy ID Verification:</span> Last 4 Digits ({verifyResult.record.proxyGovtIdLast4})</div>
                        <div><span className="text-slate-500">Pickup Location:</span> {verifyResult.record.deliveryNode}</div>
                        <div><span className="text-slate-500">Status:</span> <span className="font-bold text-white">{verifyResult.record.status}</span></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Records List Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
                  <span>{isHi ? 'हाल के प्रॉक्सी अधिकृतीकरण रिकॉर्ड्स' : 'Recent Proxy Authorization Log Registry'}</span>
                  <span className="text-emerald-400">{records.length} {isHi ? 'रिकॉर्ड्स' : 'Records'}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-900 text-slate-400 font-medium border-b border-slate-800">
                    <div className="col-span-2">Booking / Pass</div>
                    <div className="col-span-3">Owner Student</div>
                    <div className="col-span-3">Proxy Friend</div>
                    <div className="col-span-2">Location Node</div>
                    <div className="col-span-2 text-right">Status</div>
                  </div>

                  <div className="divide-y divide-slate-850 max-h-48 overflow-y-auto">
                    {records.map((r) => (
                      <div key={r.id} className="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-slate-900/50">
                        <div className="col-span-2 font-mono font-bold text-slate-200">
                          {r.bookingId}
                          <div className="text-[10px] text-slate-500 font-normal">{r.verificationPin}</div>
                        </div>
                        <div className="col-span-3 text-slate-300">
                          {r.studentName}
                          <div className="text-[10px] text-slate-500">{r.studentPhone}</div>
                        </div>
                        <div className="col-span-3 text-emerald-300">
                          {r.proxyName}
                          <div className="text-[10px] text-slate-400">ID: *{r.proxyGovtIdLast4}</div>
                        </div>
                        <div className="col-span-2 text-slate-400 text-[11px] truncate">
                          {r.deliveryNode}
                        </div>
                        <div className="col-span-2 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'AUTHORIZED' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : r.status === 'CLAIMED'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: QA SECURITY PROTOCOL CHARTER */}
          {activeTab === 'charter' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-amber-200">
                    {isHi ? 'स्टैशसारथी रिवर्स लॉजिस्टिक्स सुरक्षा प्रोटोकॉल' : 'StashSaarthi Reverse Logistics Security Charter'}
                  </h4>
                  <p className="mt-0.5 text-amber-300/80">
                    {isHi ? 'विद्यार्थी की अनुपस्थिति में अनधिकृत व्यक्ति को सामान सौंपना strictly प्रतिबंधित है।' : 'Guarantees zero unauthorized deliveries and 100% liability verification when students cannot return to campus.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Key className="w-4 h-4 text-emerald-400" />
                    1. 2FA Owner Consent
                  </div>
                  <p className="text-slate-400">
                    Only the registered booking student can generate the single-use 6-digit PIN and authorization code from their authenticated portal.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <BadgeCheck className="w-4 h-4 text-cyan-400" />
                    2. Physical ID Last-4 Check
                  </div>
                  <p className="text-slate-400">
                    Campus runner verifies the proxy friend’s physical Aadhaar / College ID card last 4 digits against the recorded authorization before release.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Lock className="w-4 h-4 text-amber-400" />
                    3. Token Invalidation Upon Release
                  </div>
                  <p className="text-slate-400">
                    Once released, the proxy token status shifts to CLAIMED and cannot be reused or presented a second time.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-white text-sm">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    4. Instant SMS Owner Audit Alert
                  </div>
                  <p className="text-slate-400">
                    An automated SMS and WhatsApp confirmation is dispatched to the original student owner the moment the runner hands over the box.
                  </p>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Total Passes</div>
                  <div className="text-xl font-bold text-white">{stats.totalRequests}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Active Authorized</div>
                  <div className="text-xl font-bold text-emerald-400">{stats.authorizedCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Successfully Handed Over</div>
                  <div className="text-xl font-bold text-cyan-400">{stats.claimedCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest">Security SLA</div>
                  <div className="text-xl font-bold text-emerald-400">{stats.securitySlaPercent}%</div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>StashSaarthi Zero-Brokerage Reverse Logistics Infrastructure</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close Console'}
          </button>
        </div>

      </div>
    </div>
  );
};
