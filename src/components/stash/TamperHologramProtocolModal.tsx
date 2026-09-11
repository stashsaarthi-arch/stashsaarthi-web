import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Scan,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  X,
  Building2,
  Download,
  Camera,
  Search,
  Award,
  ShieldAlert,
  Boxes,
  UserCheck,
  Clock,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import {
  getTamperHologramRecords,
  linkHologramToStashRecord,
  recordHologramTamperCheck,
  verifyTamperHologramCodeFormat,
  getHologramStats,
  generateHologramSecuritySealHash,
  type TamperHologramRecord,
} from '@/lib/tamperHologramEngine';

interface TamperHologramProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
  defaultStudentName?: string;
  defaultCampusNode?: string;
}

export const TamperHologramProtocolModal: React.FC<TamperHologramProtocolModalProps> = ({
  isOpen,
  onClose,
  defaultBookingId = 'SS-KNP-9821',
  defaultStudentName = 'Rahul Verma (PW Kakadeo)',
  defaultCampusNode = 'Kakadeo PW Hub',
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'link' | 'registry' | 'charter'>('link');
  const [records, setRecords] = useState<TamperHologramRecord[]>([]);
  const [stats, setStats] = useState(getHologramStats());

  // Input states for linking
  const [hologramCode, setHologramCode] = useState('STASH-HOL-889421');
  const [bookingId, setBookingId] = useState(defaultBookingId);
  const [studentName, setStudentName] = useState(defaultStudentName);
  const [campusNode, setCampusNode] = useState(defaultCampusNode);
  const [boxCount, setBoxCount] = useState<number>(2);
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'INTACT' | 'INSPECTED' | 'TAMPERED'>('ALL');

  const refreshData = useCallback(() => {
    const list = getTamperHologramRecords();
    setRecords(list);
    setStats(getHologramStats());
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen, refreshData]);

  useEffect(() => {
    const handleSync = () => refreshData();
    window.addEventListener('stashsaarthi:hologram-record-updated', handleSync);
    return () => window.removeEventListener('stashsaarthi:hologram-record-updated', handleSync);
  }, [refreshData]);

  if (!isOpen) return null;

  const liveHash = generateHologramSecuritySealHash(hologramCode || 'HOL-SAMPLE', bookingId || 'SS-KNP-9821', new Date().toISOString());

  const handleLinkHologram = (e: React.FormEvent) => {
    e.preventDefault();
    const res = linkHologramToStashRecord(
      hologramCode,
      bookingId,
      studentName,
      campusNode,
      boxCount,
      'SCANNER-CAM-KNP-01'
    );

    if (res.success) {
      toast.success(isHi ? 'टैम्पर होलोग्राम सील सफलतापूर्वक लॉक हुई!' : 'Tamper Hologram Seal Linked & Locked!', {
        description: res.message,
      });
      refreshData();
      setActiveTab('registry');
    } else {
      toast.error(isHi ? 'सीलिंग त्रुटि' : 'Hologram Link Failed', {
        description: res.message,
      });
    }
  };

  const handleUpdateStatus = (code: string, newStatus: 'INTACT' | 'INSPECTED' | 'TAMPERED' | 'VOIDED') => {
    const res = recordHologramTamperCheck(code, newStatus, `Manual audit update to ${newStatus}`);
    if (res.success) {
      toast.success(isHi ? 'होलोग्राम स्टेटस अपडेट हुआ' : 'Hologram Audit Updated', {
        description: res.message,
      });
      refreshData();
    } else {
      toast.error(res.message);
    }
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    toast.success(isHi ? 'क्रिप्टोग्राफिक हैश कॉपी हुआ!' : 'SHA-256 Seal Hash Copied!');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const SAMPLE_HOLOGRAMS = [
    'STASH-HOL-889421',
    'SS-HOLOTAPE-2026-4412',
    'STASH-HOL-339120',
    'SS-SEAL-991024',
  ];

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.hologramCode.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.bookingId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.campusNode.toLowerCase().includes(searchFilter.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-zinc-950 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-gradient-to-r from-zinc-950 via-emerald-950/40 to-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  {isHi ? 'टैम्पर-प्रूफ होलोग्राम प्रोटोकॉल कंसोल' : 'Tamper-Proof Hologram Protocol Engine'}
                </h2>
                <span className="px-2.5 py-0.5 text-xs font-mono font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CSO Task 123
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {isHi
                  ? 'भौतिक स्टैश सुरक्षा टेप कोड को कैमरा स्कैनर से लिंक और SHA-256 सील से लॉक करें।'
                  : 'Link pre-printed hologram tape codes to luggage custody records with SHA-256 verification seals.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/60 px-5 gap-4">
          <button
            onClick={() => setActiveTab('link')}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'link'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scan className="w-4 h-4" />
            {isHi ? '1. होलोग्राम सील लिंक करें' : '1. Link Hologram Tape'}
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'registry'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            {isHi ? '2. सील ऑडिट रजिस्ट्री' : '2. Hologram Audit Registry'}
            <span className="px-1.5 py-0.2 text-xs rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              {stats.totalHolograms}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('charter')}
            className={`py-3 px-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'charter'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            {isHi ? '3. CSO सुरक्षा चार्टर' : '3. Security Specifications'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LINK HOLOGRAM */}
          {activeTab === 'link' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Scanner Viewport */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-xl border border-emerald-500/30 bg-zinc-900/80 p-4 text-center overflow-hidden">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      {isHi ? 'ऑप्टिकल लेजर स्कैनर' : 'Optical Laser Scanner'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SCANNER-CAM-01
                    </span>
                  </div>

                  <div className="relative h-44 rounded-lg bg-black/90 border border-zinc-800 flex flex-col items-center justify-center overflow-hidden">
                    {/* Laser Scanner animation */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                    
                    <div className="border-2 border-dashed border-emerald-500/50 rounded-lg p-6 flex flex-col items-center gap-2">
                      <Scan className="w-10 h-10 text-emerald-400 animate-pulse" />
                      <span className="text-xs text-zinc-400 font-mono">
                        {isHi ? 'भौतिक होलोग्राम टेप बारकोड स्कैन करें' : 'Scan Physical Hologram Barcode Tape'}
                      </span>
                    </div>

                    <div className="absolute bottom-2 inset-x-2 flex justify-between text-[10px] font-mono text-zinc-500">
                      <span>RES: 1080P HD</span>
                      <span className="text-emerald-400">STATUS: READY</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                    <span>{isHi ? 'सैंपल कोड आज़माएं:' : 'Preset Sample Holograms:'}</span>
                    <div className="flex flex-wrap gap-1">
                      {SAMPLE_HOLOGRAMS.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setHologramCode(code)}
                          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-emerald-950 hover:text-emerald-300 text-[11px] font-mono border border-zinc-700 transition-colors"
                        >
                          {code.slice(-6)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cryptographic Seal Hash Preview */}
                <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                      <KeyRound className="w-3.5 h-3.5" />
                      {isHi ? 'SHA-256 सील डिजिटल सिग्नेचर' : 'SHA-256 Security Seal Hash'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(liveHash)}
                      className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedHash === liveHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black font-mono text-xs text-emerald-400/90 border border-emerald-950 break-all select-all">
                    {liveHash}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {isHi
                      ? 'यह हैश कोड, बुकिंग आईडी और टाइमस्टैम्प से निर्मित अटूट सुरक्षा प्रमाण पत्र है।'
                      : 'Deterministic cryptographic seal verifying hologram integrity across node intake.'}
                  </p>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleLinkHologram} className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    {isHi ? 'स्टैश आइटम से होलोग्राम लिंक विवरण' : 'Luggage & Hologram Custody Record Details'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'प्रि-प्रिंटेड होलोग्राम कोड *' : 'Pre-Printed Hologram Code *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={hologramCode}
                        onChange={(e) => setHologramCode(e.target.value.toUpperCase())}
                        placeholder="e.g. STASH-HOL-889421"
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'स्टैश बुकिंग आईडी *' : 'Stash Booking ID *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                        placeholder="e.g. SS-KNP-9821"
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'छात्र का नाम' : 'Student Name'}
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'कैंपस नोड' : 'Campus Host Node'}
                      </label>
                      <select
                        value={campusNode}
                        onChange={(e) => setCampusNode(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Kakadeo PW Hub">Kakadeo PW Hub</option>
                        <option value="IIT Kanpur Nankari Gate">IIT Kanpur Nankari Gate</option>
                        <option value="CSJMU Kalyanpur Hub">CSJMU Kalyanpur Hub</option>
                        <option value="HBTI Nawabganj Hub">HBTI Nawabganj Hub</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'बॉक्स / बैग संख्या' : 'Luggage Box Count'}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={boxCount}
                        onChange={(e) => setBoxCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-1">
                        {isHi ? 'स्कैनर डिवाइस आईडी' : 'Scanner Device Hardware ID'}
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="SCANNER-CAM-KNP-01"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1">
                      {isHi ? 'निरीक्षक नोट्स (वैकल्पिक)' : 'Inspector Audit Notes (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={inspectorNotes}
                      onChange={(e) => setInspectorNotes(e.target.value)}
                      placeholder={isHi ? 'जैसे लेजर होलोग्राम सील सही सलामत लगाई गई' : 'e.g. Hologram tape sealed intact on 2 cartons.'}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-zinc-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    {isHi ? '🔒 होलोग्राम सुरक्षा लॉक रिकॉर्ड सेव करें' : '🔒 Lock Hologram Custody Record'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: AUDIT REGISTRY */}
          {activeTab === 'registry' && (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-xs text-zinc-400">{isHi ? 'कुल होलोग्राम टेप' : 'Total Hologram Seals'}</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">{stats.totalHolograms}</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-xs text-emerald-400">{isHi ? 'सही सलामत (Intact)' : 'Intact & Inspected'}</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{stats.intactCount}</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-xs text-amber-400">{isHi ? 'छेड़छाड (Tampered)' : 'Tampered Alerts'}</div>
                  <div className="text-2xl font-bold font-mono text-amber-400 mt-1">{stats.tamperedCount}</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-xs text-cyan-400">{isHi ? 'सुरक्षा स्कोर' : 'Security Rating Score'}</div>
                  <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{stats.securityScore}%</div>
                </div>
              </div>

              {/* Filter Strip */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={isHi ? 'खोजें (कोड, नाम, बुकिंग ID)...' : 'Search code, student, booking...'}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-black border border-zinc-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex gap-2">
                  {(['ALL', 'INTACT', 'INSPECTED', 'TAMPERED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        statusFilter === st
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Registry Table / Cards */}
              <div className="space-y-3">
                {filteredRecords.length === 0 ? (
                  <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-zinc-800 text-zinc-500 text-sm">
                    {isHi ? 'कोई होलोग्राम रिकॉर्ड नहीं मिला।' : 'No matching hologram records found.'}
                  </div>
                ) : (
                  filteredRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-emerald-400">{rec.hologramCode}</span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {rec.bookingId}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              rec.status === 'INTACT'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : rec.status === 'INSPECTED'
                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </div>
                        <div className="text-xs text-zinc-300 flex items-center gap-4">
                          <span>👤 {rec.studentName}</span>
                          <span>📍 {rec.campusNode}</span>
                          <span>📦 {rec.boxCount} boxes</span>
                        </div>
                        <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                          <span>SHA: {rec.securitySealHash.slice(0, 16)}...</span>
                          <button
                            type="button"
                            onClick={() => handleCopyHash(rec.securitySealHash)}
                            className="hover:text-emerald-400"
                          >
                            <Copy className="w-3 h-3 inline" />
                          </button>
                        </div>
                      </div>

                      {/* Audit Status Action Toggles */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-zinc-800">
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rec.hologramCode, 'INTACT')}
                          className="px-2.5 py-1 rounded text-xs bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/50"
                        >
                          ✓ Intact
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rec.hologramCode, 'INSPECTED')}
                          className="px-2.5 py-1 rounded text-xs bg-cyan-950/80 text-cyan-300 hover:bg-cyan-900 border border-cyan-700/50"
                        >
                          🔍 Inspected
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(rec.hologramCode, 'TAMPERED')}
                          className="px-2.5 py-1 rounded text-xs bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-700/50"
                        >
                          ⚠️ Tampered
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CSO CHARTER */}
          {activeTab === 'charter' && (
            <div className="space-y-6 text-sm text-zinc-300">
              <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/50 via-zinc-900 to-zinc-950 border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                  <Award className="w-5 h-5" />
                  {isHi ? 'StashSaarthi CSO भौतिक सुरक्षा टेप मानक' : 'StashSaarthi CSO Physical Security Tape Standard'}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {isHi
                    ? 'सभी छात्रLuggage बक्से पर ऑन-साइट पिकअप के दौरान लेजर-एन्ग्रेव्ड होलोग्राम सुरक्षा टेप चिपकाई जाती है। टेप हटाते ही VOID पैटर्न और डिजिटल अलार्म ट्रिगर होता है।'
                    : 'Every luggage box undergoes mandatory physical holograph sealing during pickup. Removal attempts leave an irreversible VOID micro-pattern.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    1. Micro-Pattern Foil Hologram
                  </div>
                  <p className="text-xs text-zinc-400">
                    High-diffraction 3D optical foil displaying StashSaarthi official seal watermark, preventing counterfeit substitution.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    2. Void-If-Peeled Adhesive
                  </div>
                  <p className="text-xs text-zinc-400">
                    Pressure-sensitive acrylic adhesive layer that breaks into permanent "VOID OPENED" text upon thermal or physical peeling.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-cyan-400" />
                    3. Alphanumeric Serial Engraving
                  </div>
                  <p className="text-xs text-zinc-400">
                    Unique sequential laser-etched serial code (e.g. STASH-HOL-889421) linked 1-to-1 with student custody ticket.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    4. ₹10,000 Safety Claim Guarantee
                  </div>
                  <p className="text-xs text-zinc-400">
                    If hologram seal is tampered upon doorstep return delivery, ₹10,000 micro-insurance claim is instantly processed within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2 font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>StashSaarthi Security Engine v2.4</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close Console'}
          </button>
        </div>
      </div>
    </div>
  );
};
