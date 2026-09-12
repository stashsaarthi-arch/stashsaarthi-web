import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Camera, CheckCircle2, AlertTriangle, ArrowRight, Upload, Sparkles, RefreshCw, FileText, Check, AlertCircle } from 'lucide-react';
import {
  DamageClaim,
  DamageClaimStatus,
  VisualDiffResult,
  computeVisualDiff,
  getDamageClaims,
  getDamageClaimStats,
  submitDamageClaim,
  updateClaimStatus,
  SAMPLE_INTAKE_PHOTO,
  SAMPLE_UNBOXING_PHOTO_DAMAGED,
  SAMPLE_UNBOXING_PHOTO_PRISTINE,
} from '../../lib/damageClaimsEngine';

interface DamageClaimsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBookingId?: string;
}

export const DamageClaimsModal: React.FC<DamageClaimsModalProps> = ({
  isOpen,
  onClose,
  defaultBookingId = '',
}) => {
  const [activeTab, setActiveTab] = useState<'submit' | 'registry' | 'charter'>('submit');
  
  // Form State
  const [bookingId, setBookingId] = useState(defaultBookingId || 'BK-STASH-2026-88');
  const [studentName, setStudentName] = useState('Rahul Verma (IIT Kanpur)');
  const [studentPhone, setStudentPhone] = useState('+91 9369454350');
  const [itemLabel, setItemLabel] = useState('Carton Box #1 (Study Materials & Laptop)');
  const [claimedAmount, setClaimedAmount] = useState<number>(3000);
  const [intakePhoto, setIntakePhoto] = useState<string>(SAMPLE_INTAKE_PHOTO);
  const [unboxingPhoto, setUnboxingPhoto] = useState<string>(SAMPLE_UNBOXING_PHOTO_DAMAGED);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  // Registry & Claims List State
  const [claims, setClaims] = useState<DamageClaim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<DamageClaim | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Live Visual Diff calculation for form preview
  const liveDiffResult: VisualDiffResult = computeVisualDiff(intakePhoto, unboxingPhoto, claimedAmount);

  useEffect(() => {
    if (isOpen) {
      refreshClaims();
    }
  }, [isOpen]);

  const refreshClaims = () => {
    const data = getDamageClaims();
    setClaims(data);
    if (data.length > 0 && !selectedClaim) {
      setSelectedClaim(data[0] || null);
    }
  };

  if (!isOpen) return null;

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccessMsg('');

    setTimeout(() => {
      const created = submitDamageClaim({
        bookingId,
        studentName,
        studentPhone,
        itemLabel,
        initialIntakePhotoUrl: intakePhoto,
        unboxingPhotoUrl: unboxingPhoto,
        claimedAmount,
        notes,
      });

      setIsSubmitting(false);
      setSubmitSuccessMsg(`Claim #${created.id} submitted! Visual diff score: ${created.diffScore}% (${created.damageSeverity}). Payout evaluation in progress.`);
      refreshClaims();
      setSelectedClaim(created);
      
      setTimeout(() => {
        setActiveTab('registry');
      }, 1500);
    }, 600);
  };

  const handleUpdateStatus = (id: string, status: DamageClaimStatus, payout?: number) => {
    const updated = updateClaimStatus(id, status, payout);
    if (updated) {
      refreshClaims();
      setSelectedClaim(updated);
    }
  };

  const stats = getDamageClaimStats();
  const filteredClaims = claims.filter((c) => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0A0D0F] border border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-500/20 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                CSO Visual Diff & Damage Claims Console
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  ₹10k Insurance
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated Unboxing vs Intake Photo Analysis & Instant Payout Protocol
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

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'submit'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="w-4 h-4" />
            Submit Unboxing Claim
          </button>

          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'registry'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Claims Registry & Diff Inspector ({stats.total})
            {stats.pending > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {stats.pending} pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('charter')}
            className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'charter'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            ₹10k CSO Safety Charter
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {submitSuccessMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{submitSuccessMsg}</span>
            </div>
          )}

          {/* TAB 1: SUBMIT UNBOXING CLAIM */}
          {activeTab === 'submit' && (
            <form onSubmit={handleSubmitClaim} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Booking Reference ID
                  </label>
                  <input
                    type="text"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="BK-STASH-2026-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Item Description / Tag
                  </label>
                  <input
                    type="text"
                    value={itemLabel}
                    onChange={(e) => setItemLabel(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                    placeholder="Carton #1, Suitcase, etc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Claimed Damage Amount (Max ₹10,000)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      max={10000}
                      min={100}
                      value={claimedAmount}
                      onChange={(e) => setClaimedAmount(Number(e.target.value))}
                      required
                      className="w-full pl-7 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Photo Comparison & Visual Diff Simulation Box */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    Visual Diff Inspection Engine (Unboxing vs Intake)
                  </h3>
                  
                  {/* Preset Demo Buttons */}
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-slate-400">Preset Demo:</span>
                    <button
                      type="button"
                      onClick={() => setUnboxingPhoto(SAMPLE_UNBOXING_PHOTO_DAMAGED)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        unboxingPhoto.includes('Damaged') || unboxingPhoto.includes('EF4444')
                          ? 'bg-red-500/20 border-red-500/40 text-red-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      ⚠️ Damaged Sample (28.5% Diff)
                    </button>
                    <button
                      type="button"
                      onClick={() => setUnboxingPhoto(SAMPLE_UNBOXING_PHOTO_PRISTINE)}
                      className={`px-2.5 py-1 rounded-lg border transition-all ${
                        unboxingPhoto.includes('PERFECT CONDITION')
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      ✅ Pristine Sample (1.2% Diff)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  {/* Intake Photo Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-emerald-400">1. Initial Intake Photo (Host Pickup)</span>
                      <span className="text-[10px] font-mono">SEAL: INTACT</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-emerald-500/30 bg-slate-900 aspect-video flex items-center justify-center">
                      <img src={intakePhoto} alt="Initial Intake" loading="lazy" decoding="async" width={320} height={180} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Unboxing Photo Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-amber-400">2. Student Unboxing Photo (Drop-Off)</span>
                      <span className="text-[10px] font-mono">ANALYSIS: ACTIVE</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-amber-500/30 bg-slate-900 aspect-video flex items-center justify-center">
                      <img src={unboxingPhoto} alt="Unboxing Photo" loading="lazy" decoding="async" width={320} height={180} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Automated Visual Diff Result Banner */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">
                        Visual Variance Engine Result
                      </span>
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        Diff Score: <span className="text-emerald-400">{liveDiffResult.diffScore}%</span>
                        <span className="text-slate-400">|</span>
                        Match: <span className="text-cyan-400">{liveDiffResult.similarityScore}%</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          liveDiffResult.damageSeverity === 'NONE'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : liveDiffResult.damageSeverity === 'MINOR'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : liveDiffResult.damageSeverity === 'MODERATE'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-red-500/20 text-red-400 border-red-500/40'
                        }`}
                      >
                        {liveDiffResult.damageSeverity} DAMAGE
                      </span>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Suggested Payout</span>
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          ₹{liveDiffResult.suggestedPayout}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold">AI Inspection Highlights:</span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-300">
                      {liveDiffResult.inspectionHighlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Additional Notes / Student Explanation
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="Describe damage location or unboxing observation..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analyzing Visual Diff...
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      Submit Claim & Initiate Payout (₹{liveDiffResult.suggestedPayout})
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CLAIMS REGISTRY & INSPECTOR */}
          {activeTab === 'registry' && (
            <div className="space-y-6">
              {/* Filter Pills & Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Filter Status:</span>
                  {['ALL', 'PENDING_INSPECTION', 'APPROVED_PAYOUT', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        filterStatus === st
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-400">
                    Approved Total:{' '}
                    <strong className="text-emerald-400 font-bold">₹{stats.totalDisbursed}</strong>
                  </span>
                  <span className="text-slate-400">
                    Avg Diff Score:{' '}
                    <strong className="text-cyan-400 font-bold">{stats.avgDiffScore}%</strong>
                  </span>
                </div>
              </div>

              {/* Claims List & Visual Inspector Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Claims Sidebar List */}
                <div className="lg:col-span-5 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Submitted Damage Claims ({filteredClaims.length})
                  </h3>

                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredClaims.length === 0 ? (
                      <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
                        No damage claims matching filter.
                      </div>
                    ) : (
                      filteredClaims.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedClaim(c)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                            selectedClaim?.id === c.id
                              ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold font-mono text-white">{c.id}</span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                c.status === 'APPROVED_PAYOUT'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : c.status === 'PENDING_INSPECTION'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {c.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 font-semibold mb-1">
                            {c.studentName}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span>Diff: <strong className="text-emerald-400">{c.diffScore}%</strong></span>
                            <span>Claim: <strong className="text-amber-400 font-mono">₹{c.claimedAmount}</strong></span>
                            <span>Payout: <strong className="text-cyan-400 font-mono">₹{c.approvedPayoutAmount}</strong></span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Claim Inspection Drawer Panel */}
                <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  {selectedClaim ? (
                    <>
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] text-slate-500 font-mono uppercase block">
                            Claim Inspection Record
                          </span>
                          <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            {selectedClaim.id} ({selectedClaim.bookingId})
                          </h4>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Payout Valuation</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono">
                            ₹{selectedClaim.approvedPayoutAmount}
                          </span>
                        </div>
                      </div>

                      {/* Side-by-side Inspection Photos */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Intake Photo</span>
                          <img
                            src={selectedClaim.initialIntakePhotoUrl}
                            alt="Intake"
                            loading="lazy"
                            decoding="async"
                            width={240}
                            height={135}
                            className="rounded-lg border border-slate-800 aspect-video object-cover w-full"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Unboxing Photo</span>
                          <img
                            src={selectedClaim.unboxingPhotoUrl}
                            alt="Unboxing"
                            loading="lazy"
                            decoding="async"
                            width={240}
                            height={135}
                            className="rounded-lg border border-slate-800 aspect-video object-cover w-full"
                          />
                        </div>
                      </div>

                      {/* Details & Action Controls */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Student: <strong>{selectedClaim.studentName}</strong></span>
                          <span>Phone: <strong className="font-mono text-slate-400">{selectedClaim.studentPhone}</strong></span>
                        </div>
                        <div className="text-slate-400">
                          Item: <span className="text-white">{selectedClaim.itemLabel}</span>
                        </div>
                        {selectedClaim.notes && (
                          <div className="text-slate-400 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
                            "{selectedClaim.notes}"
                          </div>
                        )}
                      </div>

                      {/* Operator Quick Actions */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleUpdateStatus(selectedClaim.id, 'APPROVED_PAYOUT', selectedClaim.claimedAmount)}
                          className="flex-1 py-2 px-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          Approve Full Payout (₹{selectedClaim.claimedAmount})
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedClaim.id, 'REJECTED', 0)}
                          className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-xs transition-all"
                        >
                          Reject Claim
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-12 text-center text-slate-500 text-xs">
                      Select a claim from the list to view visual diff inspection details.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CSO SAFETY CHARTER */}
          {activeTab === 'charter' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-white space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-7 h-7 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-bold">StashSaarthi CSO ₹10,000 Micro-Insurance Charter</h3>
                    <p className="text-xs text-slate-300">Statutory Guarantee for Student Luggage & Belongings Safety</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-mono">1</span>
                    Pre-Intake Hologram Seal Lock
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Every bag/box is sealed with pre-printed alphanumeric tamper-proof security tape (`STASH-HOL-XXXXXX`). High-res photo proof is locked into the immutable custody log at pickup.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center font-mono">2</span>
                    Automated Visual Diff Engine
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Student unboxing photos are cross-compared against intake photos using visual contrast variance algorithms to instantly detect corner dents, tears, or seal breaches.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center font-mono">3</span>
                    24-Hour Instant Payout Guarantee
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verified damage claims are settled directly to the student's UPI account within 24 hours up to ₹10,000 max insurance coverage limit.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-bold">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center font-mono">4</span>
                    Zero-Dispute CSO Escrow Protection
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Escrow payouts are backed by StashSaarthi Risk Reserve Fund, guaranteeing peace of mind for both students and host node operators.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
