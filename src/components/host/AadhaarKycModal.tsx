import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, X, Loader2, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

interface AadhaarKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AadhaarKycModal({ isOpen, onClose, onSuccess }: AadhaarKycModalProps) {
  const [step, setStep] = useState<'front' | 'back' | 'success' | 'shield-warning'>('front');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (step === 'front') {
        setFrontImage(file);
      } else if (step === 'back') {
        setBackImage(file);
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (step === 'front') {
        setFrontImage(file);
      } else if (step === 'back') {
        setBackImage(file);
      }
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearPreview = () => {
    if (step === 'front') setFrontImage(null);
    else setBackImage(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = async () => {
    if (step === 'front' && frontImage) {
      setStep('back');
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else if (step === 'back' && backImage) {
      await uploadDocuments();
    }
  };

  const uploadDocuments = async () => {
    setError('');
    const userId = auth.currentUser?.uid;
    if (!userId) {
      const errorMsg = 'You must be logged in to upload KYC documents.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!frontImage || !backImage) {
      const errorMsg = 'Both front and back images are required.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true); // START LOADER
    try {
      const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'stashsaarthi-web');

        const response = await fetch('https://api.cloudinary.com/v1_1/nkof0cgp/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary');
        }

        const data = await response.json();
        return data.secure_url;
      };

      // Wrap the entire async upload and db sync process
      const uploadAndSync = async () => {
        // 1. Fetch request to Cloudinary & get secure_url
        const frontUrl = await uploadToCloudinary(frontImage);
        const backUrl = await uploadToCloudinary(backImage);

        // 2. await API Route instead of client-side Firestore
        const apiResponse = await fetch('/api/updateKyc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, frontUrl, backUrl })
        });

        if (!apiResponse.ok) {
          throw new Error("Network Request Blocked");
        }
      };

      // Strict 10-second kill-switch timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Request Timeout"));
        }, 10000);
      });

      // Execute race between the actual work and the 10-second timeout
      await Promise.race([uploadAndSync(), timeoutPromise]);

      // If successful:
      setStep('success');
      toast.success('KYC Uploaded Successfully!');
      
      // Delay closing to show success animation
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error: any) {
      console.error("UPLOAD FAILED:", error);
      
      const isBlocked = error.message === "Request Timeout" || error.message === "Network Request Blocked" || error.message?.includes('fetch') || error.message?.includes('Network') || error.message?.includes('blocked');
      
      if (isBlocked) {
        setStep('shield-warning');
      } else {
        const errorMsg = error.message || "Network blocked or upload failed. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      // THIS IS CRITICAL: It guarantees the spinner stops spinning no matter what.
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      {/* Liquid Modal Card */}
      <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-lg w-full relative overflow-hidden transition-all ease-[cubic-bezier(0.23,1,0.32,1)] duration-500">
        
        {/* Close Button */}
        {step !== 'success' && step !== 'shield-warning' && !loading && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Shield Warning Liquid UI State */}
        {step === 'shield-warning' && (
          <div className="flex flex-col items-center justify-center text-center py-8">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />
              <ShieldAlert className="w-10 h-10 text-red-400 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">🛡️ Your Privacy Shield is Too Strong!</h2>
            <p className="text-slate-300 mb-8 max-w-[280px] leading-relaxed">
              We noticed your Ad-Blocker or Brave Shield is blocking our secure database connection. We respect your privacy, but to complete your verified Host profile, please pause the shield for just 1 minute and click Upload again.
            </p>
            <button 
              onClick={() => { setStep('front'); setError(''); setPreview(null); }}
              className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-full transition-all flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95"
            >
              I've paused it, Let's Try Again
            </button>
            <button 
              onClick={onClose}
              className="mt-4 py-2 px-4 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Documents Submitted</h2>
            <p className="text-slate-400">Our team will verify your profile within 24 hours.</p>
          </div>
        )}

        {/* Upload State */}
        {step !== 'success' && step !== 'shield-warning' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Verify Aadhaar</h2>
              <p className="text-slate-400 text-sm">
                {step === 'front' ? 'Upload a clear photo of the front of your Aadhaar card.' : 'Now, upload the back of your Aadhaar card.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div 
              className={`border-2 border-dashed rounded-3xl p-8 mb-6 text-center transition-all ease-[cubic-bezier(0.23,1,0.32,1)] duration-300 relative ${
                preview ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/20 bg-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-xl shadow-lg object-contain" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); clearPreview(); }}
                    className="absolute -top-3 -right-3 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-emerald-400">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="text-white font-medium mb-1">Click or drag image here</p>
                  <p className="text-slate-400 text-xs">JPEG, PNG, JPG (Max 5MB)</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center gap-4">
              {step === 'back' && !loading && (
                <button 
                  type="button"
                  onClick={() => { setStep('front'); setPreview(frontImage ? URL.createObjectURL(frontImage) : null); }}
                  className="px-6 py-4 bg-white/10 hover:bg-white/15 text-white font-medium rounded-full transition-colors w-1/3"
                >
                  Back
                </button>
              )}
              
              <button 
                type="button"
                disabled={loading || !preview}
                onClick={handleNext}
                className={`flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-full transition-all ease-[cubic-bezier(0.23,1,0.32,1)] flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  step === 'front' ? 'Continue' : 'Submit Documents'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
